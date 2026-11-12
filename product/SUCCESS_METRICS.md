# Success Metrics & Product KPIs

To evaluate whether StudyNest achieves its product promise (*"Keep your study materials organized and make your next study step clear"*), we define a lean, highly measurable set of **Adoption, Engagement, Retention, and Quality** metrics.

---

## 1. Metric Hierarchy Overview

```
North Star Metric: Weekly Active Study Days (WASD)
│
├── Activation & Onboarding
│   ├── Day-0 Study Action Rate (D0-SAR)
│   └── First-Subject Completion Rate (FSCR)
│
├── Core Engagement & Value Realization
│   ├── Today's Plan Completion Ratio (TPCR)
│   ├── Revision Loop Conversion Rate (RLCR)
│   └── Resource Attachment Rate (RAR)
│
└── Retention & Habit Formation
    ├── Weekly Task Completion Velocity (WTCV)
    └── 3-Week Rolling Retention (W3-RR)
```

---

## 2. Key Metric Definitions & Formulas

### North Star Metric: Weekly Active Study Days (WASD)
- **Description:** The average number of days per week a registered student performs at least one active learning event (completing a task, writing a note, uploading a resource, or completing a flashcard review session).
- **Target:** $\ge 3.8\text{ days per week per active student}$.
- **Formula:**
  $$\text{WASD} = \frac{\sum_{\text{students}} \text{Active Study Days in Last 7 Days}}{\text{Total Active Students in Last 7 Days}}$$
- **Why It Matters:** Academic success depends on steady, distributed practice rather than panic-cramming. High WASD signals that StudyNest has become an indispensable daily companion.

---

### Secondary KPI 1: Day-0 Study Action Rate (D0-SAR)
- **Description:** Percentage of first-time visitors who perform a meaningful study action (add a note, check off a demo task, review a flashcard, or upload a file) within their first session.
- **Target:** $\ge 72\%$.
- **Formula:**
  $$\text{D0-SAR} = \left( \frac{\text{New Visitors with } \ge 1 \text{ Core Action in Session 1}}{\text{Total New Visitor Sessions}} \right) \times 100\%$$
- **Why It Matters:** Validates that the pre-seeded demo state and welcoming UI lower the barrier to entry and eliminate blank-canvas paralysis.

---

### Secondary KPI 2: Today's Plan Completion Ratio (TPCR)
- **Description:** Percentage of tasks scheduled for "Today" that are marked complete on or before the end of the day (11:59 PM).
- **Target:** $\ge 65\%$.
- **Formula:**
  $$\text{TPCR} = \left( \frac{\text{Tasks Scheduled for Date } T \text{ Completed on Date } T}{\text{Total Tasks Scheduled for Date } T} \right) \times 100\%$$
- **Why It Matters:** Confirms that students find the daily task manager realistic, actionable, and encouraging rather than overwhelming.

---

### Secondary KPI 3: Revision Loop Conversion Rate (RLCR)
- **Description:** The percentage of subject workspaces where the student utilizes active recall tools (either flipping at least one flashcard deck or taking a self-quiz).
- **Target:** $\ge 45\%$ of active subjects.
- **Formula:**
  $$\text{RLCR} = \left( \frac{\text{Active Subjects with } \ge 1 \text{ Flashcard/Quiz Session}}{\text{Total Active Subjects}} \right) \times 100\%$$
- **Why It Matters:** Distinguishes StudyNest from passive document repositories (Google Drive/Dropbox). Proves students are converting passive notes into active revision.

---

### Secondary KPI 4: Resource Attachment Rate (RAR)
- **Description:** The average number of uploaded resources (PDFs, readings, slides) linked to active subjects.
- **Target:** $\ge 2.5\text{ resources per subject}$.
- **Formula:**
  $$\text{RAR} = \frac{\text{Total Successfully Ingested Resources}}{\text{Total Active Subjects}}$$
- **Why It Matters:** Validates that students trust StudyNest as their centralized digital subject repository.

---

## 3. Telemetry & Privacy Guarantees

In accordance with strict student privacy guidelines:
1. **Zero Content Harvesting:** Telemetry records only anonymized event counts (e.g., `event: "task_checked"`, `event: "flashcard_reviewed"`).
2. **Local Logging:** In demo mode, all metrics are computed transparently directly from local state and surfaced on the student's own dashboard.
3. **No External Trackers:** No unconsented 3rd-party commercial advertising trackers or analytics cookies are injected into the client bundle.
