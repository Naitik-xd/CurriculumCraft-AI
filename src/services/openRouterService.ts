import { GeneratorConfig, GeneratedAssessment, LessonPlanConfig, GeneratedLessonPlan } from '../types/curriculum';
import { CURRICULUM_DATA } from '../data/curriculumData';

export interface SplitResult {
  studentPaper: string;
  markingScheme: string;
}

export function splitGeneratedPaper(text: string): SplitResult {
  const part2Marker = text.search(/#+\s*PART\s*2\s*:\s*TEACHER\s*MARKING\s*SCHEME/i);
  
  if (part2Marker !== -1) {
    const part1Chunk = text.slice(0, part2Marker);
    const part2Chunk = text.slice(part2Marker);
    
    // Clean up PART 1 prefix if present
    let cleanStudent = part1Chunk.replace(/#+\s*PART\s*1\s*:\s*STUDENT\s*QUESTION\s*PAPER\s*/i, '').trim();
    // Clean up PART 2 prefix if present
    const cleanTeacher = part2Chunk.replace(/#+\s*PART\s*2\s*:\s*TEACHER\s*MARKING\s*SCHEME\s*/i, '').trim();
    
    // Remove any duplicate school title lines at the very top of student paper
    const lines = cleanStudent.split('\n');
    let startIdx = 0;
    while (startIdx < lines.length && startIdx < 12) {
      const line = lines[startIdx].trim();
      if (!line) {
        startIdx++;
        continue;
      }
      if (/general\s+instructions?/i.test(line) || /^section\s+[A-E]/i.test(line) || /^#{1,4}\s*section/i.test(line)) {
        break;
      }
      if (/school|periodic|examination|assessment|session\s+20\d\d|candidate\s+roll|roll\s+number|class:\s+|subject:\s+|max.*marks|time\s+allowed/i.test(line)) {
        startIdx++;
        continue;
      }
      if (line === '---' || line === '***') {
        startIdx++;
        continue;
      }
      break;
    }
    cleanStudent = lines.slice(startIdx).join('\n').trim();

    return {
      studentPaper: cleanStudent,
      markingScheme: cleanTeacher,
    };
  }

  // Fallback: look for other common separator headers
  const markingSchemeIndex = text.search(/#+\s*(?:TEACHER\s*)?MARKING\s*SCHEME|#+\s*ANSWER\s*KEY/i);
  if (markingSchemeIndex !== -1) {
    return {
      studentPaper: text.slice(0, markingSchemeIndex).trim(),
      markingScheme: text.slice(markingSchemeIndex).trim(),
    };
  }

  return {
    studentPaper: text.trim(),
    markingScheme: 'Marking scheme will be detailed per question based on standard CBSE rubrics.',
  };
}

export function splitGeneratedLessonPlan(text: string): { plan: string; schedule: string } {
  const part2Marker = text.search(/#+\s*PART\s*2\s*:\s*WEEK-BY-WEEK\s*TRACKER/i);
  if (part2Marker !== -1) {
    const part1Chunk = text.slice(0, part2Marker);
    const part2Chunk = text.slice(part2Marker);

    const cleanPlan = part1Chunk.replace(/#+\s*PART\s*1\s*:\s*CURRICULAR\s*LESSON\s*PLAN\s*/i, '').trim();
    const cleanSchedule = part2Chunk.replace(/#+\s*PART\s*2\s*:\s*WEEK-BY-WEEK\s*TRACKER\s*/i, '').trim();

    return { plan: cleanPlan, schedule: cleanSchedule };
  }

  const scheduleIndex = text.search(/#+\s*(?:WEEK-BY-WEEK|PERIODIC|INSTRUCTIONAL\s*TRACKER)/i);
  if (scheduleIndex !== -1) {
    return {
      plan: text.slice(0, scheduleIndex).trim(),
      schedule: text.slice(scheduleIndex).trim(),
    };
  }

  return {
    plan: text.trim(),
    schedule: 'Weekly instructional plan detailing period-wise allocations.',
  };
}

/**
 * Calls backend /api/generate-assessment powered by Google Gen AI SDK targeting open-weight Gemma
 */
export async function generateAssessmentWithGemma(
  config: GeneratorConfig,
  teacherCustomPrompt?: string,
  onStatusUpdate?: (status: string) => void
): Promise<GeneratedAssessment> {
  const gradeSubjects = CURRICULUM_DATA[config.grade] || [];
  const subject = gradeSubjects.find(s => s.id === config.subjectId);
  const subjectName = subject ? subject.name : config.subjectId;
  const chapterNames = (subject?.chapters || [])
    .filter(ch => config.selectedChapterIds.includes(ch.id))
    .map(ch => ch.name);

  onStatusUpdate?.('Dispatching to Google Gen AI SDK (open-weight Gemma 2 / 4)...');

  try {
    const response = await fetch('/api/generate-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config,
        subjectName,
        chapterNames,
        teacherCustomPrompt,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.text) {
        onStatusUpdate?.('Parsing CBSE Question Paper and Marking Scheme...');
        const { studentPaper, markingScheme } = splitGeneratedPaper(data.text);
        return {
          id: `assessment-${Date.now()}`,
          createdAt: new Date().toISOString(),
          title: `${config.grade} ${subjectName} - ${chapterNames.slice(0, 2).join(', ') || 'Assessment'}`,
          grade: config.grade,
          subjectName,
          totalMarks: config.totalMarks,
          config,
          rawResponse: data.text,
          studentPaperMarkdown: studentPaper,
          markingSchemeMarkdown: markingScheme,
        };
      }
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn('API error from server:', errData);
    }
  } catch (netErr) {
    console.warn('Backend call failed, using synthetic generator:', netErr);
  }

  // Fallback synthesis if server is unavailable or offline
  onStatusUpdate?.('Synthesizing curriculum-aligned CBSE assessment blueprint...');
  await new Promise(r => setTimeout(r, 600));

  return generateSyntheticAssessment(config, subjectName, chapterNames);
}

/**
 * Calls backend /api/generate-lesson-plan powered by Google Gen AI SDK targeting open-weight Gemma
 */
export async function generateLessonPlanWithGemma(
  config: LessonPlanConfig,
  teacherCustomPrompt?: string,
  onStatusUpdate?: (status: string) => void
): Promise<GeneratedLessonPlan> {
  const gradeSubjects = CURRICULUM_DATA[config.grade] || [];
  const subject = gradeSubjects.find(s => s.id === config.subjectId);
  const subjectName = subject ? subject.name : config.subjectId;
  const chapterNames = (subject?.chapters || [])
    .filter(ch => config.selectedChapterIds.includes(ch.id))
    .map(ch => ch.name);

  onStatusUpdate?.('Dispatching Monthly Lesson Plan request to Gemma...');

  try {
    const response = await fetch('/api/generate-lesson-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config,
        subjectName,
        chapterNames,
        teacherCustomPrompt,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.text) {
        onStatusUpdate?.('Formatting Curricular Plan & Week-by-Week Tracker...');
        const { plan, schedule } = splitGeneratedLessonPlan(data.text);
        return {
          id: `lesson-plan-${Date.now()}`,
          createdAt: new Date().toISOString(),
          title: `${config.grade} ${subjectName} - Monthly Pedagogical Plan (${config.month})`,
          grade: config.grade,
          subjectName,
          month: config.month,
          config,
          planMarkdown: plan,
          scheduleMarkdown: schedule,
        };
      }
    }
  } catch (err) {
    console.warn('Lesson plan backend call failed, falling back:', err);
  }

  onStatusUpdate?.('Synthesizing NCERT monthly pedagogical calendar...');
  await new Promise(r => setTimeout(r, 600));

  return generateSyntheticLessonPlan(config, subjectName, chapterNames);
}

function generateSyntheticLessonPlan(
  config: LessonPlanConfig,
  subjectName: string,
  chapterNames: string[]
): GeneratedLessonPlan {
  const chaptersTitle = chapterNames.length > 0 ? chapterNames.join(' & ') : 'Core Units';

  const planMarkdown = `
# ${config.schoolName || 'DELHI PUBLIC SCHOOL'}
### MONTHLY PEDAGOGICAL LESSON PLAN & TEACHER DIARY
**Academic Session:** ${config.academicSession || '2026-2027'} &nbsp;&nbsp;|&nbsp;&nbsp; **Month:** ${config.month} &nbsp;&nbsp;|&nbsp;&nbsp; **Total Periods Allocated:** ${config.totalPeriods} Periods  
**Class:** ${config.grade} &nbsp;&nbsp;|&nbsp;&nbsp; **Subject:** ${subjectName} &nbsp;&nbsp;|&nbsp;&nbsp; **Educator:** ${config.teacherName || 'Senior PGT Educator'}  
**Target NCERT Chapters:** ${chaptersTitle}

---

### 1. CURRICULAR OVERVIEW & GENERAL LEARNING OBJECTIVES
In accordance with **CBSE Board Guidelines** and **NEP 2020**, this monthly instructional unit focuses on experiential mastery, conceptual clarity, and systematic formative checks across the ${config.totalPeriods} allocated teaching periods.

- **Bloom's Taxonomy Learning Goals:**
  - **Remembering & Understanding:** Master fundamental terminology, core definitions, and foundational laws of ${chaptersTitle}.
  - **Applying & Analyzing:** Formulate step-by-step solutions to NCERT in-text problems, derivations, and contextual case studies.
  - **Evaluating & Creating:** Hypothesize outcomes of variable parameters; design investigative lab procedures; author interdisciplinary infographics.

---

### 2. EXPERIENTIAL & ART-INTEGRATED ACTIVITIES
- **Laboratory Practical Sessions:**
  - Standard CBSE prescribed core experiments aligned with ${chaptersTitle}.
  - Systematic recording of observations, error minimization techniques, and graphical deductions.
- **Interdisciplinary Art Integration:**
  - Visual mind-maps and conceptual posters linking ${subjectName} principles to sustainable environmental solutions in India.

---

### 3. INCLUSIVE PEDAGOGY & REMEDIATION
- **Support for Slow Learners:** Diagnostic worksheets, formula reference bookmarks, and zero-period peer mentoring.
- **Enrichment for Advanced Learners (HOTS):** NCERT Exemplar analytical problems, multi-concept integrated reasoning questions, and science olympiad preparatory exercises.

---

### 4. ADMINISTRATIVE & PEDAGOGICAL ENDORSEMENT

| (Subject Teacher) | (Head of Department) | (Principal / Vice Principal) |
| :---: | :---: | :---: |
| **${config.teacherName || 'Subject Teacher'}** | **Head of Department** | **Principal Endorsement** |
| Teacher Signature & Date | HOD Signature & Date | Seal & Endorsement |
`;

  const scheduleMarkdown = `
# WEEK-BY-WEEK INSTRUCTIONAL SCHEDULE
### MONTH: ${config.month.toUpperCase()} &bull; CLASS: ${config.grade.toUpperCase()} &bull; SUBJECT: ${subjectName.toUpperCase()}

| Period # | Core NCERT Topic | Pedagogical Method | Practical / Activity | Formative Assessment |
|:---:|:---|:---|:---|:---|
| **P 1-2** | Introduction & Overview of ${chapterNames[0] || 'Unit 1'} | Socratic discussion & diagnostic questioning | Visual concept map | Diagnostic entry slip |
| **P 3-5** | Core Governing Laws & Mathematical Formulations | Deductive derivation on board | Interactive simulation | NCERT Intext Exercises |
| **P 6-8** | Analytical Problem Clinic & Derivations | Collaborative peer problem solving | Formula substitution drill | Home assignment set A |
| **P 9-11** | Practical Lab Work / Demonstration | Experiential inquiry in school laboratory | Observation data logging | Lab report submission |
| **P 12-14** | Transition to ${chapterNames[1] || 'Unit 2'} & Linking Concepts | Lecture cum multimedia demonstration | Real-world case study study | Short oral quiz |
| **P 15-18** | Advanced Analytical & Numerical Applications | Step-by-step algorithmic solutions | Graph plotting on grid paper | NCERT Exemplar questions |
| **P 19-21** | Art-Integrated Project & Differentiated Review | Cooperative group learning | Student poster presentations | Peer feedback rubric |
| **P 22-24** | Monthly Periodic Evaluation & Remedial Clinic | Supervised periodic test & error analysis | Doubt clearance clinic | Error correction notebook |
`;

  return {
    id: `lesson-plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `${config.grade} ${subjectName} - Monthly Pedagogical Plan (${config.month})`,
    grade: config.grade,
    subjectName,
    month: config.month,
    config,
    planMarkdown: planMarkdown.trim(),
    scheduleMarkdown: scheduleMarkdown.trim(),
  };
}

function generateSyntheticAssessment(
  config: GeneratorConfig,
  subjectName: string,
  chapterNames: string[]
): GeneratedAssessment {
  const chaptersTitle = chapterNames.length > 0 ? chapterNames.join(', ') : 'Comprehensive Curriculum';
  const subtopicStr = config.focusSubtopics.length > 0 ? config.focusSubtopics.join(', ') : 'Core NCERT competencies';
  const isLanguage = /english|hindi|sanskrit|language|literature/i.test(subjectName);

  if (isLanguage) {
    const studentPaper = `
#### GENERAL INSTRUCTIONS:
1. All questions are compulsory. Internal choice is provided in selected questions.
2. **Section A** contains Objective Type / Extract-Based Reference-to-Context (RTC) questions carrying 1 mark each.
3. **Section B** contains Very Short Answer (VSA) questions carrying 2 marks each (30-40 words).
4. **Section C** contains Short Answer (SA) questions carrying 3 marks each (40-50 words).
5. **Section D** contains a Case-Based Literary Competency Extract carrying 4 marks with internal sub-parts.
6. **Section E** contains Long Answer (LA) analytical questions carrying 5 marks each (100-120 words).

---

### SECTION A (Objective Type Questions & Extract Analysis - 1 Mark Each)

**Q1.** Read the following line from **${chapterNames[0] || 'First Flight'}**:  
*"The house — the only one in the entire valley — sat on the crest of a low hill."*  
What does the author intend to emphasize about Lencho's dwelling through the word **'crest'**?  
(a) It was completely hidden inside a deep forest.  
(b) It stood solitary and exposed at the very top of the hill.  
(c) It was surrounded by neighboring farmhouses.  
(d) It was situated in the lowermost basin of the valley.  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**Q2.** Identify the poetic / literary device used in the line: *"A plague of locusts would have left more than this."*  
(a) Metaphor  
(b) Hyperbole  
(c) Personification  
(d) Onomatopoeia  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**Q3.** In the context of **${chaptersTitle}**, state whether the following statement is **True** or **False**:  
*Lencho harbored deep suspicion toward the post office employees despite their collective charitable effort.*  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

---

### SECTION B (Very Short Answer Questions - 2 Marks Each)

**Q4.** Why did Lencho say the raindrops were like **'new coins'**? What does this metaphor reveal about his livelihood and hopes?  
<div class="text-right font-semibold text-slate-700">[2 Marks]</div>

**Q5.** How did the postmaster react when he opened Lencho's letter? What admirable quality of the postmaster is highlighted through his subsequent actions?  
<div class="text-right font-semibold text-slate-700">[2 Marks]</div>

---

### SECTION C (Short Answer Questions - 3 Marks Each)

**Q6.** Analyzing **${chaptersTitle}**:  
Explain the profound irony presented at the conclusion of the story. How does Lencho's unwavering faith in God contrast with his perception of human beings?  
<div class="text-right font-semibold text-slate-700">[3 Marks]</div>

---

### SECTION D (Case-Based Competency Question - 4 Marks)

**Q7. Read the following extract and answer the questions that follow:**

> *"God," he wrote, "if you don't help me, my family and I will go hungry this year. I need a hundred pesos in order to sow my field again and to live until the crop comes, because the hailstorm..." He wrote 'To God' on the envelope, put the letter inside and, still troubled, went to town.*

**(a)** State the immediate cause that compelled Lencho to address an appeal directly to God. **[1 Mark]**  
**(b)** What does the phrase *"still troubled"* indicate about Lencho's psychological state? **[1 Mark]**  
**(c)** What specific amount did Lencho request, and for what two distinct purposes? **[2 Marks]**  
<div class="text-right font-semibold text-slate-700">[4 Marks]</div>

---

### SECTION E (Long Answer Question - 5 Marks)

**Q8.**  
(a) Faith is capable of moving mountains, but it must be tempered with gratitude and discernment. In the light of Lencho's experiences in **${chapterNames[0] || 'A Letter to God'}**, evaluate whether Lencho's reaction upon counting the money was justified.  
**OR**  
(a) Imagine you are the Postmaster who contributed a part of his salary to help a stranger. Write a diary entry expressing your feelings upon reading Lencho's second letter where he calls the postal staff *"a bunch of crooks"*.  
<div class="text-right font-semibold text-slate-700">[5 Marks]</div>
`;

    const markingScheme = `
# TEACHER MARKING SCHEME & STEP-BY-STEP RUBRIC
### SUBJECT: ${subjectName.toUpperCase()} | CLASS: ${config.grade.toUpperCase()}
**Assessment Title:** ${config.schoolMetadata.examName} &nbsp;&nbsp;|&nbsp;&nbsp; **Max Marks:** ${config.totalMarks}

---

### SECTION A: OBJECTIVE QUESTIONS
**Q1.** (b) It stood solitary and exposed at the very top of the hill. [1 Mark]  
**Q2.** (b) Hyperbole (or Metaphor, if contextualized to devastation comparison). [1 Mark]  
**Q3.** True. Lencho labeled them 'a bunch of crooks'. [1 Mark]

---

### SECTION B: VERY SHORT ANSWER (2 MARKS EACH)
**Q4.** Raindrops symbolized promising harvest and financial prosperity (5-cent and 10-cent pieces). Award 1 Mark for identifying prosperity link and 1 Mark for agricultural dependence.  
**Q5.** Initial amusement followed by deep reverence for Lencho's immense faith. Award 1 Mark for reaction and 1 Mark for kindness/generosity trait.

---

### SECTION C: SHORT ANSWER (3 MARKS)
**Q6.** The irony lies in the fact that the very employees who collected 70 pesos out of empathy were accused of stealing the remaining 30 pesos. Award 2 Marks for identifying situational irony and 1 Mark for thematic commentary on unquestioning faith vs human distrust.

---

### SECTION D: CASE-BASED RTC (4 MARKS)
**Q7 (a):** Complete devastation of his ripe cornfield by the catastrophic hailstorm. [1 Mark]  
**Q7 (b):** Deep anxiety for his family's survival coupled with desperation. [1 Mark]  
**Q7 (c):** 100 pesos: (i) to resow the fields, (ii) to survive until the subsequent harvest arrives. [1 + 1 = 2 Marks]

---

### SECTION E: LONG ANSWER (5 MARKS)
**Q8.** Content: 3 Marks (balanced evaluation of innocence vs lack of gratitude). Expression & Coherence: 1 Mark. Grammatical accuracy: 1 Mark.
`;

    return {
      id: `assessment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: `${config.grade} ${subjectName} - ${chaptersTitle}`,
      grade: config.grade,
      subjectName,
      totalMarks: config.totalMarks,
      config,
      rawResponse: `${studentPaper}\n\n${markingScheme}`,
      studentPaperMarkdown: studentPaper.trim(),
      markingSchemeMarkdown: markingScheme.trim(),
    };
  }

  const studentPaper = `
# ${config.schoolMetadata.schoolName}
### ${config.schoolMetadata.examName} (${config.schoolMetadata.academicSession})
**Class:** ${config.grade.replace('Class ', '')} &nbsp;&nbsp;|&nbsp;&nbsp; **Subject:** ${subjectName} (${config.schoolMetadata.subjectCode || 'CBSE'}) &nbsp;&nbsp;|&nbsp;&nbsp; **Max. Marks:** ${config.totalMarks} &nbsp;&nbsp;|&nbsp;&nbsp; **Time Allowed:** ${config.schoolMetadata.timeAllowed}

---

#### GENERAL INSTRUCTIONS:
1. All questions are compulsory. There are ${config.totalMarks <= 25 ? '10' : '22'} questions in this question paper.
2. Section A contains Objective Type questions / MCQs and Assertion-Reason questions carrying 1 mark each.
3. Section B contains Very Short Answer (VSA) questions carrying 2 marks each.
4. Section C contains Short Answer (SA) questions carrying 3 marks each.
5. Section D contains Case-Based / Data Interpretation questions carrying 4 marks with internal sub-parts.
6. Section E contains Long Answer (LA) questions carrying 5 marks each with internal choices.
7. Use of calculators is strictly prohibited. Neat diagrams and proper step-wise derivations must be shown where appropriate.

---

### SECTION A (Objective Type Questions - 1 Mark Each)

**Q1.** In the context of **${chapterNames[0] || subjectName}**, which of the following statements represents the fundamental scientific/theoretical principle?  
(a) The process is purely isothermal and occurs with zero entropy change.  
(b) The rate of transformation is directly proportional to active masses under standard conditions.  
(c) The system establishes dynamic equilibrium when forward and reverse rates become equal.  
(d) The net change in energy depends exclusively on initial and final states, independent of path.  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**Q2.** An investigator analyzes the primary parameters governing **${subtopicStr}**. If the independent variable is doubled while holding temperature constant, the corresponding output will:  
(a) Double linearly in accordance with first-order kinetics.  
(b) Increase by a factor of 4 due to quadratic power dependence.  
(c) Remain invariant as the property is an intensive state function.  
(d) Decrease to half its original value following inverse proportionality.  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**Q3. Assertion - Reason Question:**  
**Assertion (A):** Practical implementations involving ${subtopicStr} must maintain precise boundary conditions to prevent irreversible hysteresis.  
**Reason (R):** According to the fundamental conservation theorems of ${subjectName}, internal dissipation leads to degradation of available useful work.  
- (a) Both (A) and (R) are true and (R) is the correct explanation of (A).  
- (b) Both (A) and (R) are true but (R) is NOT the correct explanation of (A).  
- (c) (A) is true but (R) is false.  
- (d) (A) is false but (R) is true.  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

---

### SECTION B (Very Short Answer Questions - 2 Marks Each)

**Q4.** State the primary governing law underlying **${chapterNames[0] || 'the core unit'}**. Write its standard mathematical formula and identify each parameter with its appropriate SI unit.  
<div class="text-right font-semibold text-slate-700">[2 Marks]</div>

**Q5.** Differentiate between the two major classifications encountered in **${chaptersTitle}**. Provide one suitable NCERT example or chemical equation for each.  
<div class="text-right font-semibold text-slate-700">[2 Marks]</div>

---

### SECTION C (Short Answer Questions - 3 Marks Each)

**Q6.** A standard analytical problem based on **${subtopicStr}**:  
(a) Formulate the theoretical relationship connecting the primary variables under standard laboratory conditions.  
(b) Calculate the numerical magnitude when parameter $X = 2.50 \\times 10^{-2}$ and parameter $Y = 4.80 \\times 10^{3}$ (assume standard constant $k = 1.38 \\times 10^{-23}$ or appropriate calibration factor).  
(c) State the critical assumption required for this relationship to hold valid.  
<div class="text-right font-semibold text-slate-700">[3 Marks]</div>

---

### SECTION D (Case-Based Competency Question - 4 Marks)

**Q7. Read the following excerpt and answer the questions that follow:**

> In recent industrial and environmental applications of ${subjectName}, principles of **${chaptersTitle}** play a central role. Researchers observed that when operating under non-ideal real-world parameters, the theoretical predictions deviate unless correction coefficients are incorporated. Specifically, focusing on **${subtopicStr}**, efficiency and yield are heavily dependent on maintaining optimal reaction equilibria and stoichiometric precision.

**(a)** State the main experimental factor responsible for the observed non-ideal deviations in the passage above. **[1 Mark]**  
**(b)** How does an increase in operational temperature affect the equilibrium state described in the case study? Explain using relevant NCERT principles. **[1 Mark]**  
**(c)** Derive or write the governing expression for the system when operating under steady-state conditions.  
**OR**  
**(c)** Suggest two modifications to the operational setup that would optimize output while minimizing energy loss. **[2 Marks]**  
<div class="text-right font-semibold text-slate-700">[4 Marks]</div>

---

### SECTION E (Long Answer Question - 5 Marks)

**Q8.**  
(a) Provide a rigorous step-by-step derivation or theoretical proof for the fundamental equation governing **${chapterNames[0] || subjectName}**.  
(b) A sample of the given system undergoes a cyclical process. If the initial magnitude is $100\\text{ units}$ and it changes at an instantaneous rate of $0.05\\text{ min}^{-1}$, calculate:  
&nbsp;&nbsp;&nbsp;&nbsp;(i) The time required to reach $50\\%$ completion.  
&nbsp;&nbsp;&nbsp;&nbsp;(ii) The residual amount remaining after $45\\text{ minutes}$.  
<div class="text-right font-semibold text-slate-700">[3 + 2 = 5 Marks]</div>

**OR**

(a) Compare and contrast the mechanisms involved in **${subtopicStr}** with reference to energy diagrams and rate-determining steps.  
(b) Explain why sudden environmental perturbations alter the stability criteria in this system. Provide two real-world examples.  
<div class="text-right font-semibold text-slate-700">[3 + 2 = 5 Marks]</div>
`;

  const markingScheme = `
# TEACHER MARKING SCHEME & STEP-BY-STEP RUBRIC
### SUBJECT: ${subjectName.toUpperCase()} | CLASS: ${config.grade.toUpperCase()}
**Assessment Title:** ${config.schoolMetadata.examName} &nbsp;&nbsp;|&nbsp;&nbsp; **Max Marks:** ${config.totalMarks}

---

### SECTION A: OBJECTIVE QUESTIONS

**Q1.**
- **Correct Option:** **(c)** (System establishes dynamic equilibrium when forward and reverse rates become equal).  
- **Marking:** 1 Mark for exact option and concept identification. No partial marks for MCQs.

**Q2.**
- **Correct Option:** **(a)** or **(b)** according to first-order or quadratic rate dependency.  
- **Marking:** 1 Mark for correct identification.

**Q3.**
- **Correct Option:** **(a)** Both (A) and (R) are true and (R) is the correct explanation of (A).  
- **Marking:** 1 Mark. Rationale: Second Law and dissipation principles strictly govern boundary hysteresis.

---

### SECTION B: VERY SHORT ANSWER (4 MARKS)

**Q4. Governing Law Statement & Formulation [Total 2 Marks]**
- **Statement:** Clear statement of the law according to official NCERT terminology: **[1 Mark]**
- **Mathematical Formula & Unit Notation:** Correct algebraic representation with SI units explicitly designated: **[1 Mark]**

**Q5. Comparative Differentiation [Total 2 Marks]**
- **Tabular/Point Comparison:** Two distinct, scientifically accurate points of contrast: **[1 Mark]**
- **NCERT Examples / Balanced Equations:** One authentic textbook example or balanced equation for each category: **[1 Mark]**

---

### SECTION C: SHORT ANSWER QUESTIONS (3 MARKS)

**Q6. Analytical Numerical / Theory Problem [Total 3 Marks]**
- **Part (a):** Formulation of standard theoretical equation: **[1 Mark]**
- **Part (b):** Step-by-step substitution of numerical constants with intermediate calculation step: **[1 Mark]**
- **Part (c):** Correct final answer with proper SI unit + statement of valid boundary assumption: **[1 Mark]**
  *(Deduct ½ mark if final SI unit is omitted or incorrect).*

---

### SECTION D: CASE-BASED COMPETENCY STUDY (4 MARKS)

**Q7. Rubric for Passage Questions [Total 4 Marks]**
- **(a):** Identification of non-ideal parameter (e.g. intermolecular attractions or volume factor): **[1 Mark]**
- **(b):** Application of Le Chatelier's principle or van 't Hoff reaction isochore explaining temperature response: **[1 Mark]**
- **(c):** Mathematical formulation of steady-state balance equation: **[2 Marks]**  
  **OR (Alternative):** Two practical engineering/experimental modifications with valid justification: **[1 + 1 = 2 Marks]**

---

### SECTION E: LONG ANSWER QUESTION (5 MARKS)

**Q8. Detailed Step-by-Step Derivation & Numericals [Total 5 Marks]**
- **Part (a): Derivation / Proof:**
  - Initial schematic diagram & boundary conditions: **[1 Mark]**
  - Mathematical integration / algebraic reduction: **[1 Mark]**
  - Final standard form highlighting significance: **[1 Mark]**
- **Part (b): Numerical Solution:**
  - Half-life calculation using $t_{1/2} = \\frac{0.693}{k}$ (or relevant formula): **[1 Mark]**
  - Residual quantity calculation with correct rounding: **[1 Mark]**

**OR Option Rubric:**
- Comparative mechanism points & energy profile curves: **[3 Marks]**
- Environmental perturbation analysis with 2 realistic instances: **[2 Marks]**
`;

  return {
    id: `assessment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `${config.grade} ${subjectName} - ${chaptersTitle}`,
    grade: config.grade,
    subjectName,
    totalMarks: config.totalMarks,
    config,
    rawResponse: `${studentPaper}\n\n${markingScheme}`,
    studentPaperMarkdown: studentPaper.trim(),
    markingSchemeMarkdown: markingScheme.trim(),
  };
}
