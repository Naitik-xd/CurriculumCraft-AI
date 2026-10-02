import { Grade, SubjectInfo, AssessmentPreset } from '../types/curriculum';

export const ASSESSMENT_PRESETS: Record<string, AssessmentPreset> = {
  slip_test: {
    id: 'slip_test',
    label: 'Slip Test',
    defaultMarks: 10,
    durationMinutes: 15,
    description: 'Quick formative check (10 Marks / 15m) for weekly spot evaluation.',
    sectionsDistribution: {
      mcq: 4,
      vsa: 1,
      sa: 1,
      la: 0,
      caseStudy: 0,
    }
  },
  unit_test: {
    id: 'unit_test',
    label: 'Unit Test',
    defaultMarks: 25,
    durationMinutes: 45,
    description: 'Standard classroom assessment (25 Marks / 45m) covering 1–2 chapters.',
    sectionsDistribution: {
      mcq: 6,
      vsa: 2,
      sa: 2,
      la: 1,
      caseStudy: 1,
    }
  },
  periodic_assessment: {
    id: 'periodic_assessment',
    label: 'Periodic Assessment',
    defaultMarks: 40,
    durationMinutes: 90,
    description: 'Mid-term periodic evaluation (40 Marks / 90m) across multiple units.',
    sectionsDistribution: {
      mcq: 10,
      vsa: 3,
      sa: 3,
      la: 2,
      caseStudy: 1,
    }
  },
  board_specimen: {
    id: 'board_specimen',
    label: 'Board Specimen / Pre-Board',
    defaultMarks: 70,
    durationMinutes: 180,
    description: 'Full official CBSE format (70/80 Marks / 3 Hours) with comprehensive sections.',
    sectionsDistribution: {
      mcq: 16,
      vsa: 5,
      sa: 7,
      la: 3,
      caseStudy: 2,
    }
  }
};

export const CURRICULUM_DATA: Record<Grade, SubjectInfo[]> = {
  'Class 9': [
    {
      id: 'science_9',
      name: 'Science',
      code: '086',
      iconName: 'Atom',
      chapters: [
        { id: 'sci9_1', name: 'Matter in Our Surroundings', typicalSubtopics: ['Evaporation & cooling', 'Latent heat', 'States of matter interconversion'] },
        { id: 'sci9_2', name: 'Is Matter Around Us Pure?', typicalSubtopics: ['Colloids, suspensions & solutions', 'Separation techniques', 'Tyndall effect'] },
        { id: 'sci9_3', name: 'Atoms and Molecules', typicalSubtopics: ['Law of conservation of mass', 'Law of constant proportions', 'Mole concept & molar mass'] },
        { id: 'sci9_4', name: 'Structure of the Atom', typicalSubtopics: ['Thomson & Rutherford models', 'Bohr model', 'Valency & isotopes', 'Isobars'] },
        { id: 'sci9_5', name: 'The Fundamental Unit of Life', typicalSubtopics: ['Plasma membrane & osmosis', 'Nucleus & chromosomes', 'Cell organelles'] },
        { id: 'sci9_6', name: 'Tissues', typicalSubtopics: ['Meristematic & permanent tissues', 'Xylem & phloem', 'Epithelial & connective tissues'] },
        { id: 'sci9_7', name: 'Motion', typicalSubtopics: ['Equations of motion', 'Distance vs displacement', 'Uniform circular motion'] },
        { id: 'sci9_8', name: 'Force and Laws of Motion', typicalSubtopics: ['Newton three laws', 'Conservation of momentum', 'Inertia & mass'] },
        { id: 'sci9_9', name: 'Gravitation', typicalSubtopics: ['Universal law of gravitation', 'Free fall & acceleration g', 'Thrust, pressure & Archimedes principle'] },
        { id: 'sci9_10', name: 'Work and Energy', typicalSubtopics: ['Kinetic & potential energy', 'Law of conservation of energy', 'Commercial unit of energy'] },
        { id: 'sci9_11', name: 'Sound', typicalSubtopics: ['Propagation & longitudinal waves', 'Echo & reverberation', 'Structure of human ear'] },
        { id: 'sci9_12', name: 'Improvement in Food Resources', typicalSubtopics: ['Crop variety improvement', 'Manures & fertilizers', 'Animal husbandry'] },
      ]
    },
    {
      id: 'maths_9',
      name: 'Mathematics',
      code: '041',
      iconName: 'Calculator',
      chapters: [
        { id: 'm9_1', name: 'Number Systems', typicalSubtopics: ['Irrational numbers representation', 'Real numbers & decimal expansions', 'Laws of exponents'] },
        { id: 'm9_2', name: 'Polynomials', typicalSubtopics: ['Remainder theorem', 'Factor theorem', 'Algebraic identities factorization'] },
        { id: 'm9_3', name: 'Coordinate Geometry', typicalSubtopics: ['Cartesian plane', 'Plotting coordinates in quadrants'] },
        { id: 'm9_4', name: 'Linear Equations in Two Variables', typicalSubtopics: ['Graph of linear equation', 'Equations of lines parallel to axes'] },
        { id: 'm9_5', name: 'Introduction to Euclid Geometry', typicalSubtopics: ['Axioms and postulates', 'Euclidean propositions'] },
        { id: 'm9_6', name: 'Lines and Angles', typicalSubtopics: ['Intersecting & non-intersecting lines', 'Transversal & alternate interior angles', 'Angle sum property'] },
        { id: 'm9_7', name: 'Triangles', typicalSubtopics: ['Congruence criteria (SAS, ASA, AAS, SSS, RHS)', 'Inequalities in a triangle'] },
        { id: 'm9_8', name: 'Quadrilaterals', typicalSubtopics: ['Mid-point theorem', 'Properties of parallelograms'] },
        { id: 'm9_9', name: 'Circles', typicalSubtopics: ['Angle subtended by chord', 'Cyclic quadrilaterals', 'Perpendicular from center to chord'] },
        { id: 'm9_10', name: 'Heron Formula', typicalSubtopics: ['Area of triangle using semi-perimeter', 'Application in finding quadrilateral areas'] },
        { id: 'm9_11', name: 'Surface Areas and Volumes', typicalSubtopics: ['Right circular cones', 'Spheres & hemispheres'] },
        { id: 'm9_12', name: 'Statistics', typicalSubtopics: ['Histograms with variable widths', 'Frequency polygons'] },
      ]
    },
    {
      id: 'social_9',
      name: 'Social Science',
      code: '087',
      iconName: 'Globe',
      chapters: [
        { id: 'soc9_1', name: 'The French Revolution', typicalSubtopics: ['Estates General', 'Reign of Terror', 'Abolition of slavery'] },
        { id: 'soc9_2', name: 'Socialism in Europe and the Russian Revolution', typicalSubtopics: ['Tsarist Russia', 'Bolsheviks & Mensheviks', 'Stalin collectivization'] },
        { id: 'soc9_3', name: 'India - Size and Location', typicalSubtopics: ['Standard Meridian 82°30’ E', 'Neighbouring countries'] },
        { id: 'soc9_4', name: 'Physical Features of India', typicalSubtopics: ['The Himalayas', 'Northern Plains', 'Peninsular Plateau', 'Coastal Plains'] },
        { id: 'soc9_5', name: 'Drainage', typicalSubtopics: ['Himalayan river system', 'Peninsular rivers', 'Lakes & role of rivers'] },
        { id: 'soc9_6', name: 'What is Democracy? Why Democracy?', typicalSubtopics: ['Features of democracy', 'Arguments for & against democracy'] },
        { id: 'soc9_7', name: 'Constitutional Design', typicalSubtopics: ['South African constitution', 'Making of Indian Constitution', 'Preamble values'] },
        { id: 'soc9_8', name: 'People as Resource', typicalSubtopics: ['Human capital formation', 'Health and education investment', 'Unemployment types'] },
        { id: 'soc9_9', name: 'Poverty as a Challenge', typicalSubtopics: ['Poverty line estimation', 'Vulnerable groups', 'Anti-poverty schemes (MGNREGA)'] },
      ]
    },
    {
      id: 'english_9',
      name: 'English Language & Literature',
      code: '184',
      iconName: 'BookOpen',
      chapters: [
        { id: 'eng9_1', name: 'Reading Comprehension (Discursive & Case-based)', typicalSubtopics: ['Inference questions', 'Vocabulary in context', 'Data interpretation'] },
        { id: 'eng9_2', name: 'Writing Skills (Descriptive Paragraph & Diary Entry)', typicalSubtopics: ['Format and organisation', 'Content & tone', 'Lexical accuracy'] },
        { id: 'eng9_3', name: 'Grammar (Tenses, Modals, Subject-Verb Concord, Reported Speech)', typicalSubtopics: ['Error correction', 'Gap filling', 'Dialogue completion'] },
        { id: 'eng9_4', name: 'Beehive: The Fun They Had & The Road Not Taken', typicalSubtopics: ['Theme analysis', 'Character traits', 'Poetic devices (metaphor, rhyme)'] },
        { id: 'eng9_5', name: 'Beehive: The Sound of Music & Wind', typicalSubtopics: ['Evelyn Glennie determination', 'Symbolism of wind', 'Message of resilience'] },
        { id: 'eng9_6', name: 'Moments: The Lost Child & The Adventures of Toto', typicalSubtopics: ['Child psychology', 'Irony of fairs', 'Grandfather pet escapades'] },
      ]
    }
  ],

  'Class 10': [
    {
      id: 'science_10',
      name: 'Science',
      code: '086',
      iconName: 'Atom',
      chapters: [
        { id: 'sci10_1', name: 'Chemical Reactions and Equations', typicalSubtopics: ['Balancing chemical equations', 'Types of chemical reactions', 'Corrosion & rancidity'] },
        { id: 'sci10_2', name: 'Acids, Bases and Salts', typicalSubtopics: ['pH scale in everyday life', 'Chlor-alkali process', 'Baking soda, washing soda & Plaster of Paris'] },
        { id: 'sci10_3', name: 'Metals and Non-metals', typicalSubtopics: ['Reactivity series', 'Ionic compounds properties', 'Metallurgy: roasting & calcination'] },
        { id: 'sci10_4', name: 'Carbon and its Compounds', typicalSubtopics: ['Covalent bonding', 'Versatile nature of carbon', 'Homologous series & functional groups', 'Soaps & detergents'] },
        { id: 'sci10_5', name: 'Life Processes', typicalSubtopics: ['Autotrophic & heterotrophic nutrition', 'Human respiration', 'Circulatory system & double circulation', 'Excretion in humans'] },
        { id: 'sci10_6', name: 'Control and Coordination', typicalSubtopics: ['Neuron structure & reflex arc', 'Human brain', 'Plant hormones (auxin, gibberellin)', 'Endocrine glands'] },
        { id: 'sci10_7', name: 'How do Organisms Reproduce?', typicalSubtopics: ['Asexual reproduction modes', 'Sexual reproduction in plants', 'Human reproductive system', 'Contraceptive methods'] },
        { id: 'sci10_8', name: 'Heredity', typicalSubtopics: ['Mendel monohybrid & dihybrid crosses', 'Law of segregation & independent assortment', 'Sex determination in humans'] },
        { id: 'sci10_9', name: 'Light – Reflection and Refraction', typicalSubtopics: ['Mirror formula & magnification', 'Snell law & refractive index', 'Lens formula & ray diagrams', 'Power of lens'] },
        { id: 'sci10_10', name: 'The Human Eye and the Colourful World', typicalSubtopics: ['Myopia & hypermetropia corrections', 'Dispersion of light through prism', 'Atmospheric refraction & twinkling of stars'] },
        { id: 'sci10_11', name: 'Electricity', typicalSubtopics: ['Ohm law & V-I graph', 'Resistance in series & parallel', 'Joule law of heating', 'Electric power'] },
        { id: 'sci10_12', name: 'Magnetic Effects of Electric Current', typicalSubtopics: ['Magnetic field lines & Right-hand thumb rule', 'Fleming left-hand rule', 'Domestic electric circuits'] },
        { id: 'sci10_13', name: 'Our Environment', typicalSubtopics: ['Trophic levels & 10% law', 'Biological magnification', 'Ozone layer depletion'] },
      ]
    },
    {
      id: 'maths_10',
      name: 'Mathematics',
      code: '041',
      iconName: 'Calculator',
      chapters: [
        { id: 'm10_1', name: 'Real Numbers', typicalSubtopics: ['Fundamental Theorem of Arithmetic', 'Proof of irrationality of √2, √3, √5'] },
        { id: 'm10_2', name: 'Polynomials', typicalSubtopics: ['Geometrical meaning of zeroes', 'Relationship between zeroes & coefficients of quadratic polynomial'] },
        { id: 'm10_3', name: 'Pair of Linear Equations in Two Variables', typicalSubtopics: ['Graphical method of solution', 'Substitution & Elimination methods', 'Consistent/inconsistent conditions'] },
        { id: 'm10_4', name: 'Quadratic Equations', typicalSubtopics: ['Factorization method', 'Quadratic formula', 'Nature of roots & discriminant D'] },
        { id: 'm10_5', name: 'Arithmetic Progressions', typicalSubtopics: ['nth term of AP formula', 'Sum of first n terms formula', 'Word problems on daily life AP'] },
        { id: 'm10_6', name: 'Triangles', typicalSubtopics: ['Basic Proportionality Theorem (Thales Theorem)', 'Criteria for similarity (AAA, SSS, SAS)'] },
        { id: 'm10_7', name: 'Coordinate Geometry', typicalSubtopics: ['Distance formula', 'Section formula', 'Midpoint coordinates'] },
        { id: 'm10_8', name: 'Introduction to Trigonometry', typicalSubtopics: ['Trigonometric ratios of acute angles', 'Trigonometric values at 0°, 30°, 45°, 60°, 90°', 'Identities: sin²θ + cos²θ = 1'] },
        { id: 'm10_9', name: 'Some Applications of Trigonometry (Heights and Distances)', typicalSubtopics: ['Angle of elevation & depression', 'Two triangles heights & distances word problems'] },
        { id: 'm10_10', name: 'Circles', typicalSubtopics: ['Tangent to circle is perpendicular to radius', 'Lengths of tangents from external point are equal'] },
        { id: 'm10_11', name: 'Areas Related to Circles', typicalSubtopics: ['Area of sector of circle', 'Area of segment of circle'] },
        { id: 'm10_12', name: 'Surface Areas and Volumes', typicalSubtopics: ['Combination of solids (cube, cylinder, cone, hemisphere)', 'Conversion of solids'] },
        { id: 'm10_13', name: 'Statistics', typicalSubtopics: ['Mean by direct & assumed mean method', 'Mode of grouped data', 'Median of grouped data'] },
        { id: 'm10_14', name: 'Probability', typicalSubtopics: ['Classical definition of probability', 'Complementary events', 'Coin, dice & playing cards problems'] },
      ]
    },
    {
      id: 'social_10',
      name: 'Social Science',
      code: '087',
      iconName: 'Globe',
      chapters: [
        { id: 'soc10_1', name: 'The Rise of Nationalism in Europe', typicalSubtopics: ['Frédéric Sorrieu vision', 'Unification of Germany & Italy', 'Marianne and Germania allegories'] },
        { id: 'soc10_2', name: 'Nationalism in India', typicalSubtopics: ['Rowlatt Act & Jallianwala Bagh', 'Non-Cooperation Movement', 'Civil Disobedience & Salt March', 'Sense of collective belonging'] },
        { id: 'soc10_3', name: 'Resources and Development', typicalSubtopics: ['Resource planning in India', 'Land use pattern & degradation', 'Soil types: alluvial, black, red/yellow, laterite'] },
        { id: 'soc10_4', name: 'Agriculture', typicalSubtopics: ['Types of farming (primitive, intensive, commercial)', 'Cropping pattern: Kharif, Rabi, Zaid', 'Major crops & technological reforms'] },
        { id: 'soc10_5', name: 'Power Sharing', typicalSubtopics: ['Belgium model vs Sri Lanka majoritarianism', 'Why power sharing is desirable', 'Horizontal vs vertical forms'] },
        { id: 'soc10_6', name: 'Federalism', typicalSubtopics: ['Key features of federalism', 'Coming together vs holding together', 'Decentralisation in India & 1992 amendment'] },
        { id: 'soc10_7', name: 'Development', typicalSubtopics: ['Different people different goals', 'Income and other criteria (IMR, literacy, net attendance)', 'HDI & sustainability'] },
        { id: 'soc10_8', name: 'Sectors of the Indian Economy', typicalSubtopics: ['Primary, secondary, tertiary comparisons', 'Disguised unemployment', 'Organised vs unorganised sectors'] },
        { id: 'soc10_9', name: 'Money and Credit', typicalSubtopics: ['Barter system & double coincidence', 'Formal vs informal sources of credit', 'Self-Help Groups (SHGs)'] },
      ]
    },
    {
      id: 'english_10',
      name: 'English Language & Literature',
      code: '184',
      iconName: 'BookOpen',
      chapters: [
        { id: 'eng10_1', name: 'First Flight: A Letter to God', typicalSubtopics: ['Lencho unswerving faith', 'Irony of the post office employees', 'Theme of man vs nature'] },
        { id: 'eng10_2', name: 'First Flight: Nelson Mandela - Long Walk to Freedom', typicalSubtopics: ['Inauguration ceremony', 'Meaning of courage & twin obligations', 'Apartheid victory'] },
        { id: 'eng10_3', name: 'Poetry: Dust of Snow & Fire and Ice (Robert Frost)', typicalSubtopics: ['Transformative power of nature', 'Metaphors of desire and hatred', 'Rhyme scheme & symbolism'] },
        { id: 'eng10_4', name: 'Poetry: A Tiger in the Zoo (Leslie Norris)', typicalSubtopics: ['Contrast between cage and natural habitat', 'Poetic devices (personification, imagery)', 'Animal freedom ethics'] },
        { id: 'eng10_5', name: 'Footprints Without Feet: A Triumph of Surgery', typicalSubtopics: ['Mrs Pumphrey overindulgence', 'Dr Herriot pragmatic treatment of Tricki'] },
        { id: 'eng10_6', name: 'Footprints Without Feet: The Thief Story', typicalSubtopics: ['Hari Singh transformation', 'Anil trusting nature', 'Education over theft'] },
      ]
    }
  ],

  'Class 11': [
    {
      id: 'chem_11',
      name: 'Chemistry',
      code: '043',
      iconName: 'FlaskConical',
      chapters: [
        { id: 'c11_1', name: 'Some Basic Concepts of Chemistry', typicalSubtopics: ['Mole concept & molar mass', 'Empirical and molecular formula', 'Stoichiometry & limiting reagent'] },
        { id: 'c11_2', name: 'Structure of Atom', typicalSubtopics: ['Photoelectric effect', 'Bohr model & hydrogen spectrum', 'de Broglie relation & Heisenberg uncertainty', 'Quantum numbers & orbital shapes'] },
        { id: 'c11_3', name: 'Classification of Elements and Periodicity in Properties', typicalSubtopics: ['Modern periodic law', 'Ionization enthalpy trends', 'Electron gain enthalpy & electronegativity'] },
        { id: 'c11_4', name: 'Chemical Bonding and Molecular Structure', typicalSubtopics: ['VSEPR theory & molecular geometry', 'Hybridization (sp, sp2, sp3)', 'Molecular Orbital Theory (N2, O2)', 'Hydrogen bonding'] },
        { id: 'c11_5', name: 'Chemical Thermodynamics', typicalSubtopics: ['First law of thermodynamics', 'Enthalpy changes (reaction, formation, combustion)', 'Hess law', 'Entropy & Gibbs free energy (ΔG = ΔH - TΔS)'] },
        { id: 'c11_6', name: 'Equilibrium', typicalSubtopics: ['Law of mass action & Kc, Kp relationship', 'Le Chatelier principle', 'pH calculations & buffer solutions', 'Solubility product Ksp'] },
        { id: 'c11_7', name: 'Redox Reactions', typicalSubtopics: ['Oxidation number rules', 'Balancing redox reactions by ion-electron method', 'Electrochemical cell basics'] },
        { id: 'c11_8', name: 'Organic Chemistry – Some Basic Principles and Techniques', typicalSubtopics: ['IUPAC nomenclature', 'Inductive, electromeric & resonance effects', 'Carbocation, carbanion stability', 'Isomerism types'] },
        { id: 'c11_9', name: 'Hydrocarbons', typicalSubtopics: ['Alkanes: free radical halogenation', 'Alkenes: Markovnikov rule & peroxide effect', 'Benzene: aromaticity & electrophilic substitution'] },
      ]
    },
    {
      id: 'phys_11',
      name: 'Physics',
      code: '042',
      iconName: 'Zap',
      chapters: [
        { id: 'p11_1', name: 'Units and Measurements', typicalSubtopics: ['Dimensional analysis & applications', 'Significant figures & error propagation'] },
        { id: 'p11_2', name: 'Motion in a Straight Line', typicalSubtopics: ['Kinematic equations for uniformly accelerated motion', 'Relative velocity in 1D', 'Position-time & velocity-time graphs'] },
        { id: 'p11_3', name: 'Motion in a Plane', typicalSubtopics: ['Vector addition & resolution', 'Projectile motion derivations', 'Centripetal acceleration'] },
        { id: 'p11_4', name: 'Laws of Motion', typicalSubtopics: ['Newton second law (F = dp/dt)', 'Friction & banking of roads', 'Conservation of linear momentum'] },
        { id: 'p11_5', name: 'Work, Energy and Power', typicalSubtopics: ['Work-Energy Theorem derivation', 'Conservative vs non-conservative forces', 'Elastic and inelastic collisions in 1D'] },
        { id: 'p11_6', name: 'System of Particles and Rotational Motion', typicalSubtopics: ['Center of mass of two-particle system', 'Torque and angular momentum conservation', 'Moment of inertia of circular ring and disc'] },
        { id: 'p11_7', name: 'Gravitation', typicalSubtopics: ['Kepler laws of planetary motion', 'Variation of acceleration due to gravity with altitude and depth', 'Escape velocity derivation'] },
        { id: 'p11_8', name: 'Mechanical Properties of Solids', typicalSubtopics: ['Stress-strain curve', 'Hooke law and Young modulus', 'Elastic potential energy'] },
        { id: 'p11_9', name: 'Mechanical Properties of Fluids', typicalSubtopics: ['Pascal law & hydraulic lift', 'Bernoulli theorem & applications (venturimeter)', 'Surface tension & capillary rise'] },
        { id: 'p11_10', name: 'Thermal Properties of Matter & Thermodynamics', typicalSubtopics: ['Thermal expansion', 'First law of thermodynamics (Q = ΔU + W)', 'Isothermal & adiabatic processes'] },
        { id: 'p11_11', name: 'Kinetic Theory of Gases', typicalSubtopics: ['Pressure exerted by ideal gas equation', 'Degrees of freedom & law of equipartition of energy'] },
        { id: 'p11_12', name: 'Oscillations and Waves', typicalSubtopics: ['Simple Harmonic Motion (SHM) equation', 'Simple pendulum time period derivation', 'Longitudinal & transverse waves', 'Standing waves in strings'] },
      ]
    },
    {
      id: 'math_11',
      name: 'Mathematics',
      code: '041',
      iconName: 'Calculator',
      chapters: [
        { id: 'm11_1', name: 'Sets', typicalSubtopics: ['Subset, power set', 'Venn diagrams', 'Union, intersection & complement laws'] },
        { id: 'm11_2', name: 'Relations and Functions', typicalSubtopics: ['Cartesian product', 'Domain, co-domain & range', 'Real functions (identity, modulus, signum, greatest integer)'] },
        { id: 'm11_3', name: 'Trigonometric Functions', typicalSubtopics: ['Sign of trigonometric functions in quadrants', 'Compound angle formulas: sin(x±y), cos(x±y)', 'Transformation formulas'] },
        { id: 'm11_4', name: 'Complex Numbers and Quadratic Equations', typicalSubtopics: ['Algebra of complex numbers', 'Modulus and conjugate', 'Square root of negative real numbers'] },
        { id: 'm11_5', name: 'Linear Inequalities', typicalSubtopics: ['Algebraic solutions of linear inequalities in one variable', 'Graphical representation on number line'] },
        { id: 'm11_6', name: 'Permutations and Combinations', typicalSubtopics: ['Fundamental principle of counting', 'Derivation of nPr and nCr', 'Circular permutation & arrangements'] },
        { id: 'm11_7', name: 'Binomial Theorem', typicalSubtopics: ['Binomial expansion for positive integral indices', 'General term & middle term'] },
        { id: 'm11_8', name: 'Sequences and Series', typicalSubtopics: ['Geometric Progression (GP)', 'General term of GP and sum of first n terms', 'Geometric Mean (GM)'] },
        { id: 'm11_9', name: 'Straight Lines', typicalSubtopics: ['Slope of line', 'Various forms of equations of line (slope-intercept, intercept, normal)', 'Distance of a point from a line'] },
        { id: 'm11_10', name: 'Conic Sections', typicalSubtopics: ['Parabola standard equations', 'Ellipse standard equation & eccentricity', 'Hyperbola standard equation'] },
        { id: 'm11_11', name: 'Limits and Derivatives', typicalSubtopics: ['Intuitive idea of limit', 'Standard limits: lim (x^n-a^n)/(x-a), lim sinx/x', 'First principle derivative of polynomials & trig functions'] },
        { id: 'm11_12', name: 'Statistics & Probability', typicalSubtopics: ['Mean deviation about mean/median', 'Variance and standard deviation', 'Axiomatic approach to probability'] },
      ]
    },
    {
      id: 'bio_11',
      name: 'Biology',
      code: '044',
      iconName: 'Dna',
      chapters: [
        { id: 'b11_1', name: 'The Living World', typicalSubtopics: ['What is living?', 'Binomial nomenclature', 'Taxonomic categories'] },
        { id: 'b11_2', name: 'Biological Classification', typicalSubtopics: ['Five kingdom classification', 'Monera, Protista, Fungi', 'Viruses, viroids & prions'] },
        { id: 'b11_3', name: 'Plant Kingdom & Animal Kingdom', typicalSubtopics: ['Algae, Bryophytes, Pteridophytes', 'Non-chordates to chordates classification'] },
        { id: 'b11_4', name: 'Morphology & Anatomy of Flowering Plants', typicalSubtopics: ['Root, stem, leaf modifications', 'Inflorescence', 'Internal anatomy of dicot and monocot'] },
        { id: 'b11_5', name: 'Cell: The Unit of Life & Cell Cycle', typicalSubtopics: ['Prokaryotic vs eukaryotic cell', 'Endomembrane system', 'Mitosis and Meiosis phases'] },
        { id: 'b11_6', name: 'Photosynthesis in Higher Plants', typicalSubtopics: ['Light reaction & Z-scheme', 'Calvin cycle (C3 pathway)', 'Hatch & Slack pathway (C4)'] },
        { id: 'b11_7', name: 'Respiration in Plants', typicalSubtopics: ['Glycolysis (EMP pathway)', 'Krebs cycle (TCA cycle)', 'Electron transport system (ETS) & ATP synthesis'] },
        { id: 'b11_8', name: 'Plant Growth and Development', typicalSubtopics: ['Plant growth regulators (Auxins, Gibberellins, Cytokinins, Ethylene, ABA)', 'Photoperiodism'] },
        { id: 'b11_9', name: 'Human Physiology (Breathing, Circulation, Excretion)', typicalSubtopics: ['Mechanism of breathing & gas transport', 'Cardiac cycle & ECG', 'Mechanism of urine formation & counter-current system'] },
        { id: 'b11_10', name: 'Neural & Chemical Coordination', typicalSubtopics: ['Conduction of nerve impulse', 'Reflex action', 'Pituitary, thyroid, adrenal hormones'] },
      ]
    },
    {
      id: 'acc_11',
      name: 'Accountancy',
      code: '055',
      iconName: 'CreditCard',
      chapters: [
        { id: 'a11_1', name: 'Introduction to Accounting', typicalSubtopics: ['Objectives and advantages', 'Basic accounting terms: Assets, Liabilities, Capital'] },
        { id: 'a11_2', name: 'Theory Base of Accounting', typicalSubtopics: ['GAAP principles (Going concern, Accrual, Matching)', 'Accounting standards'] },
        { id: 'a11_3', name: 'Recording of Transactions (Journal, Ledger, Cash Book)', typicalSubtopics: ['Rules of Debit and Credit', 'Journal entries with GST', 'Petty cash book'] },
        { id: 'a11_4', name: 'Bank Reconciliation Statement (BRS)', typicalSubtopics: ['Need for BRS', 'Causes of difference between Cash Book and Pass Book balances'] },
        { id: 'a11_5', name: 'Trial Balance and Rectification of Errors', typicalSubtopics: ['One-sided & two-sided errors', 'Suspense account entries'] },
        { id: 'a11_6', name: 'Depreciation, Provisions and Reserves', typicalSubtopics: ['Straight Line Method (SLM)', 'Written Down Value Method (WDV)', 'Asset disposal account'] },
        { id: 'a11_7', name: 'Financial Statements of Sole Proprietorship', typicalSubtopics: ['Trading and Profit & Loss Account', 'Balance Sheet with adjustments (closing stock, bad debts)'] },
      ]
    },
    {
      id: 'bst_11',
      name: 'Business Studies',
      code: '054',
      iconName: 'Briefcase',
      chapters: [
        { id: 'bst11_1', name: 'Evolution and Fundamentals of Business', typicalSubtopics: ['History of trade & commerce in India', 'Concept and characteristics of business', 'Business risks'] },
        { id: 'bst11_2', name: 'Forms of Business Organisations', typicalSubtopics: ['Sole Proprietorship, Partnership, HUF', 'Cooperative societies', 'Joint Stock Company formation'] },
        { id: 'bst11_3', name: 'Public, Private and Global Enterprises', typicalSubtopics: ['Departmental undertakings', 'Statutory corporations', 'Government companies', 'MNCs & Joint Ventures'] },
        { id: 'bst11_4', name: 'Business Services', typicalSubtopics: ['Banking (NEFT, RTGS, e-banking)', 'Insurance principles (utmost good faith, insurable interest)'] },
        { id: 'bst11_5', name: 'Emerging Modes of Business', typicalSubtopics: ['e-Business vs traditional business', 'BPO and KPO outsourcing'] },
        { id: 'bst11_6', name: 'Social Responsibility of Business and Business Ethics', typicalSubtopics: ['Arguments for and against social responsibility', 'Responsibility towards stakeholders'] },
        { id: 'bst11_7', name: 'Sources of Business Finance', typicalSubtopics: ['Retained earnings', 'Equity and preference shares', 'Debentures, Commercial papers, Trade credit'] },
        { id: 'bst11_8', name: 'Small Business and Internal Trade', typicalSubtopics: ['MSME role in Indian economy', 'Wholesale & Retail trade', 'GST concept'] },
      ]
    },
    {
      id: 'eco_11',
      name: 'Economics',
      code: '030',
      iconName: 'TrendingUp',
      chapters: [
        { id: 'eco11_1', name: 'Statistics: Collection, Organisation and Presentation of Data', typicalSubtopics: ['Census vs sampling methods', 'Tabular, bar diagram and pie chart presentation'] },
        { id: 'eco11_2', name: 'Statistics: Measures of Central Tendency', typicalSubtopics: ['Arithmetic Mean', 'Median', 'Mode for grouped frequency distributions'] },
        { id: 'eco11_3', name: 'Statistics: Correlation and Index Numbers', typicalSubtopics: ['Karl Pearson coefficient of correlation', 'Consumer Price Index (CPI) and WPI'] },
        { id: 'eco11_4', name: 'Microeconomics: Introduction & Consumer Equilibrium', typicalSubtopics: ['Production Possibility Curve (PPC)', 'Marginal Utility analysis', 'Indifference Curve analysis'] },
        { id: 'eco11_5', name: 'Microeconomics: Demand and Elasticity of Demand', typicalSubtopics: ['Law of demand & determinants', 'Price elasticity of demand (percentage method)'] },
        { id: 'eco11_6', name: 'Microeconomics: Production and Cost', typicalSubtopics: ['Law of Variable Proportions (Total, Average, Marginal Product)', 'Short-run cost curves (TFC, TVC, TC, MC)'] },
        { id: 'eco11_7', name: 'Microeconomics: Revenue and Producer Equilibrium', typicalSubtopics: ['Relationship between TR, AR, MR', 'MR-MC approach to producer equilibrium'] },
      ]
    },
    {
      id: 'cs_11',
      name: 'Computer Science',
      code: '083',
      iconName: 'Terminal',
      chapters: [
        { id: 'cs11_1', name: 'Computer System and Organisation', typicalSubtopics: ['Von Neumann architecture', 'Memory units & types', 'Number system conversions (Binary, Octal, Hex)'] },
        { id: 'cs11_2', name: 'Computational Thinking and Programming: Basics of Python', typicalSubtopics: ['Data types, operators, expressions', 'Conditionals (if-elif-else)', 'Loops (for, while, range)'] },
        { id: 'cs11_3', name: 'Strings, Lists, Tuples and Dictionaries', typicalSubtopics: ['String slicing & built-in methods', 'List manipulation & list comprehension', 'Dictionary key-value operations'] },
        { id: 'cs11_4', name: 'Society, Law and Ethics', typicalSubtopics: ['Cyber safety and digital footprint', 'Intellectual Property Rights (IPR) & plagiarism', 'IT Act and open-source software'] },
      ]
    }
  ],

  'Class 12': [
    {
      id: 'chem_12',
      name: 'Chemistry',
      code: '043',
      iconName: 'FlaskConical',
      chapters: [
        { id: 'c12_1', name: 'Solutions', typicalSubtopics: ['Raoult law for volatile/non-volatile solutes', 'Colligative properties (ΔTb, ΔTf, osmotic pressure π)', 'van’t Hoff factor (i) & abnormal molar mass'] },
        { id: 'c12_2', name: 'Electrochemistry', typicalSubtopics: ['Nernst equation & numericals', 'Kohlrausch law of independent migration', 'Conductivity (κ) & molar conductivity (Λm)', 'Lead-storage battery & Fuel cell'] },
        { id: 'c12_3', name: 'Chemical Kinetics', typicalSubtopics: ['Rate law & order of reaction', 'Integrated rate equations for zero and first order', 'Arrhenius equation & activation energy Ea graph'] },
        { id: 'c12_4', name: 'd- and f-Block Elements', typicalSubtopics: ['Transition element electronic configurations', 'Variable oxidation states & magnetic properties', 'Lanthanoid contraction & consequences', 'KMnO4 and K2Cr2O7 preparation & reactions'] },
        { id: 'c12_5', name: 'Coordination Compounds', typicalSubtopics: ['Werner coordination theory', 'IUPAC nomenclature of coordination complexes', 'Valence Bond Theory (inner/outer orbital)', 'Crystal Field Theory (CFT) splitting in octahedral/tetrahedral'] },
        { id: 'c12_6', name: 'Haloalkanes and Haloarenes', typicalSubtopics: ['SN1 vs SN2 reaction mechanisms & stereochemistry', 'Electrophilic aromatic substitution of chlorobenzene', 'Organometallic Grignard reagent'] },
        { id: 'c12_7', name: 'Alcohols, Phenols and Ethers', typicalSubtopics: ['Acid-catalyzed dehydration mechanism', 'Kolbe reaction & Reimer-Tiemann reaction', 'Williamson ether synthesis mechanism'] },
        { id: 'c12_8', name: 'Aldehydes, Ketones and Carboxylic Acids', typicalSubtopics: ['Nucleophilic addition mechanism (HCN, NaHSO3)', 'Aldol condensation & Cannizzaro reaction', 'Tollens and Fehling tests', 'Acidity of carboxylic acids & Hell-Volhard-Zelinsky (HVZ)'] },
        { id: 'c12_9', name: 'Amines', typicalSubtopics: ['Basicity of aliphatic vs aromatic amines in gaseous and aqueous phase', 'Gabriel phthalimide synthesis', 'Hoffmann bromamide degradation', 'Carbylamine test & Hinsberg test'] },
        { id: 'c12_10', name: 'Biomolecules', typicalSubtopics: ['Glucose structure & open vs cyclic form', 'Amino acids, peptide bond & protein denaturation', 'Nucleic acids: DNA vs RNA structure', 'Vitamins & deficiency diseases'] },
      ]
    },
    {
      id: 'phys_12',
      name: 'Physics',
      code: '042',
      iconName: 'Zap',
      chapters: [
        { id: 'p12_1', name: 'Electric Charges and Fields', typicalSubtopics: ['Coulomb law in vector form', 'Electric field of dipole on axial and equatorial points', 'Gauss theorem and applications (infinite wire, plane sheet)'] },
        { id: 'p12_2', name: 'Electrostatic Potential and Capacitance', typicalSubtopics: ['Electric potential due to dipole', 'Equipotential surfaces', 'Capacitance of parallel plate capacitor with dielectric', 'Energy stored in capacitor'] },
        { id: 'p12_3', name: 'Current Electricity', typicalSubtopics: ['Drift velocity derivation & relation with current', 'Ohm law micro-derivation', 'Kirchhoff laws & Wheatstone bridge proof', 'Temperature dependence of resistivity'] },
        { id: 'p12_4', name: 'Moving Charges and Magnetism', typicalSubtopics: ['Biot-Savart law & magnetic field on axis of circular coil', 'Ampere Circuital Law and solenoid', 'Force between parallel current-carrying conductors', 'Moving Coil Galvanometer'] },
        { id: 'p12_5', name: 'Magnetism and Matter', typicalSubtopics: ['Magnetic dipole moment of revolving electron', 'Dia, para and ferromagnetic substances with Curie law'] },
        { id: 'p12_6', name: 'Electromagnetic Induction', typicalSubtopics: ['Faraday law & Lenz law with conservation of energy', 'Motional EMF derivation', 'Self and mutual induction'] },
        { id: 'p12_7', name: 'Alternating Current', typicalSubtopics: ['LCR series AC circuit & phasor diagram', 'Resonance condition & Quality factor Q', 'Power in AC circuit & power factor', 'AC generator & Transformer working and efficiency'] },
        { id: 'p12_8', name: 'Electromagnetic Waves', typicalSubtopics: ['Displacement current need', 'EM spectrum wavelength & frequency ranges and applications'] },
        { id: 'p12_9', name: 'Ray Optics and Optical Instruments', typicalSubtopics: ['Lens Maker Formula derivation', 'Refraction through prism (prism formula)', 'Astronomical telescope & Compound microscope magnifying power derivations'] },
        { id: 'p12_10', name: 'Wave Optics', typicalSubtopics: ['Huygens principle & laws of reflection/refraction proof', 'Young Double Slit Experiment (YDSE) fringe width derivation', 'Diffraction at single slit'] },
        { id: 'p12_11', name: 'Dual Nature of Radiation and Matter', typicalSubtopics: ['Photoelectric effect observations & Einstein photoelectric equation', 'de Broglie wavelength of electron'] },
        { id: 'p12_12', name: 'Atoms', typicalSubtopics: ['Rutherford alpha particle scattering experiment', 'Bohr postulates & radius/energy derivations for hydrogen atom', 'Hydrogen emission spectral series'] },
        { id: 'p12_13', name: 'Nuclei', typicalSubtopics: ['Nuclear size and nuclear density independence', 'Mass defect and binding energy per nucleon curve', 'Nuclear fission and fusion'] },
        { id: 'p12_14', name: 'Semiconductor Electronics: Materials, Devices and Simple Circuits', typicalSubtopics: ['Intrinsic and extrinsic semiconductors', 'p-n junction diode forward and reverse characteristics', 'p-n junction as half wave and full wave rectifier'] },
      ]
    },
    {
      id: 'math_12',
      name: 'Mathematics',
      code: '041',
      iconName: 'Calculator',
      chapters: [
        { id: 'm12_1', name: 'Relations and Functions', typicalSubtopics: ['Types of relations: Reflexive, Symmetric, Transitive & Equivalence', 'One-one (injective) and onto (surjective) functions'] },
        { id: 'm12_2', name: 'Inverse Trigonometric Functions', typicalSubtopics: ['Principal value branches of sin⁻¹, cos⁻¹, tan⁻¹', 'Domain and range graphs'] },
        { id: 'm12_3', name: 'Matrices', typicalSubtopics: ['Multiplication of matrices properties', 'Symmetric and skew-symmetric matrices', 'Invertible matrices'] },
        { id: 'm12_4', name: 'Determinants', typicalSubtopics: ['Properties of determinants', 'Area of triangle using determinants', 'Adjoint and inverse of square matrix', 'Solving system of linear equations by matrix method'] },
        { id: 'm12_5', name: 'Continuity and Differentiability', typicalSubtopics: ['Continuity at a point', 'Differentiability of composite functions (chain rule)', 'Implicit differentiation and logarithmic differentiation', 'Parametric form derivatives'] },
        { id: 'm12_6', name: 'Application of Derivatives', typicalSubtopics: ['Rate of change of quantities', 'Strictly increasing and decreasing functions', 'Maxima and minima using first & second derivative test (applied word problems)'] },
        { id: 'm12_7', name: 'Integrals', typicalSubtopics: ['Integration by substitution, partial fractions and by parts', 'Definite integral fundamental theorem', 'Definite integral properties (King property)'] },
        { id: 'm12_8', name: 'Application of Integrals', typicalSubtopics: ['Area bounded by standard curves: circles, parabolas, ellipses, straight lines'] },
        { id: 'm12_9', name: 'Differential Equations', typicalSubtopics: ['Order and degree of differential equation', 'Variable separable method', 'Homogeneous differential equations', 'First order linear differential equation: dy/dx + Py = Q'] },
        { id: 'm12_10', name: 'Vector Algebra', typicalSubtopics: ['Scalar (dot) product and projection of vector', 'Vector (cross) product and geometrical interpretation'] },
        { id: 'm12_11', name: 'Three Dimensional Geometry', typicalSubtopics: ['Direction cosines and direction ratios of a line', 'Cartesian and vector equation of a line', 'Shortest distance between two skew lines'] },
        { id: 'm12_12', name: 'Linear Programming', typicalSubtopics: ['Formulation of LPP', 'Graphical method of solving bounded and unbounded feasible regions'] },
        { id: 'm12_13', name: 'Probability', typicalSubtopics: ['Conditional probability & multiplication theorem', 'Independent events', 'Bayes Theorem and total probability theorem'] },
      ]
    },
    {
      id: 'bio_12',
      name: 'Biology',
      code: '044',
      iconName: 'Dna',
      chapters: [
        { id: 'b12_1', name: 'Sexual Reproduction in Flowering Plants', typicalSubtopics: ['Microsporogenesis & pollen grain', 'Megasporogenesis & embryo sac', 'Double fertilization', 'Post-fertilization: endosperm & seed'] },
        { id: 'b12_2', name: 'Human Reproduction', typicalSubtopics: ['Male and female reproductive systems', 'Spermatogenesis and Oogenesis', 'Menstrual cycle hormonal regulation', 'Fertilization, cleavage and blastocyst implantation'] },
        { id: 'b12_3', name: 'Reproductive Health', typicalSubtopics: ['Population explosion and birth control methods', 'MTP (Medical Termination of Pregnancy)', 'STIs & Assisted Reproductive Technologies (ART: IVF, ZIFT, ICSI)'] },
        { id: 'b12_4', name: 'Principles of Inheritance and Variation', typicalSubtopics: ['Mendel laws of inheritance', 'Incomplete dominance and co-dominance (ABO blood groups)', 'Chromosomal theory of inheritance & linkage/recombination', 'Mendelian & chromosomal disorders (Sickle cell, Haemophilia, Down syndrome)'] },
        { id: 'b12_5', name: 'Molecular Basis of Inheritance', typicalSubtopics: ['DNA double helix model & packaging', 'Griffith, Hershey-Chase experiments', 'Semi-conservative DNA replication (Meselson-Stahl)', 'Transcription & Translation', 'Lac Operon & Human Genome Project (HGP)'] },
        { id: 'b12_6', name: 'Evolution', typicalSubtopics: ['Miller-Urey experiment', 'Darwin theory of natural selection vs Lamarckism', 'Hardy-Weinberg equilibrium and factors', 'Adaptive radiation & human evolution'] },
        { id: 'b12_7', name: 'Human Health and Disease', typicalSubtopics: ['Pathogens: Malaria life cycle (Plasmodium), Typhoid, Amoebiasis', 'Innate and acquired immunity (B & T cells, antibodies structure)', 'AIDS (HIV life cycle) & Cancer causes/detection'] },
        { id: 'b12_8', name: 'Microbes in Human Welfare', typicalSubtopics: ['Microbes in household products (Curd, bread, fermented beverages)', 'Microbes in sewage treatment (STP)', 'Biogas production and biofertilizers'] },
        { id: 'b12_9', name: 'Biotechnology: Principles and Processes', typicalSubtopics: ['Restriction endonucleases & ligases', 'Cloning vectors (pBR322 characteristics)', 'Polymerase Chain Reaction (PCR steps: denaturation, annealing, extension)', 'Gel electrophoresis & bioreactors'] },
        { id: 'b12_10', name: 'Biotechnology and its Applications', typicalSubtopics: ['Bt crops (Bt cotton mechanism)', 'RNA interference (RNAi) in pest resistance', 'Genetically engineered insulin production', 'Gene therapy (ADA deficiency) and transgenic animals'] },
        { id: 'b12_11', name: 'Organisms and Populations', typicalSubtopics: ['Organism response to abiotic factors (conformers/regulators)', 'Population attributes (growth models: exponential & logistic)', 'Population interactions (Mutualism, Competition, Parasitism, Commensalism)'] },
        { id: 'b12_12', name: 'Ecosystem & Biodiversity', typicalSubtopics: ['Trophic structure & ecological pyramids', 'Primary productivity & decomposition', 'In-situ and ex-situ conservation methods'] },
      ]
    },
    {
      id: 'acc_12',
      name: 'Accountancy',
      code: '055',
      iconName: 'CreditCard',
      chapters: [
        { id: 'a12_1', name: 'Accounting for Partnership: Basic Concepts', typicalSubtopics: ['Profit and Loss Appropriation Account', 'Partners Capital accounts (Fixed and Fluctuating)', 'Interest on capital and drawings calculation', 'Past adjustments & guarantee of profit'] },
        { id: 'a12_2', name: 'Reconstitution of a Partnership Firm (Admission of Partner)', typicalSubtopics: ['Sacrificing ratio and new profit sharing ratio', 'Goodwill valuation & treatment (AS-26)', 'Revaluation of assets and reassessment of liabilities'] },
        { id: 'a12_3', name: 'Reconstitution: Retirement and Death of a Partner', typicalSubtopics: ['Gaining ratio', 'Deceased partner share of profit till date of death', 'Settlement of partner loan account'] },
        { id: 'a12_4', name: 'Dissolution of a Partnership Firm', typicalSubtopics: ['Realisation Account preparation', 'Treatment of unrecorded assets/liabilities', 'Partners capital and bank/cash account closure'] },
        { id: 'a12_5', name: 'Accounting for Share Capital', typicalSubtopics: ['Issue of shares at par and premium', 'Pro-rata allotment in case of over-subscription', 'Calls in arrears, forfeiture and reissue of shares', 'Capital Reserve transfer'] },
        { id: 'a12_6', name: 'Issue and Redemption of Debentures', typicalSubtopics: ['Issue of debentures with terms of redemption conditions', 'Debentures issued as collateral security', 'Writing off discount/loss on issue of debentures'] },
        { id: 'a12_7', name: 'Financial Statements of a Company & Analysis', typicalSubtopics: ['Schedule III Balance Sheet and Statement of P&L format', 'Comparative and Common-size statements'] },
        { id: 'a12_8', name: 'Accounting Ratios', typicalSubtopics: ['Liquidity ratios (Current & Quick ratio)', 'Solvency ratios (Debt-Equity, Total Assets to Debt)', 'Turnover ratios (Inventory, Debtors)', 'Profitability ratios (Gross profit, Net profit, ROI)'] },
        { id: 'a12_9', name: 'Cash Flow Statement', typicalSubtopics: ['Operating activities (indirect method as per AS-3)', 'Investing activities', 'Financing activities & net change in cash equivalents'] },
      ]
    },
    {
      id: 'bst_12',
      name: 'Business Studies',
      code: '054',
      iconName: 'Briefcase',
      chapters: [
        { id: 'bst12_1', name: 'Nature and Significance of Management', typicalSubtopics: ['Management as science, art and profession', 'Levels of management', 'Functions of management', 'Coordination: essence of management'] },
        { id: 'bst12_2', name: 'Principles of Management', typicalSubtopics: ['Fayol 14 principles of general management', 'Taylor scientific management principles & techniques (functional foremanship, work study)'] },
        { id: 'bst12_3', name: 'Business Environment', typicalSubtopics: ['Dimensions of business environment (Economic, Social, Technological, Political, Legal)', 'Impact of Demonetization & GST'] },
        { id: 'bst12_4', name: 'Planning', typicalSubtopics: ['Planning process steps', 'Types of plans (Single use vs Standing: objectives, strategy, policy, procedure, rule, programme)'] },
        { id: 'bst12_5', name: 'Organising', typicalSubtopics: ['Organising process', 'Functional vs Divisional organizational structure', 'Formal and informal organisation', 'Delegation vs Decentralisation'] },
        { id: 'bst12_6', name: 'Staffing', typicalSubtopics: ['Staffing process steps', 'Internal vs External recruitment sources', 'Selection process and tests', 'On-the-job and off-the-job training methods'] },
        { id: 'bst12_7', name: 'Directing', typicalSubtopics: ['Maslow need hierarchy theory of motivation', 'Leadership styles (Autocratic, Democratic, Laissez-faire)', 'Financial and non-financial incentives', 'Barriers to communication'] },
        { id: 'bst12_8', name: 'Controlling', typicalSubtopics: ['Controlling process steps', 'Relationship between planning and controlling', 'Management by Exception (MBE) & Critical Point Control'] },
        { id: 'bst12_9', name: 'Financial Management', typicalSubtopics: ['Financial decisions (Investment, Financing, Dividend decisions and factors)', 'Capital structure & trading on equity', 'Fixed and working capital requirements'] },
        { id: 'bst12_10', name: 'Financial Markets', typicalSubtopics: ['Money market instruments (Treasury bill, Commercial paper, Call money, Certificate of deposit)', 'Primary vs Secondary capital market', 'Stock Exchange functions & SEBI regulatory role'] },
        { id: 'bst12_11', name: 'Marketing Management', typicalSubtopics: ['Marketing management philosophies', 'Marketing mix (4 Ps: Product, Price, Place, Promotion)', 'Channels of distribution & sales promotion tools'] },
        { id: 'bst12_12', name: 'Consumer Protection', typicalSubtopics: ['Consumer Protection Act 2019 rights & responsibilities', 'Three-tier consumer redressal agencies (District, State, National commissions)'] },
      ]
    },
    {
      id: 'eco_12',
      name: 'Economics',
      code: '030',
      iconName: 'TrendingUp',
      chapters: [
        { id: 'eco12_1', name: 'National Income and Related Aggregates', typicalSubtopics: ['Circular flow of income in two-sector economy', 'GDP, NDP, GNP, NNP at factor cost and market price', 'Methods of calculating national income (Value added, Income, Expenditure)', 'Real vs Nominal GDP'] },
        { id: 'eco12_2', name: 'Money and Banking', typicalSubtopics: ['Money creation / Credit creation by commercial banking system', 'Central Bank (RBI) monetary policy tools (Repo rate, Reverse repo, CRR, SLR, Open market operations)'] },
        { id: 'eco12_3', name: 'Determination of Income and Employment', typicalSubtopics: ['Aggregate Demand (AD) and Aggregate Supply (AS) components', 'Propensity to consume (APC, MPC) and save (APS, MPS)', 'Investment multiplier (k = 1 / (1-MPC))', 'Problems of Deficient and Excess demand & corrective fiscal and monetary measures'] },
        { id: 'eco12_4', name: 'Government Budget and the Economy', typicalSubtopics: ['Objectives of government budget', 'Revenue receipts vs Capital receipts', 'Revenue expenditure vs Capital expenditure', 'Fiscal deficit, Revenue deficit & Primary deficit definitions and implications'] },
        { id: 'eco12_5', name: 'Balance of Payments & Foreign Exchange', typicalSubtopics: ['Current Account vs Capital Account components', 'Autonomous vs Accommodating transactions', 'Fixed, flexible and managed floating exchange rates'] },
        { id: 'eco12_6', name: 'Indian Economy on the Eve of Independence & 1950-1990', typicalSubtopics: ['Colonial exploitation in agriculture & industry', 'Five-Year Plans common goals', 'Land reforms and Green Revolution', 'Industrial Policy Resolution 1956 (IPR 1956)'] },
        { id: 'eco12_7', name: 'Economic Reforms Since 1991 (LPG)', typicalSubtopics: ['Liberalisation, Privatisation, Globalisation policies', 'Appraisal of LPG reforms & WTO role'] },
        { id: 'eco12_8', name: 'Current Challenges Facing Indian Economy', typicalSubtopics: ['Human Capital Formation (Education & health expenditure)', 'Rural Development (Credit, agricultural marketing, organic farming)', 'Employment trends & informalisation', 'Sustainable development'] },
        { id: 'eco12_9', name: 'Development Experience of India, Pakistan and China', typicalSubtopics: ['Comparative development indicators: GDP growth, sectoral contribution, HDI comparison'] },
      ]
    },
    {
      id: 'cs_12',
      name: 'Computer Science',
      code: '083',
      iconName: 'Terminal',
      chapters: [
        { id: 'cs12_1', name: 'Computational Thinking and Programming - 2 (Python)', typicalSubtopics: ['Functions (user-defined, arguments, return values, scope)', 'Exception handling (try-except-finally)', 'File handling (Text files: read, readline, write, seek, tell; Binary files: pickle module; CSV files: csv.reader/writer)'] },
        { id: 'cs12_2', name: 'Data Structures: Stack', typicalSubtopics: ['Stack operations: Push, Pop using Python lists', 'Peek and display stack', 'Implementation of stack for real-world scenarios'] },
        { id: 'cs12_3', name: 'Computer Networks', typicalSubtopics: ['Network devices (Hub, Switch, Router, Gateway, Repeater)', 'Network topologies (Star, Bus, Ring, Mesh)', 'Protocols (TCP/IP, HTTP, HTTPS, FTP, DNS)', 'Web services (HTML, XML, URL, Cookies)', 'Network layout case studies (Cable layout & server placement)'] },
        { id: 'cs12_4', name: 'Database Management and SQL', typicalSubtopics: ['Relational data model (Relation, Attribute, Tuple, Domain, Degree, Cardinality)', 'SQL commands: DDL (CREATE, DROP, ALTER) vs DML (SELECT, INSERT, UPDATE, DELETE)', 'Aggregate functions (COUNT, SUM, AVG, MIN, MAX)', 'GROUP BY, HAVING, ORDER BY clauses', 'Equi-joins and natural joins between two tables', 'Interface Python with SQL database (mysql.connector)'] },
      ]
    }
  ]
};
