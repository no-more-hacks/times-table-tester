import { useEffect } from 'react'
import type { Question } from '../types'

type Phase = 'answering' | 'feedback' | 'ended'

export function ChoiceInput({
  question,
  phase,
  selectedValue,
  correct,
  onAnswer,
}: {
  question: Question
  phase: Phase
  selectedValue: number | null
  correct: boolean | null
  onAnswer: (value: number) => void
}) {
  const options = question.options ?? []

  // Keyboard: 1–4 → option index
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (phase !== 'answering') return
      const i = ['1', '2', '3', '4'].indexOf(e.key)
      if (i !== -1 && options[i] !== undefined) onAnswer(options[i])
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, options, onAnswer])

  return (
    <div className="space-y-10">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-900 tracking-tight select-none">
          {question.a} × {question.b} ={' '}
          {phase === 'feedback' ? (
            <span className={correct ? 'text-green-500' : 'text-gray-400'}>
              {correct ? '✓' : '✗'}
            </span>
          ) : (
            <span>?</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, i) => {
          const isSelected = selectedValue === opt
          const isAnswer = opt === question.answer
          const inFeedback = phase === 'feedback'

          let cls =
            'w-full py-8 rounded-2xl text-3xl font-bold border-2 transition-colors select-none '

          if (inFeedback && isAnswer) {
            cls += 'bg-green-100 border-green-400 text-green-700'
          } else if (inFeedback && isSelected && !correct) {
            cls += 'bg-gray-100 border-gray-200 text-gray-400'
          } else {
            cls +=
              'bg-white border-gray-200 text-gray-900 hover:border-indigo-300 hover:bg-indigo-50 active:bg-indigo-100'
          }

          return (
            <button
              key={i}
              onClick={() => onAnswer(opt)}
              disabled={phase !== 'answering'}
              className={cls}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
