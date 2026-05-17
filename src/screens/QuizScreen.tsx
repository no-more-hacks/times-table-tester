import type { QuizConfig, QuizResult } from '../types'
import { useQuiz } from '../hooks/useQuiz'
import { ChoiceInput } from '../inputs/ChoiceInput'
import { KeypadInput } from '../inputs/KeypadInput'

export function QuizScreen({
  config,
  onEnd,
}: {
  config: QuizConfig
  onEnd: (results: QuizResult[]) => void
}) {
  const {
    question,
    timeLeft,
    phase,
    selectedValue,
    correct,
    total,
    currentMaxMultiplier,
    leveledUp,
    answer,
  } = useQuiz(config, onEnd)

  const progress = timeLeft / (config.duration * 10)
  const isKeypad = config.inputMode === 'keypad'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className={`w-full ${isKeypad ? 'max-w-4xl' : 'max-w-lg'} space-y-10`}>

        {/* Silent progress bar — no numbers, no colour change */}
        <div className="space-y-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-300 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {config.progression === 'progressive' && (
            <div className="flex justify-end">
              <span className="text-xs text-gray-400 font-medium">
                ×1–{currentMaxMultiplier}
              </span>
            </div>
          )}
        </div>

        {/* Level-up banner — reserved slot avoids layout shift */}
        {config.progression === 'progressive' && (
          <div className="h-8 flex items-center justify-center -my-2">
            {phase === 'feedback' && leveledUp && (
              <p className="text-2xl font-bold text-green-500">
                Level up! ×1–{currentMaxMultiplier} unlocked
              </p>
            )}
          </div>
        )}

        <div key={total}>
          {isKeypad ? (
            <KeypadInput
              question={question}
              phase={phase}
              correct={correct}
              onAnswer={answer}
            />
          ) : (
            <ChoiceInput
              question={question}
              phase={phase}
              selectedValue={selectedValue}
              correct={correct}
              onAnswer={answer}
            />
          )}
        </div>

      </div>
    </div>
  )
}
