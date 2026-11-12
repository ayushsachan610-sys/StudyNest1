-- ==============================================================================
-- StudyNest Database Schema & Row-Level Security (RLS) Policies
-- Designed for Supabase / PostgreSQL
-- ==============================================================================
-- This schema enforces absolute privacy: Each student can only read, write,
-- update, or delete their own subjects, notes, files, planner tasks, and revision items.
-- ==============================================================================

-- 1. Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  major text,
  academic_term text,
  weekly_target_hours integer default 16,
  theme text default 'warm',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Students can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Students can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Subjects Table
create table if not exists public.subjects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  code text not null,
  color text default '#2E7D5B',
  icon text default 'BookOpen',
  description text,
  target_hours_per_week integer default 4,
  completed_hours_this_week numeric(4,1) default 0.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subjects enable row level security;

create policy "Students can view their own subjects"
  on public.subjects for select
  using (auth.uid() = user_id);

create policy "Students can insert their own subjects"
  on public.subjects for insert
  with check (auth.uid() = user_id);

create policy "Students can update their own subjects"
  on public.subjects for update
  using (auth.uid() = user_id);

create policy "Students can delete their own subjects"
  on public.subjects for delete
  using (auth.uid() = user_id);

-- 3. Resources / Files Table
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete cascade,
  name text not null,
  size_bytes bigint not null,
  type text not null,
  status text default 'ready',
  storage_path text,
  content_extract text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.resources enable row level security;

create policy "Students can view their own resources"
  on public.resources for select
  using (auth.uid() = user_id);

create policy "Students can insert their own resources"
  on public.resources for insert
  with check (auth.uid() = user_id);

create policy "Students can delete their own resources"
  on public.resources for delete
  using (auth.uid() = user_id);

-- 4. Notes Table
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete cascade not null,
  resource_id uuid references public.resources on delete set null,
  title text not null,
  content text default '',
  template_used text default 'blank',
  tags text[] default '{}',
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Students can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Students can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Students can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Students can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- 5. Tasks (Study Planner) Table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete cascade not null,
  title text not null,
  due_date date not null,
  estimated_minutes integer default 30,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean default false,
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;

create policy "Students can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Students can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Students can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Students can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- 6. Flashcard Decks Table
create table if not exists public.flashcard_decks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete cascade not null,
  title text not null,
  description text,
  source_note_id uuid references public.notes on delete set null,
  source_snippet text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.flashcard_decks enable row level security;

create policy "Students can view their own flashcard decks"
  on public.flashcard_decks for select
  using (auth.uid() = user_id);

create policy "Students can manage their own decks"
  on public.flashcard_decks for all
  using (auth.uid() = user_id);

-- 7. Flashcards Items Table
create table if not exists public.flashcards (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.flashcard_decks on delete cascade not null,
  front text not null,
  back text not null,
  difficulty text default 'unreviewed',
  reviews_count integer default 0,
  last_reviewed timestamp with time zone
);

alter table public.flashcards enable row level security;

create policy "Students can view flashcards in their own decks"
  on public.flashcards for select
  using (
    exists (
      select 1 from public.flashcard_decks
      where public.flashcard_decks.id = flashcards.deck_id
      and public.flashcard_decks.user_id = auth.uid()
    )
  );

create policy "Students can manage flashcards in their own decks"
  on public.flashcards for all
  using (
    exists (
      select 1 from public.flashcard_decks
      where public.flashcard_decks.id = flashcards.deck_id
      and public.flashcard_decks.user_id = auth.uid()
    )
  );

-- Indexes for lightning fast queries
create index if not exists idx_subjects_user on public.subjects(user_id);
create index if not exists idx_notes_subject on public.notes(subject_id);
create index if not exists idx_tasks_due on public.tasks(user_id, due_date, completed);
create index if not exists idx_resources_subject on public.resources(subject_id);
