import { useEffect, useState } from 'react'
import type { Question } from '../types'

type Phase = 'answering' | 'feedback' | 'ended'

const KEYS = [
  '7', '8', '9',
  '4', '5', '6',
  '1', '2', '3',
  '⌫', '0', '⏎',
] as const

const MAX_DIGITS = 4

export function KeypadInput({
  question,
  phase,
  correct,
  onAnswer,
}: {
  question: Question
  phase: Phase
  correct: boolean | null
  onAnswer: (value: number) => void
}) {
  const [typed, setTyped] = useState('')

  // Clear input on each new question
  useEffect(() => {
    setTyped('')
  }, [question])

  function press(label: string) {
    if (phase !== 'answering') return
    if (label === '⌫') setTyped(t => t.slice(0, -1))
    else if (label === '⏎') {
      if (typed.length > 0) onAnswer(Number(typed))
    } else if (typed.length < MAX_DIGITS) {
      setTyped(t => t + label)
    }
  }

  // Physical keyboard
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (phase !== 'answering') return
      if (e.key === 'Backspace') setTyped(t => t.slice(0, -1))
      else if (e.key === 'Enter') {
        if (typed.length > 0) onAnswer(Number(typed))
      } else if (/^[0-9]$/.test(e.key) && typed.length < MAX_DIGITS) {
        setTyped(t => t + e.key)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, typed, onAnswer])

  // During wrong-answer feedback we reveal the correct answer in the box
  const inFeedback = phase === 'feedback'
  const revealAnswer = inFeedback && !correct
  const boxValue = revealAnswer ? String(question.answer) : typed

  let boxCls =
    'min-w-[12rem] px-8 py-4 rounded-2xl text-7xl font-bold text-center border-2 select-none transition-colors '
  if (inFeedback && correct) boxCls += 'bg-green-50 border-green-400 text-green-700'
  else if (inFeedback && !correct) boxCls += 'bg-gray-50 border-gray-300 text-gray-600'
  else boxCls += 'bg-white border-gray-300 text-gray-900'

  return (
    <div className="flex items-center justify-center gap-12">
      {/* Question + input + feedback icon */}
      <div className="flex items-center gap-6">
        <p className="text-7xl font-bold text-gray-900 tracking-tight select-none">
          {question.a} × {question.b} =
        </p>
        <div className={boxCls}>
          {boxValue || <span className="text-gray-300">?</span>}
        </div>
        <div className="w-16 text-center">
          {inFeedback && (
            <span className={`text-7xl font-bold ${correct ? 'text-green-500' : 'text-gray-400'}`}>
              {correct ? '✓' : '✗'}
            </span>
          )}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3">
        {KEYS.map(k => {
          const isEnter = k === '⏎'
          const cls = isEnter
            ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            : 'bg-white border-gray-200 text-gray-900 hover:border-indigo-300 hover:bg-indigo-50 active:bg-indigo-100'
          return (
            <button
              key={k}
              onClick={() => press(k)}
              disabled={phase !== 'answering'}
              className={`w-24 h-24 rounded-2xl text-3xl font-bold border-2 select-none transition-colors disabled:opacity-40 ${cls}`}
            >
              {k}
            </button>
          )
        })}
      </div>
    </div>
  )
}
