# 🌿 StudyNest — Personal Student Learning Workspace

> **"Keep your study materials organized and make your next study step clear."**  
> Built as a capstone project for **Product Management 2 (PM2)**.

StudyNest is a calm, supportive personal learning companion where students can organize course subjects, upload study files and lecture slides, write structured notes using pedagogical templates, schedule daily study sprints, and engage in active recall through interactive 3D flashcards and self-quizzes.

---

## 📋 Table of Contents
1. [Product Overview & Problem Solved](#product-overview--problem-solved)
2. [Core Features & Architecture](#core-features--architecture)
3. [Design System & Usability](#design-system--usability)
4. [Demo Mode & Persistence Guarantee](#demo-mode--persistence-guarantee)
5. [Backend Architecture & Supabase RLS](#backend-architecture--supabase-rls)
6. [Product Management Assignment Deliverables](#product-management-assignment-deliverables)
7. [Local Setup & Running](#local-setup--running)
8. [Vercel & GitHub Deployment Guide](#vercel--github-deployment-guide)

---

## 🌟 Product Overview & Problem Solved

### The Student Problem
University students balance 4–6 concurrent modules, syllabus updates, lecture decks, and homework deadlines. Academic materials are scattered across institutional LMS portals (Canvas/Blackboard), Google Drive, local downloads, and messaging chats. Students waste 15–20 minutes each evening simply figuring out what to study and where their notes are. Furthermore, passive reading of lecture slides leads to poor exam retention and test anxiety.

### The StudyNest Solution
StudyNest provides a tranquil, focused digital desk:
- **Subject-Centric Notebooks:** Files, notes, tasks, and flashcards grouped by course.
- **Traceable Study Metrics:** Real weekly study hours, tasks completed, and review repetitions calculated directly from student actions.
- **Actionable Daily Plan:** An interactive "Today's Plan" checklist that removes blank-page paralysis.
- **Active Recall Engine:** 3D flashcard flips with confidence ratings and multiple-choice self-quizzes with pedagogical rationales.
- **Focus Companion:** Integrated Pomodoro study timer with Web Audio synthesized soundscapes (Gentle Rain, Soft Cafe, White Noise).

---

## ✨ Core Features & Architecture

### 1. Dashboard
- **Dynamic Contextual Greeting:** Welcomes the student by name and time of day, highlighting pending tasks.
- **Quick Action Triggers:** One-click triggers for *Start Focus Session*, *Plan Next Task*, and *Upload Files*.
- **Today's Plan (Checklist):** Interactive task manager where checking off tasks dynamically recalculates completion velocity and weekly hours.
- **Traceable Productivity Metrics:** Weekly study hours logged vs. semester goal, total tasks completed, flashcards reviewed, and active notebooks.
- **Upcoming Deadlines & Recent Materials:** Quick-glance cards with urgent countdown badges.

### 2. Subjects & Dedicated Notebooks
- **Subject Management:** Create, color-code, describe, set target hours, and delete subject workspaces.
- **5-Tab Subject Notebook:**
  - `Overview`: Course summary, recent notes, and upcoming milestones.
  - `Notes`: Filtered lecture notes with template scaffolding.
  - `Files & Slides`: Drag-and-drop uploaded documents with size and date metadata.
  - `Tasks`: Course-specific agenda with completion checkboxes.
  - `Revision`: Course-specific flashcard decks and self-quizzes.

### 3. File Upload & Resource Library
- **Drag-and-Drop Ingestion:** Supports PDF, Markdown (`.md`), Plain Text (`.txt`), Code scripts (`.ts`, `.py`, `.json`), CSV datasets, and DOCX documents (up to 15MB).
- **Plain-Language Validation:** Rejects unsupported binary formats or oversize files with clear explanations.
- **In-Browser Preview Modal:** Full in-app previewer for markdown and code with download capabilities.
- **Search, Filter & Sort:** Filter by subject, file type, or tag, with sorting by upload date, file name, or file size.

### 4. Structured Notes
- **Pedagogical Note Templates:**
  - *Cornell Notes:* Cues, Notes, and Summary sections.
  - *Lecture Notes:* Professor, date, key announcements, and action checklist.
  - *Topic Summary:* Definition, frameworks, and real-world application.
  - *Questions to Revisit:* Office hours preparation and unresolved exam questions.
- **Live Save Feedback:** "Saved just now" confirmation badge and live word/line counters.
- **Deterministic Note-to-Deck Generator:** Parses key terms and definitions (`**Term:** Definition` or `Term – Definition`) into active flashcards citing the exact source note snippet.

### 5. Study Planner & Agenda
- **Task Scheduling:** Title, course association, due date, estimated duration (15–90 min), and priority badges (High, Medium, Normal).
- **Time Horizons:** Segmented into *Today & Urgent*, *Upcoming Agenda*, and *Completed Milestones*.
- **Direct Linkage:** Add tasks from the global planner or directly inside a course notebook.

### 6. Revision Tools (Active Recall Suite)
- **3D Flashcard Deck Player:** Smooth card flip animation, card counter, and self-assessment ratings (*Again, Hard, Good, Easy*).
- **Self-Quiz Knowledge Checks:** Multiple-choice questions with instant correct/incorrect visual feedback and in-depth explanations.
- **Confetti Celebration:** Fires celebratory confetti upon achieving $\ge 80\%$ on a self-quiz or finishing a deck.
- **Pedagogical Integrity Guarantee:** Zero fabricated AI claims; questions are deterministic and grounded in source material.

### 7. Focus Pomodoro Companion
- **Study Timers:** 25-minute Pomodoro, 50-minute deep sprint, or 5-minute break.
- **Synthesized Ambient Audio:** Pure Web Audio API simulation of *Gentle Rain*, *White Noise*, and *Soft Cafe* (100% offline with zero external audio assets).
- **Subject Attribution:** Automatically logs completed focus minutes to the selected course.

---

## 🎨 Design System & Usability

- **Color Palette:** Warm cream canvas (`#FAF8F5`), earthy sage green (`#2E7D5B`), warm terracotta (`#D35D38`), and soft indigo (`#4F5BD5`).
- **Typography:** Modern high-contrast `Inter` paired with literary serif headings (`Newsreader`) for a calm, editorial feel.
- **Accessibility:** Meets WCAG 2.2 AA contrast ratios, visible keyboard focus indicators (`focus-visible:ring-2`), and descriptive ARIA labels.

---

## 🔒 Demo Mode & Persistence Guarantee

StudyNest operates in **Demo Mode (Local Persistence)** out of the box:
- **Zero Signup Friction:** Pre-seeded with realistic coursework for 4 modules (*Product Management 2*, *Cognitive Psychology*, *HCI*, and *Environmental Economics*).
- **Local Storage Engine:** All edits, uploads, notes, tasks, and flashcard ratings persist across browser refreshes via `localStorage`.
- **Data Sovereignty:**
  - **Export JSON Backup:** Download your entire study workspace in standard JSON.
  - **Import JSON Backup:** Restore notes and decks onto any device.
  - **Reset to Demo Data:** 1-click restore to sample state.

---

## 🗄️ Backend Architecture & Supabase RLS

For multi-device cloud synchronization, StudyNest includes an enterprise-grade Supabase schema with strict **Row-Level Security (RLS)**:
- **Single-Student Data Isolation:** Every query verifies `auth.uid() = user_id`, guaranteeing students can never view another user's files or notes.
- **SQL Schema File:** Available in [`supabase/schema.sql`](./supabase/schema.sql).
- **Adapter File:** Implemented in [`src/lib/supabase.ts`](./src/lib/supabase.ts).

---

## 📁 Product Management Assignment Deliverables

All required PM2 documentation is organized in the [`product/`](./product/) directory:

1. [`product/PRODUCT_BRIEF.md`](./product/PRODUCT_BRIEF.md) — Problem statement, target user, value proposition, goals, and out-of-scope boundaries.
2. [`product/PERSONAS.md`](./product/PERSONAS.md) — Detailed user personas (*Maya Chen* — STEM undergrad, and *Marcus Vance* — Non-traditional PM student).
3. [`product/MVP_REQUIREMENTS.md`](./product/MVP_REQUIREMENTS.md) — MoSCoW prioritized requirements (Must, Should, Could, Won't).
4. [`product/USER_STORIES.md`](./product/USER_STORIES.md) — Agile user stories with Gherkin acceptance criteria (`Given-When-Then`).
5. [`product/SUCCESS_METRICS.md`](./product/SUCCESS_METRICS.md) — North Star (WASD), secondary KPIs, and mathematical formulas.
6. [`product/ROADMAP.md`](./product/ROADMAP.md) — 3-Horizon evolution from MVP to Collaborative Campus.
7. [`product/ASSUMPTIONS_AND_RISKS.md`](./product/ASSUMPTIONS_AND_RISKS.md) — Privacy, storage limits, AI accuracy, and mitigation matrices.

---

## 🚀 Local Setup & Running

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v26.13.0`)
- npm `v9+` or `v11+`

### Installation Steps
```bash
# 1. Navigate to the studynest directory
cd studynest

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173/` to explore StudyNest.

### Building for Production
```bash
npm run build
npm run preview
```

---

## ☁️ Vercel & GitHub Deployment Guide

StudyNest is configured for zero-configuration deployment on **Vercel**:

### 1. GitHub Preparation
```bash
cd studynest
git init
git add .
git commit -m "feat: complete StudyNest student workspace MVP with PM2 documentation"
```
To push to your private GitHub repository:
```bash
git remote add origin https://github.com/<your-username>/studynest.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `studynest` repository.
3. Vercel automatically detects the Vite framework and settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. *(Optional)* If using Supabase, enter `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Environment Variables**.
5. Click **Deploy**. Your app will be live with an SSL URL (e.g., `https://studynest.vercel.app`).
