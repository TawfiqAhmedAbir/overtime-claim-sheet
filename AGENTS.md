# Agent guide — Overtime Claim Sheet

Read this file first when starting a new chat in this repository.

## What this project is

A **mobile-first PWA** for **Qaiser Nazneen** (Adult Phlebotomist, site **DH**) to log monthly overtime on her phone and download the **official Synnovis Staff Timesheet – Phlebotomy** Excel file filled correctly.

**Live site:** https://tawfiqahmedabir.github.io/overtime-claim-sheet/

**Repo:** https://github.com/TawfiqAhmedAbir/overtime-claim-sheet (branch **`main`**, remote **`origin`**)

**Agent onboarding:** this file + `.cursor/rules/project-context.mdc` (always applied in Cursor). Keep both in sync when project status changes.

Mom should **Add to Home Screen** on her phone and use the live URL — not localhost.

---

## Non-negotiable requirement

The downloaded file must come from the **exact bundled template**:

- `public/template.xlsx` (source: Synnovis `Claim Sheet October.xlsx`)

**Do not** recreate the spreadsheet layout in code. Load the template, write specific cells, download.

---

## Current status (V1 — shipped)

| Area | Status |
|------|--------|
| Month picker + entry list | Done |
| Add / edit / delete overtime | Done |
| Auto-save on phone (localStorage) | Done |
| Profile in Settings (name, job, site) | Done |
| Download filled `.xlsx` | Done |
| PWA + offline after first visit | Done |
| GitHub Pages auto-deploy on push to `main` | Done |
| Excel opens without recovery warning | Fixed (`stripFormulaResults`) |

---

## How the app works (user flow)

1. Open app → current month shown
2. **+ Add overtime** → date, start, finish, break, hours claimed → **Save**
3. Entries persist on the device; she can add more anytime
4. **Download claim sheet** → `Claim Sheet {Month} {Year}.xlsx`

**Business rules:**

- **One entry per calendar day** (Excel has one row per day). Adding the same day again **replaces** the existing entry.
- **Column D (Shift)** = overtime **claimed** as text (e.g. `5 hour 30 min`) — **not** auto-calculated from start/finish minus break.
- **Times** in E/F are supporting detail; mom enters claimed hours separately.

---

## Excel template — cell map

| Cell(s) | Purpose |
|---------|---------|
| **H7** | Month anchor = 1st of selected month (`mmm-yy` format). Use **UTC noon** (`Date.UTC`) to avoid timezone shifting the date. |
| **B15:B45** | Day numbers (formulas — do not overwrite) |
| **C15:C45** | Weekday names (formulas — do not overwrite) |
| **D{row}** | Shift / hours claimed (text) |
| **E{row}** | Start time |
| **F{row}** | Finish time |
| **G{row}** | Break (`1 hour`, `30 min`, or empty) |
| **H46** | Total as text, e.g. `26 hours` |
| **C6, G6, F7, B49** | Profile: name, job title, site, signature line |

**Row mapping:** `row = dayOfMonth + 14` (day 1 → row 15, day 7 → row 21).

**Golden test reference** (August 2026, 26 hours total):

| Day | Shift | Start | Finish | Break |
|-----|-------|-------|--------|-------|
| 7 | 5 hour | 07:00 | 12:00 | — |
| 10 | 5 hour 30 min | 07:00 | 17:30 | 1 hour |
| 12 | 5 hour 30 min | 07:00 | 17:30 | 1 hour |
| 14 | 5 hour | 07:00 | 13:00 | 1 hour |
| 30 | 2 hour 30 min | 07:30 | 14:00 | — |
| 31 | 2 hour 30 min | 07:30 | 14:00 | — |

Run `npm run test:excel` after any change to `src/lib/excel.ts`.

---

## Critical Excel export fix

**Problem:** ExcelJS round-trip save wrote `<v>NaN</v>` as cached formula results. Excel showed: *"We found a problem with some content…"*

**Fix:** `stripFormulaResults()` in `src/lib/excel.ts` — removes cached `result` from all formula cells before `writeBuffer()`. Excel recalculates on open.

**Test guard:** `scripts/test-excel.mjs` mirrors the same helper and fails if output XML contains `<v>NaN</v>`.

**Never remove this** without re-verifying output in Microsoft Excel on Windows.

---

## Architecture

```
public/template.xlsx     ← exact Synnovis template (never generate from scratch)
src/
  App.tsx                ← screens: home, add, edit, settings
  components/            ← EntryForm, EntryList, MonthPicker, Settings, DownloadModal
  lib/
    excel.ts             ← template load, fill, download
    storage.ts           ← localStorage (profile + entries by month key)
    hours.ts             ← parse/format shift text ("5 hour 30 min" → 5.5)
    dates.ts             ← row mapping, month helpers, UTC dates
  types.ts
.github/workflows/deploy.yml  ← GitHub Pages
```

**Stack:** React 19, Vite 7, TypeScript, ExcelJS, vite-plugin-pWA

**Storage key:** `overtime-sheet-v1` in localStorage

**Month key format:** `YYYY-MM` (e.g. `2026-08`)

---

## Commands

```bash
npm install
npm run dev          # local dev (also exposes LAN URL for phone testing)
npm run build        # production build → dist/
npm run preview      # serve dist/
npm run test:excel   # golden test — must pass after excel.ts changes
```

---

## Deployment

**Shipped:** 31 Aug 2026 — V1 live on GitHub Pages; auto-deploy verified.

Push to **`main`** → GitHub Actions (`.github/workflows/deploy.yml`) builds with `npm ci && npm run build` and deploys `dist/` to Pages.

| Setting | Value |
|---------|--------|
| Pages URL | https://tawfiqahmedabir.github.io/overtime-claim-sheet/ |
| Build type | GitHub Actions (not branch `/docs`) |
| Vite `base` | `'./'` — required for project Pages subpath |
| PWA `start_url` / `scope` | `'./'` in `vite.config.ts` |

**Pushing workflow files:** `gh`/git token needs **`workflow`** scope or GitHub rejects `.github/workflows/*` updates.

**After code changes:** push to `main`, then check [Actions](https://github.com/TawfiqAhmedAbir/overtime-claim-sheet/actions) — deploy usually completes in ~1 min.

---

## V2 backlog (not built yet)

Prioritise only when user asks:

1. **Same as last time** — duplicate previous entry, change date
2. **Undo delete**
3. **Share sheet** after download (mobile share API)
4. **Remember usual shift** — default start/finish/break
5. **Month-end reminder**
6. **Large text mode**
7. **Export/backup** entries for new phone

---

## Next steps for future agents

1. **Read this file first** — update it (and `project-context.mdc`) when shipping features or changing deploy/status.
2. **Before changing Excel logic:** run `npm run test:excel`, then manually open output in Excel on Windows.
3. **If employer sends a new template:** replace `public/template.xlsx`, re-run golden test, adjust cell map if layout changed.
4. **If mom reports wrong rows/dates:** check H7 UTC handling and `dayToRow()` in `src/lib/dates.ts`.
5. **If Excel recovery dialog returns:** inspect sheet XML for `<v>NaN</v>`; ensure `stripFormulaResults()` still runs before save.
6. **For new features:** keep mobile-first UX, plain English labels, minimal scope. User prefers plan-first; reply with plan and wait for **Go** before large changes.
7. **Do not commit** unless the user explicitly asks.

---

## Default profile (pre-filled)

- Name: Qaiser Nazneen
- Job: Adult Phlebotomist
- Site: DH
- Department: Phlebotomy (static in template)

---

## Original template location (user's PC)

`C:\Users\tawfi\OneDrive\Documents\Work\Claim Sheet October.xlsx` (and related monthly files in that folder)

Use these only to refresh `public/template.xlsx` if the employer updates the form — not for runtime.
