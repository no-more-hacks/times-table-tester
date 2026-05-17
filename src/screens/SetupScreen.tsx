import { useState } from 'react'
import type { QuizConfig, InputMode, Progression } from '../types'

interface Preset {
  name: string
  tables: number[]
  duration: number
  feedbackDelay: number
  inputMode: InputMode
  progression: Progression
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
  { name: 'Standard', tables: range(2, 12), duration: 60, feedbackDelay: 600, inputMode: 'choice', progression: 'fixed', advanceAfter: 0 },
  { name: 'Junior', tables: range(2, 5), duration: 90, feedbackDelay: 800, inputMode: 'choice', progression: 'fixed', advanceAfter: 0 },
  { name: 'Extended', tables: range(2, 20), duration: 120, feedbackDelay: 600, inputMode: 'choice', progression: 'fixed', advanceAfter: 0 },
  { name: 'Speed Round', tables: range(2, 12), duration: 30, feedbackDelay: 200, inputMode: 'choice', progression: 'fixed', advanceAfter: 0 },
  { name: 'Progressive', tables: [12], duration: 60, feedbackDelay: 1000, inputMode: 'choice', progression: 'progressive', advanceAfter: 4 },
]

const DURATIONS = [30, 60, 90, 120]

function matchPreset(
  tables: number[],
  duration: number,
  feedbackDelay: number,
  inputMode: InputMode,
  progression: Progression,
  advanceAfter: number
): number {
  return PRESETS.findIndex(
    p =>
      p.inputMode === inputMode &&
      p.progression === progression &&
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
  const [inputMode, setInputMode] = useState<InputMode>(PRESETS[0].inputMode)
  const [progression, setProgression] = useState<Progression>(PRESETS[0].progression)
  const [advanceAfter, setAdvanceAfter] = useState(PROGRESSIVENESS[1].advanceAfter)

  const activePreset = matchPreset(tables, duration, feedbackDelay, inputMode, progression, advanceAfter)

  function applyPreset(p: Preset) {
    setTables(p.tables)
    setDuration(p.duration)
    setFeedbackDelay(p.feedbackDelay)
    setInputMode(p.inputMode)
    setProgression(p.progression)
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
      <div className="w-full max-w-md lg:max-w-6xl bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Times Table Tester</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Quick start
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                      i === PRESETS.length - 1 && PRESETS.length % 2 !== 0 ? 'col-span-2 lg:col-span-1' : ''
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
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Input style
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setInputMode('choice')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    inputMode === 'choice'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  Multiple choice
                </button>
                <button
                  onClick={() => setInputMode('keypad')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    inputMode === 'keypad'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  Keypad
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Mode
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setProgression('fixed')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    progression === 'fixed'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setProgression('progressive')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    progression === 'progressive'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  Progressive
                </button>
              </div>
              {progression === 'progressive' && (
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

            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Transition
              </h2>
              <div className="flex items-center gap-3">
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
            </section>
          </div>

          <div className="lg:flex lg:items-center lg:justify-center">
            <button
              onClick={() => canStart && onStart({ tables, duration, feedbackDelay, inputMode, progression, advanceAfter })}
              disabled={!canStart}
              className={`w-full lg:py-8 py-3 rounded-xl font-bold text-lg lg:text-2xl transition-colors ${
                canStart
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
