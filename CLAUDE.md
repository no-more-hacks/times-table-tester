# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # Dev server at http://localhost:5173/times-table-tester/
npm run build    # Production build to dist/
```

Deployment is automatic: push to `main` → GitHub Actions builds and publishes `dist/` to the `gh-pages` branch.

## Architecture

**Stack:** Vite + React + TypeScript + Tailwind CSS

**State:** Single `useReducer` custom hook — no external state library. State transitions are explicit.

**Screens:** Setup → Quiz → Results (client-side routing, no router library).

**Question generation:** Lazy — one question generated at a time to support unlimited questions without pool exhaustion.

**Distractors:** Adjacent multiples of the same/neighbouring tables (pedagogically plausible, not random noise).

**Timer:** `setInterval` at 100ms for smooth countdown.

## Key behaviour

- Answer feedback: ~600ms green/red flash, then auto-advance
- Score hidden during quiz, shown only on results screen
- Keyboard keys `1`–`4` map to the four answer buttons (desktop)
- Timer counts down; quiz ends at zero

## Staged build plan

The project is built in 8 stages (see README.md). Multiple choice mode is implemented. Additional modes (type answer, reverse, fill the blank, mixed) are independent and optional — described in TODO.md. Do not implement them unless explicitly asked.

## Development approach

When adding a new mode or significant feature, follow the pattern that worked for multiple choice:

1. **UI skeleton first.** Build the screen with hardcoded/placeholder data so the layout, tap targets, and visual flow can be evaluated before any logic exists.
2. **Game engine second.** Once the UI feels right, wire in question generation, state transitions, and scoring.

This keeps feedback loops short and avoids re-doing UI work after logic is already entangled.

## Constraints

- **Single page app.** No routing library, no server, no build-time data fetching.
- **No storage.** Nothing is persisted between sessions — no localStorage, no cookies, no IndexedDB.
- **No external services.** No APIs, no analytics, no third-party scripts. Everything runs in the browser from the built assets.

## Presets

| Name | Tables | Duration |
|---|---|---|
| Standard (default) | 2–12 | 60 s |
| Junior | 2–5 | 90 s |
| Extended | 2–20 | 120 s |
| Speed Round | 2–12 | 30 s |
