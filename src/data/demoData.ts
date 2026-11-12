import { Subject, Resource, Note, Task, FlashcardDeck, SelfQuiz, StudentProfile, StudyActivityLog } from '../types';

export const initialProfile: StudentProfile = {
  name: 'Ayush',
  email: 'ayush@university.edu',
  major: 'B.Sc. Cognitive Science & Product Management',
  academicTerm: 'Term 2 (Spring 2027)',
  weeklyTargetHours: 16,
  currentWeeklyHours: 9.5,
  theme: 'warm',
  isDemoMode: true,
};

export const initialSubjects: Subject[] = [
  {
    id: 'sub-pm202',
    name: 'Product Management 2',
    code: 'PM-202',
    color: '#2E7D5B', // Sage green
    icon: 'Target',
    description: 'Product discovery, metrics frameworks (AARRR, HEART), agile sprints, and capstone PRD synthesis.',
    targetHoursPerWeek: 5,
    completedHoursThisWeek: 3.5,
    createdAt: '2027-01-10T09:00:00Z',
  },
  {
    id: 'sub-cog101',
    name: 'Cognitive Psychology',
    code: 'COG-101',
    color: '#D35D38', // Terracotta
    icon: 'Brain',
    description: 'Working memory capacity, dual-process cognition, heuristics, and perceptual chunking.',
    targetHoursPerWeek: 4,
    completedHoursThisWeek: 2.5,
    createdAt: '2027-01-11T10:00:00Z',
  },
  {
    id: 'sub-hci310',
    name: 'Human-Computer Interaction',
    code: 'HCI-310',
    color: '#4F5BD5', // Indigo
    icon: 'Laptop',
    description: 'User-centered design heuristics, Fitts’s Law, cognitive walkthroughs, and accessibility compliance (WCAG 2.2).',
    targetHoursPerWeek: 4,
    completedHoursThisWeek: 2.0,
    createdAt: '2027-01-12T14:30:00Z',
  },
  {
    id: 'sub-env215',
    name: 'Environmental Economics',
    code: 'ENV-215',
    color: '#0D9488', // Teal
    icon: 'Leaf',
    description: 'Pigouvian taxation, carbon cap-and-trade mechanisms, public goods, and tragedy of the commons.',
    targetHoursPerWeek: 3,
    completedHoursThisWeek: 1.5,
    createdAt: '2027-01-14T11:15:00Z',
  },
];

export const initialResources: Resource[] = [
  {
    id: 'res-pm-01',
    subjectId: 'sub-pm202',
    name: 'PM2_Sprint_Discovery_Framework.md',
    size: 24500,
    type: 'markdown',
    status: 'ready',
    uploadedAt: '2027-02-18T14:20:00Z',
    tags: ['frameworks', 'discovery', 'sprint'],
    content: `# Continuous Product Discovery Framework

## 1. Problem Space vs Solution Space
Product teams frequently make the mistake of jumping directly into wireframing solutions without rigorously mapping the customer's latent struggle.

### The Opportunity Solution Tree (Teresa Torres)
1. **Desired Outcome:** Business and customer metric aligned (e.g. Increase 3-week study retention from 35% to 55%).
2. **Opportunities:** Customer pain points and unmet desires uncovered in qualitative user interviews.
3. **Solutions:** Multiple tactical candidate features addressing each opportunity.
4. **Assumption Tests:** Rapid experiments to invalidate risk before shipping code.

## 2. Key Metrics Framework: Google HEART
- **Happiness:** Student satisfaction score via NPS and in-app sentiment surveys.
- **Engagement:** Weekly Active Study Days (WASD), tasks completed per week.
- **Adoption:** Percentage of students who upload >= 2 resources in Week 1.
- **Retention:** 3-week rolling student retention.
- **Task Success:** Time required to create a note or flip a flashcard deck.`,
  },
  {
    id: 'res-pm-02',
    subjectId: 'sub-pm202',
    name: 'Customer_Interview_Insights_Term2.csv',
    size: 14200,
    type: 'csv',
    status: 'ready',
    uploadedAt: '2027-02-20T11:05:00Z',
    tags: ['research', 'interviews', 'raw-data'],
    content: `Student_ID,Major,Daily_App_Count,Biggest_Pain_Point,Preferred_Study_Tool
STU_101,Cognitive Sci,5,"Lost slide decks across Canvas & Drive",Flashcards & Notes
STU_102,Business PM,4,"Don't know what to study first each evening",Checklists & Timers
STU_103,Computer Sci,3,"Too many bookmarks and open browser tabs",Markdown files
STU_104,Economics,6,"Stressful institutional LMS notifications",Calm clean workspace
STU_105,Biology Pre-Med,7,"Turning 60-slide lectures into quick revision",Active recall quizzes`,
  },
  {
    id: 'res-cog-01',
    subjectId: 'sub-cog101',
    name: 'Baddeley_Working_Memory_Model.txt',
    size: 18400,
    type: 'txt',
    status: 'ready',
    uploadedAt: '2027-02-15T09:40:00Z',
    tags: ['memory', 'cognition', 'lecture-summary'],
    content: `Baddeley and Hitch Working Memory Model (1974 / 2000 Update)

1. Central Executive:
   - Directs attention and coordinates target activities.
   - Allocates cognitive capacity between the slave systems.
   - Non-domain specific; does not store sensory data.

2. Phonological Loop:
   - Phonological Store: "Inner ear" holding auditory trace for 1.5 - 2 seconds.
   - Articulatory Rehearsal: "Inner voice" repeating verbal material in loop.

3. Visuospatial Sketchpad:
   - Visual Cache: Stores color, shape, and spatial coordinates.
   - Inner Scribe: Rehearses movement and spatial sequences.

4. Episodic Buffer (Added in 2000):
   - Integrates multimodal information into coherent unitary scenes.
   - Acts as temporary scratchpad linking working memory to long-term memory.`,
  },
  {
    id: 'res-hci-01',
    subjectId: 'sub-hci310',
    name: 'Nielsen_10_Usability_Heuristics.md',
    size: 31200,
    type: 'markdown',
    status: 'ready',
    uploadedAt: '2027-02-22T16:15:00Z',
    tags: ['usability', 'heuristics', 'design'],
    content: `# Jakob Nielsen's 10 Usability Heuristics for User Interface Design

1. **Visibility of system status:** Always keep users informed through appropriate feedback within a reasonable time (e.g. "Saved just now" indicators, loading spinners).
2. **Match between system and real world:** Speak the user's language using natural phrases, real notebook metaphors, and conventional symbols.
3. **User control and freedom:** Provide clear "emergency exits" like undo, cancel, and clear modals without unintended consequences.
4. **Consistency and standards:** Follow platform conventions; buttons with identical functions should look identical across all screens.
5. **Error prevention:** Eliminate error-prone conditions or present a confirmation prompt before committing irreversible actions (e.g. deleting a subject).
6. **Recognition rather than recall:** Minimize memory load by making objects, actions, and options visible.
7. **Flexibility and efficiency of use:** Cater to both novice and experienced users with shortcuts and template starters.
8. **Aesthetic and minimalist design:** Dialogs should not contain irrelevant or rarely needed information.
9. **Recognize, diagnose, and recover from errors:** Plain-language error messages indicating the exact problem and constructive solution.
10. **Help and documentation:** Accessible instructions and sample demo data demonstrating optimal product use.`,
  },
  {
    id: 'res-env-01',
    subjectId: 'sub-env215',
    name: 'Carbon_Tax_vs_Cap_And_Trade.txt',
    size: 16800,
    type: 'txt',
    status: 'ready',
    uploadedAt: '2027-02-12T13:10:00Z',
    tags: ['economics', 'policy', 'environment'],
    content: `Comparative Policy Analysis: Price vs Quantity Instruments

Pigouvian Carbon Tax (Price Instrument):
- Sets a fixed price per ton of CO2 emissions.
- Provides price certainty for corporate investment planning.
- Emission volume fluctuates depending on marginal abatement costs (MAC).

Cap-and-Trade (Quantity Instrument):
- Sets an absolute cap on overall metric tons of carbon allowed.
- Issues tradeable permits; market clears at permit equilibrium price.
- Provides quantity certainty for environmental targets, but allowance prices can be volatile.

Weitzman (1974) Theorem:
- When marginal damage curve is steeper than marginal abatement cost curve, quantity instruments (Cap-and-Trade) are welfare-superior.
- When MAC curve is steeper, price instruments (Carbon Tax) minimize deadweight loss.`,
  },
];

export const initialNotes: Note[] = [
  {
    id: 'note-pm-01',
    subjectId: 'sub-pm202',
    resourceId: 'res-pm-01',
    title: 'Lecture 4: Customer Discovery & The Mom Test',
    templateUsed: 'cornell',
    tags: ['discovery', 'interviews', 'pm-core'],
    createdAt: '2027-02-19T10:30:00Z',
    updatedAt: '2027-02-21T18:45:00Z',
    isPinned: true,
    content: `# Cornell Method: Customer Discovery & The Mom Test

## CUES & KEYWORDS
- The Mom Test
- Leading questions
- Past behavioral evidence
- Commitments (time, reputation, cash)

## NOTES
- **Rule 1:** Talk about their life instead of your idea. Once you pitch your solution, respondents enter "polite approval" mode.
- **Rule 2:** Ask about specific things that happened in the past rather than generic opinions or hypotheticals about the future ("When was the last time you studied for an exam? Walk me through what you did").
- **Rule 3:** Talk less and listen more. The best interviewers spend 80% of the session listening to the customer's actual workflows and frustrations.

### Signal vs Noise
- "That sounds like a great app!" ➔ **Compliment (Zero Value Signal)**
- "I spent \$30 on an Anki template last Tuesday because I was desperate" ➔ **Hard Behavioral Data (High Value Signal)**

## SUMMARY
Never ask customers if your idea is good. Ask how they currently solve their problem, what they spent money or hours on last week, and look for proof of active struggle.`,
  },
  {
    id: 'note-pm-02',
    subjectId: 'sub-pm202',
    title: 'HEART Framework & Student Retention Metrics',
    templateUsed: 'summary',
    tags: ['metrics', 'frameworks'],
    createdAt: '2027-02-22T08:15:00Z',
    updatedAt: '2027-02-22T14:20:00Z',
    content: `# Topic Summary: Google HEART Framework Applied to StudyNest

## Core Dimensions
1. **Happiness:** Measured via quarterly CSAT surveys and satisfaction with the calm interface.
2. **Engagement:** Depth of interaction: Average weekly study sessions, tasks completed per user, notes created per subject.
3. **Adoption:** Number of new students who upload at least one syllabus or lecture slide within 24 hours of account creation.
4. **Retention:** Weekly Active Study Days (WASD); target is >= 3.8 days per week.
5. **Task Success:** Time to upload a file (< 5 sec) and time to start a flashcard review session (< 3 clicks).`,
  },
  {
    id: 'note-cog-01',
    subjectId: 'sub-cog101',
    resourceId: 'res-cog-01',
    title: 'Working Memory vs Long-Term Storage Mechanisms',
    templateUsed: 'lecture',
    tags: ['memory', 'baddeley', 'exam-prep'],
    createdAt: '2027-02-16T11:00:00Z',
    updatedAt: '2027-02-17T16:10:00Z',
    isPinned: true,
    content: `# Lecture Notes: Working Memory Architecture

## Main Concepts
- **Miller's Law (1956):** Classical capacity was proposed as 7 ± 2 items.
- **Cowan (2001) Modern Revision:** True working memory focus is approximately 4 ± 1 chunks when articulatory rehearsal is suppressed.
- **Cognitive Load Theory (Sweller):**
  - *Intrinsic Load:* Innate complexity of the academic topic.
  - *Extraneous Load:* Distracting UI, poor formatting, or messy files (StudyNest explicitly minimizes extraneous load).
  - *Germane Load:* Beneficial cognitive effort devoted to schema construction and active recall.

## Practical Revision Tips for StudyNest
- Break study sessions into 25-minute Pomodoro bursts.
- Test active recall using flashcards instead of passive reading to stimulate deep hippocampal encoding.`,
  },
  {
    id: 'note-hci-01',
    subjectId: 'sub-hci310',
    resourceId: 'res-hci-01',
    title: 'Heuristic Evaluation & WCAG 2.2 Accessibility Standards',
    templateUsed: 'cornell',
    tags: ['accessibility', 'wcag', 'ux'],
    createdAt: '2027-02-23T09:00:00Z',
    updatedAt: '2027-02-23T15:30:00Z',
    content: `# Cornell Notes: Accessibility & Heuristics

## CUES
- WCAG Contrast Ratios
- Keyboard Tab Order
- Screen Reader ARIA
- Cognitive Accessibility

## NOTES
- **Color Contrast:** Minimum 4.5:1 ratio for regular body text; minimum 3:1 for large headings and active input borders.
- **Focus Rings:** Always maintain a visible, high-contrast focus indicator (focus-visible:ring-2) for keyboard-only navigators.
- **Form Labels:** Every input field must have an explicit HTML label or aria-label; never rely solely on gray placeholder text.
- **Motor Control:** Minimum interactive click target size should be at least 44x44 CSS pixels.

## SUMMARY
Accessibility is not an afterthought; it is fundamental usability. Designing with high contrast and explicit keyboard focus benefits all tired, late-night student users.`,
  },
  {
    id: 'note-env-01',
    subjectId: 'sub-env215',
    resourceId: 'res-env-01',
    title: 'Pigouvian Taxes vs Cap-and-Trade Comparative Analysis',
    templateUsed: 'summary',
    tags: ['economics', 'policy'],
    createdAt: '2027-02-13T14:00:00Z',
    updatedAt: '2027-02-14T10:15:00Z',
    content: `# Topic Summary: Environmental Policy Instruments

## 1. The Market Failure
Pollution is a classic negative externality where marginal private cost (MPC) is lower than marginal social cost (MSC). Without government intervention, firms overproduce pollution.

## 2. Solutions
- **Pigouvian Tax:** Set tax equal to Marginal External Damage (MED) at the socially optimal output Q*.
- **Cap-and-Trade:** Government caps total emissions permits at Q* and allows firms with varying abatement costs to trade permits.
- **Equivalence:** Under perfect certainty, both instruments yield identical economic and environmental outcomes. Under uncertainty, Weitzman's rule dictates the superior policy.`,
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-01',
    subjectId: 'sub-pm202',
    title: 'Complete PRD Section 3 (User Stories & Acceptance Criteria)',
    dueDate: new Date().toISOString().split('T')[0], // Today!
    estimatedMinutes: 45,
    priority: 'high',
    completed: false,
    notes: 'Focus on Gherkin format (Given-When-Then) for flashcards and file upload modules.',
  },
  {
    id: 'task-02',
    subjectId: 'sub-pm202',
    title: 'Synthesize Customer Interview Notes for StudyNest MVP',
    dueDate: new Date().toISOString().split('T')[0], // Today!
    estimatedMinutes: 30,
    priority: 'medium',
    completed: true,
    completedAt: '2027-02-23T11:30:00Z',
    notes: '5 student interviews completed and grouped into primary personas.',
  },
  {
    id: 'task-03',
    subjectId: 'sub-cog101',
    title: 'Review Working Memory & Baddeley Flashcards (20 cards)',
    dueDate: new Date().toISOString().split('T')[0], // Today!
    estimatedMinutes: 20,
    priority: 'high',
    completed: false,
    notes: 'Pay special attention to the difference between phonological store and articulatory rehearsal.',
  },
  {
    id: 'task-04',
    subjectId: 'sub-hci310',
    title: 'Audit StudyNest UI against Nielsen 10 Usability Heuristics',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // Tomorrow
    estimatedMinutes: 40,
    priority: 'medium',
    completed: false,
    notes: 'Check system status indicators, error prevention alerts, and keyboard focus states.',
  },
  {
    id: 'task-05',
    subjectId: 'sub-env215',
    title: 'Read Weitzman (1974) Paper on Prices vs Quantities',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // In 2 days
    estimatedMinutes: 50,
    priority: 'low',
    completed: false,
    notes: 'Summarize the marginal damage slope proof in a new StudyNest note.',
  },
  {
    id: 'task-06',
    subjectId: 'sub-pm202',
    title: 'Prepare Slide Deck for PM2 Capstone Walkthrough',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // In 3 days
    estimatedMinutes: 60,
    priority: 'high',
    completed: false,
    notes: 'Include 5-minute live demo flow and success metrics slide.',
  },
  {
    id: 'task-07',
    subjectId: 'sub-cog101',
    title: 'Take Cognitive Psychology Practice Quiz #1',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], // Yesterday (Completed)
    estimatedMinutes: 25,
    priority: 'medium',
    completed: true,
    completedAt: '2027-02-22T15:00:00Z',
    notes: 'Scored 100% on dual-process theory section.',
  },
];

export const initialDecks: FlashcardDeck[] = [
  {
    id: 'deck-pm-01',
    subjectId: 'sub-pm202',
    title: 'Product Discovery & The Mom Test Essentials',
    description: 'Key principles for customer interviews, uncovering latent problems, and validating willingness to pay.',
    sourceNoteId: 'note-pm-01',
    sourceSnippet: 'Rule 1: Talk about their life instead of your idea. Rule 2: Ask about specific past behavior. Rule 3: Talk less and listen more.',
    createdAt: '2027-02-20T12:00:00Z',
    cards: [
      {
        id: 'c-pm-01',
        front: 'What is the fundamental rule of "The Mom Test"?',
        back: 'Talk about the customer’s life and specific past behaviors instead of your hypothetical idea, so you avoid polite compliments.',
        difficulty: 'easy',
        reviewsCount: 3,
        lastReviewed: '2027-02-22T10:15:00Z',
      },
      {
        id: 'c-pm-02',
        front: 'Why are compliments considered dangerous noise during customer interviews?',
        back: 'Compliments cost the customer nothing and create false positive validation. High-signal data requires proof of past spending, time sacrifice, or emotional struggle.',
        difficulty: 'medium',
        reviewsCount: 2,
        lastReviewed: '2027-02-21T09:40:00Z',
      },
      {
        id: 'c-pm-03',
        front: 'What are the 5 dimensions of Google’s HEART framework?',
        back: 'Happiness, Engagement, Adoption, Retention, and Task Success.',
        difficulty: 'easy',
        reviewsCount: 4,
        lastReviewed: '2027-02-22T11:00:00Z',
      },
      {
        id: 'c-pm-04',
        front: 'What is an Opportunity Solution Tree (OST)?',
        back: 'A visual framework (by Teresa Torres) mapping Desired Business/Customer Outcomes ➔ Uncovered Customer Opportunities ➔ Potential Solutions ➔ Fast Assumption Experiments.',
        difficulty: 'hard',
        reviewsCount: 1,
        lastReviewed: '2027-02-20T14:30:00Z',
      },
    ],
  },
  {
    id: 'deck-cog-01',
    subjectId: 'sub-cog101',
    title: 'Working Memory Architecture & Dual Coding',
    description: 'Baddeley & Hitch components, Miller vs Cowan capacity limits, and cognitive load management.',
    sourceNoteId: 'note-cog-01',
    sourceSnippet: 'Central executive, phonological loop, visuospatial sketchpad, and episodic buffer (added 2000).',
    createdAt: '2027-02-18T16:00:00Z',
    cards: [
      {
        id: 'c-cog-01',
        front: 'What are the four components of Baddeley’s Working Memory Model?',
        back: '1. Central Executive, 2. Phonological Loop, 3. Visuospatial Sketchpad, 4. Episodic Buffer (added in 2000).',
        difficulty: 'easy',
        reviewsCount: 5,
        lastReviewed: '2027-02-22T14:10:00Z',
      },
      {
        id: 'c-cog-02',
        front: 'How long does acoustic information persist in the Phonological Store without rehearsal?',
        back: 'Approximately 1.5 to 2.0 seconds before decaying, unless refreshed by the Articulatory Rehearsal process ("inner voice").',
        difficulty: 'medium',
        reviewsCount: 3,
        lastReviewed: '2027-02-21T18:00:00Z',
      },
      {
        id: 'c-cog-03',
        front: 'What is the modern consensus (Cowan, 2001) on working memory focus capacity?',
        back: '4 ± 1 chunks of information when articulatory rehearsal and long-term memory chunking strategies are controlled.',
        difficulty: 'hard',
        reviewsCount: 2,
        lastReviewed: '2027-02-20T15:20:00Z',
      },
      {
        id: 'c-cog-04',
        front: 'Define "Extraneous Cognitive Load" and how software design affects it.',
        back: 'Mental effort wasted dealing with confusing layout, cluttered buttons, or disorganized files. Good UX minimizes extraneous load so students can focus on learning.',
        difficulty: 'easy',
        reviewsCount: 4,
        lastReviewed: '2027-02-22T14:25:00Z',
      },
    ],
  },
  {
    id: 'deck-hci-01',
    subjectId: 'sub-hci310',
    title: 'Nielsen Heuristics & Accessibility Standards',
    description: 'Essential interface evaluation criteria and WCAG guidelines for student web apps.',
    sourceNoteId: 'note-hci-01',
    sourceSnippet: 'Minimum 4.5:1 ratio for regular body text; always keep users informed through appropriate feedback.',
    createdAt: '2027-02-23T11:00:00Z',
    cards: [
      {
        id: 'c-hci-01',
        front: 'What does Nielsen Heuristic #1 ("Visibility of System Status") require?',
        back: 'The system should always keep users informed about what is going on, through appropriate feedback within a reasonable time (e.g. save timestamps, progress bars).',
        difficulty: 'easy',
        reviewsCount: 2,
        lastReviewed: '2027-02-23T12:00:00Z',
      },
      {
        id: 'c-hci-02',
        front: 'What is the WCAG 2.2 AA minimum contrast ratio for normal body text?',
        back: '4.5:1 against its background color (3:1 for large text >= 18pt or bold >= 14pt).',
        difficulty: 'medium',
        reviewsCount: 1,
        lastReviewed: '2027-02-23T12:15:00Z',
      },
      {
        id: 'c-hci-03',
        front: 'What is the difference between "Recognition" and "Recall" in UI design?',
        back: 'Recognition is easier because visual cues trigger memory (e.g. icons, templates). Recall requires the user to retrieve information from pure memory with no hints.',
        difficulty: 'easy',
        reviewsCount: 2,
        lastReviewed: '2027-02-23T12:30:00Z',
      },
    ],
  },
];

export const initialQuizzes: SelfQuiz[] = [
  {
    id: 'quiz-pm-01',
    subjectId: 'sub-pm202',
    title: 'Product Management 2: Discovery & Metrics Check',
    description: 'Test your understanding of customer interview techniques, HEART metrics, and agile sprint discovery.',
    sourceNoteId: 'note-pm-01',
    createdAt: '2027-02-21T14:00:00Z',
    bestScore: 100,
    lastAttemptDate: '2027-02-22T16:00:00Z',
    questions: [
      {
        id: 'q-pm-01',
        question: 'According to Rob Fitzpatrick’s "The Mom Test", which of the following is the highest-signal question to ask a prospective user?',
        options: [
          '"Would you buy an app that organizes your lecture notes for $5/month?"',
          '"Do you think a calm study platform is a good idea?"',
          '"When was the last time you studied for an exam, and how did you keep your materials organized?"',
          '"What features would your ideal study tool have?"',
        ],
        correctAnswerIndex: 2,
        explanation: 'Questions about concrete past behaviors reveal real-world habits and true pain points, whereas hypothetical questions yield false compliments and speculation.',
      },
      {
        id: 'q-pm-02',
        question: 'In Google’s HEART framework, what metric directly assesses the depth of repeated day-to-day product usage?',
        options: [
          'Happiness (NPS)',
          'Adoption (Sign-up count)',
          'Engagement (Weekly active study days / actions per session)',
          'Task Success (Speed of page load)',
        ],
        correctAnswerIndex: 2,
        explanation: 'Engagement measures the frequency, intensity, or depth of interaction over time, such as Weekly Active Study Days or completed tasks.',
      },
      {
        id: 'q-pm-03',
        question: 'What is the primary danger of building an MVP without defining explicit Out-of-Scope boundaries?',
        options: [
          'The product becomes too simple for users to understand',
          'Scope creep leads to half-baked, buggy features rather than a cohesive, high-quality core experience',
          'You run out of storage space in the database immediately',
          'Users are offended by having too few settings',
        ],
        correctAnswerIndex: 1,
        explanation: 'Defining what NOT to build protects engineering focus and ensures the core value proposition is polished, stable, and genuinely usable.',
      },
    ],
  },
  {
    id: 'quiz-cog-01',
    subjectId: 'sub-cog101',
    title: 'Cognitive Science: Working Memory & Retrieval Practice',
    description: 'Assess comprehension of memory models, retrieval practice theory, and cognitive load.',
    sourceNoteId: 'note-cog-01',
    createdAt: '2027-02-20T11:00:00Z',
    bestScore: 100,
    lastAttemptDate: '2027-02-21T17:30:00Z',
    questions: [
      {
        id: 'q-cog-01',
        question: 'Which component was added to Baddeley and Hitch’s working memory model in the year 2000?',
        options: [
          'The Central Executive',
          'The Episodic Buffer',
          'The Visuospatial Sketchpad',
          'The Articulatory Loop',
        ],
        correctAnswerIndex: 1,
        explanation: 'Alan Baddeley added the Episodic Buffer in 2000 to explain how multimodal information from the slave systems is bound into unitary representations linked to long-term memory.',
      },
      {
        id: 'q-cog-02',
        question: 'Why does "Active Recall" (e.g. self-quizzing, flashcards) lead to stronger memory retention than re-reading notes?',
        options: [
          'Re-reading produces rapid neural fatigue',
          'Active retrieval strengthens memory trace consolidation and neural pathways via the testing effect',
          'Active recall takes less cognitive effort than reading',
          'Self-quizzing bypasses working memory entirely',
        ],
        correctAnswerIndex: 1,
        explanation: 'The testing effect demonstrates that actively retrieving knowledge from memory reorganizes and consolidates cognitive schemas much more robustly than passive exposure.',
      },
    ],
  },
];

export const initialActivities: StudyActivityLog[] = [
  {
    id: 'act-01',
    timestamp: '2027-02-23T11:30:00Z',
    type: 'task_completed',
    subjectId: 'sub-pm202',
    description: 'Completed task: Synthesize Customer Interview Notes for StudyNest MVP',
    minutesSpent: 30,
  },
  {
    id: 'act-02',
    timestamp: '2027-02-23T10:15:00Z',
    type: 'card_reviewed',
    subjectId: 'sub-pm202',
    description: 'Reviewed 4 flashcards in "Product Discovery & The Mom Test Essentials"',
    minutesSpent: 10,
  },
  {
    id: 'act-03',
    timestamp: '2027-02-22T16:00:00Z',
    type: 'quiz_taken',
    subjectId: 'sub-pm202',
    description: 'Scored 100% on "Product Management 2: Discovery & Metrics Check"',
    minutesSpent: 15,
  },
  {
    id: 'act-04',
    timestamp: '2027-02-22T14:20:00Z',
    type: 'note_created',
    subjectId: 'sub-hci310',
    description: 'Created note: Heuristic Evaluation & WCAG 2.2 Accessibility Standards',
    minutesSpent: 25,
  },
  {
    id: 'act-05',
    timestamp: '2027-02-21T15:45:00Z',
    type: 'file_uploaded',
    subjectId: 'sub-hci310',
    description: 'Uploaded resource: Nielsen_10_Usability_Heuristics.md',
    minutesSpent: 5,
  },
  {
    id: 'act-06',
    timestamp: '2027-02-21T09:30:00Z',
    type: 'focus_session',
    subjectId: 'sub-pm202',
    description: 'Focused study block (Pomodoro Sprint) on agile discovery',
    minutesSpent: 25,
  },
];
