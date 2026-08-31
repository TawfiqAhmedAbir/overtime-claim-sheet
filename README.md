# Overtime Claim Sheet

Mobile web app for logging overtime and downloading the official Synnovis phlebotomy claim sheet.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Excel golden test

```bash
npm run test:excel
```

## GitHub Pages

1. Push this repo to GitHub
2. Enable GitHub Pages from GitHub Actions
3. Share the published URL with your mom
4. She can tap **Add to Home Screen** on her phone

## How it works

- Pick a month and add overtime entries (saved on the phone)
- Download generates `Claim Sheet {Month} {Year}.xlsx` from the exact bundled template
- Profile details (name, job title, site) are saved once in Settings
