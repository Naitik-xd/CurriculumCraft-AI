import { GeneratedAssessment } from '../types/curriculum';

export const INITIAL_MOCK_PAPER: GeneratedAssessment = {
  id: 'mock-chem-12-unit-test-1',
  createdAt: new Date().toISOString(),
  title: 'Class 12 Chemistry Unit Test - Solutions & Electrochemistry',
  grade: 'Class 12',
  subjectName: 'Chemistry',
  totalMarks: 25,
  config: {
    grade: 'Class 12',
    subjectId: 'chem_12',
    selectedChapterIds: ['c12_1', 'c12_2'],
    focusSubtopics: ['Nernst equation numericals', 'Kohlrausch law', 'van’t Hoff factor', 'Fuel cells'],
    assessmentType: 'unit_test',
    totalMarks: 25,
    durationMinutes: 45,
    difficulty: 'standard',
    questionBlend: {
      includeMcq: true,
      includeVsa: true,
      includeSa: true,
      includeLa: true,
      includeCaseStudy: true,
    },
    schoolMetadata: {
      schoolName: 'ABC PUBLIC SCHOOL',
      examName: 'PERIODIC UNIT TEST - II (2026–2027)',
      academicSession: '2026-2027',
      subjectCode: 'CHEMISTRY (043)',
      timeAllowed: '45 Minutes',
      maxMarks: 25,
      generalInstructions: [
        'All questions are compulsory. There are 10 questions divided into four sections: A, B, C and D.',
        'Section A comprises 4 Multiple Choice Questions (including 1 Assertion-Reason) carrying 1 mark each.',
        'Section B comprises 2 Very Short Answer type questions carrying 2 marks each.',
        'Section C comprises 2 Short Answer type questions carrying 3 marks each.',
        'Section D comprises 1 Case-Based Question carrying 4 marks with internal choices.',
        'Section E comprises 1 Long Answer type question carrying 5 marks with internal choice.',
        'Use of calculators and log tables without permission is not permitted. You may use values: $F = 96500\\text{ C mol}^{-1}$, $R = 8.314\\text{ J K}^{-1}\\text{ mol}^{-1}$, $\\frac{2.303 RT}{F} = 0.0591\\text{ V}$ at $298\\text{ K}$.'
      ]
    }
  },
  rawResponse: '',
  studentPaperMarkdown: `
# ABC PUBLIC SCHOOL
### PERIODIC UNIT TEST - II (SESSION 2026–2027)
**Class:** XII &nbsp;&nbsp;|&nbsp;&nbsp; **Subject:** Chemistry (043) &nbsp;&nbsp;|&nbsp;&nbsp; **Max. Marks:** 25 &nbsp;&nbsp;|&nbsp;&nbsp; **Time Allowed:** 45 Minutes

---

#### GENERAL INSTRUCTIONS:
1. All questions are compulsory. Internal choice is provided in selected questions.
2. **Section A:** Questions No. 1 to 4 are Objective type / MCQs carrying 1 mark each.
3. **Section B:** Questions No. 5 and 6 are Very Short Answer (VSA) carrying 2 marks each.
4. **Section C:** Questions No. 7 and 8 are Short Answer (SA) carrying 3 marks each.
5. **Section D:** Question No. 9 is a Case-Based Question carrying 4 marks.
6. **Section E:** Question No. 10 is a Long Answer (LA) numerical / concept question carrying 5 marks.
7. Use log tables if necessary. Use of scientific calculators is strictly prohibited.

---

### SECTION A (Objective Type Questions - 1 Mark Each)

**Q1.** Which of the following $0.1\\text{ M}$ aqueous solutions will exhibit the highest boiling point elevation?  
(a) $0.1\\text{ M Glucose}$  
(b) $0.1\\text{ M } \\text{NaCl}$  
(c) $0.1\\text{ M } \\text{BaCl}_2$  
(d) $0.1\\text{ M } \\text{Al}_2(\\text{SO}_4)_3$  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**Q2.** The molar conductivity of $0.025\\text{ mol L}^{-1}$ methanoic acid ($\\text{HCOOH}$) is $46.1\\text{ S cm}^2\\text{ mol}^{-1}$. Given that $\\lambda^\\circ(\\text{H}^+) = 349.6\\text{ S cm}^2\\text{ mol}^{-1}$ and $\\lambda^\\circ(\\text{HCOO}^-) = 54.6\\text{ S cm}^2\\text{ mol}^{-1}$, the degree of dissociation ($\\alpha$) is:  
(a) $0.114$  
(b) $0.228$  
(c) $0.057$  
(d) $0.886$  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**Q3.** An electrochemical cell is set up: $\\text{Zn}(s) \\mid \\text{Zn}^{2+}(aq) \\parallel \\text{Cu}^{2+}(aq) \\mid \\text{Cu}(s)$. If the concentration of $\\text{Cu}^{2+}$ ions is increased by a factor of 10 at $298\\text{ K}$, the EMF of the cell will:  
(a) Decrease by $0.0591\\text{ V}$  
(b) Increase by $0.0295\\text{ V}$  
(c) Decrease by $0.0295\\text{ V}$  
(d) Remain unchanged  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**Q4. Assertion - Reason Question:**  
In the following question, a statement of **Assertion (A)** is followed by a statement of **Reason (R)**. Choose the correct option:  
- (a) Both (A) and (R) are true and (R) is the correct explanation of (A).  
- (b) Both (A) and (R) are true but (R) is NOT the correct explanation of (A).  
- (c) (A) is true but (R) is false.  
- (d) (A) is false but (R) is true.  

**Assertion (A):** The conductivity ($\\kappa$) of an electrolytic solution decreases with dilution, whereas its molar conductivity ($\\Lambda_m$) increases.  
**Reason (R):** On dilution, the number of current-carrying ions per unit volume decreases, but the volume containing one mole of electrolyte increases significantly.  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

---

### SECTION B (Very Short Answer Questions - 2 Marks Each)

**Q5.** State **Raoult's Law** for a solution containing non-volatile solute. Why does a mixture of chloroform and acetone exhibit a negative deviation from Raoult's law? Illustrate with intermolecular hydrogen bonding.  
<div class="text-right font-semibold text-slate-700">[2 Marks]</div>

**Q6.** The limiting molar conductivities for $\\text{KCl}$, $\\text{KNO}_3$, and $\\text{AgNO}_3$ are $149.9$, $145.0$, and $133.4\\text{ S cm}^2\\text{ mol}^{-1}$ respectively at $298\\text{ K}$. Using **Kohlrausch's Law of Independent Migration of Ions**, calculate the limiting molar conductivity ($\\Lambda_m^\\circ$) for $\\text{AgCl}$.  
<div class="text-right font-semibold text-slate-700">[2 Marks]</div>

---

### SECTION C (Short Answer Questions - 3 Marks Each)

**Q7.** A solution prepared by dissolving $1.25\\text{ g}$ of wintergreen oil (methyl salicylate) in $99.0\\text{ g}$ of benzene has a boiling point of $80.31^\\circ\\text{C}$. The boiling point of pure benzene is $80.10^\\circ\\text{C}$ and $K_b$ for benzene is $2.53\\text{ K kg mol}^{-1}$.  
(a) Calculate the experimental molar mass of wintergreen oil.  
(b) If the true formula mass of methyl salicylate is $152\\text{ g mol}^{-1}$, calculate the van 't Hoff factor ($i$) and state whether association or dissociation occurs.  
<div class="text-right font-semibold text-slate-700">[3 Marks]</div>

**Q8.** Calculate the EMF and $\\Delta G^\\circ$ for the following galvanic cell at $298\\text{ K}$:  
$$\\text{Mg}(s) \\mid \\text{Mg}^{2+}(0.10\\text{ M}) \\parallel \\text{Ag}^{+}(0.0001\\text{ M}) \\mid \\text{Ag}(s)$$  
Given standard reduction potentials:  
$$E^\\circ_{\\text{Mg}^{2+}/\\text{Mg}} = -2.37\\text{ V}, \\quad E^\\circ_{\\text{Ag}^{+}/\\text{Ag}} = +0.80\\text{ V}$$  
$$(1\\text{ F} = 96500\\text{ C mol}^{-1}, \\log 10 = 1)$$  
<div class="text-right font-semibold text-slate-700">[3 Marks]</div>

---

### SECTION D (Case-Based Competency Question - 4 Marks)

**Q9. Read the passage given below and answer the following questions:**

> Electrochemical cells that convert the chemical energy of spontaneous combustion of fuels directly into electrical energy are called **Fuel Cells**. One of the most successful fuel cells uses the reaction of hydrogen with oxygen to form water, which was used in the Apollo space programme. The electrical energy produced was used to power life support systems and the water vapour produced was condensed and used for drinking by astronauts. Unlike conventional thermal power plants, which have efficiencies around 40%, fuel cells operate with an efficiency of about 70% and do not cause environmental pollution. Meanwhile, in rechargeable secondary batteries like the Lead-Storage battery, electrical energy is stored by driving non-spontaneous reactions during charging.

**(a)** Write the balanced chemical reactions occurring at the anode and cathode in the $\\text{H}_2\\text{-O}_2$ fuel cell running with aqueous $\\text{KOH}$ electrolyte.  
<div class="text-right font-semibold text-slate-700">[2 Marks]</div>

**(b)** Why are fuel cells considered eco-friendly and thermodynamically superior to conventional thermal combustion plants? State two key reasons.  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

**(c)** What chemical changes occur at the anode and cathode during the **recharging** of a secondary lead storage battery? Write the overall cell reaction.  
**OR**  
**(c)** What happens to the density and concentration of $\\text{H}_2\\text{SO}_4$ in a lead storage battery when it discharges? Explain why this parameter serves as a state-of-charge indicator.  
<div class="text-right font-semibold text-slate-700">[1 Mark]</div>

---

### SECTION E (Long Answer Question - 5 Marks)

**Q10.**  
(a) The electrical resistance of a column of $0.05\\text{ mol L}^{-1}\\text{ NaOH}$ solution of diameter $1\\text{ cm}$ and length $50\\text{ cm}$ is $5.55 \\times 10^3\\text{ }\\Omega$. Calculate:  
&nbsp;&nbsp;&nbsp;&nbsp;(i) Resistivity ($\\rho$)  
&nbsp;&nbsp;&nbsp;&nbsp;(ii) Conductivity ($\\kappa$)  
&nbsp;&nbsp;&nbsp;&nbsp;(iii) Molar conductivity ($\\Lambda_m$)  
(b) Explain why aquatic species feel more comfortable in cold water than in warm water using Henry's Law constant ($K_H$).  
<div class="text-right font-semibold text-slate-700">[3 + 2 = 5 Marks]</div>

**OR**

(a) How many coulombs of electricity are required for the oxidation of:  
&nbsp;&nbsp;&nbsp;&nbsp;(i) $1\\text{ mol of } \\text{H}_2\\text{O}$ to $\\text{O}_2$?  
&nbsp;&nbsp;&nbsp;&nbsp;(ii) $1\\text{ mol of } \\text{FeO}$ to $\\text{Fe}_2\\text{O}_3$?  
(b) Determine the osmotic pressure of a solution prepared by dissolving $25\\text{ mg}$ of $\\text{K}_2\\text{SO}_4$ in $2\\text{ litres}$ of water at $25^\\circ\\text{C}$, assuming that it is completely dissociated. $(R = 0.0821\\text{ L atm K}^{-1}\\text{ mol}^{-1}, \\text{Molar mass of } \\text{K}_2\\text{SO}_4 = 174\\text{ g mol}^{-1})$.  
<div class="text-right font-semibold text-slate-700">[2 + 3 = 5 Marks]</div>
`,
  markingSchemeMarkdown: `
# TEACHER MARKING SCHEME & STEP-BY-STEP RUBRIC
### SUBJECT: CHEMISTRY (043) | CLASS: XII | UNIT TEST II (2026–2027)
**Max Marks:** 25 &nbsp;&nbsp;|&nbsp;&nbsp; **Assessment Standard:** Latest CBSE Evaluation Guidelines

---

### SECTION A: OBJECTIVE QUESTIONS (4 MARKS)

**Q1.**  
- **Correct Answer:** **(d) $0.1\\text{ M } \\text{Al}_2(\\text{SO}_4)_3$**  
- **Marking Breakdown:**  
  - Complete identification of highest van 't Hoff factor $i = 5$ for $\\text{Al}_2(\\text{SO}_4)_3 \\rightarrow 2\\text{Al}^{3+} + 3\\text{SO}_4^{2-}$: **[1 Mark]**  
  - *(Note: Glucose $i=1$, $\\text{NaCl } i=2$, $\\text{BaCl}_2\\ i=3$)*. Since $\\Delta T_b = i K_b m$, highest $i$ gives maximum elevation.

**Q2.**  
- **Correct Answer:** **(a) $0.114$**  
- **Marking Breakdown:**  
  - Step 1: $\\Lambda_m^\\circ(\\text{HCOOH}) = \\lambda^\\circ(\\text{H}^+) + \\lambda^\\circ(\\text{HCOO}^-) = 349.6 + 54.6 = 404.2\\text{ S cm}^2\\text{ mol}^{-1}$ **[½ Mark]**  
  - Step 2: $\\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\circ} = \\frac{46.1}{404.2} = 0.114$ **[½ Mark]**

**Q3.**  
- **Correct Answer:** **(b) Increase by $0.0295\\text{ V}$**  
- **Marking Breakdown:**  
  - Cell reaction: $\\text{Zn} + \\text{Cu}^{2+} \\rightarrow \\text{Zn}^{2+} + \\text{Cu}$ ($n=2$).  
  - $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{2}\\log\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]} = E^\\circ_{\\text{cell}} + \\frac{0.0591}{2}\\log[\\text{Cu}^{2+}] - \\dots$  
  - When $[\\text{Cu}^{2+}]$ increases by $10\\times$, $\\Delta E = +\\frac{0.0591}{2} \\log 10 = +0.02955\\text{ V}$ **[1 Mark]**

**Q4.**  
- **Correct Answer:** **(a) Both (A) and (R) are true and (R) is the correct explanation of (A).**  
- **Marking Breakdown:**  
  - Correct option identification with rationale: **[1 Mark]**  
  - *Evaluation Note:* Award 0 if student writes (b) or (c). Number of ions $/\\text{cm}^3$ drops, causing $\\kappa$ decrease; but volume per mole increases faster, causing $\\Lambda_m = \\kappa \\times V$ to increase.

---

### SECTION B: VERY SHORT ANSWER (4 MARKS)

**Q5. Raoult's Law & Negative Deviation [Total 2 Marks]**  
- **Definition:** For a solution of non-volatile solute in a volatile solvent, the relative lowering of vapour pressure is equal to the mole fraction of the solute: $\\frac{p_1^\\circ - p_1}{p_1^\\circ} = x_2$, or vapour pressure of solvent in solution is directly proportional to its mole fraction ($p_1 = p_1^\\circ x_1$). **[1 Mark]**  
- **Negative Deviation Explanation:** In pure acetone and chloroform, weak dipole-dipole attractions exist. When mixed, a new strong **intermolecular hydrogen bond** forms between the $\\text{C-H}$ of chloroform and the carbonyl oxygen ($>\\text{C}=\\text{O}$) of acetone:  
  $\\text{Cl}_3\\text{C}-\\text{H} \\cdots \\text{O}=\\text{C}(\\text{CH}_3)_2$.  
  Since A-B interactions are stronger than A-A and B-B interactions, escaping tendency of molecules decreases $\\rightarrow$ vapour pressure decreases (negative deviation). **[1 Mark]**

**Q6. Kohlrausch's Law for AgCl [Total 2 Marks]**  
- **Application of Law:**  
  $\\Lambda_m^\\circ(\\text{AgCl}) = \\Lambda_m^\\circ(\\text{AgNO}_3) + \\Lambda_m^\\circ(\\text{KCl}) - \\Lambda_m^\\circ(\\text{KNO}_3)$ **[1 Mark]**  
- **Numerical Substitution & Calculation:**  
  $= 133.4 + 149.9 - 145.0$ **[½ Mark]**  
  $= 283.3 - 145.0 = 138.3\\text{ S cm}^2\\text{ mol}^{-1}$ **[½ Mark]**  
  *(Deduct ½ mark if proper SI units are missing).*

---

### SECTION C: SHORT ANSWER QUESTIONS (6 MARKS)

**Q7. Elevation in Boiling Point & van 't Hoff factor [Total 3 Marks]**  
- **Part (a):**  
  - $\\Delta T_b = T_b - T_b^\\circ = 80.31 - 80.10 = 0.21^\\circ\\text{C} = 0.21\\text{ K}$ **[½ Mark]**  
  - Formula: $M_2 = \\frac{1000 \\times K_b \\times w_2}{\\Delta T_b \\times w_1}$ **[½ Mark]**  
  - Substitution: $M_2 = \\frac{1000 \\times 2.53 \\times 1.25}{0.21 \\times 99.0} = \\frac{3162.5}{20.79} = 152.1\\text{ g mol}^{-1}$ **[1 Mark]**  
- **Part (b):**  
  - van 't Hoff factor $i = \\frac{\\text{Calculated Molar Mass (Normal)}}{\\text{Observed Experimental Molar Mass}} = \\frac{152}{152.1} \\approx 1.0$ **[½ Mark]**  
  - Since $i \\approx 1$, the solute methyl salicylate undergoes **neither association nor dissociation** in benzene. **[½ Mark]**

**Q8. Nernst Equation & Free Energy [Total 3 Marks]**  
- **Cell Reaction:** $\\text{Mg}(s) + 2\\text{Ag}^+(aq) \\rightarrow \\text{Mg}^{2+}(aq) + 2\\text{Ag}(s)$ ($n = 2$)  
- $E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = +0.80 - (-2.37) = +3.17\\text{ V}$ **[½ Mark]**  
- **Nernst Equation Formula & Substitution:**  
  $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n}\\log \\frac{[\\text{Mg}^{2+}]}{[\\text{Ag}^+]^2}$ **[½ Mark]**  
  $E_{\\text{cell}} = 3.17 - \\frac{0.0591}{2}\\log \\frac{0.10}{(10^{-4})^2} = 3.17 - 0.02955 \\log\\left(\\frac{10^{-1}}{10^{-8}}\\right)$  
  $= 3.17 - 0.02955 \\times \\log(10^7) = 3.17 - (0.02955 \\times 7)$  
  $= 3.17 - 0.2068 = +2.963\\text{ V}$ (or $2.96\\text{ V}$) **[1 Mark]**  
- **Standard Gibbs Free Energy $\\Delta G^\\circ$:**  
  $\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}} = -2 \\times 96500 \\times 3.17 = -611,810\\text{ J mol}^{-1} = -611.81\\text{ kJ mol}^{-1}$ **[1 Mark]**

---

### SECTION D: CASE-BASED STUDY (4 MARKS)

**Q9. Fuel Cell & Secondary Cell Rubric [Total 4 Marks]**  
- **(a) Electrode Reactions in $\\text{H}_2\\text{-O}_2$ Alkaline Fuel Cell:**  
  - **At Anode:** $2\\text{H}_2(g) + 4\\text{OH}^-(aq) \\rightarrow 4\\text{H}_2\\text{O}(l) + 4e^-$ **[1 Mark]**  
  - **At Cathode:** $\\text{O}_2(g) + 2\\text{H}_2\\text{O}(l) + 4e^- \\rightarrow 4\\text{OH}^-(aq)$ **[1 Mark]**  
  *(Overall: $2\\text{H}_2(g) + \\text{O}_2(g) \\rightarrow 2\\text{H}_2\\text{O}(l)$)*
- **(b) Advantages of Fuel Cells (Any two valid points):**  
  1. High thermal efficiency (~70% vs 40% in turbine generators).  
  2. Eco-friendly / zero emissions (only harmless water vapour is formed as byproduct).  
  3. Continuous power supply without recharging as long as reactants are supplied. **[1 Mark]**
- **(c) Recharging Reactions of Lead Storage Battery:**  
  - **At Anode during recharge:** $\\text{PbSO}_4(s) + 2e^- \\rightarrow \\text{Pb}(s) + \\text{SO}_4^{2-}(aq)$  
  - **At Cathode during recharge:** $\\text{PbSO}_4(s) + 2\\text{H}_2\\text{O}(l) \\rightarrow \\text{PbO}_2(s) + \\text{SO}_4^{2-}(aq) + 4\\text{H}^+(aq) + 2e^-$  
  - **Overall recharging equation:** $2\\text{PbSO}_4(s) + 2\\text{H}_2\\text{O}(l) \\rightarrow \\text{Pb}(s) + \\text{PbO}_2(s) + 2\\text{H}_2\\text{SO}_4(aq)$ **[1 Mark]**  
  **OR (Alternative Option):**  
  - During discharge, $\\text{H}_2\\text{SO}_4$ is consumed to form insoluble $\\text{PbSO}_4$ and water. Hence the concentration of sulphuric acid drops from $38\\%$ ($1.30\\text{ g mL}^{-1}$) to below $1.20\\text{ g mL}^{-1}$. Measuring density via hydrometer gives an immediate direct readout of state-of-charge. **[1 Mark]**

---

### SECTION E: LONG ANSWER (5 MARKS)

**Q10. Conductivity & Henry's Law [Total 5 Marks]**  
- **(a) Electrical Resistance Calculations:**  
  - Area $A = \\pi r^2 = 3.1416 \\times (0.5\\text{ cm})^2 = 0.7854\\text{ cm}^2$ **[½ Mark]**  
  - Length $l = 50\\text{ cm}$  
  - (i) Resistivity $\\rho = R \\times \\frac{A}{l} = 5.55 \\times 10^3 \\times \\frac{0.7854}{50} = 87.18\\text{ }\\Omega\\text{ cm}$ **[1 Mark]**  
  - (ii) Conductivity $\\kappa = \\frac{1}{\\rho} = \\frac{1}{87.18} = 0.01147\\text{ S cm}^{-1}$ ($1.147 \\times 10^{-2}\\text{ S cm}^{-1}$) **[1 Mark]**  
  - (iii) Molar conductivity $\\Lambda_m = \\frac{\\kappa \\times 1000}{M} = \\frac{0.01147 \\times 1000}{0.05} = 229.4\\text{ S cm}^2\\text{ mol}^{-1}$ **[½ Mark]**  
- **(b) Aquatic Species & Henry's Law:**  
  - According to Henry's Law, solubility of gas $x = \\frac{p}{K_H}$.  
  - The value of Henry's constant $K_H$ increases with rise in temperature.  
  - Consequently, solubility of dissolved oxygen is higher at lower temperatures (cold water). More dissolved $\\text{O}_2$ enables easier respiration for aquatic life. **[2 Marks]**

**OR (Alternative Q10):**  
- **(a) Faraday's Law Calculations:**  
  - (i) $2\\text{H}_2\\text{O} \\rightarrow \\text{O}_2 + 4\\text{H}^+ + 4e^-$. For $1\\text{ mol }\\text{H}_2\\text{O}$, $2e^-$ are transferred $\\Rightarrow 2\\text{ F} = 2 \\times 96500 = 193,000\\text{ C}$. **[1 Mark]**  
  - (ii) $\\text{Fe}^{2+} \\rightarrow \\text{Fe}^{3+} + 1e^-$. Oxidation of $1\\text{ mol FeO}$ requires $1\\text{ F} = 96500\\text{ C}$. **[1 Mark]**  
- **(b) Osmotic Pressure with van 't Hoff factor:**  
  - $\\text{K}_2\\text{SO}_4 \\rightarrow 2\\text{K}^+ + \\text{SO}_4^{2-}$ $\\Rightarrow i = 3$ **[½ Mark]**  
  - Number of moles $n = \\frac{0.025\\text{ g}}{174\\text{ g mol}^{-1}} = 1.437 \\times 10^{-4}\\text{ mol}$ **[½ Mark]**  
  - Formula: $\\pi = i \\left(\\frac{n}{V}\\right) R T$ **[½ Mark]**  
  - Substitution: $\\pi = 3 \\times \\frac{1.437 \\times 10^{-4}\\text{ mol}}{2\\text{ L}} \\times 0.0821 \\times (273 + 25)\\text{ K}$  
  - $\\pi = 3 \\times (7.185 \\times 10^{-5}) \\times 0.0821 \\times 298 = 5.27 \\times 10^{-3}\\text{ atm}$ (or $5.34 \\times 10^2\\text{ Pa}$) **[1 Mark]**
`
};
