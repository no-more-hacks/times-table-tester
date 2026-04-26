import type { Question } from '../types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateQuestion(tables: number[]): Question {
  const a = tables[Math.floor(Math.random() * tables.length)]
  const b = Math.floor(Math.random() * 12) + 1
  const answer = a * b

  const candidates = new Set<number>()

  // Adjacent multiples of same table
  for (const db of [-2, -1, 1, 2]) {
    const nb = b + db
    if (nb >= 1 && nb <= 12) candidates.add(a * nb)
  }

  // Neighbouring tables ±1
  for (const da of [-1, 1]) {
    const na = a + da
    if (na >= 1) candidates.add(na * b)
  }

  candidates.delete(answer)

  const distractors = shuffle([...candidates]).slice(0, 3)

  // Pad with incrementing values if somehow still short (e.g. table=1, b=1)
  let pad = 1
  while (distractors.length < 3) {
    const v = answer + pad++
    if (!distractors.includes(v)) distractors.push(v)
  }

  return { a, b, answer, options: shuffle([answer, ...distractors]) }
}
