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

The project is built in 8 stages (see README.md). Phase 1 (multiple choice) is the current focus. Phases 2–5 (type answer, reverse mode, fill the blank, mixed mode) are future work described in TODO.md — do not implement them until Phase 1 is complete.

## Presets

| Name | Tables | Duration |
|---|---|---|
| Standard (default) | 2–12 | 60 s |
| Junior | 2–5 | 90 s |
| Extended | 2–20 | 120 s |
| Speed Round | 2–12 | 30 s |
