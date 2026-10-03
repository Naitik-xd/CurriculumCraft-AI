import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

// Trust proxy for accurate client IP identification on Vercel, Render, Cloud Run
app.set('trust proxy', 1);

// Initialize Google Gen AI client with server-side environment key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models: strictly open-weight Gemma models verified in Google Gen AI
const MODEL_PRIORITY = [
  'gemma-4-26b-a4b-it',
  'gemma-4-31b-it',
];

// --- Rate Limiter: Max 30 requests per 5 hours to prevent abuse & conserve tokens ---
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per 5-hour window

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function rateLimitMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // If no record exists or window expired, reset
  if (!record || (now - record.windowStart) > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
    res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS_PER_WINDOW - 1);
    return next();
  }

  // Check if limit exceeded
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const remainingMs = record.windowStart + RATE_LIMIT_WINDOW_MS - now;
    const resetHours = Math.floor(remainingMs / (60 * 60 * 1000));
    const resetMins = Math.ceil((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    const resetTimeFormatted = resetHours > 0 ? `${resetHours}h ${resetMins}m` : `${resetMins}m`;

    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('Retry-After', Math.ceil(remainingMs / 1000));
    return res.status(429).json({
      error: `Rate limit reached: Maximum 30 requests per 5 hours to protect model capacity and conserve tokens. Please retry in ${resetTimeFormatted}.`,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: 0,
      resetInMinutes: Math.ceil(remainingMs / (60 * 1000)),
    });
  }

  record.count++;
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS_PER_WINDOW - record.count);
  next();
}

async function callGenAIWithFallback(fullPrompt: string, logPrefix: string): Promise<{ text: string; model: string }> {
  let lastError: any = null;

  for (const model of MODEL_PRIORITY) {
    try {
      console.log(`[Google Gen AI] [${logPrefix}] Attempting Gemma model: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 3500,
        },
      });

      if (response && response.text) {
        console.log(`[Google Gen AI] [${logPrefix}] SUCCESS with Gemma model: ${model} (${response.text.length} chars)`);
        return { text: response.text, model };
      }
    } catch (err: any) {
      console.warn(`[Google Gen AI] [${logPrefix}] Gemma model ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || 'Gemma AI models exhausted without response.');
}

// Clean Part 1 of any duplicate school header blocks produced by model
function cleanPart1Header(part1Text: string): string {
  const lines = part1Text.split('\n');
  let startIdx = 0;
  while (startIdx < lines.length && startIdx < 15) {
    const trimmed = lines[startIdx].trim();
    if (!trimmed) {
      startIdx++;
      continue;
    }
    if (
      /general\s+instructions?/i.test(trimmed) ||
      /^#{1,4}\s*section\s+[A-E]/i.test(trimmed) ||
      /^section\s+[A-E]/i.test(trimmed)
    ) {
      break;
    }
    if (
      /school|periodic|examination|assessment|session\s+20\d\d|candidate\s+roll|roll\s+number|class:\s+|subject:\s+|max.*marks|time\s+allowed/i.test(trimmed)
    ) {
      startIdx++;
      continue;
    }
    if (trimmed === '---' || trimmed === '***') {
      startIdx++;
      continue;
    }
    break;
  }
  return lines.slice(startIdx).join('\n').trim();
}

// Assessment generation endpoint with rate limiter
app.post('/api/generate-assessment', rateLimitMiddleware, async (req, res) => {
  try {
    const { config, subjectName, chapterNames, teacherCustomPrompt } = req.body;

    if (!config) {
      return res.status(400).json({ error: 'Missing assessment configuration.' });
    }

    const isEnglishOrLanguage = /english|hindi|sanskrit|language|literature/i.test(subjectName || '');
    const isMath = /math|applied mathematics/i.test(subjectName || '');
    const isScience = /physics|chemistry|biology|science/i.test(subjectName || '');
    const isSocialScience = /social|history|geography|political|civics|economics|business|accountancy/i.test(subjectName || '');

    const chaptersLabel =
      Array.isArray(chapterNames) && chapterNames.length > 0
        ? chapterNames.join(', ')
        : 'Selected NCERT Units';

    const focusSubtopicsText =
      Array.isArray(config.focusSubtopics) && config.focusSubtopics.length > 0
        ? `Focus Subtopics: ${config.focusSubtopics.join('; ')}`
        : isEnglishOrLanguage
        ? 'Focus on chapter themes, character motivations, extract-based analysis (RTC), literary devices, and author intentions.'
        : isMath
        ? 'Focus on core NCERT theorems, algebraic reductions, step-by-step proofs, and formula applications.'
        : 'Cover all critical NCERT concepts, high-yield topics, and standard CBSE question patterns.';

    const customInstructionsText = teacherCustomPrompt && teacherCustomPrompt.trim()
      ? `\nTEACHER CUSTOM DIRECTIVES (CRITICAL - YOU MUST FOLLOW THESE SPECIFIC REQUESTS):\n${teacherCustomPrompt.trim()}\n`
      : '';

    const blendDetails: string[] = [];
    if (config.questionBlend?.includeMcq) {
      blendDetails.push(
        isEnglishOrLanguage
          ? 'Extract-Based Objective MCQs testing vocabulary, tone, literary devices & context (1 mark each)'
          : 'Multiple Choice Questions (MCQs) & Assertion-Reasoning (1 mark each)'
      );
    }
    if (config.questionBlend?.includeVsa) {
      blendDetails.push(
        isEnglishOrLanguage
          ? 'Short Answer Questions on character motives, plot & themes in 30-40 words (2 marks each)'
          : 'Very Short Answer Type (2 marks each)'
      );
    }
    if (config.questionBlend?.includeSa) {
      blendDetails.push(
        isEnglishOrLanguage
          ? 'Analytical Short Answer Questions on poetic devices, symbolism & conflicts in 40-50 words (3 marks each)'
          : 'Short Answer Type (3 marks each)'
      );
    }
    if (config.questionBlend?.includeCaseStudy) {
      blendDetails.push(
        isEnglishOrLanguage
          ? 'Reference-to-Context (RTC) Case Study with a 4-6 line prose or poetry extract followed by 4 sub-parts (4 marks)'
          : 'Case-Based / Competency-Based Real World Scenario (4 marks with sub-parts)'
      );
    }
    if (config.questionBlend?.includeLa) {
      blendDetails.push(
        isEnglishOrLanguage
          ? 'Long Answer Value-Based / Character Sketch Questions in 100-120 words (5 marks each, with internal OR choice)'
          : 'Long Answer / Comprehensive Concept Questions (5 marks each, with internal OR choice)'
      );
    }

    let subjectSpecificRules = '';
    if (isEnglishOrLanguage) {
      subjectSpecificRules = `
SUBJECT DOMAIN: LANGUAGE & LITERATURE (${subjectName}).
- STRICT PROHIBITION: Under NO circumstances generate science formulas, physics equations, chemical reactions, SI units, reaction rates, equilibrium, thermodynamics, isothermal, entropy, numericals, or mathematical derivations!
- All questions must be 100% focused on English Literature, Reading Comprehension, Literary Devices, Vocabulary, and Character Analysis from the prescribed NCERT chapters (${chaptersLabel}).
- Literature questions must cite characters, quotes, and themes from the prescribed texts (e.g. Lencho in 'A Letter to God', Nelson Mandela in 'Long Walk to Freedom', Robert Frost's 'Dust of Snow', etc.).
- Marking Scheme: Allocate marks for Content (key points), Expression (coherence & vocabulary), and Accuracy (spelling & grammar).`;
    } else if (isMath) {
      subjectSpecificRules = `
SUBJECT DOMAIN: MATHEMATICS (${subjectName}).
- Formulate questions using clean LaTeX math notation ($...$ and $$...$$).
- Include theorems, proofs, algebraic simplifications, coordinate geometry, or calculus problems matching the syllabus.
- Marking Scheme: Detail explicit step marks for formula, intermediate substitutions, and final numerical values with units.`;
    } else if (isScience) {
      subjectSpecificRules = `
SUBJECT DOMAIN: NATURAL SCIENCE (${subjectName}).
- Balanced mix of conceptual reasoning, standard numericals with SI units, balanced chemical equations (with state symbols), and biological mechanisms.
- Marking Scheme: Explicit step marks: Formula/Law [1 Mark], Substitution [1 Mark], Final answer with correct SI unit [1 Mark].`;
    } else if (isSocialScience) {
      subjectSpecificRules = `
SUBJECT DOMAIN: SOCIAL SCIENCES / HUMANITIES (${subjectName}).
- Focus on historical analysis, constitutional principles, geographical factors, economic indicators, and policy reasoning.
- STRICT PROHIBITION: Do NOT generate physics or chemistry formulas or SI units.`;
    }

    const systemPrompt = `You are a Senior CBSE Chief Examination Setter and Master NCERT Educator with 20+ years of experience authoring official CBSE board exam papers and confidential marking schemes.
You strictly comply with the latest rationalized NCERT textbook syllabi, National Curriculum Framework (NCF), and official CBSE assessment blueprints.

CRITICAL INSTRUCTIONS:
1. TARGET SUBJECT: Strictly generate questions ONLY for ${subjectName} (${config.grade}). NEVER mix questions from other subjects or unrelated chapters.
2. TARGET CHAPTERS: ${chaptersLabel}
${subjectSpecificRules}

ANTI-HALLUCINATION & FACTUAL ACCURACY MANDATE:
- All questions MUST be strictly grounded in the authentic NCERT syllabus for ${subjectName} (${config.grade}).
- Do NOT hallucinate non-existent NCERT topics, fictional experiments, false historical accounts, or fabricated literary quotes.
- For literature, cite genuine prescribed NCERT textbook characters, author names, and themes from: ${chaptersLabel}.
- For science & mathematics, ensure all chemical formulas, physics laws, and mathematical equations are verified, standard, and solvable.
- Ensure the total marks of all questions strictly equals ${config.totalMarks || 25}.

3. OUTPUT FORMAT: You MUST separate your response into EXACTLY TWO distinct sections using these verbatim headings:
# PART 1: STUDENT QUESTION PAPER
(followed by the complete student test paper)

# PART 2: TEACHER MARKING SCHEME
(followed by the step-by-step marking rubric)

4. FORMATTING FOR PART 1 (Student Question Paper):
- CRITICAL: DO NOT repeat any School Letterhead, School Name, Exam Title, or Roll Number box at the top. The UI system already prints the official school letterhead, session, and candidate roll number grid.
- Start directly with:
**General Instructions:**
1. All questions are compulsory.
2. Section A contains Objective Type questions / MCQs carrying 1 mark each...
- Section breaks: SECTION A, SECTION B, SECTION C, SECTION D, SECTION E (as appropriate for question types).
- Use clear markdown typography with question numbering Q1, Q2, Q3...
- For MCQs, clearly list options (a), (b), (c), (d) on separate lines.
- For Math/Science, write formulas in clean LaTeX ($...$ and $$...$$).
- Always include mark allocations in brackets at the end of each question (e.g. [1 Mark], [2 Marks], [3 Marks], [4 Marks], [5 Marks]).
- Include authentic internal OR choices for at least one 3-mark and one 5-mark question.

5. FORMATTING FOR PART 2 (Teacher Marking Scheme & Answer Key):
- Must provide unambiguous, comprehensive solutions and marking breakdowns for EVERY single question from Part 1.
- For MCQs: State the correct option letter, the option text, and a 1-sentence pedagogical rationale.
- For numerical / mathematical / formula derivations: Provide explicit step-marking:
  - Formula written: [1/2 or 1 Mark]
  - Correct substitution: [1 Mark]
  - Final answer with correct SI unit / simplified expression: [1 Mark]
- For literature / social science subjective answers: Provide bullet points of essential value points required for full credit.`;

    const userPrompt = `Generate a complete, official CBSE Class ${config.grade} examination paper for:
Subject: ${subjectName}
Prescribed Chapters / Units: ${chaptersLabel}
${focusSubtopicsText}
${customInstructionsText}
Difficulty: ${config.difficulty || 'standard'}
Total Marks: ${config.totalMarks || 25}
Duration: ${config.durationMinutes || 45} Minutes

Question Typologies Included:
${blendDetails.map(b => `- ${b}`).join('\n')}

Generate the complete paper now strictly using the two headings:
# PART 1: STUDENT QUESTION PAPER
...
# PART 2: TEACHER MARKING SCHEME
...`;

    const fullPrompt = `${systemPrompt}\n\n=== USER ASSESSMENT REQUEST ===\n${userPrompt}`;

    const { text, model } = await callGenAIWithFallback(fullPrompt, 'Assessment');

    // Post-process to remove duplicate school header if model included one in Part 1
    let processedText = text;
    const part2Idx = text.search(/#+\s*PART\s*2\s*:\s*TEACHER\s*MARKING\s*SCHEME/i);
    if (part2Idx !== -1) {
      const part1Raw = text.slice(0, part2Idx);
      const part2Raw = text.slice(part2Idx);
      const part1Cleaned = cleanPart1Header(part1Raw.replace(/#+\s*PART\s*1\s*:\s*STUDENT\s*QUESTION\s*PAPER\s*/i, ''));
      processedText = `# PART 1: STUDENT QUESTION PAPER\n\n${part1Cleaned}\n\n${part2Raw}`;
    }

    res.json({
      success: true,
      text: processedText,
      model,
    });
  } catch (error: any) {
    console.error('[Google Gen AI] Assessment generation error:', error?.message || error);
    res.status(500).json({ error: error?.message || 'Failed to generate assessment.' });
  }
});

// Endpoint for Monthly Lesson Plan generation with rate limiter
app.post('/api/generate-lesson-plan', rateLimitMiddleware, async (req, res) => {
  try {
    const { config, subjectName, chapterNames, teacherCustomPrompt } = req.body;

    if (!config) {
      return res.status(400).json({ error: 'Missing lesson plan configuration.' });
    }

    const chaptersLabel =
      Array.isArray(chapterNames) && chapterNames.length > 0
        ? chapterNames.join(', ')
        : 'Target Units';

    const customInstructionsText = teacherCustomPrompt && teacherCustomPrompt.trim()
      ? `\nTEACHER CUSTOM DIRECTIVES:\n${teacherCustomPrompt.trim()}\n`
      : '';

    const systemPrompt = `You are a CBSE Master Pedagogy Consultant and NCERT Curriculum Coordinator with 20+ years of experience authoring official CBSE Teacher Diaries and Monthly Instructional Lesson Plans.
You strictly comply with the National Education Policy (NEP 2020), National Curriculum Framework (NCF-SE), and rationalized NCERT textbooks.

CRITICAL INSTRUCTIONS:
1. TARGET SUBJECT: Strictly generate the lesson plan ONLY for ${subjectName} (${config.grade}). Do NOT mix other subjects.
2. TARGET CHAPTERS: ${chaptersLabel}
3. OUTPUT FORMAT: You MUST separate your output into EXACTLY TWO distinct sections using these verbatim headings:
# PART 1: CURRICULAR LESSON PLAN
(followed by the comprehensive administrative and pedagogical plan including General Objectives, Experiential / Lab Activities, Art Integration, Remedial & HOTS strategies, and sign-offs)

# PART 2: WEEK-BY-WEEK TRACKER
(followed by a markdown table detailing: Period #, NCERT Topic / Core Subtopic, Pedagogical Method, Lab / Art Integration, Formative Check / HW across all ${config.totalPeriods || 24} periods)

IMPORTANT: Do NOT output raw HTML tags like <div> or <span>. For signature blocks, use a Markdown table.`;

    const userPrompt = `Generate an authentic CBSE Monthly Lesson Plan for:
Class: ${config.grade}
Subject: ${subjectName}
Month: ${config.month} (${config.academicSession || '2026-2027'})
Total Periods Allocated: ${config.totalPeriods || 24} Periods
Target NCERT Chapters: ${chaptersLabel}
School: ${config.schoolName || 'ABC PUBLIC SCHOOL'}
Teacher: ${config.teacherName || 'Senior PGT Educator'}
${customInstructionsText}

Output using verbatim headings:
# PART 1: CURRICULAR LESSON PLAN
...
# PART 2: WEEK-BY-WEEK TRACKER
...`;

    const fullPrompt = `${systemPrompt}\n\n=== LESSON PLAN REQUEST ===\n${userPrompt}`;

    const { text, model } = await callGenAIWithFallback(fullPrompt, 'LessonPlan');

    res.json({
      success: true,
      text,
      model,
    });
  } catch (error: any) {
    console.error('[Google Gen AI] Lesson plan generation error:', error?.message || error);
    res.status(500).json({ error: error?.message || 'Failed to generate lesson plan.' });
  }
});

// Rate limit status endpoint
app.get('/api/rate-limit-status', (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || (now - record.windowStart) > RATE_LIMIT_WINDOW_MS) {
    return res.json({
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: MAX_REQUESTS_PER_WINDOW,
      resetInMinutes: 300,
    });
  }
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count);
  const remainingMs = Math.max(0, record.windowStart + RATE_LIMIT_WINDOW_MS - now);
  res.json({
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining,
    resetInMinutes: Math.ceil(remainingMs / (60 * 1000)),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CurriculumCraft AI Backend', models: MODEL_PRIORITY });
});

export { app };
export default app;
