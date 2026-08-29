---
name: vercel-deploy-target
description: PRIMA+ web app deploys to Vercel root URL, not /prima-web subpath
metadata:
  type: project
---

PRIMA+ web app (`prima-web/`) deploys to **`prima-plus.vercel.app`** (root), NOT `prima-plus.vercel.app/prima-web`.

As of 2026-08-28 the repo removed `basePath` from `prima-web/next.config.ts` and deleted root `vercel.json`. `next.config.ts` now only has `images: { unoptimized: true }`. `NEXT_PUBLIC_BASE_PATH` is empty, so asset paths (`/sw.js`, `/manifest.webmanifest`, `/models/karts/*.glb`, icons) resolve at root.

**Why:** earlier the goal was a `/prima-web` subpath deploy; the remote repo (HEAD `f5f2c9f`) reverted that and consolidated on root deploy.

**How to apply:** if asked to redeploy or fix Vercel, set Root Directory = `prima-web` in Vercel dashboard (no `vercel.json` anymore). Don't re-add `basePath` unless the deploy target changes back to a subpath. Google Sheets integration (`src/lib/googleSheets.ts` + `prima-web/APPS_SCRIPT.gs`) and cookie-based session are now in the repo.

Cf. [[cloud-run-deploy]] for the alternative GCP Cloud Run path (standalone Docker).
