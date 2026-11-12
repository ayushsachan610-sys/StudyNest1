# User Stories & Acceptance Criteria

This document details user stories in standard Agile format (`As a <user>, I want to <action>, so that <benefit>`) paired with explicit Gherkin-style Acceptance Criteria (`Given-When-Then`) across all core functional areas of StudyNest.

---

## 1. Onboarding & Demo Experience

### Story US-01: First-Time Visitor Immediate Orientation
> **As a** first-time student exploring StudyNest,  
> **I want** to see an immediate, realistic demo workspace with sample subjects, notes, and tasks,  
> **So that** I understand the product's value instantly without being forced through empty forms or mandatory signups.

#### Acceptance Criteria:
- **AC 1.1:** *Given* a new user lands on the app for the first time, *When* the dashboard loads, *Then* realistic demo content for 4 courses (e.g., Product Management, Cognitive Science, HCI, Environmental Economics) is automatically displayed.
- **AC 1.2:** *Given* demo data is active, *When* viewing the interface, *Then* a discreet "Demo Mode (Local Persistence)" badge is visible, informing the student that all changes remain local to their browser.
- **AC 1.3:** *Given* a student has experimented with the demo data, *When* they click "Reset to Demo Data" in Settings, *Then* all sample records are cleanly restored to their default state after a confirmation warning.

---

## 2. Subjects and Notebooks

### Story US-02: Subject Creation & Workspace Navigation
> **As a** student taking a new semester course,  
> **I want to** create a dedicated subject workspace with a custom name, code, color, and description,  
> **So that** I can organize all materials for that course in one cohesive notebook.

#### Acceptance Criteria:
- **AC 2.1:** *Given* a student is on the "My Subjects" page or Dashboard, *When* they click "Add Subject" and submit valid fields, *Then* a new subject card is created with its designated color tag and added to active subjects.
- **AC 2.2:** *Given* a student clicks on a subject card, *When* the subject notebook opens, *Then* it displays tabs for Overview, Notes, Resources, Tasks, and Revision, with all contents strictly filtered to that subject.
- **AC 2.3:** *Given* an existing subject, *When* a student chooses to edit or rename it, *Then* the modifications are immediately reflected across all linked notes, resources, and planner tasks.
- **AC 2.4:** *Given* a student wishes to delete a subject, *When* they confirm the deletion dialog, *Then* the subject is safely removed from state.

---

## 3. File Upload and Resource Library

### Story US-03: Resource Ingestion & In-App Preview
> **As a** student who receives lecture slides and reading articles,  
> **I want to** upload study files (PDF, Markdown, TXT, DOCX, CSV) and preview text files directly inside StudyNest,  
> **So that** I can reference materials without constantly switching back and forth to my desktop file system.

#### Acceptance Criteria:
- **AC 3.1:** *Given* a student is on the Resources page or inside a Subject notebook, *When* they drag and drop a file or pick one via the file picker, *Then* the file is validated against allowed types and maximum size (<= 15MB).
- **AC 3.2:** *Given* an unsupported file type (e.g., `.exe`, `.dmg`) or a file exceeding 15MB, *When* the student attempts to upload it, *Then* a clear, plain-language error banner explains why the file was rejected without crashing the page.
- **AC 3.3:** *Given* a successfully uploaded file, *When* it is added, *Then* the resource record displays the file name, size, type icon, association to the selected subject, upload date, and a "Ready" status badge.
- **AC 3.4:** *Given* a text-based file (`.md`, `.txt`, `.json`, `.csv`, code files), *When* the student clicks "Preview", *Then* a clean modal renders the content with syntax-highlighted or formatted reading view and a download option.

---

## 4. Structured Notes

### Story US-04: Note Authoring & Template Scaffolding
> **As a** student attending a lecture or reading an assigned paper,  
> **I want to** take structured notes using Cornell or Lecture Summary templates and link them to a specific subject and resource,  
> **So that** my notes are organized, well-formatted, and easy to review before exams.

#### Acceptance Criteria:
- **AC 4.1:** *Given* a student opens the note editor, *When* they type a title and body, *Then* changes auto-save with a "Saved just now" confirmation timestamp.
- **AC 4.2:** *Given* a new note, *When* the student selects a template (*Cornell Notes, Lecture Summary, Key Definitions & Questions*), *Then* the template's structured sections (e.g., Cues, Notes, Summary) are inserted into the editor without overwriting existing titles.
- **AC 4.3:** *Given* a list of notes, *When* the student enters a search query in the search bar or selects a subject filter, *Then* notes matching title, content, or subject are filtered in real-time.
- **AC 4.4:** *Given* an existing note, *When* the student clicks "Generate Flashcards", *Then* key terms and definitions are extracted with the source note excerpt clearly shown as attribution.

---

## 5. Study Planner

### Story US-05: Task Management & Daily Study Agenda
> **As a** student managing multiple weekly deadlines,  
> **I want to** schedule study tasks with due dates, subject tags, and estimated duration,  
> **So that** I can see an actionable "Today's Plan" and never miss an assignment.

#### Acceptance Criteria:
- **AC 5.1:** *Given* a student is on the Planner page or inside a Subject notebook, *When* they create a task, *Then* the task is assigned to the selected subject, given a priority (High, Medium, Normal), and assigned a due date.
- **AC 5.2:** *Given* tasks scheduled for today or overdue, *When* viewing the Dashboard, *Then* the "Today's Plan" checklist accurately reflects those tasks with clickable checkboxes.
- **AC 5.3:** *Given* a task is checked off, *When* completed, *Then* it updates the global study completion metric, reflects on the subject's progress, and updates the task status to `completed`.
- **AC 5.4:** *Given* the planner agenda view, *When* toggling between "All Tasks", "Upcoming", and "Completed", *Then* the list displays tasks organized by chronological due date with visual badges for overdue items.

---

## 6. Revision Tools (Flashcards & Self-Quiz)

### Story US-06: Active Recall Flashcard Review
> **As a** student preparing for an upcoming exam,  
> **I want to** flip through flashcards and rate my recall confidence (Again, Hard, Good, Easy),  
> **So that** I can reinforce memory retention through active recall and spaced repetition.

#### Acceptance Criteria:
- **AC 6.1:** *Given* a student opens a flashcard deck, *When* they click on a card or hit spacebar/tap flip, *Then* the card smoothly flips 3D to reveal the answer.
- **AC 6.2:** *Given* the answer is revealed, *When* the student rates their confidence (Again / Hard / Good / Easy), *Then* the review state records the response, advances to the next card, and increments the user's total reviewed count.
- **AC 6.3:** *Given* all cards in a session are completed, *When* the session ends, *Then* a summary screen displays the cards reviewed, mastery breakdown, and an option to restart or return to the notebook.

### Story US-07: Interactive Self-Quiz Knowledge Checks
> **As a** student testing my comprehension of a subject,  
> **I want to** take a timed or untimed self-quiz with instant feedback and pedagogical rationales,  
> **So that** I can identify knowledge gaps before high-stakes exams.

#### Acceptance Criteria:
- **AC 7.1:** *Given* a self-quiz is launched, *When* the student selects an option, *Then* the correct and incorrect choices are clearly highlighted with an educational explanation of why the answer is right.
- **AC 7.2:** *Given* the quiz is finished, *When* the final question is submitted, *Then* a celebratory score banner is displayed, celebratory confetti fires if score >= 80%, and performance metrics update the student's study record.
