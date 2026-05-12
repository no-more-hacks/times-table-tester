import { useState } from 'react'
import type { QuizConfig } from '../types'

interface Preset {
  name: string
  tables: number[]
  duration: number
  feedbackDelay: number
  mode: 'multiple-choice' | 'progressive'
  advanceAfter: number
}

const PROGRESSIVENESS = [
  { label: 'Fast', advanceAfter: 2 },
  { label: 'Medium', advanceAfter: 4 },
  { label: 'Slow', advanceAfter: 7 },
]

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => i + from)
}

const PRESETS: Preset[] = [
  { name: 'Standard', tables: range(2, 12), duration: 60, feedbackDelay: 600, mode: 'multiple-choice', advanceAfter: 0 },
  { name: 'Junior', tables: range(2, 5), duration: 90, feedbackDelay: 800, mode: 'multiple-choice', advanceAfter: 0 },
  { name: 'Extended', tables: range(2, 20), duration: 120, feedbackDelay: 600, mode: 'multiple-choice', advanceAfter: 0 },
  { name: 'Speed Round', tables: range(2, 12), duration: 30, feedbackDelay: 200, mode: 'multiple-choice', advanceAfter: 0 },
  { name: 'Progressive', tables: [12], duration: 60, feedbackDelay: 1000, mode: 'progressive', advanceAfter: 4 },
]

const DURATIONS = [30, 60, 90, 120]

function matchPreset(
  tables: number[],
  duration: number,
  feedbackDelay: number,
  mode: 'multiple-choice' | 'progressive',
  advanceAfter: number
): number {
  return PRESETS.findIndex(
    p =>
      p.mode === mode &&
      p.advanceAfter === advanceAfter &&
      p.duration === duration &&
      p.feedbackDelay === feedbackDelay &&
      p.tables.length === tables.length &&
      p.tables.every((t, i) => t === tables[i])
  )
}

export function SetupScreen({ onStart }: { onStart: (config: QuizConfig) => void }) {
  const [tables, setTables] = useState<number[]>(PRESETS[0].tables)
  const [duration, setDuration] = useState(PRESETS[0].duration)
  const [feedbackDelay, setFeedbackDelay] = useState(PRESETS[0].feedbackDelay)
  const [mode, setMode] = useState<'multiple-choice' | 'progressive'>('multiple-choice')
  const [advanceAfter, setAdvanceAfter] = useState(PROGRESSIVENESS[1].advanceAfter)

  const activePreset = matchPreset(tables, duration, feedbackDelay, mode, advanceAfter)

  function applyPreset(p: Preset) {
    setTables(p.tables)
    setDuration(p.duration)
    setFeedbackDelay(p.feedbackDelay)
    setMode(p.mode)
    setAdvanceAfter(p.advanceAfter)
  }

  function toggleTable(t: number) {
    setTables(prev =>
      prev.includes(t)
        ? prev.filter(x => x !== t)
        : [...prev, t].sort((a, b) => a - b)
    )
  }

  const canStart = tables.length > 0

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Times Table Tester</h1>

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Quick start
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  i === PRESETS.length - 1 && PRESETS.length % 2 !== 0 ? 'col-span-2' : ''
                } ${
                  activePreset === i
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Mode
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('multiple-choice')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                mode === 'multiple-choice'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setMode('progressive')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                mode === 'progressive'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              Progressive
            </button>
          </div>
          {mode === 'progressive' && (
            <>
              <div className="flex gap-2 mt-2">
                {PROGRESSIVENESS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setAdvanceAfter(p.advanceAfter)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      advanceAfter === p.advanceAfter
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Works best with a single times table selected.</p>
            </>
          )}
        </section>

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Tables
          </h2>
          <div className="flex flex-wrap gap-2">
            {range(2, 20).map(t => (
              <button
                key={t}
                onClick={() => toggleTable(t)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-colors ${
                  tables.includes(t)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Time limit
          </h2>
          <div className="flex gap-2">
            {DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  duration === d
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => canStart && onStart({ tables, duration, feedbackDelay, mode, advanceAfter })}
          disabled={!canStart}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
            canStart
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          Start
        </button>

        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs text-gray-400 whitespace-nowrap">Transition</span>
          <input
            type="range"
            min={100}
            max={1000}
            step={100}
            value={feedbackDelay}
            onChange={e => setFeedbackDelay(Number(e.target.value))}
            className="flex-1 accent-indigo-500 h-1"
          />
          <span className="text-xs text-gray-400 w-14 text-right">{feedbackDelay} ms</span>
        </div>
      </div>
    </div>
  )
}
