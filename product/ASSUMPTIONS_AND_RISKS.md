# Assumptions, Risks & Mitigations

Every product initiative operates on key pedagogical, technical, and behavioral assumptions. Below is the risk assessment matrix and mitigation strategy for StudyNest.

---

## 1. Key Product & Market Assumptions

1. **Student Habituation:** We assume students are dissatisfied with fragmented multi-app systems (Drive + Notion + Quizlet + Todoist) and will embrace an integrated, all-in-one workspace if onboarding friction is virtually zero.
2. **Preference for Calm UI:** We assume students experience digital fatigue from bright, gamified, high-frequency notification apps and will prefer a warm, tranquil, distraction-free environment.
3. **Active Recall Willingness:** We assume students recognize that self-testing (flashcards and quizzes) yields higher exam scores than passive slide re-reading, provided card generation requires minimal manual labor.
4. **Data Ownership:** We assume students place a premium on academic privacy and do not want their personal notes or unpublished research papers mined for external LLM training.

---

## 2. Risk Assessment Matrix

| Risk Domain | Risk Event / Threat | Severity | Likelihood | Mitigation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| **Data Privacy & Leakage** | A student's uploaded notes, graded essays, or syllabus files leak to other students or public clouds. | **Critical** | Low | **Zero Shared Storage in MVP:** In Demo Mode, all data is retained strictly within the user's browser `LocalStorage` and `IndexedDB`. When transitioning to cloud storage (Supabase), Row Level Security (RLS) policies are enforced at the database layer ensuring `auth.uid() = user_id`. |
| **Storage Limits & Bloat** | Students upload massive multi-gigabyte video lectures or high-res textbooks, crashing browser storage. | **Medium** | High | **Client Validation & Quotas:** Enforce strict file size limits ($\le 15\text{MB}$ per file) and accepted MIME types (PDF, Markdown, TXT, DOCX, CSV, images). Surface plain-language warnings when quota thresholds approach. |
| **AI Hallucination & Accuracy** | AI-generated flashcards or quiz answers fabricate incorrect formulas or historical dates, harming student exam grades. | **High** | Medium | **Transparent Grounding & Non-Fabrication:** The MVP explicitly avoids black-box ungrounded AI. Revision tools use deterministic extraction with clear citation to the exact source note. Any future LLM integration requires verified source context and displays the exact source snippet. |
| **Student Adoption & Abandonment** | Students sign up enthusiastically during Week 1 of the semester but abandon the app during midterms due to maintenance friction. | **High** | Medium | **Frictionless Daily Routine:** "Today's Plan" requires zero setup; pre-seeded demo data allows instant exploration; 1-click note templates (Cornell, Lecture Summary) eliminate blank-page paralysis; Pomodoro focus timer brings utility even for single 25-minute sprints. |
| **Device Sync Expectations** | Students expect their phone changes to appear on their laptop immediately while using Demo Mode without cloud login. | **Medium** | High | **Transparent System Status:** Explicit "Demo Mode (Local Persistence)" badge and banner explaining that data is stored in the current browser. Provided 1-click "Export JSON Backup" and "Import Backup" to facilitate manual transfer until Supabase cloud sync is activated. |

---

## 3. Security & Compliance Checklist

- [x] **No Hardcoded Secrets:** Client codebase contains zero API keys, service tokens, or private credentials.
- [x] **Environment Template:** Safe `.env.example` provided for any future backend endpoints.
- [x] **Clean Error Handling:** Rejected file uploads or malformed inputs produce friendly, actionable alerts without exposing stack traces.
- [x] **Audit Trail & Portability:** Student retains full data sovereignty via immediate JSON export.
