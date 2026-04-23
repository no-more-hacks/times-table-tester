# Times Table Tester — Roadmap

## Phase 1 — Multiple Choice (current)

Show `A × B = ?` with 4 answer buttons in a 2×2 grid. Player taps the correct answer.

- Distractors drawn from adjacent multiples of the same table and neighbouring tables — plausible wrong answers, not random noise
- After answering: ~600ms green/red flash, then auto-advance to next question
- Score hidden during quiz, revealed in full on the results screen
- Timer counts down; session ends when it hits zero

**Status:** In progress — see staged build plan.

---

## Phase 2 — Type the Answer

Player types the numeric answer using a keyboard.

```
  3 × 7 = ?

  ┌───────────┐
  │  _        │
  └───────────┘
  [ Submit ]
```

- Faster for desktop users who know their tables well
- Submit on Enter key or tap
- Wrong answer shows correct value before advancing

---

## Phase 3 — Reverse: Find the Question

Given the answer, pick the correct expression from 4 options.

```
  ? × ? = 21

  ┌──────┐  ┌──────┐
  │ 3×7  │  │ 4×6  │
  └──────┘  └──────┘
  ┌──────┐  ┌──────┐
  │ 2×9  │  │ 5×5  │
  └──────┘  └──────┘
```

- Distractor expressions produce a product close to but not equal to the target
- Tests a different axis of recall than Phase 1

---

## Phase 4 — Fill the Blank

One factor is hidden. Pick the missing factor from 4 options.

```
  3 × ? = 21

  ┌──────┐  ┌──────┐
  │   6  │  │   7  │
  └──────┘  └──────┘
  ┌──────┐  ┌──────┐
  │   8  │  │   9  │
  └──────┘  └──────┘
```

- Randomly hide either the first or second factor
- Distractors are adjacent integers to the correct factor

---

## Phase 5 — Mixed Mode

Questions within a single session randomly alternate between the modes selected by the user on the setup screen.

---

## Setup Screen — Mode Selection (future)

Once Phase 2+ is implemented, add a "Question style" row to the setup screen:

- Single mode: [Multiple choice] [Type answer] [Reverse] [Fill blank]
- Mix: [Mix selected modes]
