import type { QuizConfig, QuizResult } from '../types'

export function ResultsScreen({
  results,
  onPlayAgain,
}: {
  config: QuizConfig
  results: QuizResult[]
  onPlayAgain: () => void
}) {
  const score = results.filter(r => r.correct).length

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Results</h2>
        <p className="text-4xl font-bold text-indigo-600">{score} / {results.length}</p>
        <p className="text-gray-400 text-sm">Full breakdown coming in Stage 7</p>
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
