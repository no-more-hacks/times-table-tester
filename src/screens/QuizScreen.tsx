import type { QuizConfig } from '../types'

export function QuizScreen({ config, onEnd }: { config: QuizConfig; onEnd: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-gray-500">Quiz — coming in Stage 4–6</p>
        <p className="text-sm text-gray-400">
          Tables: {config.tables.join(', ')} &middot; {config.duration}s
        </p>
        <button
          onClick={onEnd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Skip to results
        </button>
      </div>
    </div>
  )
}
