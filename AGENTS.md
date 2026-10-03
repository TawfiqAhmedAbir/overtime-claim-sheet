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

## Current status (V6 — shipped)

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
| Warm UI, ConfirmSheet, share/download | Done (V2) |
| Auto overtime calculation | Done (V3) |
| Normal shift length in Settings (default 4 hr) | Done (V3) |
| Weekend + UK bank holiday full-OT days | Done (V3) |
| **Native time inputs (start/finish)** | Done (V6) |
| **Full form on one screen (no wizard)** | Done (V6) |
| **Break: 3 chips + Other dropdown** | Done (V6) |
| **Overtime override via dropdown** | Done (V6) |

---

## How the app works (user flow)

1. Open app → current month, profile snippet, total hours hero
2. **+ Add overtime** or **Same as last time** → **all fields visible at once** on one screen
3. Tap **Start time** / **Finish time** → phone’s native time picker (Android: clock dial; iPhone: scroll wheels)
4. **Break:** tap **No break** / **30 min** / **1 hour**, or **Other…** → dropdown (15 min, 45 min, 1 hr 30, 2 hr)
5. App **calculates overtime** and shows it — change via **dropdown** only if wrong (no free typing)
6. **Send claim sheet** (share icon on phone when supported) → **Share…** opens the **system share sheet** (whatever apps the phone offers), or **Save to this phone** → `Claim Sheet {Month} {Year}.xlsx`

**Business rules:**

- **One entry per calendar day** (Excel has one row per day). Adding the same day again **replaces** the existing entry.
- **Column D (Shift)** = overtime as text (`5 hour 30 min`) — **auto-calculated** by default; user may override via **dropdown** only (valid Excel format guaranteed).
- **Overtime formula (weekday):** `(finish − start − break) − normalShiftHours` (normal shift from Settings, default **4 hr**).
- **Weekends + UK bank holidays:** whole on-site time counts as overtime (no normal-shift subtraction). Manual **“Whole shift is overtime”** toggle for edge cases.
- **Times** in E/F and break in G are still written to Excel as entered.

---

## UX history (do not repeat without user asking)

These were tried and **rejected** by the user (mom + developer):

| Approach | Why dropped |
|----------|-------------|
| Scroll button lists (V3) | Ugly; page jumped to overtime (`scrollIntoView`) |
| Drum / wheel pickers (V4) | Still unintuitive on phone |
| +/- steppers (V5) | Absurd tap count (e.g. 45 taps for `:45`) |
| Start → Next → Finish wizard (V4–V5) | User wants everything on one screen |

**Current (V6):** native `<input type="time">`, chips + `<select>` for break/overtime. If user asks to change time UX again, discuss **typed time** or **hour/minute dropdowns** — not steppers or custom scroll wheels.

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
  App.tsx
  components/
    TimeField.tsx        ← native type="time" (start/finish)
    BreakPicker.tsx      ← 3 chips + Other select
    OvertimeField.tsx    ← auto calc hero + breakdown + override select
    DayPicker, EntryForm, EntryList, Settings, DownloadModal, ConfirmSheet, StatCard
  lib/
    hours.ts             ← calculateOvertime, formatShiftClaimFromMinutes, break options
    bankHolidays.ts      ← UK bank holiday dates (extend annually)
    excel.ts, storage.ts, dates.ts
  types.ts               ← WorkSettings, UsualShift, OvertimeEntry
.github/workflows/deploy.yml
```

**Stack:** React 19, Vite 7, TypeScript, ExcelJS, vite-plugin-pWA

**Storage key:** `overtime-sheet-v1` in localStorage

**Stored fields:** `profile`, `entries`, `usualShift` (start/finish/break), `workSettings` (normalShiftHours), `preferences`

---

## Commands

```bash
npm install
npm run dev          # local dev (also exposes LAN URL for phone testing)
npm run build        # production build → dist/
npm run preview      # serve dist/
npm run test:excel     # golden test — must pass after excel.ts changes
npm run test:overtime  # overtime calc unit tests — must pass after hours.ts changes
```

---

## Deployment

**Shipped:** V1 Aug 2026, V2 UI/UX Aug 2026, V3 auto overtime Aug 2026, V6 simple native inputs Aug 2026 — live on GitHub Pages.

Push to **`main`** → GitHub Actions (`.github/workflows/deploy.yml`) builds with `npm ci && npm run build` and deploys `dist/` to Pages.

| Setting | Value |
|---------|--------|
| Pages URL | https://tawfiqahmedabir.github.io/overtime-claim-sheet/ |
| Build type | GitHub Actions (not branch `/docs`) |
| Vite `base` | `'./'` — required for project Pages subpath |
| PWA `start_url` / `scope` | `'./'` in `vite.config.ts` |

**Pushing workflow files:** `gh`/git token needs **`workflow`** scope or GitHub rejects `.github/workflows/*` updates.

**After code changes:** push to `main`, then check [Actions](https://github.com/TawfiqAhmedAbir/overtime-claim-sheet/actions) — deploy usually completes in ~1 min. Mom may need to **hard refresh** or re-open from home screen after deploy (PWA cache).

---

## V7 backlog (not built yet)

Prioritise only when user asks:

1. ~~**Alternative time input on Android**~~ — **shipped:** hour + minute dropdowns on Android; iPhone keeps native `type="time"`. Optional later: typed `07:45` or Settings override.
2. ~~**Export/backup** entries for new phone~~ — **shipped:** JSON export/import in Settings.
3. ~~**Share-first claim sheet UX**~~ — **shipped:** system share sheet on supported mobile browsers (`src/lib/share.ts`).
4. **Month-end reminder** — needs notification permission strategy
5. **Code-split ExcelJS** — reduce main bundle size
6. **Extend bank holiday list** beyond 2027 automatically

---

## V6 backlog (shipped Aug 2026)

1. ~~Native time inputs for start/finish~~
2. ~~Remove start/finish wizard — full form on one screen~~
3. ~~Break 3 chips + Other dropdown~~
4. ~~Overtime override dropdown (no free typing)~~

---

## V3 backlog (shipped Aug 2026)

1. ~~Auto overtime calculation~~
2. ~~Normal shift in Settings~~
3. ~~Weekend + bank holiday rules~~

---

## V2 backlog (shipped Aug 2026)

1. ~~Same as last time~~
2. ~~Undo delete~~
3. ~~Share sheet after download~~
4. ~~Remember usual shift~~
5. ~~Large text mode~~
6. ~~Warm UI + ConfirmSheet + DayPicker~~

---

## Next steps for future agents

1. **Read this file first** — update it (and `project-context.mdc`) when shipping features or changing deploy/status.
2. **Before changing Excel logic:** run `npm run test:excel`, then manually open output in Excel on Windows.
3. **If employer sends a new template:** replace `public/template.xlsx`, re-run golden test, adjust cell map if layout changed.
4. **If mom reports wrong rows/dates:** check H7 UTC handling and `dayToRow()` in `src/lib/dates.ts`.
5. **If Excel recovery dialog returns:** inspect sheet XML for `<v>NaN</v>`; ensure `stripFormulaResults()` still runs before save.
6. **If mom reports stale UI on phone:** PWA cache — hard refresh or remove/re-add home screen shortcut after deploy.
7. **For new features:** keep mobile-first UX, plain English labels, minimal scope. User prefers plan-first; reply with plan and wait for **Go** before large changes.
8. **Do not commit** unless the user explicitly asks.

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
