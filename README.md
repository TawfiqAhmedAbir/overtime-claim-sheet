# Overtime Claim Sheet

Mobile web app for logging overtime and downloading the official **Synnovis Staff Timesheet – Phlebotomy** Excel file — filled correctly, from the real template.

**Live app:** https://tawfiqahmedabir.github.io/overtime-claim-sheet/

On a phone: open the link → **Add to Home Screen** → use like an app.

---

## For developers & AI agents

**Start here:** [AGENTS.md](./AGENTS.md) — project status, Excel cell map, architecture, known fixes, V2 backlog, and next steps for new chats.

---

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173 (LAN URL shown for phone testing)
npm run build
npm run test:excel   # verify Excel export (run after excel.ts changes)
```

---

## What it does

1. Pick a month (e.g. August 2026)
2. **+ Add overtime** — date, start, finish, break, hours claimed
3. Entries **save on the phone** automatically
4. **Download claim sheet** → `Claim Sheet August 2026.xlsx`

Profile (name, job title, site) is saved once under **Settings**.

---

## Deploy

Push to **`main`** → GitHub Actions deploys to Pages automatically.

Repo: https://github.com/TawfiqAhmedAbir/overtime-claim-sheet

---

## Project layout

| Path | Purpose |
|------|---------|
| `public/template.xlsx` | Official Synnovis template (do not replace with generated layout) |
| `src/lib/excel.ts` | Load template, fill cells, download |
| `src/lib/storage.ts` | localStorage persistence |
| `scripts/test-excel.mjs` | Golden test (6 entries → 26 hours) |
| `.github/workflows/deploy.yml` | GitHub Pages CI |

See [AGENTS.md](./AGENTS.md) for the full Excel cell map and business rules.
