-- ============================================================================
-- PRIMA+ — Activity schema (input siswa: chat, mini-games, kart, quiz, feedback)
-- Jalankan SETELAH schema.sql. Menangkap semua interaksi siswa untuk analisis.
-- ============================================================================
-- Identitas: partisipan anonim (cookie participant_id dikirim sebagai FK).
-- Semua tulis lewat SERVICE ROLE key (server-only). RLS diaktifkan, grant ke
-- anon/authenticated agar insert via publishable tetap sah bila diaktifkan.
-- ============================================================================

-- Chat (PRIMA WORLD): tiap skenario + refleksi diri.
create table if not exists public.chat_answers (
  id bigint generated always as identity primary key,
  participant_id bigint not null references public.participants(id) on delete cascade,
  scenario_index integer not null,
  scenario_title text not null,
  domain text,                        -- tag skenario (mis. "CONTEXT AWARENESS")
  chosen_text text,
  tone text,
  is_correct integer,                 -- 1 good, 0 mid/bad
  reflections jsonb not null default '[]'
);

-- Tambah kolom domain bila tabel sudah ada (idempoten):
alter table public.chat_answers add column if not exists domain text;

-- Activity log generik: mini-game / kart / quiz / world hub.
-- Satu baris per sesi permainan. detail_json menyimpan hasil spesifik tiap game.
create table if not exists public.activity_log (
  id bigint generated always as identity primary key,
  participant_id bigint not null references public.participants(id) on delete cascade,
  activity_key text not null,          -- 'context-match', 'language-kart', 'quiz', dll
  activity_type text not null,         -- 'mini_game' | 'kart' | 'quiz' | 'world'
  score integer,
  accuracy integer,                    -- persen 0-100
  correct integer,
  total integer,
  duration_ms integer,
  detail_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Feedback / curhat siswa.
create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  participant_id bigint references public.participants(id) on delete set null,
  message text not null,
  favorite_part text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
create index if not exists idx_chat_answers_pid on public.chat_answers(participant_id);
create index if not exists idx_activity_log_pid on public.activity_log(participant_id);
create index if not exists idx_activity_log_key on public.activity_log(activity_key);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.chat_answers enable row level security;
alter table public.activity_log enable row level security;
alter table public.feedback enable row level security;

-- Siswa boleh INSERT (via service role di client komponen).
drop policy if exists "allow insert chat_answers" on public.chat_answers;
create policy "allow insert chat_answers" on public.chat_answers for insert to anon, authenticated with check (true);
drop policy if exists "allow insert activity_log" on public.activity_log;
create policy "allow insert activity_log" on public.activity_log for insert to anon, authenticated with check (true);
drop policy if exists "allow insert feedback" on public.feedback;
create policy "allow insert feedback" on public.feedback for insert to anon, authenticated with check (true);

-- GRANT (Data API exposure)
grant usage on schema public to anon, authenticated;
grant insert, update, delete on table
  public.chat_answers, public.activity_log, public.feedback
  to anon, authenticated;
