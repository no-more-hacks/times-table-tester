# Times Table Tester

A standalone times table quiz app. Runs entirely in the browser — no server required.

**Live app:** https://[your-github-username].github.io/times-table-tester/

---

## What it does

- Timed multiple-choice quiz for times tables 1–20
- Pick which tables to practise, set a duration, and go
- Quick-launch presets for common configurations
- Full results breakdown at the end

---

## Architecture decisions

| Concern | Decision | Reason |
|---|---|---|
| Stack | Vite + React + TypeScript | Static build output, first-class TS, fast dev server |
| Styling | Tailwind CSS | Utility-first, responsive breakpoints, no separate CSS file |
| State | `useReducer` in a custom hook | Explicit state transitions, no external library needed |
| Question generation | Lazy (one at a time) | Supports unlimited questions without pool exhaustion |
| Distractors | Adjacent multiples of same/neighbouring tables | Pedagogically plausible — tempting to someone who almost knows it |
| Timer | `setInterval` at 100ms | Smooth countdown without over-engineering |
| Deployment | GitHub Actions → `gh-pages` branch | Build artefacts stay off `main` |

---

## Question modes

Phase 1 implements **multiple choice**. Future phases add more modes — see [TODO.md](./TODO.md).

---

## Presets

| Name | Tables | Duration |
|---|---|---|
| Standard (default) | 2–12 | 60 s |
| Junior | 2–5 | 90 s |
| Extended | 2–20 | 120 s |
| Speed Round | 2–12 | 30 s |

---

## Quiz behaviour

- **Answer feedback:** correct answer flashes green, wrong answer flashes red, then next question loads automatically after ~600ms
- **Score:** hidden during the quiz, shown in full on the results screen
- **Timer:** counts down; quiz ends when it reaches zero
- **Keyboard:** keys `1`–`4` map to the four answer buttons (desktop)

---

## Staged build plan

| Stage | Goal | Status |
|---|---|---|
| 1 | Skeleton + build pipeline → "Hello World" on GitHub Pages | ⬜ |
| 2 | App shell + screen routing (Setup → Quiz → Results) | ⬜ |
| 3 | Setup screen logic (presets, table toggles, duration) | ⬜ |
| 4 | Question generator (questions + plausible distractors) | ⬜ |
| 5 | Quiz state machine + countdown timer | ⬜ |
| 6 | Quiz UI polish (timer ring, answer flash, responsive) | ⬜ |
| 7 | Results screen (score, breakdown, play again) | ⬜ |
| 8 | Final QA + GitHub Pages end-to-end verify | ⬜ |

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173/times-table-tester/
npm run build      # outputs to dist/
```

## Deployment

Push to `main`. The GitHub Actions workflow builds the app and publishes `dist/` to the `gh-pages` branch automatically.

Enable GitHub Pages in repo settings: source = `gh-pages` branch, root `/`.
