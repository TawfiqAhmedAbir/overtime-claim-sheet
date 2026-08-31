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

Live site: https://tawfiqahmedabir.github.io/overtime-claim-sheet/

Pushing to `main` deploys automatically. On a phone, open the site and use **Add to Home Screen**.

## How it works

- Pick a month and add overtime entries (saved on the phone)
- Download generates `Claim Sheet {Month} {Year}.xlsx` from the exact bundled template
- Profile details (name, job title, site) are saved once in Settings
