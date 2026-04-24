import type { QuizConfig } from '../types'

export function ResultsScreen({
  config,
  onPlayAgain,
}: {
  config: QuizConfig
  onPlayAgain: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Results</h2>
        <p className="text-gray-500">Results screen — coming in Stage 7</p>
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700"
        >
          Play again
        </button>
      </div>
    </div>
  )
}
