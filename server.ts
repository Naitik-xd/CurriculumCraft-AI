import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client with server-side environment key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models: strictly open-weight Gemma models only
const MODEL_PRIORITY = [
  'gemma-4-26b-a4b-it',
  'gemma-4-31b-it',
];

async function callGenAIWithFallback(fullPrompt: string, logPrefix: string): Promise<{ text: string; model: string }> {
  let lastError: any = null;

  for (const model of MODEL_PRIORITY) {
    try {
      console.log(`[Google Gen AI] [${logPrefix}] Attempting Gemma model: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 3000,
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

// Assessment generation endpoint
app.post('/api/generate-assessment', async (req, res) => {
  try {
    const { config, subjectName, chapterNames, teacherCustomPrompt } = req.body;

    if (!config) {
      return res.status(400).json({ error: 'Missing assessment configuration.' });
    }

    const chaptersLabel =
      Array.isArray(chapterNames) && chapterNames.length > 0
        ? chapterNames.join(', ')
        : 'Selected NCERT Units';

    const focusSubtopicsText =
      Array.isArray(config.focusSubtopics) && config.focusSubtopics.length > 0
        ? `Focus Subtopics: ${config.focusSubtopics.join('; ')}`
        : 'Cover all critical NCERT concepts, high-yield derivations, and standard numerical problems.';

    const customInstructionsText = teacherCustomPrompt && teacherCustomPrompt.trim()
      ? `\nTEACHER CUSTOM DIRECTIVES (CRITICAL - YOU MUST FOLLOW THESE SPECIFIC REQUESTS):\n${teacherCustomPrompt.trim()}\n`
      : '';

    const blendDetails: string[] = [];
    if (config.questionBlend?.includeMcq) {
      blendDetails.push('Multiple Choice Questions (MCQs) & Assertion-Reasoning (1 mark each)');
    }
    if (config.questionBlend?.includeVsa) {
      blendDetails.push('Very Short Answer Type (2 marks each)');
    }
    if (config.questionBlend?.includeSa) {
      blendDetails.push('Short Answer Type (3 marks each)');
    }
    if (config.questionBlend?.includeCaseStudy) {
      blendDetails.push('Case-Based / Competency-Based Real World Scenario (4 marks with sub-parts)');
    }
    if (config.questionBlend?.includeLa) {
      blendDetails.push('Long Answer / Derivations / Comprehensive Numericals (5 marks each, with internal OR choice)');
    }

    const systemPrompt = `You are a Senior CBSE Chief Examination Setter and Master NCERT Educator with 20+ years of experience authoring official CBSE board exam papers and confidential marking schemes.
You strictly comply with the latest rationalized NCERT textbook syllabi, National Curriculum Framework (NCF), and official CBSE assessment blueprints.

CRITICAL INSTRUCTIONS:
1. TARGET SUBJECT: Strictly generate questions ONLY for ${subjectName} (${config.grade}). NEVER mix questions from other subjects or unrelated chapters.
2. TARGET CHAPTERS: ${chaptersLabel}
3. OUTPUT FORMAT: You MUST separate your response into EXACTLY TWO distinct sections using these verbatim headings:
# PART 1: STUDENT QUESTION PAPER
(followed by the complete student test paper)

# PART 2: TEACHER MARKING SCHEME
(followed by the step-by-step marking rubric)

4. FORMATTING FOR PART 1 (Student Question Paper):
- School Header block with: School Name (${config.schoolMetadata?.schoolName || 'ABC PUBLIC SCHOOL'}), Examination Title, Session, Class, Subject & Code, Time Allowed, Max Marks.
- General Instructions block (numbered 1 to 7 matching standard CBSE board patterns).
- Section breaks: SECTION A, SECTION B, SECTION C, SECTION D, SECTION E (as appropriate for question types).
- Every question MUST state its mark at the end right-aligned like:
[X Mark(s)]
- For Assertion-Reason questions, include the official 4 options (a) Both A and R are true and R is correct explanation..., (b)... etc.
- For Science / Math / Economics formulas, write clean inline LaTeX with $...$ (e.g. $E = mc^2$, $\\Delta T_b = i K_b m$, $\\frac{dy}{dx}$) or block LaTeX with $$...$$. Use chemical notations like $\\text{KMnO}_4$, $\\text{Zn}^{2+}$, $\\text{H}_2\\text{SO}_4$.
- Do NOT output raw HTML tags like <div> or <span>. Use pure Markdown.
- Include authentic internal choice ("OR") on Long Answer questions and Case Studies.

5. FORMATTING FOR PART 2 (Teacher Marking Scheme):
- Question-by-question complete answer key.
- Explicit step-wise credit breakdown: e.g. Formula: [½ Mark], Substitution with values: [1 Mark], Final answer with correct SI units: [½ Mark].
- Balanced chemical equations or step-by-step mathematical proofs.
- "Evaluation Note / Common Pitfalls" highlighting typical student mistakes.

6. Difficulty Level: ${(config.difficulty || 'standard').toUpperCase()}
- Foundation: Direct conceptual questions, basic definitions, direct formula applications.
- Standard CBSE Board: Balanced mix of theory, derivations, numericals, and NCERT Exemplar questions.
- HOTS: High Order Thinking Skills, tricky conceptual applications, multi-step numericals.

Total Marks: ${config.totalMarks || 25}. Ensure the sum of marks of all questions strictly equals ${config.totalMarks || 25}.`;

    const userPrompt = `Generate an authentic CBSE ${config.grade} ${subjectName} exam paper.
Target Chapters: ${chaptersLabel}
${focusSubtopicsText}
${customInstructionsText}
Difficulty: ${config.difficulty || 'standard'}
Total Marks: ${config.totalMarks || 25}
Duration: ${config.durationMinutes || 45} Minutes

School Details:
- School Name: ${config.schoolMetadata?.schoolName || 'ABC PUBLIC SCHOOL'}
- Exam Title: ${config.schoolMetadata?.examName || 'PERIODIC ASSESSMENT'}
- Academic Session: ${config.schoolMetadata?.academicSession || '2026-2027'}

Question Typologies Included:
${blendDetails.map(b => `- ${b}`).join('\n')}

Generate the complete paper now strictly using the two headings:
# PART 1: STUDENT QUESTION PAPER
...
# PART 2: TEACHER MARKING SCHEME
...`;

    const fullPrompt = `${systemPrompt}\n\n=== USER ASSESSMENT REQUEST ===\n${userPrompt}`;

    const { text, model } = await callGenAIWithFallback(fullPrompt, 'Assessment');

    res.json({
      success: true,
      text,
      model,
    });
  } catch (error: any) {
    console.error('[Google Gen AI] Assessment generation error:', error?.message || error);
    res.status(500).json({ error: error?.message || 'Failed to generate assessment.' });
  }
});

// Endpoint for Monthly Lesson Plan generation
app.post('/api/generate-lesson-plan', async (req, res) => {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CurriculumCraft AI Backend', models: MODEL_PRIORITY });
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CurriculumCraft AI server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
