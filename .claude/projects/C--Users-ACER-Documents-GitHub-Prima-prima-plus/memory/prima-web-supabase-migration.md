---
name: prima-web-supabase-migration
description: PRIMA+ web app status — Supabase migration, admin table, chat/game logging done; pending live verification + deploy
metadata:
  type: project
---

PRIMA+ web app (`prima-web/`, Next.js 16 App Router) — research-demo game platform for OPSI 2026.
Data layer migrated from local SQLite to **Supabase** (anon participants via `prima_participant_id` httpOnly cookie; no Supabase Auth).

**Done (committed `aa40a90`, pushed to `origin/master` 2026-08-29):**
- All student input persists to Supabase: `participants`, `pretest_answers`, `game_answers`, `posttest_answers`, `response_answers`, `activity_log`, `chat_answers`, `feedback` via service-role Server Actions.
- **Critical bug fixed**: `/api/activity` (route `src/app/api/activity/route.ts`) now reads `participant_id` from the **httpOnly request cookie server-side** — client JS could never read it, so `logActivity()` (in `src/lib/logActivity.ts`) silently no-op'd before. Verified via headless browser: 9 chat rows (8 scenarios + reflection) + activity_log rows persist per participant.
- Chat scenario tag ("CONTEXT AWARENESS" = `domain` field from `src/lib/chatChapters.ts`) now saved — added `chat_answers.domain` column + `domain` in route payload + `src/lib/exportData.ts` query/label. SQL `alter table public.chat_answers add column if not exists domain text;` was run in Supabase SQL Editor by user (column confirmed present).
- Admin page (`src/app/admin/page.tsx`) rewritten as functional data table: 8 dataset tabs (participants/pretest/game/posttest/respons/activity/chat/feedback), inline list + CSV export (`/api/export?dataset=`), stat cards. Password `prima2026` (`ADMIN_PASSWORD` in `.env.local`), cookie `prima_admin=1`.
- Wired every game/quiz/chat/feedback to log via `lib/useLogGameResult`, `lib/logActivity`, `ScenarioGame.tsx`.
- Added `.gitignore` (was missing — CLAUDE.md warns about this), excludes `.env*`, `credentials.json`, `drive_token.json`, `supabase/.temp/`, `node_modules/`.

**Credentials / access:**
- Admin password: `prima2026`.
- Supabase project ref `udhfafnwxdsghicrfmgj`, key via `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- **No Supabase CLI login / access token / DB connection string available in this env** → cannot run DDL directly; user runs SQL in Supabase SQL Editor.

**Pending / next steps (resume here):**
- User has NOT yet re-tested the live chat flow after the `domain` column was added (did not want to test chat before column existed). Should confirm "CONTEXT AWARENESS" tag now shows in admin under user's name.
- Live end-to-end playthrough of remaining games (7 ScenarioGame games: battle-card, caption-garage, chat-crash, code-mix-mirror, context-switch, meaning-detective, nusantara-quest) not browser-verified — only chat + context-match mini-game verified.
- `supabase/.temp/` dir still on disk (locked by running Supabase CLI `link`); gitignored, harmless.
- Deploy target: Vercel root `prima-plus.vercel.app`, Root Directory=`prima-web`, basePath removed (see [[vercel-deploy-target]]).

**Why:** research demo must capture per-student answers for OPSI analysis; integrity rule (CLAUDE.md) keeps students anonymous (cookie, no auth) and keeps AI text as draft only.
**How to apply:** before claiming chat/game logging works, verify in real browser (puppeteer or Chrome DevTools MCP) since the httpOnly-cookie bug was invisible in unit/logic checks. Any new DB column needs user-run SQL + app-side wiring.
