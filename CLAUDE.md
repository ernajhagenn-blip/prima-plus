# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A working directory for **Proposal PRIMA+** — an Indonesian high-school research submission for **OPSI MAN 2026** (Olimpiade Penelitian Siswa Indonesia), in the Social Humanities (ISH) subfield of Language & Literature.

**Research title:** *Kesadaran Berbahasa Remaja melalui Media PRIMA+ untuk Menguatkan Loyalitas Bahasa Indonesia di Lingkungan Sekolah.*

**Product:** PRIMA+ — a digital platform (planned: ReactJS + Express.js + Firebase + Gemini API, delivered as PWA) that uses language-awareness gamification to strengthen Indonesian-language loyalty among teenagers at MAN Kotawaringin Timur.

This is **not** an application codebase. There is no app to run, no test suite, no CI. It is a research-deliverable workspace: Python and Node scripts that *generate* the Word/PDF/Excel artifacts that go to the judges, plus Markdown reports that record the audit/review process.

## Security note (read first)

**There is no `.gitignore` in this repo today.** Before any commit, manually exclude `credentials.json` (Google OAuth client secret) and `drive_token.json` (Google OAuth refresh token). `upload_to_drive.py` reads `credentials.json` from the repo root and writes `drive_token.json` at the repo root. Frontend code for PRIMA+ (when written) must not embed any API keys — keep Gemini credentials server-side only.

## Directory layout

```
_aktif/        ← CURRENT deliverables (latest DOCX outputs, the audit MDs, user_profile.json, prima_media/)
_archive/      ← superseded DOCX drafts and one-off generator scripts (do not edit)
outputs/       ← generated artifacts; build_rab_xlsx.mjs writes outputs/opsi_prima_rab/*.xlsx
prima_media/   ← source figures (image1.png, image2.jpeg) used during proposal drafting — DO NOT embed these
prima_prosedur_ADDIE_HIGH.png ← the figure actually embedded in the proposal (the ADDIE flowchart for PRIMA+)
__pycache__/   ← bytecode from build_*.py; safe to delete
user_profile.json ← session state: tech-stack decision, budget, last update
Panduan OPSI SMA Sederajat 2026.pdf ← official competition guideline (authoritative)
~$*.docx       ← Word lock files; safe to delete when Word is closed
node_modules/  ← symlink to codex runtime; do not edit by hand
```

`_aktif/` holds the **current** DOCX/MD outputs and references; `_archive/` holds **superseded** drafts and earlier `build_*.py` revisions. Both directories currently contain copies of most build scripts; **the canonical generators now live at the repo root** (`build_*.py`, `build_rab_xlsx.mjs`, `upload_to_drive.py`, `extract_docx.py`) and that is where commands below run them from. There is no `.gitignore` — see Security note above.

## Key authoritative files (read these before changing anything)

- **`Panduan OPSI SMA Sederajat 2026.pdf`** — official OPSI 2026 syle guide. The required chapter structure (BAB 1 Pendahuluan → BAB 4 RAB & Jadwal → Daftar Pustaka, with exact subbab names) is summarized in `AUDIT_SISTEMATIKA_PROPOSAL_PRIMA_OPSI_2026.md`. New proposal edits must conform to that structure; do not invent subbab names.
- **`AUDIT_SISTEMATIKA_PROPOSAL_PRIMA_OPSI_2026.md`** — structural audit of an earlier draft against the official guide. It documents which subbabs are non-conforming and how to merge them into the official ones.
- **`PRIMA_RESEARCH_REVIEW.md`** — full substantive review (research questions, indicators, method design, references). Authoritative source for the indicators, R&D + one-group pretest-posttest design, and reference style.
- **`PRIMA_PEER_REVIEW_REPORT.md`** — peer review of the v2 full paper. Confirms ISH framing (abstract must NOT lead with tech stack like "ReactJS/Express.js/Firebase/Gemini API/PWA"; keywords likewise). Tech-stack details are acceptable inside Metode (Tabel alat dan bahan) but not in Abstrak, Kata Kunci, or BAB 4 narrative.

## Document-generation pipeline

All DOCX artifacts are produced by Python scripts using **`python-docx`**. The shared helpers — `set_run`, `set_p`, `add_p`, `add_center`, `add_heading`, `add_list`, `shade_cell`, `set_cell`, `add_table` — are defined identically at the top of each `build_*.py`. Fonts are forced to **Times New Roman**; `add_table` uses `Table Grid` style with shaded headers.

Run a generator from the repo root (paths are relative to cwd):

```bash
python build_prima_proposal_ish_revision.py   # → Proposal_Penelitian_PRIMA_OPSI_2026_ISH_Revisi_RAB_Konkret_v2.docx + Tabel_Revisi_...
python build_full_paper_opsi_2026.py          # → Laporan_Penelitian_PRIMA_OPSI_2026_Draf_Full_Paper_v2.docx (also written to _aktif/)
python build_laporan_v3.py                     # → Laporan_Penelitian_PRIMA_OPSI_2026_v3_Struktur_Panduan.docx — current full-paper layout matching Panduan OPSI 2026 (BAB 5 Kesimpulan & Saran; RAB = Lampiran 1; includes Ucapan Terima Kasih + Pernyataan Penggunaan AI; BAB 4/5 use honest placeholders until data is collected) (also written to _aktif/)
python build_instrumen.py                     # → Instrumen_Penelitian_PRIMA.docx (5 lampiran) (also written to _aktif/)
python extract_docx.py                        # reads _archive/prima.docx → _archive/prima_extracted.txt + _archive/prima_structure.json
```

The budget `.xlsx` is generated with a **separate Node.js toolchain** that imports `@oai/artifact-tool`:

```bash
node build_rab_xlsx.mjs                       # → outputs/opsi_prima_rab/RAB_PRIMA_OPSI_2026_Rinci.xlsx
                                                #   (the Rp2.000.000 ceiling is hardcoded as `proposalLimit`)
```

Upload to Google Drive (manual interactive OAuth the first time):

```bash
python upload_to_drive.py
# requires credentials.json from Google Cloud Console placed at repo root
# stores token at drive_token.json at the repo root (NOT _aktif/)
```

## Engineering conventions

- **Word output font is always Times New Roman.** Do not switch to Calibri/Arial even if Word's defaults differ.
- **Tables** go through `add_table(doc, headers, rows, caption=...)` so the header row stays shaded `EDEDED` and centered.
- **Figures** are embedded as `prima_prosedur_ADDIE_HIGH.png` (the ADDIE flowchart for PRIMA+). The raw `prima_media/` images are the original sources — do not embed those, they were placeholders.
- **Style is "akademik_sederhana"** (per `user_profile.json`): straightforward Indonesian academic prose, not flowery. The audit file is the calibration reference for tone.
- **R&D method framing is fixed:** R&D (ADDIE) + one-group pretest-posttest. Indicators for "loyalitas berbahasa" are the six in `PRIMA_RESEARCH_REVIEW.md` § "Usulan Indikator" (sikap positif, kesetiaan penggunaan, kesadaran norma, kebanggaan, kemampuan memilih ragam, refleksi kritis).
- **Budget ceiling:** Rp2.000.000 (reviewer's stated constraint). Firebase Spark Plan + Gemini Free Tier are treated as Rp0. The `.xlsx` script encodes this ceiling in `proposalLimit`.

## Integrity constraints (from Panduan OPSI 2026)

The competition rules (recorded in `AUDIT_SISTEMATIKA...md` § Catatan Integritas Penelitian) allow AI only for: finding references, understanding the topic, sparking ideas. The substance of the proposal — writing, analysis, conclusions — must remain the student's own work. AI-generated text is a draft for the student to rewrite, not a final submission. Do not promote AI drafts to "final" without the student's pass.

## Known TODO / pain points surfaced by past reviews

- Title still considered too long by reviewers — alternative short titles are listed in `PRIMA_RESEARCH_REVIEW.md` § "Usulan Judul Lebih Ringkas".
- Daftar pustaka inconsistencies (e.g. Carter 2023 vs 2013, Fairclough publisher name) — must be reconciled before final submission.
- The previous draft contained the typo "pretest & protest" — verify all instances say "pretest & posttest".
