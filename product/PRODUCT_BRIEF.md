# Product Brief: StudyNest

**Product Name:** StudyNest  
**Tagline:** *Your calm, organized learning workspace.*  
**Product Promise:** *"Keep your study materials organized and make your next study step clear."*  
**Document Version:** 1.0 (MVP)  
**Author:** Senior Product Manager, StudyNest  
**Course Context:** Product Management 2 (PM2) Capstone Assignment  

---

## 1. Problem Statement

University and college students face intense cognitive overload caused by fragmented academic materials and disjointed study tools:
- **Scattered Resources:** Lecture slides, syllabus PDFs, lab manuals, and readings are dispersed across campus LMS portals (Canvas/Blackboard), Google Drive, local desktop download folders, and messaging channels.
- **Unclear Next Steps:** Students spend valuable study time simply figuring out what to study, when assignments are due, and which notes correspond to upcoming exams.
- **Passive vs. Active Learning Gap:** Traditional document storage tools (Dropbox, Google Drive) are static; they store files but do not help students transform lecture notes into active revision tools (e.g., flashcards, quizzes, or structured study plans).
- **Institutional Clutter:** Existing university enterprise portals feel rigid, administrative, and uninspiring, inducing stress rather than focus.

## 2. Target Users

- **Primary User:** The ambitious university/college undergraduate or graduate student juggling 4 to 6 concurrent academic modules, coursework deadlines, lab notes, and exam prep.
- **User Mindset:** Wants an aesthetically calm, distraction-free environment that empowers autonomous study, fosters daily consistency, and provides clear visibility over academic deadlines.

*(Detailed user profiles are documented in [`product/PERSONAS.md`](./PERSONAS.md).)*

---

## 3. Value Proposition & Core Benefits

| Traditional Approach | StudyNest Advantage |
| :--- | :--- |
| PDFs buried in nested OS folders | Subject-based visual workspace pairing files with corresponding notes and tasks |
| Juggling 3 separate apps for notes, todo lists, and flashcards | Integrated loop: Upload Resources ➔ Synthesize Notes ➔ Schedule Tasks ➔ Review Flashcards/Quizzes |
| High-stress, bureaucratic LMS dashboards | Calm, warm, tactile design with actionable "Today's Plan" and focus timer |
| Opaque progress metrics | 100% transparent, activity-traceable study metrics (actual tasks completed, minutes focused, cards reviewed) |

---

## 4. Product Goals & Objectives

1. **Reduce Time-to-Study (Onboarding & Orientation):** Allow a student to land on their dashboard and commence active revision or task planning within 60 seconds.
2. **Centralize Subject Context:** Enable 100% association of study materials (notes, files, tasks, flashcards) by subject notebooks.
3. **Close the Active Recall Loop:** Provide native, accessible revision tools (interactive flashcard decks with Leitner spacing and self-quizzes) generated directly from notes or user input.
4. **Foster Daily Habituation:** Provide an intuitive daily agenda ("Today's Plan") and focus companion that turn macro syllabus goals into micro daily actions.
5. **Guarantee Privacy & Local Autonomy:** Ensure all student notes, uploads, and revision stats are completely private and client-persisted, with zero third-party data harvesting and a clean path to self-hosted cloud sync (Supabase RLS).

---

## 5. Scope Boundaries

### In Scope for MVP
- **Dashboard:** Dynamic time-aware greeting, next recommended study action, active subjects overview, upcoming deadlines widget, recently accessed resources, and real-time interactive "Today's Plan".
- **Subject Workspaces:** Full CRUD (create, view, edit/rename, delete) with color tagging, target study hours, and dedicated tabs for Notes, Files, Tasks, and Revision.
- **Resource Management:** Drag-and-drop file upload with client-side validation (type/size checks), search, filtering, sorting, downloadable exports, and native text/markdown file previews.
- **Structured Note Taking:** Rich note editor with auto-save indicators, subject linking, and standardized pedagogical templates (*Cornell Notes, Lecture Summary, Key Definitions & Questions*).
- **Study Planner:** Calendar/agenda views, task prioritization, due dates, subject badges, and one-click completion.
- **Revision Suite:** Interactive flashcards with 3D flip card dynamics, self-assessment difficulty ratings (Easy, Medium, Hard), and self-quizzes with instant scoring and pedagogical answer explanations.
- **Calm Focus Companion:** Integrated Pomodoro study timer with ambient tones to anchor focused study blocks.
- **Data Persistence & Demo State:** LocalStorage + IndexedDB zero-friction offline persistence, one-click "Reset to Sample Demo Data", and full JSON backup/restore.

### Explicitly Out of Scope for MVP (Future Roadmap)
- Real-time collaborative peer study rooms (planned for Phase 2).
- Native iOS/Android app store binaries (responsive web PWA covers mobile access in MVP).
- Automated opaque AI generation without explicit student source citations (StudyNest uses deterministic, traceable note extraction and manual deck builders to prevent hallucination; opt-in LLM keys are supported via configuration).
- Third-party LMS direct gradebook synchronization (Canvas/Blackboard API integrations belong to institutional tier).

---

## 6. Brand & Design Philosophy

- **Vibe:** Calm, warm, focused, supportive.
- **Color Palette:** Warm cream background, earthy sage (`#10b981`), terracotta/warm amber (`#f59e0b`), soft indigo accents, with high-contrast, accessible typography (`Inter` / serif headings).
- **Tactility:** Subtle borders, warm card elevations, micro-animations for card flips, smooth transitions, and celebratory confetti upon quiz completion.
