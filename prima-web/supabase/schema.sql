-- ============================================================================
-- PRIMA+ — Supabase schema (PRIMA+ OPSI 2026)
-- Jalankan di Supabase Dashboard → SQL Editor, atau via supabase CLI/MCP.
-- ============================================================================
-- Identitas siswa: ANONIM (cookie participant_id). Tidak pakai Supabase Auth.
--   - Siswa: insert jawaban via publishable (anon) key.
--   - Admin/read/export/content CRUD: via SERVICE ROLE key (server-only, tidak NEXT_PUBLIC).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- RESEARCH DATA
-- ---------------------------------------------------------------------------

create table if not exists public.participants (
  id bigint generated always as identity primary key,
  code text unique not null,
  name text not null,
  kelas text not null,
  stage text not null default 'registered',
  pretest_total integer,
  posttest_total integer,
  game_score integer,
  game_max integer,
  reflection text,
  created_at timestamptz not null default now()
);

-- Progres dunia PRIMA CITY (fleksibel → JSONB)
create table if not exists public.world_progress (
  participant_id bigint primary key references public.participants(id) on delete cascade,
  episodes_done jsonb not null default '[]',
  cards jsonb not null default '[]',
  skills jsonb not null default '[]',
  game_scores jsonb not null default '{}',
  boss_defeated boolean not null default false
);

-- Jawaban siswa (sumber analisis)
create table if not exists public.pretest_answers (
  id bigint generated always as identity primary key,
  participant_id bigint not null references public.participants(id) on delete cascade,
  item_id integer not null,
  dimension text not null,
  answer text not null,
  score integer not null
);
create table if not exists public.game_answers (
  id bigint generated always as identity primary key,
  participant_id bigint not null references public.participants(id) on delete cascade,
  scenario_id integer not null,
  construct text not null,
  chosen text,
  is_correct integer
);
create table if not exists public.posttest_answers (
  id bigint generated always as identity primary key,
  participant_id bigint not null references public.participants(id) on delete cascade,
  item_id integer not null,
  dimension text not null,
  answer text not null,
  score integer not null
);
create table if not exists public.response_answers (
  id bigint generated always as identity primary key,
  participant_id bigint not null references public.participants(id) on delete cascade,
  item_id integer not null,
  answer text not null,
  score integer not null
);

-- ---------------------------------------------------------------------------
-- CONTENT (CRUD admin)
-- ---------------------------------------------------------------------------

create table if not exists public.edu_modules (
  id bigint generated always as identity primary key,
  sort_order integer not null default 0,
  title text not null,
  dimension text not null default '',
  body text not null
);
create table if not exists public.pretest_items (
  id bigint generated always as identity primary key,
  sort_order integer not null default 0,
  dimension text not null,
  statement text not null
);
create table if not exists public.game_scenarios (
  id bigint generated always as identity primary key,
  sort_order integer not null default 0,
  construct text not null,
  case_type text not null,
  task text not null,
  situation text not null,
  options_json text not null,
  feedback text not null
);
create table if not exists public.game_reflection_questions (
  id bigint generated always as identity primary key,
  sort_order integer not null default 0,
  question text not null
);
create table if not exists public.response_items (
  id bigint generated always as identity primary key,
  sort_order integer not null default 0,
  statement text not null
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
create index if not exists idx_pretest_answers_pid on public.pretest_answers(participant_id);
create index if not exists idx_game_answers_pid on public.game_answers(participant_id);
create index if not exists idx_posttest_answers_pid on public.posttest_answers(participant_id);
create index if not exists idx_response_answers_pid on public.response_answers(participant_id);

-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================
alter table public.participants enable row level security;
alter table public.world_progress enable row level security;
alter table public.pretest_answers enable row level security;
alter table public.game_answers enable row level security;
alter table public.posttest_answers enable row level security;
alter table public.response_answers enable row level security;
alter table public.edu_modules enable row level security;
alter table public.pretest_items enable row level security;
alter table public.game_scenarios enable row level security;
alter table public.game_reflection_questions enable row level security;
alter table public.response_items enable row level security;

-- Siswa (anon/authenticated) boleh INSERT partisipan & jawaban (tanpa auth, etika penelitian).
-- Tidak ada SELECT/UPDATE/DELETE untuk anon/authenticated — semua baca/ekspor lewat service role.
-- Catatan arsitektur: publishable key Supabase baru adalah opaque (bukan JWT) sehingga ditolak
-- REST gateway untuk write. Oleh karena itu SELURUH tulis data lewat SERVICE ROLE key (server-only)
-- di Server Actions. Policy ini tetap diberikan agar insert via publishable/anon tetap sah bila suatu
-- saat diaktifkan, dan agar grant di bawah konsisten.
-- (drop policy if exists agar schema.sql idempoten / bisa dijalankan berulang.)
drop policy if exists "allow insert participants" on public.participants;
create policy "allow insert participants" on public.participants
  for insert to anon, authenticated with check (true);
drop policy if exists "allow insert world_progress" on public.world_progress;
create policy "allow insert world_progress" on public.world_progress
  for insert to anon, authenticated with check (true);
drop policy if exists "allow insert pretest_answers" on public.pretest_answers;
create policy "allow insert pretest_answers" on public.pretest_answers
  for insert to anon, authenticated with check (true);
drop policy if exists "allow insert game_answers" on public.game_answers;
create policy "allow insert game_answers" on public.game_answers
  for insert to anon, authenticated with check (true);
drop policy if exists "allow insert posttest_answers" on public.posttest_answers;
create policy "allow insert posttest_answers" on public.posttest_answers
  for insert to anon, authenticated with check (true);
drop policy if exists "allow insert response_answers" on public.response_answers;
create policy "allow insert response_answers" on public.response_answers
  for insert to anon, authenticated with check (true);

-- Konten: anon/authenticated boleh SELECT (halaman game/pretest membaca). Tidak ada write untuk keduanya.
drop policy if exists "allow select edu_modules" on public.edu_modules;
create policy "allow select edu_modules" on public.edu_modules for select to anon, authenticated using (true);
drop policy if exists "allow select pretest_items" on public.pretest_items;
create policy "allow select pretest_items" on public.pretest_items for select to anon, authenticated using (true);
drop policy if exists "allow select game_scenarios" on public.game_scenarios;
create policy "allow select game_scenarios" on public.game_scenarios for select to anon, authenticated using (true);
drop policy if exists "allow select game_reflection_questions" on public.game_reflection_questions;
create policy "allow select game_reflection_questions" on public.game_reflection_questions for select to anon, authenticated using (true);
drop policy if exists "allow select response_items" on public.response_items;
create policy "allow select response_items" on public.response_items for select to anon, authenticated using (true);

-- Catatan: INSERT/UPDATE/DELETE pada semua tabel (termasuk konten) dan SELECT/UPDATE/DELETE
-- pada data penelitian dilakukan lewat SERVICE ROLE key di Server Actions (bypass RLS).
-- Service role otomatis punya all privileges; tidak perlu policy eksplisit.
-- PASTIKAN SUPABASE_SERVICE_ROLE_KEY hanya ada di server env, bukan NEXT_PUBLIC_*.

-- ===========================================================================
-- DATA API EXPOSURE (GRANT)
-- ===========================================================================
-- Supabase membutuhkan GRANT eksplisit agar role anon/authenticated bisa akses tabel via Data API.
-- Service role otomatis punya all privileges (tidak perlu grant).
grant usage on schema public to anon, authenticated;
grant insert, update, delete on table
  public.participants, public.world_progress,
  public.pretest_answers, public.game_answers,
  public.posttest_answers, public.response_answers
  to anon, authenticated;
grant select on table
  public.edu_modules, public.pretest_items, public.game_scenarios,
  public.game_reflection_questions, public.response_items
  to anon, authenticated;
