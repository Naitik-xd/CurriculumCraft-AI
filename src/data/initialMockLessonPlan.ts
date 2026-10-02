import { GeneratedLessonPlan } from '../types/curriculum';

export const INITIAL_MOCK_LESSON_PLAN: GeneratedLessonPlan = {
  id: 'lesson-plan-chem-12-july',
  createdAt: new Date().toISOString(),
  title: 'Class 12 Chemistry - Monthly Pedagogical Plan (July 2026)',
  grade: 'Class 12',
  subjectName: 'Chemistry',
  month: 'July',
  config: {
    grade: 'Class 12',
    subjectId: 'chem_12',
    selectedChapterIds: ['c12_1', 'c12_2'],
    month: 'July',
    academicSession: '2026-2027',
    totalPeriods: 24,
    schoolName: 'ABC PUBLIC SCHOOL',
    teacherName: 'Dr. S. K. Sharma (Senior PGT Chemistry)',
    focusPedagogy: ['Experiential Learning', 'Problem-Solving Numericals', 'Art-Integrated Infographics', 'Inquiry-Based Labs'],
    includeArtIntegration: true,
    includeLabExperiments: true,
    includeRemedialStrategy: true,
  },
  planMarkdown: `
# ABC PUBLIC SCHOOL
### MONTHLY PEDAGOGICAL LESSON PLAN & TEACHER DIARY
**Academic Session:** 2026–2027 &nbsp;&nbsp;|&nbsp;&nbsp; **Month:** July &nbsp;&nbsp;|&nbsp;&nbsp; **Total Periods Allocated:** 24 Periods  
**Class & Section:** XII (Science - Batches A & B) &nbsp;&nbsp;|&nbsp;&nbsp; **Subject:** Chemistry (Code 043)  
**Educator:** Dr. S. K. Sharma (Senior PGT Chemistry) &nbsp;&nbsp;|&nbsp;&nbsp; **Target NCERT Units:** Unit 1 (Solutions) & Unit 2 (Electrochemistry)

---

### 1. CURRICULAR OVERVIEW & GENERAL LEARNING OBJECTIVES
This pedagogical plan conforms strictly with the **CBSE Curriculum Guidelines** and **National Curriculum Framework (NCF-SE)**. The instruction combines conceptual rigor with interactive laboratory sessions, contextual problem-solving, and continuous formative assessment.

- **Cognitive Domain (Bloom's Taxonomy):**
  - **Remembering & Understanding:** Define Raoult's law, Henry's law, colligative properties, molar conductivity ($\\Lambda_m$), Kohlrausch's law, and Faraday's laws of electrolysis.
  - **Applying & Analyzing:** Compute numerical values for elevation in boiling point ($\\Delta T_b$), depression in freezing point ($\\Delta T_f$), osmotic pressure ($\\pi$), cell EMF ($E_{\\text{cell}}$) using Nernst equation, and Gibbs energy ($\\Delta G^\\circ$).
  - **Evaluating & Creating:** Contrast ideal vs. non-ideal solutions with molecular interaction models; assess fuel cell efficiencies over fossil fuel generators; design corrosion mitigation proposals for urban infrastructure.

---

### 2. EXPERIENTIAL & ART-INTEGRATED PEDAGOGY
- **NCERT Laboratory Practicals (CBSE Core Experiments):**
  1. *Experiment 1:* Preparation of standard solution of oxalic acid and titration with $\\text{KMnO}_4$ solution (4 Periods).
  2. *Experiment 2:* Setting up a Daniell Cell and observing the variation of cell potential with concentration of $\\text{Zn}^{2+}$ and $\\text{Cu}^{2+}$ ions (2 Periods).
- **Art-Integration / Interdisciplinary Activity (CBSE Circular Aligned):**
  - *Topic:* "Green Electrochemistry & Clean Energy". Students author an illustrated infographic explaining how Hydrogen-Oxygen Fuel Cells power NASA spacecraft and zero-emission transit systems.

---

### 3. WEEK-BY-WEEK INSTRUCTIONAL SCHEDULE & TOPIC DISTRIBUTION

#### WEEK 1 (Periods 1 to 6) — Solutions: Ideality, Deviations & Henry's Law
- **Period 1:** Expression of concentration terms: Molarity ($M$), Molality ($m$), Mole Fraction ($x$). Contextual industrial units (ppm).
- **Period 2:** Solubility of gases in liquids: Henry's Law statement, mathematical formula $p = K_H x$, application in scuba diving and soft drinks.
- **Period 3:** Raoult's Law for volatile liquid-liquid mixtures: Derivation of $P_{\\text{total}} = p_A + p_B$. Graphical representation.
- **Period 4:** Ideal solutions: Thermodynamic criteria ($\\Delta_{\\text{mix}}H = 0, \\Delta_{\\text{mix}}V = 0$). Examples: n-hexane + n-heptane.
- **Period 5:** Non-ideal solutions: Positive deviation (Ethanol + Acetone) vs Negative deviation (Chloroform + Acetone) with H-bonding diagrams.
- **Period 6:** Azeotropes (Minimum & Maximum boiling). Diagnostic formative oral quiz + Home assignment.

#### WEEK 2 (Periods 7 to 12) — Colligative Properties & van 't Hoff Factor
- **Period 7:** Relative Lowering of Vapour Pressure: Proof and determination of molar mass of non-volatile solute ($M_2$).
- **Period 8:** Elevation in Boiling Point: Graphical deduction, Molal boiling point elevation constant ($K_b$ / Ebullioscopic constant).
- **Period 9:** Depression in Freezing Point: Cryoscopic constant ($K_f$), application in anti-freeze solutions (ethylene glycol).
- **Period 10:** Osmotic Pressure ($\\pi = iCRT$): Reverse osmosis and water desalination. Why osmotic pressure is best for polymers.
- **Period 11:** Abnormal molar mass and van 't Hoff factor ($i$): Calculations for degree of dissociation ($\\alpha$) and association.
- **Period 12:** Classroom problem clinic: CBSE Board 3-mark numerical workshop on Solutions.

#### WEEK 3 (Periods 13 to 18) — Electrochemistry: Galvanic Cells & Nernst Equation
- **Period 13:** Galvanic vs Electrolytic cells: Daniell Cell construction, salt bridge functions, cell representation.
- **Period 14:** Standard electrode potentials ($E^\\circ$), Standard Hydrogen Electrode (SHE) reference, Electrochemical series trends.
- **Period 15:** Derivation of Nernst Equation at $298\\text{ K}$: $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log Q$.
- **Period 16:** Calculation of cell potential under non-standard conditions; equilibrium constant $K_c$ and Gibbs energy $\\Delta G^\\circ = -nFE^\\circ$.
- **Period 17:** Conductance in electrolytic solutions: Resistance ($R$), Resistivity ($\\rho$), Conductivity ($\\kappa$), Molar conductivity ($\\Lambda_m$).
- **Period 18:** Variation of conductivity and molar conductivity with dilution for strong vs weak electrolytes (Debye-Hückel-Onsager).

#### WEEK 4 (Periods 19 to 24) — Kohlrausch Law, Commercial Batteries & Assessment
- **Period 19:** Kohlrausch's Law of Independent Migration of Ions: Determination of $\\Lambda_m^\\circ$ for weak electrolytes, degree of dissociation $\\alpha$.
- **Period 20:** Faraday's First and Second Laws of Electrolysis: Numericals on coulombs, current, and mass deposited.
- **Period 21:** Commercial Batteries: Primary (Dry cell, Mercury cell) vs Secondary (Lead storage battery charge/discharge half-reactions).
- **Period 22:** Fuel Cells ($\text{H}_2\text{-O}_2$ alkaline cell) and Corrosion (Electrochemical mechanism of rusting, cathodic protection).
- **Period 23:** Periodic Unit Test II (25 Marks / 45 Minutes evaluation).
- **Period 24:** Test Paper Discussion, Error Analysis, Remedial Feedback & Doubt Clearance.

---

### 4. INCLUSIVE LEARNING & DIFFERENTIATED PEDAGOGY
- **Remedial Strategy for Struggling Learners:**
  - Provide a step-by-step "Formula Wheel" summarizing colligative properties and Nernst equation steps.
  - Paired peer-learning sessions during zero-period for numerical practice.
  - Bi-weekly formative diagnostic sheets focusing on direct formula substitution.
- **Enrichment for Advanced / High Achievers (HOTS):**
  - Multi-concept integrated numericals combining Equilibrium constants ($K_c$) with Nernst potentials and Gibbs energy.
  - Exploration of Lithium-ion and solid-state battery chemistry for electric vehicles.
  - Introduction to past CBSE Board Exemplar and Olympiad Stage-1 reasoning problems.

---

### 5. TEACHER'S SELF-REFLECTION & ACADEMIC ENDORSEMENT
- **Syllabus Pacing:** On track. Covered 100% of rationalized syllabus units for July.
- **Identified Student Common Errors:** Arithmetic slips in logarithmic computation of Nernst equation; confusing $i = 1 + (n-1)\\alpha$ for dissociation vs association.

| (Subject Teacher) | (Head of Department) | (Principal / Vice Principal) |
| :---: | :---: | :---: |
| **Dr. S. K. Sharma** | **Mrs. R. Sen** | **Dr. V. K. Malhotra** |
| Subject Teacher Signature | HOD Chemistry Signature | Principal Endorsement |
`,
  scheduleMarkdown: `
# WEEK-BY-WEEK PERIODIC INSTRUCTIONAL TRACKER
### MONTH: JULY 2026 &bull; SUBJECT: CHEMISTRY (043) &bull; CLASS XII

| Period # | NCERT Topic / Core Subtopic | Pedagogical Method | Lab / Demonstration / Art Integration | Formative Check / HW |
|:---:|:---|:---|:---|:---|
| **P 1** | Concentration Terms ($M, m, x$, ppm) | Direct instruction & contextual conversions | Prep of standard salt solutions | NCERT Exercise Q1.1–Q1.4 |
| **P 2** | Henry's Law & Gas Solubility | Inquiry & Socratic dialogue | Cold drink depressurization demo | Conceptual worksheet on scuba diving |
| **P 3** | Raoult's Law (Volatile solutes) | Mathematical derivation on smartboard | Graphical plotting of partial pressures | NCERT Example 1.4 |
| **P 4** | Ideal Solutions & Enthalpy of mixing | Molecular modeling & comparative chart | Interactive molecular attraction simulation | Tabulate A-A vs A-B forces |
| **P 5** | Non-Ideal Solutions (+ve & -ve deviations) | Case-based discussion on Azeotropes | Acetone-Chloroform hydrogen bonding model | NCERT Intext Questions |
| **P 6** | Solutions Unit Quiz 1 | Collaborative formative quiz | Peer-review of solutions | Error log completion |
| **P 7** | Relative Lowering of Vapour Pressure | Analytical numerical walkthrough | Manometer apparatus walkthrough | Practice 3 numericals |
| **P 8** | Elevation of Boiling Point ($\\Delta T_b$) | Formula deduction & ebullioscopy | Lab: Boiling point elevation of water | NCERT Q1.12–Q1.14 |
| **P 9** | Depression of Freezing Point ($\\Delta T_f$) | Cryoscopy & real-world anti-freeze | Demonstration of salt on ice | Solve 2 past board questions |
| **P 10** | Osmotic Pressure & Reverse Osmosis | Diagrammatic analysis of semi-permeable membranes | Osmosis egg demonstration | Write short note on RO plants |
| **P 11** | van 't Hoff factor ($i$) & Dissociation | Mathematical derivation of $\\alpha$ | Flowchart of electrolyte types | Numericals on $i$ factor |
| **P 12** | Solutions Board Numerical Workshop | Timed classroom problem-solving sprint | Peer problem sharing | Practice Test Paper |
| **P 13** | Daniell Cell & Electrochemical Principles | Animated 3D cell visualization | Lab: Setting up a Daniell Cell | Draw labeled cell diagram |
| **P 14** | Electrode Potentials & SHE Reference | Theoretical lecture & reduction potential chart | SHE working simulation | Identify oxidizing/reducing agents |
| **P 15** | Nernst Equation Derivation | Algebraic derivation for single electrode & cell | Step-by-step substitution template | Calculate EMF of 3 cells |
| **P 16** | Nernst Equation & $\\Delta G^\\circ, K_c$ | Formula link: $\\Delta G^\\circ = -nFE^\\circ = -2.303 RT \\log K_c$ | Multi-variable computational drill | NCERT Exercise Q2.5–Q2.8 |
| **P 17** | Electrolytic Conductance ($\\kappa, \\Lambda_m$) | Definition & SI units drill | Conductivity cell apparatus demo | Convert $\\text{S m}^2\\text{ mol}^{-1}$ to $\\text{S cm}^2$ |
| **P 18** | Dilution Effect on Conductivity | Graphical trends comparison | Molar conductivity vs $\\sqrt{c}$ plot | Explain sharp rise in $\\Lambda_m$ for HCOOH |
| **P 19** | Kohlrausch's Law of Independent Migration | Concept lecture & additive calculations | Additive ion migration puzzle | NCERT Exemplar problems |
| **P 20** | Faraday's Laws of Electrolysis | Quantitative electrolysis calculation | Silver voltameter concept | Solve 2 electrolysis problems |
| **P 21** | Primary & Secondary Batteries | Comparative flowchart (Dry cell vs Lead battery) | Disassembled car battery display | Write anode/cathode reactions |
| **P 22** | Fuel Cells & Rusting Prevention | Group discussion & Art infographic task | Student infographic presentation | Final revision flashcards |
| **P 23** | **Periodic Unit Test II (25 Marks)** | **Formal CBSE Assessment Evaluation** | **Supervised Exam Conditions** | **Self-assessment reflection** |
| **P 24** | Test Paper Review & Remedial Clinic | Question-by-question diagnostic review | Remedial worksheet distribution | Correct mistake notebook |
`
};
