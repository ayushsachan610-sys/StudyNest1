# MVP Requirements & Prioritization (MoSCoW)

This document specifies and prioritizes all functional and non-functional requirements for the StudyNest Minimum Viable Product (MVP), structured according to the industry-standard **MoSCoW framework** (Must Have, Should Have, Could Have, Won't Have for MVP).

---

## 1. Must Have (P0 — Absolute MVP Core)

Without these capabilities, StudyNest cannot fulfill its core promise to keep materials organized and clarify the next study step:

| Req ID | Domain | Requirement Description | Acceptance Standard |
| :--- | :--- | :--- | :--- |
| **M-01** | **Dashboard** | Dynamic welcome banner with time-of-day greeting, contextual "Continue Studying" recommendation, and summary of active subjects and urgent deadlines. | Must update dynamically and calculate real state without hardcoded static counts. |
| **M-02** | **Dashboard** | "Today's Plan" interactive checklist allowing immediate check-off, un-check, and task completion metrics. | Directly updates global task state and recalculates completion %. |
| **M-03** | **Subjects** | Subject management: Create subject (title, code, color, target hours, description), edit/rename, open notebook, and delete subject (with confirmation). | Deleting a subject cleans up associated items or reassigns them cleanly. |
| **M-04** | **Notebooks** | Dedicated subject workspace with tabbed navigation: Overview, Notes, Files/Resources, Tasks, and Revision cards. | Navigating to a subject filters content strictly to that subject's context. |
| **M-05** | **File Library** | File upload supporting drag-and-drop and standard OS file dialog with progress and status feedback. | Validates file type and size (<= 15MB); rejects unsupported files with clear error reason. |
| **M-06** | **File Library** | In-browser preview modal for text-based study files (Markdown, TXT, JSON, code, CSV) and simulated PDF reader with metadata. | Students can inspect notes/files without leaving the app or downloading externally. |
| **M-07** | **Notes** | Full note editor with title, rich markdown-compatible content, subject linking, word count, and visible "Saved" state. | Automatically updates in state with timestamp; persists locally across refreshes. |
| **M-08** | **Notes** | Built-in pedagogical templates: Cornell Notes, Lecture Summary, Topic Deep-Dive, and Key Questions. | Selecting a template inserts structured scaffolding into the editor. |
| **M-09** | **Planner** | Study task scheduler with title, subject assignment, due date, estimated minutes, priority badge, and status. | Supports Agenda view and "Today" filter; allows adding tasks directly from subject pages. |
| **M-10** | **Revision** | Interactive Flashcards module with 3D flip animation, self-rating buttons (Again, Hard, Good, Easy), and deck completion summary. | Flashcards can be created manually or generated from note definitions with source citations. |
| **M-11** | **Revision** | Self-Quiz engine featuring multiple-choice questions, instant answer checking, rationale explanations, and final score banner with confetti. | Tracks quiz attempts and displays accurate grade feedback. |
| **M-12** | **Persistence** | Robust local persistence (LocalStorage + IndexedDB) with pre-seeded, realistic demo data clearly marked as "Demo Mode". | First-time visitors experience an immediate, fully populated study environment. |

---

## 2. Should Have (P1 — High Value for Complete Student Experience)

These features enhance usability, retention, and delight, and are included in this complete MVP build:

| Req ID | Domain | Requirement Description | Implementation in MVP |
| :--- | :--- | :--- | :--- |
| **S-01** | **Focus** | Built-in Pomodoro Focus Timer with customizable intervals (25/50 min) and ambient study soundscapes (White Noise, Rain, Cafe, Library). | Fully implemented floating / dedicated focus companion with audio synthesis. |
| **S-02** | **Revision** | Deterministic Note-to-Flashcard generator that extracts key definitions and concepts while visibly displaying the source note snippet. | Implemented with transparent source citation—no fabricated AI claims. |
| **S-03** | **Data Portability**| Full JSON Data Export and Import, allowing students to back up their entire study workspace or migrate between devices. | One-click download & upload JSON file with schema validation. |
| **S-04** | **Settings** | Student profile preferences (Name, Academic Year, Weekly Study Target, Theme mode) and "Reset to Demo Data" button. | Implemented in Account / Settings dialog with instant feedback. |
| **S-05** | **Cloud Spec** | Ready-to-deploy Supabase schema (`schema.sql`) with strict Row Level Security (RLS) policies enforcing single-student data isolation. | Complete SQL script provided for seamless backend provisioning. |

---

## 3. Could Have (P2 — Desirable Enhancements)

Included if time permits, or earmarked for fast-follow iteration (v1.1):
- Markdown WYSIWYG rich text toolbar (bold, italics, code blocks, lists).
- Spaced repetition algorithm (Leitner 5-box intervals) with daily review queue calculation.
- Tag-based cross-subject resource filtering (e.g., `#midterms`, `#formulas`).

---

## 4. Won't Have for MVP (Out of Scope for Initial Release)

- Real-time multiplayer peer study groups / audio rooms.
- Native mobile app binaries (App Store / Play Store).
- Third-party LMS OAuth gradebook synchronizers (Canvas, Blackboard, Brightspace).
- Unbounded black-box AI generative agents that pretend to read arbitrary unparsed binary files without explicit user consent or API configuration.
