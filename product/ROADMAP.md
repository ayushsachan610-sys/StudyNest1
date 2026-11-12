# Product Roadmap: StudyNest

This roadmap charts the strategic evolution of StudyNest across three horizons: **Current MVP (Phase 1)**, **Next Iteration (Phase 2)**, and **Future Vision (Phase 3)**.

```
Phase 1: MVP Core (Current Release) ────► Phase 2: Enhanced Learning (Q3 2027) ────► Phase 3: Collaborative Campus (Q1 2028)
• Subject Notebooks & Files             • Spaced Repetition (SM-2 Algorithm)      • Real-Time Collaborative Study Rooms
• Markdown Notes & Templates            • Rich WYSIWYG Text Editor                • LMS Calendar Two-Way Sync (Canvas/iCal)
• Agenda Planner & Today's Plan         • Audio/PDF Annotation & Citations        • Opt-in Verified AI Tutor (BYO API Key)
• Flashcards & Interactive Quizzes      • Cross-Device Cloud Sync (Supabase)      • Offline Native PWA Install & Sync
• Focus Pomodoro Companion              • Export to PDF / Anki Deck Format        • Institutional Department Workspaces
```

---

## Horizon 1: MVP (Delivered in this Release)
**Strategic Objective:** Establish a calm, reliable, and functional personal study workspace that unifies files, notes, tasks, and flashcards.

- [x] **Subject-Centric Workspace:** Create, edit, and organize subjects with dedicated tabs for files, notes, tasks, and revision.
- [x] **File Library & Text Previewer:** Client-side file drag-and-drop, validation, categorization, and previewing for text/markdown/code/JSON.
- [x] **Structured Note Taking:** Rich note editor with templates (Cornell Notes, Lecture Summary, Key Questions) and auto-save feedback.
- [x] **Study Planner:** Daily and upcoming task tracker with priorities, due dates, and instant check-off on "Today's Plan".
- [x] **Revision Tools:** Interactive 3D flip flashcard decks with difficulty scoring and self-quizzes with explanations.
- [x] **Pomodoro Focus Companion:** Calming timer with ambient soundscapes (white noise, cafe, rain, library).
- [x] **Demo Mode & Persistence:** Immediate realistic sample data for 4 courses, client persistence (LocalStorage/IndexedDB), and full JSON backup/restore.

---

## Horizon 2: Next Iteration (Phase 2 — Target: Q3 2027)
**Strategic Objective:** Deepen cognitive retention and provide seamless multi-device cloud synchronization.

1. **SuperMemo (SM-2) Spaced Repetition Engine:**
   - Transition from simple Leitner boxes to full interval calculation based on recall quality (0-5 scale).
   - "Due Today" revision badge on dashboard showing cards needing review based on forgetting curves.
2. **Rich Document Annotation:**
   - In-app PDF highlighter and margin note taker allowing students to highlight textbook passages and link them directly to a note card.
3. **Cloud Multi-Device Sync (Supabase Backend):**
   - Seamless sign-in with campus email (`@university.edu`) or OAuth.
   - Row Level Security (RLS) encrypted database sync enabling seamless switching between laptop and tablet.
4. **Anki & Notion Interoperability:**
   - Export flashcards to standard `.apkg` format for Anki users.
   - Import notes from Notion and Markdown archives.

---

## Horizon 3: Future Opportunities (Phase 3 — Target: Q1 2028)
**Strategic Objective:** Expand from single-player study companion to synchronized peer learning networks.

1. **Silent Peer Study Rooms (Virtual Study Lounges):**
   - Ambient, video-free study rooms where study cohorts share focus timers, weekly study streaks, and mutual accountability without distraction.
2. **Campus LMS Deep Integration:**
   - Secure two-way sync with Canvas, Blackboard, and Moodle to automatically ingest assignment due dates and syllabus slide updates into the Planner.
3. **Opt-in Verified AI Tutor (Bring-Your-Own-Key):**
   - Provide student-controlled API key integration (Gemini, Claude, OpenAI) to generate Socratic quiz questions exclusively from confirmed uploaded lecture slides, citing exact page numbers.
