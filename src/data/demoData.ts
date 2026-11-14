import {
  Subject,
  Resource,
  Note,
  Task,
  FlashcardDeck,
  SelfQuiz,
  StudentProfile,
  StudyActivityLog,
  SlideData,
  VideoResource,
  Folder,
  AcademicTermId,
} from '../types';

export const initialProfile: StudentProfile = {
  name: 'Ayush',
  email: 'ayush@university.edu',
  major: 'MBA - Strategic Product Management',
  academicTerm: 'Term 2 (Design & Strategy)',
  weeklyTargetHours: 15,
  currentWeeklyHours: 8.5,
  themeMode: 'light',
  accentColor: 'rose',
  visualTheme: 'anime',
  reducedMotion: false,
  defaultQuizTimerMinutes: 10,
  mascotEnabled: true,
  theme: 'warm',
  isDemoMode: true,
};

export const initialSubjects: Subject[] = [
  {
    id: 'sub-dt101',
    name: 'Design Thinking & Innovation',
    code: 'DT-101',
    color: '#E11D48', // Vibrant Rose
    icon: 'Sparkles',
    description: 'Empathize, Define, Ideate, Prototype, Test — Campus services reimagining & stakeholder alignment.',
    targetHoursPerWeek: 5,
    completedHoursThisWeek: 3.5,
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'sub-pm202',
    name: 'Product Management 2',
    code: 'PM-202',
    color: '#059669', // Emerald
    icon: 'Target',
    description: 'Continuous product discovery, metrics frameworks (AARRR, HEART), and agile sprints.',
    targetHoursPerWeek: 4,
    completedHoursThisWeek: 2.5,
    createdAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'sub-hci310',
    name: 'Human-Computer Interaction',
    code: 'HCI-310',
    color: '#4F46E5', // Indigo
    icon: 'Laptop',
    description: 'User-centered design heuristics, Fitts’s Law, cognitive walkthroughs, and accessibility.',
    targetHoursPerWeek: 3,
    completedHoursThisWeek: 1.5,
    createdAt: '2026-10-10T14:30:00Z',
  },
  {
    id: 'sub-env215',
    name: 'Business Processes & Economics',
    code: 'BP-215',
    color: '#D97706', // Amber
    icon: 'Brain',
    description: 'Financial cycles, operational reliability, treasury workflows, and service level agreements.',
    targetHoursPerWeek: 3,
    completedHoursThisWeek: 1.0,
    createdAt: '2026-10-12T11:15:00Z',
  },
];

// Extracted Slides from the user's uploaded presentation: DT_Group_Presentation_7min.pptx
export const extractedDtSlides: SlideData[] = [
  {
    slideNumber: 1,
    title: 'DESIGN THINKING · CAMPUS SERVICES',
    paragraphs: [
      'DESIGN THINKING · CAMPUS SERVICES',
      'Reimagining the HSB Student Experience',
      "A design thinking approach to campus services — from a fragmented, low-trust system to one honest window into what's happening and when it'll be fixed.",
      'Framework: Empathize → Define → Ideate → Prototype → Test',
      'Team: Akshita Nagar · Ayush Sachan · K. Naga Maheswara Reddy · Lakshita Rathore · Sanskriti Vadher',
      'Course: Design Thinking | Submitted to Mr. Venki Mahadevan'
    ],
    content: `DESIGN THINKING · CAMPUS SERVICES
Reimagining the HSB Student Experience
A design thinking approach to campus services — from a fragmented, low-trust system to one honest window into what's happening and when it'll be fixed.
Framework: Empathize → Define → Ideate → Prototype → Test
Course: Design Thinking | Submitted to Mr. Venki Mahadevan`,
  },
  {
    slideNumber: 2,
    title: 'THE HOOK - Four scores tell the story',
    paragraphs: [
      'THE HOOK: Four scores tell the story',
      '• Wi-Fi Satisfaction: 3.00 / 5',
      '• Marks Transparency: 2.74 / 5',
      '• Hostel Infrastructure: 2.71 / 5',
      '• Mess / Cafeteria Timing: 2.62 / 5',
      "All four sit below HSB's own 3.68 / 5 campus average — and every one of them is fixable, not fundamental.",
      '“22 students told us why. One word kept coming back: trust.”'
    ],
    content: `THE HOOK: Four scores tell the story
• Wi-Fi: 3.00 / 5
• Marks Transparency: 2.74 / 5
• Hostel Info: 2.71 / 5
• Mess Timing: 2.62 / 5
All four sit below HSB's own 3.68 / 5 average.
22 students told us why: One word kept coming back: TRUST.`,
  },
  {
    slideNumber: 3,
    title: 'THE CORE INSIGHT - Grounded in Evidence',
    paragraphs: [
      'THE CORE INSIGHT',
      "We didn't set out to fix Wi-Fi. We set out to understand why students stopped believing what HSB told them.",
      'WHAT WE FOUND:',
      "It's not one broken service — it's a fragmented, low-transparency system.",
      'OUR CHALLENGE:',
      'How might we enhance the overall HSB student experience — grounded in evidence, not assumption?'
    ],
    content: `THE CORE INSIGHT
We didn't set out to fix Wi-Fi. We set out to understand why students stopped believing what HSB told them.
WHAT WE FOUND: It's not one broken service — it's a fragmented, low-transparency system.
OUR CHALLENGE: How might we enhance the overall HSB student experience — grounded in evidence, not assumption?`,
  },
  {
    slideNumber: 4,
    title: 'PROBLEM STATEMENT - The pain point, quantified',
    paragraphs: [
      'PROBLEM STATEMENT: The pain point, quantified',
      'Research Methodology: 22 semi-structured interviews · 18-question guide · first- and second-year MBA students',
      'High performers: Library (3.93/5), Admissions (3.67/5) vs HSB Campus Average (3.68/5)',
      'Underperformers: Wi-Fi (3.00), Marks Transparency (2.74), Hostel Info (2.71), Mess/Cafeteria (2.62)',
      'Synthesis: Library and Admissions are strong — this isn’t a college in crisis. But Wi-Fi, Marks, Hostel, and Mess cluster in the weak zone: operational reliability, not strategy.'
    ],
    content: `PROBLEM STATEMENT: The pain point, quantified
22 semi-structured interviews · 18-question guide · MBA students
Library: 3.93 | Admissions: 3.67 | HSB Average: 3.68
Wi-Fi: 3.00 | Marks Transparency: 2.74 | Hostel Info: 2.71 | Mess: 2.62
Operational reliability issue, not an institutional crisis.`,
  },
  {
    slideNumber: 5,
    title: 'THE ROOT CAUSE - Master Problem Statement',
    paragraphs: [
      'THE ROOT CAUSE: Master Problem Statement',
      'HSB students struggle to access services and resolve issues because communication, requests, and feedback are fragmented and lack transparency — causing delays, uncertainty, and eroded trust.',
      'Key Diagnosis: Not a Wi-Fi problem. Not a marks problem. A visibility problem.'
    ],
    content: `THE ROOT CAUSE: Master Problem Statement
HSB students struggle to access services and resolve issues because communication, requests, and feedback are fragmented and lack transparency — causing delays, uncertainty, and eroded trust.
Not a Wi-Fi problem. Not a marks problem. A visibility problem.`,
  },
  {
    slideNumber: 6,
    title: 'THE SOLUTION - Introducing HSB Connect',
    paragraphs: [
      'THE SOLUTION: Introducing HSB Connect',
      'One platform. One login. Every service request — Wi-Fi, Hostel, IT, Library, Cafeteria — in one place.',
      'BORN FROM CONVERGENCE: Across every ideation theme, the same idea kept resurfacing — a shared layer for raising, routing, and tracking issues.',
      'DFV SCREEN: Screened for Desirability, Feasibility, and Viability — the only concept to score High on all three.',
      '• Desirability: HIGH (students desperately crave visibility)',
      '• Feasibility: HIGH (uses existing ticketing/database backends)',
      '• Viability: HIGH (low cost to pilot, high retention payoff)'
    ],
    content: `THE SOLUTION: Introducing HSB Connect
One platform. One login. Every service request — Wi-Fi, Hostel, IT, Library, Cafeteria — in one place.
DFV SCREEN: The only concept to score High on all three:
• Desirability: HIGH
• Feasibility: HIGH
• Viability: HIGH`,
  },
  {
    slideNumber: 7,
    title: 'HOW IT WORKS - From raised to resolved, visibly',
    paragraphs: [
      'HOW IT WORKS: From raised to resolved — visibly',
      '01. Raise: Raise a ticket in seconds — text or Voice-Assisted, in English or Hindi.',
      '02. Track: Track it against a live SLA countdown — no more wondering who’s handling it.',
      '03. Resolve: Resolve with a named owner and a notification — not silence.',
      '04. Close the Loop: Feedback & Ideas loop closes visibly: “you said, we did,” not a suggestion box that disappears.'
    ],
    content: `HOW IT WORKS: From raised to resolved — visibly
01. Raise: Raise a ticket in seconds (text or voice, English or Hindi)
02. Track: Track against a live SLA countdown
03. Resolve: Resolve with a named owner & notification
04. Close the Loop: Visible feedback ("you said, we did")`,
  },
  {
    slideNumber: 8,
    title: 'MARKET VALIDATION - Tested with real users',
    paragraphs: [
      'MARKET VALIDATION: Tested with real users',
      'Usability setup: 6 students · think-aloud usability sessions · live interactive prototype',
      '• 6/6 Raised a ticket unaided',
      '• 6/6 Tracked a ticket successfully',
      '• 4.3 / 5 Average user satisfaction score',
      'User Quote: “Seeing the hours left makes it feel like someone is actually responsible.”',
      'Iterative improvements: clearer tiles, a voice-review step, reordered categories by real ticket volume.'
    ],
    content: `MARKET VALIDATION: Tested with real users
6 students · think-aloud usability sessions · live prototype
• 6/6 Raised a ticket unaided
• 6/6 Tracked a ticket
• 4.3 / 5 Average satisfaction
“Seeing the hours left makes it feel like someone is actually responsible.”`,
  },
  {
    slideNumber: 9,
    title: 'THE ASK - One honest window in',
    paragraphs: [
      'THE ASK: One honest window in',
      "We're not asking HSB to rebuild everything — just to give students one honest window into what's happening and when it'll be fixed.",
      '1. A pilot cohort: One hostel block to start, real tickets, real students.',
      '2. IT Department buy-in: The owner on the other end of the SLA countdown.',
      '3. One term to re-measure: Re-run the baseline survey and show the delta.',
      "“We're not just closing tickets — we're rebuilding trust, one visible answer at a time.”"
    ],
    content: `THE ASK: One honest window in
1. A pilot cohort: One hostel block to start, real tickets, real students.
2. IT Department buy-in: The owner on the other end of the SLA countdown.
3. One term to re-measure: Re-run baseline survey and show delta.
Rebuilding trust, one visible answer at a time.`,
  },
  {
    slideNumber: 10,
    title: 'Conclusion - Questions & Discussion',
    paragraphs: [
      'Conclusion & Next Steps',
      'Thank you for your time.',
      'Questions, feedback, and discussion with faculty and peer review.'
    ],
    content: `Conclusion & Discussion
Design Thinking Capstone Presentation
Open for Questions & Panel Discussion.`,
  },
];

export const microeconomicsSlides: SlideData[] = [
  {
    slideNumber: 1,
    title: 'Session 1: Introduction to Microeconomics — Foundations & Scarcity',
    paragraphs: [
      'Course: Managerial Microeconomics | Academic Term 2',
      'Core Theme: How individuals, households, and business firms allocate scarce resources to maximize utility and profit.',
      'Fundamental Reality: Unlimited human wants vs. finite, scarce productive resources (Land, Labor, Capital, Entrepreneurship).',
      'The Central Economic Problem: What to produce, How to produce, and For whom to produce.'
    ],
    content: `Course: Managerial Microeconomics | Academic Term 2
Core Theme: How individuals, households, and business firms allocate scarce resources to maximize utility and profit.
Fundamental Reality: Unlimited human wants vs. finite, scarce productive resources (Land, Labor, Capital, Entrepreneurship).
The Central Economic Problem: What to produce, How to produce, and For whom to produce.`
  },
  {
    slideNumber: 2,
    title: 'Opportunity Cost & Marginal Decision Making',
    paragraphs: [
      'Definition: Opportunity cost is the value of the next best alternative forgone when a choice is made.',
      'Key Distinction: Explicit accounting costs (out-of-pocket expenses) vs. Implicit opportunity costs (foregone salary, interest on capital).',
      'Marginal Analysis Rule: Rational agents take an action if and only if Marginal Benefit (MB) >= Marginal Cost (MC).',
      'Sunk Cost Fallacy: Costs that have already been incurred and cannot be recovered must NOT influence future marginal decisions.'
    ],
    content: `Definition: Opportunity cost is the value of the next best alternative forgone when a choice is made.
Key Distinction: Explicit accounting costs (out-of-pocket expenses) vs. Implicit opportunity costs (foregone salary, interest on capital).
Marginal Analysis Rule: Rational agents take an action if and only if Marginal Benefit (MB) >= Marginal Cost (MC).
Sunk Cost Fallacy: Costs that have already been incurred and cannot be recovered must NOT influence future marginal decisions.`
  },
  {
    slideNumber: 3,
    title: 'The Production Possibility Frontier (PPF)',
    paragraphs: [
      'Concept: The PPF model illustrates the maximum combination of two goods an economy or firm can produce given fixed technology and resources.',
      'Points on the Frontier: Productively efficient points — full utilization of existing resources.',
      'Points Inside the Frontier: Inefficient production — unemployment or underutilization of productive assets.',
      'Points Outside the Frontier: Currently unattainable given current resources and technology (achievable only through economic growth or innovation).',
      'Shape of the Curve: Concave (bowed out) to origin due to the Law of Increasing Opportunity Cost (resources are not equally adaptable to all goods).'
    ],
    content: `Concept: The PPF model illustrates the maximum combination of two goods an economy or firm can produce given fixed technology and resources.
Points on the Frontier: Productively efficient points — full utilization of existing resources.
Points Inside the Frontier: Inefficient production — unemployment or underutilization of productive assets.
Points Outside the Frontier: Currently unattainable given current resources and technology.
Shape of the Curve: Concave (bowed out) to origin due to the Law of Increasing Opportunity Cost.`
  },
  {
    slideNumber: 4,
    title: 'Microeconomics vs. Macroeconomics & Methodology',
    paragraphs: [
      'Microeconomics: Studies behavior of individual decision-making entities — households, workers, specific firms, and competitive industry markets.',
      'Macroeconomics: Studies aggregate economy-wide phenomena — national GDP growth, inflation, general price levels, and aggregate unemployment.',
      'Positive Economics: Objective, testable, factual statements of "what is" or cause-and-effect relationships.',
      'Normative Economics: Value-based, subjective statements of "what ought to be" (e.g. policy recommendations).'
    ],
    content: `Microeconomics: Studies behavior of individual decision-making entities — households, workers, specific firms, and competitive industry markets.
Macroeconomics: Studies aggregate economy-wide phenomena — national GDP growth, inflation, general price levels, and aggregate unemployment.
Positive Economics: Objective, testable, factual statements of "what is" or cause-and-effect relationships.
Normative Economics: Value-based, subjective statements of "what ought to be".`
  },
  {
    slideNumber: 5,
    title: 'Market Mechanisms, Prices & The Invisible Hand',
    paragraphs: [
      'Adam Smith’s Invisible Hand: In competitive free markets, self-interested individual choices coordinate through price signals to allocate resources efficiently.',
      'Role of Market Prices: Ration scarce goods, provide incentives to producers and consumers, and signal changing market conditions.',
      'Ceteris Paribus Assumption: "All other things being equal" — isolating the effect of changing one variable while holding all other external determinants constant.',
      'Circular Flow Model: Interdependent exchange of goods, services, and factors of production between households and firms.'
    ],
    content: `Adam Smith’s Invisible Hand: In competitive free markets, self-interested individual choices coordinate through price signals to allocate resources efficiently.
Role of Market Prices: Ration scarce goods, provide incentives to producers and consumers, and signal changing market conditions.
Ceteris Paribus Assumption: "All other things being equal" — isolating the effect of changing one variable.
Circular Flow Model: Interdependent exchange of goods, services, and factors of production.`
  }
];

export const microeconomicsStudyContent = `# Session 1: Introduction to Microeconomics (Detailed Study Guide)

## 1. The Core Economic Problem: Scarcity & Choice
Economics is the study of how society allocates its scarce productive resources to satisfy unlimited human needs and desires.
- **Scarcity** exists because productive resources (land, physical capital, skilled labor, entrepreneurship) are finite while human wants are infinite.
- Because of scarcity, every society must resolve three foundational allocation problems:
  1. *What* goods and services to produce and in what quantities?
  2. *How* to produce them (capital-intensive vs. labor-intensive production methods)?
  3. *For whom* are they produced (income distribution and market purchasing power)?

---

## 2. Opportunity Cost & Marginal Decision Principle
- **Opportunity Cost**: The highest-valued alternative sacrificed when making a choice.
- **Explicit Costs**: Monetary expenditures paid out-of-pocket (e.g., college tuition, raw material purchases).
- **Implicit Costs**: Non-monetary opportunity costs of using resources the firm or individual already owns (e.g., foregone salary, foregone rental income).
- **Marginal Principle**: Rational economic agents make decisions "at the margin."
  - Decision Rule: An action is taken if and only if **Marginal Benefit (MB) >= Marginal Cost (MC)**.
  - Sunk Costs: Historical costs that have already been incurred and cannot be refunded. **Sunk costs are irrelevant to rational forward-looking decisions.**

---

## 3. The Production Possibility Frontier (PPF) Model
The PPF is a graphical model showing the maximum combinations of two outputs that can be produced using available inputs and technology efficiently.
- **On the Frontier**: Productive efficiency is achieved; you cannot produce more of good A without sacrificing some of good B.
- **Inside the Frontier**: Inefficiency, idle capacity, or unemployment.
- **Outside the Frontier**: Unattainable with current technological capabilities and resource stocks.
- **Law of Increasing Opportunity Cost**: As more of one good is produced, its opportunity cost increases because productive resources are specialized and not equally adaptable across different production tasks.

---

## 4. Microeconomics vs. Macroeconomics
- **Microeconomics**: Focuses on bottom-up interactions of individual consumers, workers, individual markets, price elasticities, and firm cost structures.
- **Macroeconomics**: Focuses on top-down aggregate phenomena including gross domestic product (GDP), economy-wide price inflation, central bank monetary policy, and national unemployment rates.

---

## 5. Positive vs. Normative Analysis
- **Positive Economics**: Descriptive, evidence-based, testable statements describing cause-and-effect relationships ("A 10% tax on sugar-sweetened beverages reduces sales by 14%").
- **Normative Economics**: Prescriptive, opinion-based, subjective statements that prescribe what policy choices *should* or *ought* to be adopted based on moral or political values.`;

export const initialFolders: Folder[] = [
  // First Term
  {
    id: 'folder-t1-qm',
    name: 'Quantitative Methods',
    termId: 'term-1',
    parentId: null,
    color: '#3B82F6', // Blue
    createdAt: '2026-08-01T09:00:00Z',
    description: 'Statistical distributions, hypothesis testing and regression modeling',
  },
  {
    id: 'folder-t1-qm-slides',
    name: 'Lecture Slides & Handouts',
    termId: 'term-1',
    parentId: 'folder-t1-qm',
    color: '#60A5FA',
    createdAt: '2026-08-05T10:00:00Z',
  },
  {
    id: 'folder-t1-mkt',
    name: 'Marketing Management',
    termId: 'term-1',
    parentId: null,
    color: '#EC4899', // Pink
    createdAt: '2026-08-02T11:00:00Z',
  },

  // Second Term (Current Term)
  {
    id: 'folder-t2-pm2',
    name: 'PM2 - Product Management 2',
    termId: 'term-2',
    parentId: null,
    color: '#10B981', // Emerald
    createdAt: '2026-10-01T09:00:00Z',
    description: 'Continuous product discovery, metrics frameworks and sprint delivery',
  },
  {
    id: 'folder-t2-pm2-sprints',
    name: 'Sprint Presentations',
    termId: 'term-2',
    parentId: 'folder-t2-pm2',
    color: '#34D399',
    createdAt: '2026-10-05T14:00:00Z',
    description: 'Capstone team pitch decks and slide reviews',
  },
  {
    id: 'folder-t2-pm2-discovery',
    name: 'Continuous Discovery & Frameworks',
    termId: 'term-2',
    parentId: 'folder-t2-pm2',
    color: '#059669',
    createdAt: '2026-10-06T15:30:00Z',
  },
  {
    id: 'folder-t2-dt',
    name: 'Design Thinking (DT-101)',
    termId: 'term-2',
    parentId: null,
    color: '#E11D48', // Rose
    createdAt: '2026-10-02T10:00:00Z',
    description: 'Empathize, Define, Ideate, Prototype, Test methodology',
  },
  {
    id: 'folder-t2-dt-campus',
    name: 'Campus Services Reimagined',
    termId: 'term-2',
    parentId: 'folder-t2-dt',
    color: '#F43F5E',
    createdAt: '2026-10-10T12:00:00Z',
  },

  // Third Term
  {
    id: 'folder-t3-hci',
    name: 'Human-Computer Interaction (HCI-310)',
    termId: 'term-3',
    parentId: null,
    color: '#6366F1', // Indigo
    createdAt: '2026-11-01T09:00:00Z',
  },
  {
    id: 'folder-t3-heuristics',
    name: 'Usability Heuristics & Audit',
    termId: 'term-3',
    parentId: 'folder-t3-hci',
    color: '#818CF8',
    createdAt: '2026-11-02T10:00:00Z',
  },

  // Fourth Term
  {
    id: 'folder-t4-bpe',
    name: 'Business Processes & Economics',
    termId: 'term-4',
    parentId: null,
    color: '#F59E0B', // Amber
    createdAt: '2026-11-03T11:00:00Z',
  },
  {
    id: 'folder-t4-financial',
    name: 'Financial Modeling & Workbooks',
    termId: 'term-4',
    parentId: 'folder-t4-bpe',
    color: '#FBBF24',
    createdAt: '2026-11-04T12:00:00Z',
  },

  // Fifth Term
  {
    id: 'folder-t5-lead',
    name: 'Strategic Leadership & Enterprise Architecture',
    termId: 'term-5',
    parentId: null,
    color: '#8B5CF6', // Purple
    createdAt: '2026-11-05T13:00:00Z',
  },

  // Sixth Term
  {
    id: 'folder-t6-cap',
    name: 'Capstone Project & Defense',
    termId: 'term-6',
    parentId: null,
    color: '#06B6D4', // Cyan
    createdAt: '2026-11-06T14:00:00Z',
  },
  {
    id: 'folder-t6-thesis',
    name: 'Master Defense & Final Deliverables',
    termId: 'term-6',
    parentId: 'folder-t6-cap',
    color: '#22D3EE',
    createdAt: '2026-11-07T15:00:00Z',
  },
];

export const initialResources: Resource[] = [
  {
    id: 'res-microeconomics-pdf',
    subjectId: 'sub-dt101',
    termId: 'term-2',
    folderId: 'folder-t2-dt',
    name: 'Session1_Introduction_to_Microeconomics_Detailed.pdf',
    size: 328574,
    type: 'pdf',
    status: 'ready',
    uploadedAt: '2026-11-14T20:13:00Z',
    tags: ['microeconomics', 'scarcity', 'opportunity-cost', 'ppf', 'core-reading'],
    content: microeconomicsStudyContent,
    slides: microeconomicsSlides,
    slideCount: 5,
    downloadUrl: '/Session1_Introduction_to_Microeconomics_Detailed.pdf',
    canPreview: true,
  },
  {
    id: 'res-dt-presentation',
    subjectId: 'sub-dt101',
    termId: 'term-2',
    folderId: 'folder-t2-pm2-sprints',
    name: 'DT_Group_Presentation_7min.pptx',
    size: 44092,
    type: 'pptx',
    status: 'ready',
    uploadedAt: '2026-11-14T12:00:00Z',
    tags: ['design-thinking', 'hsb-connect', 'campus-services', 'primary-resource'],
    content: extractedDtSlides.map(s => `[Slide ${s.slideNumber}: ${s.title}]\n${s.content}`).join('\n\n'),
    slides: extractedDtSlides,
    slideCount: 10,
    downloadUrl: '/DT_Group_Presentation_7min.pptx',
    canPreview: true,
  },
  {
    id: 'res-pm-01',
    subjectId: 'sub-pm202',
    termId: 'term-2',
    folderId: 'folder-t2-pm2-discovery',
    name: 'PM2_Sprint_Discovery_Framework.md',
    size: 24500,
    type: 'markdown',
    status: 'ready',
    uploadedAt: '2026-11-10T14:20:00Z',
    tags: ['frameworks', 'discovery', 'sprint'],
    content: `# Continuous Product Discovery Framework\n\n## 1. Problem Space vs Solution Space\nProduct teams frequently make the mistake of jumping directly into wireframing solutions without rigorously mapping the customer's latent struggle.\n\n### The Opportunity Solution Tree\n1. Desired Outcome\n2. Opportunities\n3. Solutions\n4. Assumption Tests`,
    slideCount: 1,
    canPreview: true,
  },
  {
    id: 'res-dt-summary-doc',
    subjectId: 'sub-dt101',
    termId: 'term-2',
    folderId: 'folder-t2-dt-campus',
    name: 'HSB_Connect_Executive_Summary.docx',
    size: 38200,
    type: 'docx',
    status: 'ready',
    uploadedAt: '2026-11-12T16:45:00Z',
    tags: ['executive-summary', 'design-thinking'],
    content: `HSB CONNECT: EXECUTIVE SUMMARY\n\nA unified portal designed to resolve campus service fragmentation. Key elements include:\n- Live SLA Countdowns for Wi-Fi and hostel maintenance\n- Bilingual Voice-Assisted ticket logging (English & Hindi)\n- Transparent accountability loops ("You said, We did")\n- 4.3/5 satisfaction rating during initial 6-student prototype usability tests.`,
    slideCount: 1,
    canPreview: true,
  },
  {
    id: 'res-excel-sample',
    subjectId: 'sub-pm202',
    termId: 'term-2',
    folderId: 'folder-t2-pm2',
    name: 'Campus_Services_Budget_Model.xlsx',
    size: 154200,
    type: 'spreadsheet',
    status: 'ready',
    uploadedAt: '2026-11-13T10:15:00Z',
    tags: ['budget', 'financial-model', 'excel', 'download-only'],
    content: `[Campus_Services_Budget_Model.xlsx - Multi-tab workbook with 5-year SLA financial cost projections and return on investment scenarios. In-app preview unavailable; download original file to open in Microsoft Excel.]`,
    canPreview: false,
    previewUnavailableReason: 'Spreadsheet workbooks (.xlsx) contain binary calculation sheets, cell formulas, and pivot charts that require Microsoft Excel or desktop spreadsheet tools. Web browsers cannot execute this proprietary format safely in real time.',
  },
];

export const initialNotes: Note[] = [
  {
    id: 'note-dt-01',
    subjectId: 'sub-dt101',
    resourceId: 'res-dt-presentation',
    title: 'Design Thinking: Campus Services Synthesis',
    content: `## Key Insights from Slide Deck\n- The issue at HSB is NOT broken Wi-Fi per se; it is the opacity of the resolution process.\n- Four scores tell the story: Wi-Fi (3.00), Marks (2.74), Hostel (2.71), Mess (2.62).\n- DFV Screen: HSB Connect scored HIGH across Desirability, Feasibility, and Viability.\n- SLA Countdown: Seeing the hours remaining restored feeling of accountability.`,
    tags: ['synthesis', 'design-thinking', 'hsb-connect'],
    createdAt: '2026-11-14T13:00:00Z',
    updatedAt: '2026-11-14T13:30:00Z',
    isPinned: true,
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    subjectId: 'sub-dt101',
    title: 'Review Slide 6 (DFV Screen) & Practice Quiz',
    dueDate: '2026-11-16',
    estimatedMinutes: 25,
    priority: 'high',
    completed: false,
    notes: 'Focus on why HSB Connect scored High across Desirability, Feasibility, and Viability.',
  },
  {
    id: 'task-2',
    subjectId: 'sub-dt101',
    title: 'Take 10-Minute Timed Test on Campus Services Deck',
    dueDate: '2026-11-17',
    estimatedMinutes: 15,
    priority: 'medium',
    completed: true,
    completedAt: '2026-11-14T14:10:00Z',
  },
  {
    id: 'task-3',
    subjectId: 'sub-pm202',
    title: 'Review Teresa Torres Opportunity Solution Tree',
    dueDate: '2026-11-18',
    estimatedMinutes: 30,
    priority: 'low',
    completed: false,
  },
];

export const initialDecks: FlashcardDeck[] = [
  {
    id: 'deck-dt-core',
    subjectId: 'sub-dt101',
    title: 'Design Thinking & Campus Services Mastery',
    description: 'Extracted key terms, frameworks, and metrics from DT_Group_Presentation_7min.pptx',
    sourceResourceId: 'res-dt-presentation',
    createdAt: '2026-11-14T12:30:00Z',
    cards: [
      {
        id: 'c1',
        front: 'What are the 5 stages of the Design Thinking framework used in the presentation?',
        back: 'Empathize → Define → Ideate → Prototype → Test',
        difficulty: 'good',
        reviewsCount: 3,
        lastReviewed: '2026-11-14T14:00:00Z',
        topic: 'Design Thinking Process',
        sourceSlideNumber: 1,
      },
      {
        id: 'c2',
        front: 'What is the "Core Insight" discovered about student dissatisfaction?',
        back: 'Students don\'t hate that things break; they hate not knowing if anyone is fixing it. It is a low-transparency visibility problem, not just broken equipment.',
        difficulty: 'easy',
        reviewsCount: 4,
        lastReviewed: '2026-11-14T14:05:00Z',
        topic: 'Problem Diagnosis',
        sourceSlideNumber: 3,
      },
      {
        id: 'c3',
        front: 'What are the 3 criteria of the DFV screen used to evaluate HSB Connect?',
        back: 'Desirability (do students want it?), Feasibility (can IT build/run it?), and Viability (does it sustain low operational cost and rebuild trust?).',
        difficulty: 'hard',
        reviewsCount: 2,
        lastReviewed: '2026-11-14T14:12:00Z',
        topic: 'DFV Framework',
        sourceSlideNumber: 6,
      },
      {
        id: 'c4',
        front: 'What are the 4 sequential steps in the HSB Connect workflow (Slide 7)?',
        back: '01. Raise (text/voice ticket in seconds) → 02. Track (live SLA countdown) → 03. Resolve (named owner notification) → 04. Close the Loop ("you said, we did").',
        difficulty: 'good',
        reviewsCount: 3,
        lastReviewed: '2026-11-14T14:15:00Z',
        topic: 'SLA & Workflow',
        sourceSlideNumber: 7,
      },
      {
        id: 'c5',
        front: 'What was the average satisfaction score in the 6-student prototype usability test?',
        back: '4.3 / 5 satisfaction score, with 6/6 students raising tickets unaided and 6/6 tracking tickets.',
        difficulty: 'again',
        reviewsCount: 1,
        lastReviewed: '2026-11-14T14:20:00Z',
        topic: 'Market Validation',
        sourceSlideNumber: 8,
      },
      {
        id: 'c6',
        front: 'What are the four services scoring below HSB’s 3.68 campus average?',
        back: 'Wi-Fi (3.00), Marks Transparency (2.74), Hostel Info (2.71), and Mess / Cafeteria Timing (2.62).',
        difficulty: 'hard',
        reviewsCount: 2,
        lastReviewed: '2026-11-14T14:22:00Z',
        topic: 'Campus Metrics',
        sourceSlideNumber: 2,
      },
    ],
  },
];

export const initialQuizzes: SelfQuiz[] = [
  {
    id: 'quiz-dt-presentation',
    subjectId: 'sub-dt101',
    resourceId: 'res-dt-presentation',
    title: 'Design Thinking: HSB Campus Services Assessment',
    description: 'Comprehensive assessment drafted from DT_Group_Presentation_7min.pptx slides 1–10.',
    createdAt: '2026-11-14T12:45:00Z',
    bestScore: 88,
    lastAttemptDate: '2026-11-14T14:35:00Z',
    attemptsCount: 2,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'According to Slide 5, what is the fundamental diagnosis / root cause of student frustration at HSB?',
        options: [
          'A visibility and transparency problem across fragmented communication channels',
          'A shortage of qualified IT professors in the engineering department',
          'Insufficient state government funding for the campus library',
          'Lack of student attendance in student union governance meetings',
        ],
        correctAnswerIndex: 0,
        explanation: 'Slide 5 explicitly diagnoses: "Not a Wi-Fi problem. Not a marks problem. A visibility problem — requests and feedback are fragmented and lack transparency."',
        topic: 'Problem Diagnosis',
        sourceSlideNumber: 5,
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'In the DFV screen evaluated on Slide 6, how did the "HSB Connect" concept perform?',
        options: [
          'It was the only concept to score HIGH across Desirability, Feasibility, and Viability',
          'It scored High on Desirability but Low on Feasibility due to server costs',
          'It was rejected in favor of an external commercial ticketing vendor',
          'It was deemed viable only after a 5-year campus-wide infrastructure overhaul',
        ],
        correctAnswerIndex: 0,
        explanation: 'Slide 6 shows the DFV Screen: Desirability: HIGH, Feasibility: HIGH, Viability: HIGH — the only concept to score High on all three.',
        topic: 'DFV Framework',
        sourceSlideNumber: 6,
      },
      {
        id: 'q3',
        type: 'true_false',
        question: 'True or False: According to Slide 4, the Library (3.93) and Admissions (3.67) services scored above or near the HSB average, indicating the campus is not in a structural crisis.',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: 'True. The deck notes: "Library and Admissions are strong — this isn’t a college in crisis. Wi-Fi, Marks, Hostel, and Mess cluster in the weak operational zone."',
        topic: 'Campus Metrics',
        sourceSlideNumber: 4,
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'What is the correct 4-step workflow sequence introduced in Slide 7 ("From raised to resolved")?',
        options: [
          '01. Raise → 02. Track → 03. Resolve → 04. Close the Loop',
          '01. Submit → 02. Approve → 03. Budget → 04. Purchase',
          '01. Complain → 02. Escalate → 03. Audit → 04. Discard',
          '01. Phone Call → 02. Paper Form → 03. Waiting Period → 04. Survey',
        ],
        correctAnswerIndex: 0,
        explanation: 'Slide 7 details: 01. Raise (text/voice in seconds) → 02. Track (live SLA countdown) → 03. Resolve (named owner notification) → 04. Close the Loop ("you said, we did").',
        topic: 'SLA & Workflow',
        sourceSlideNumber: 7,
      },
      {
        id: 'q5',
        type: 'true_false',
        question: 'True or False: In user testing (Slide 8), only 3 out of 6 students were able to raise a ticket unaided.',
        options: ['True', 'False'],
        correctAnswerIndex: 1,
        explanation: 'False. 6/6 (100%) of the students raised a ticket unaided, and 6/6 tracked a ticket successfully with an average satisfaction rating of 4.3/5.',
        topic: 'Market Validation',
        sourceSlideNumber: 8,
      },
      {
        id: 'q6',
        type: 'multiple_choice',
        question: 'What is "The Ask" outlined on Slide 9 to start the HSB Connect rollout?',
        options: [
          'A pilot cohort in one hostel block with IT Department buy-in and one term to re-measure',
          'A mandatory fee increase for all enrolled MBA students',
          'A full replacement of all hostel Wi-Fi routers within 48 hours',
          'A third-party outsourcing contract for campus food catering',
        ],
        correctAnswerIndex: 0,
        explanation: 'Slide 9 proposes: 1. A pilot cohort in one hostel block, 2. IT department buy-in on the SLA countdown, 3. One term to re-measure baseline survey delta.',
        topic: 'Pilot Implementation',
        sourceSlideNumber: 9,
      },
      {
        id: 'q7',
        type: 'true_false',
        question: 'True or False: The HSB Connect proposal supports bilingual ticket raising in both English and Hindi.',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: 'True. Slide 7 explicitly specifies: "Raise a ticket in seconds — text or Voice-Assisted, in English or Hindi."',
        topic: 'SLA & Workflow',
        sourceSlideNumber: 7,
      },
      {
        id: 'q8',
        type: 'multiple_choice',
        question: 'On Slide 2, what student satisfaction score did Wi-Fi receive, and what was the college campus average benchmark?',
        options: [
          'Wi-Fi: 3.00 / 5 (Campus benchmark: 3.68 / 5)',
          'Wi-Fi: 4.10 / 5 (Campus benchmark: 4.50 / 5)',
          'Wi-Fi: 1.50 / 5 (Campus benchmark: 2.50 / 5)',
          'Wi-Fi: 3.80 / 5 (Campus benchmark: 3.00 / 5)',
        ],
        correctAnswerIndex: 0,
        explanation: 'Slide 2 records Wi-Fi at 3.00/5, Marks at 2.74/5, Hostel at 2.71/5, Mess at 2.62/5, all below the HSB 3.68/5 campus average.',
        topic: 'Campus Metrics',
        sourceSlideNumber: 2,
      },
    ],
  },
];

export const initialActivities: StudyActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '2026-11-14T14:35:00Z',
    type: 'timed_test',
    subjectId: 'sub-dt101',
    description: 'Completed Timed Test: "Design Thinking: HSB Campus Services Assessment"',
    minutesSpent: 8,
    scorePercentage: 88,
  },
  {
    id: 'act-2',
    timestamp: '2026-11-14T14:15:00Z',
    type: 'card_reviewed',
    subjectId: 'sub-dt101',
    description: 'Mastered 6 flashcards in "Design Thinking & Campus Services Mastery"',
    minutesSpent: 12,
  },
  {
    id: 'act-3',
    timestamp: '2026-11-14T12:00:00Z',
    type: 'file_uploaded',
    subjectId: 'sub-dt101',
    description: 'Imported study resource: DT_Group_Presentation_7min.pptx (10 slides extracted)',
  },
  {
    id: 'act-4',
    timestamp: '2026-11-13T16:30:00Z',
    type: 'focus_session',
    subjectId: 'sub-pm202',
    description: 'Focused study session on Opportunity Solution Trees',
    minutesSpent: 45,
  },
];

export const initialVideos: VideoResource[] = [
  {
    id: 'vid-dt-01',
    subjectId: 'sub-dt101',
    title: 'The Design Thinking Process (Stanford d.school Overview)',
    url: 'https://www.youtube.com/watch?v=a7sEoEvT8l8',
    youtubeId: 'a7sEoEvT8l8',
    description: 'Visual breakdown of the 5 key phases: Empathize, Define, Ideate, Prototype, and Test.',
    tags: ['design-thinking', 'stanford', 'methodology'],
    addedAt: '2026-11-14T12:10:00Z',
  },
  {
    id: 'vid-pm-02',
    subjectId: 'sub-pm202',
    title: 'Continuous Discovery Habits & Opportunity Solution Trees',
    url: 'https://www.youtube.com/watch?v=kY0wU3qEaH4',
    youtubeId: 'kY0wU3qEaH4',
    description: 'Teresa Torres explains how product managers map customer struggles to measurable outcomes.',
    tags: ['product-management', 'discovery', 'frameworks'],
    addedAt: '2026-11-13T15:00:00Z',
  },
  {
    id: 'vid-hci-03',
    subjectId: 'sub-hci310',
    title: '10 Usability Heuristics for User Interface Design',
    url: 'https://www.youtube.com/watch?v=cTlhYkyB2hI',
    youtubeId: 'cTlhYkyB2hI',
    description: 'Jakob Nielsen’s 10 general principles for interaction design and usability heuristics.',
    tags: ['hci', 'usability', 'heuristics'],
    addedAt: '2026-11-12T11:30:00Z',
  },
];
