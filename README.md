# Forecash — See tomorrow's cash today

Forecash is an AI cash-flow copilot for small and growing businesses in Bangladesh. It warns an owner **weeks before cash runs short**, builds a rescue plan from the business's own records, and shows the **true cost of every loan** — in Bangla, Banglish or English. It never moves money.

> **Status: Round 1 static prototype.** Everything you see runs in the browser with sample data for one fictional business ("Rahim Garments"). There is **no backend, no database, no API and no AI model** in this repository yet. These will be built during the official Aethermind 2026 build window (11–20 December 2026).

- **Team:** Kemon Dilam Bondhura
- **Competition:** BRAC Aethermind 2026 · Fintech track
- **SDG focus:** 8.3 (productive activities, entrepreneurship and growth of micro, small and medium enterprises, including access to financial services). Also supports 8.2 and 9.3.

## The problem

Most small businesses in Bangladesh keep records in notebooks, SMS alerts and memory. They find out about a cash shortage on the day a supplier bill or salary is due. Then they borrow in a hurry, often from expensive sources whose real yearly cost is hidden behind "flat" rates.

## What the prototype shows

| Screen | What it demonstrates |
| --- | --- |
| **Landing** | The product story, a sample 30-day cash outlook and the SDG impact |
| **Today** | Cash in hand, lowest point ahead, an early warning and a morning briefing |
| **Add records** | A Banglish voice note turned into draft entries, a bill photo, and bank or mobile-money SMS (all scripted) |
| **Cash radar** | 30-day outlook against the owner's safety reserve, with plan A and plan B compared |
| **Customers** | Who owes money and when they usually really pay, plus a polite reminder draft in Bangla or English |
| **Loans** | Bank, NBFI and supplier-finance offers compared by true yearly cost and total taka paid |
| **Insights** | Product margins, market watch and A/B/C strategy ideas |
| **Passport** | A shareable summary of the business's cash discipline for lenders |
| **Alerts** | The warnings the owner would receive |

The interface switches between English and Bangla, and works on phones and desktops.

## Run it locally

Requires Node.js 20 or later.

```bash
npm ci
npm run dev       # development server
npm run build     # type-check and production build into dist/
npm run preview   # serve the production build
```

## Tech stack (Round 1)

- React 19, TypeScript, Vite
- Hand-written CSS and inline SVG (chart, icons) — no UI or chart library
- Google Fonts: Plus Jakarta Sans, Hind Siliguri
- Hosted as a static site on Vercel

## Planned for the build phase (11–20 Dec 2026)

Nothing below exists in this repository yet; it is the plan the team will build during the official window.

- A backend and database to store a business's records securely
- Forecasting of daily cash balance from the business's own history
- Bangla and Banglish voice and photo input turned into draft entries that the owner confirms
- Loan cost calculation from the lender's stated terms
- Every AI tool or API used will be listed in the section below when it is added

## AI tools and external services used

| Tool | Used for |
| --- | --- |
| Claude Code (Anthropic) | Helped write the prototype's interface code and this README, under the team's direction and review |
| Google Fonts | Web fonts |
| Vercel | Static hosting |

The prototype itself contains no AI model and makes no calls to any AI service. All numbers, names and messages in it are sample data.

## Competition rules compliance

- This repository was created on 26 November 2026 for Aethermind 2026; it contains no code from earlier projects.
- Before 11 December 2026, 12:00 PM, it contains only the static front-end prototype and documentation.
- Licensed under MIT (see [LICENSE](LICENSE)).

## License

[MIT](LICENSE) © 2026 Team Kemon Dilam Bondhura
