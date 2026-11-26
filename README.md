# The Marlowe Household — Household Budget Site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/cocolats18-svg/best-household-budget-site-20261126-1457-entry/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/cocolats18-svg/best-household-budget-site-20261126-1457-entry/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A complete original household budget site for a fictional family — Maya, Tom, Leo and June Marlowe — keeping their November 2026 budget. It runs entirely from static files with no network request, on a desktop and on a phone.

## What it does

- **Dashboard** — income $7,830 vs spent $3,327 vs $4,503 left, savings progress, a donut of spending by category, a 6-month income-vs-spending bar chart, recent transactions and bills still due.
- **Transactions** — 27 real entries, a working add-transaction form (saved in the browser), category filter, per-row delete, and a reset button.
- **Budget** — 9 per-category monthly budgets with progress bars, percent used, remaining amounts and over/near warnings.
- **Bills** — 8 bills with due dates and working paid/unpaid toggles, with still-to-pay vs already-paid totals.
- **Goals** — 4 savings goals with progress bars and working add-contribution controls.

Every figure is computed live from the household's data; every control does what it says.

## Files

- `app/index.html` — the page and navigation
- `app/style.css` — layout, palette and phone layout
- `app/data.js` — the household's seed figures
- `app/views.js` — routing, rendering, charts and interactions
- `app/main.js` — bootstrap
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output and writes `dossier.json`
- `screenshots/` — four real renders of the site's own code in a headless browser

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Hand it in with `MAKEFUN_OUTPUT_DIR=out node main.ts`.
