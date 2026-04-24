import { useState } from 'react'
import type { QuizConfig } from '../types'

interface Preset {
  name: string
  tables: number[]
  duration: number
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => i + from)
}

const PRESETS: Preset[] = [
  { name: 'Standard', tables: range(2, 12), duration: 60 },
  { name: 'Junior', tables: range(2, 5), duration: 90 },
  { name: 'Extended', tables: range(2, 20), duration: 120 },
  { name: 'Speed Round', tables: range(2, 12), duration: 30 },
]

const DURATIONS = [30, 60, 90, 120]

function matchPreset(tables: number[], duration: number): number {
  return PRESETS.findIndex(
    p =>
      p.duration === duration &&
      p.tables.length === tables.length &&
      p.tables.every((t, i) => t === tables[i])
  )
}

export function SetupScreen({ onStart }: { onStart: (config: QuizConfig) => void }) {
  const [tables, setTables] = useState<number[]>(PRESETS[0].tables)
  const [duration, setDuration] = useState(PRESETS[0].duration)

  const activePreset = matchPreset(tables, duration)

  function applyPreset(p: Preset) {
    setTables(p.tables)
    setDuration(p.duration)
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
          onClick={() => canStart && onStart({ tables, duration })}
          disabled={!canStart}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
            canStart
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          Start
        </button>
      </div>
    </div>
  )
}
