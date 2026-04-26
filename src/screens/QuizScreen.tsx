import type { QuizConfig, QuizResult } from '../types'
import { useQuiz } from '../hooks/useQuiz'

export function QuizScreen({
  config,
  onEnd,
}: {
  config: QuizConfig
  onEnd: (results: QuizResult[]) => void
}) {
  const { question, timeLeft, phase, selectedIndex, correct, answer } = useQuiz(config, onEnd)

  const progress = timeLeft / (config.duration * 10)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-10">

        {/* Silent progress bar — no numbers, no colour change */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-300 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Question — ? swaps to ✓ or ✗ during feedback */}
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

        {/* 2×2 answer grid */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((opt, i) => {
            const isSelected = selectedIndex === i
            const isAnswer = opt === question.answer
            const inFeedback = phase === 'feedback'

            let cls =
              'w-full py-8 rounded-2xl text-3xl font-bold border-2 transition-colors select-none '

            if (inFeedback && isAnswer) {
              // Always highlight the correct answer green
              cls += 'bg-green-100 border-green-400 text-green-700'
            } else if (inFeedback && isSelected && !correct) {
              // Wrong selection: muted, no red
              cls += 'bg-gray-100 border-gray-200 text-gray-400'
            } else {
              cls +=
                'bg-white border-gray-200 text-gray-900 hover:border-indigo-300 hover:bg-indigo-50 active:bg-indigo-100'
            }

            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={phase !== 'answering'}
                className={cls}
              >
                {opt}
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
