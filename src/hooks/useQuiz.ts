import { useReducer, useEffect, useRef } from 'react'
import type { QuizConfig, Question, QuizResult, Progression } from '../types'
import { generateQuestion } from '../quiz/generateQuestion'

type Phase = 'answering' | 'feedback' | 'ended'

interface QuizState {
  question: Question
  timeLeft: number // tenths of a second (100ms ticks)
  phase: Phase
  selectedValue: number | null
  correct: boolean | null
  score: number
  total: number
  results: QuizResult[]
  progression: Progression
  currentMaxMultiplier: number
  advanceAfter: number
  correctSinceAdvance: number
  leveledUp: boolean
}

type QuizAction =
  | { type: 'TICK' }
  | { type: 'ANSWER'; value: number }
  | { type: 'ADVANCE'; nextQuestion: Question }

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'TICK': {
      if (state.phase === 'ended') return state
      const timeLeft = state.timeLeft - 1
      return timeLeft <= 0
        ? { ...state, timeLeft: 0, phase: 'ended' }
        : { ...state, timeLeft }
    }
    case 'ANSWER': {
      if (state.phase !== 'answering') return state
      const correct = action.value === state.question.answer

      let { currentMaxMultiplier, correctSinceAdvance } = state
      let leveledUp = false
      if (state.progression === 'progressive' && correct) {
        correctSinceAdvance += 1
        if (correctSinceAdvance >= state.advanceAfter && currentMaxMultiplier < 12) {
          currentMaxMultiplier = currentMaxMultiplier + 1
          correctSinceAdvance = 0
          leveledUp = true
        }
      }

      return {
        ...state,
        phase: 'feedback',
        selectedValue: action.value,
        correct,
        score: correct ? state.score + 1 : state.score,
        total: state.total + 1,
        results: [
          ...state.results,
          { question: state.question, selectedValue: action.value, correct },
        ],
        currentMaxMultiplier,
        correctSinceAdvance,
        leveledUp,
      }
    }
    case 'ADVANCE':
      return {
        ...state,
        question: action.nextQuestion,
        phase: 'answering',
        selectedValue: null,
        correct: null,
      }
  }
}

export function useQuiz(config: QuizConfig, onEnd: (results: QuizResult[]) => void) {
  const [state, dispatch] = useReducer(reducer, config, (cfg): QuizState => ({
    question: generateQuestion(cfg.tables, cfg.progression === 'progressive' ? 3 : 12),
    timeLeft: cfg.duration * 10,
    phase: 'answering',
    selectedValue: null,
    correct: null,
    score: 0,
    total: 0,
    results: [],
    progression: cfg.progression,
    currentMaxMultiplier: cfg.progression === 'progressive' ? 3 : 12,
    advanceAfter: cfg.advanceAfter,
    correctSinceAdvance: 0,
    leveledUp: false,
  }))

  // Keep a stable ref to onEnd so the effect below doesn't need it as a dep
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd

  // Countdown — runs for the lifetime of the component; reducer ignores ticks after 'ended'
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK' }), 100)
    return () => clearInterval(id)
  }, [])

  // After feedback delay, advance to the next question
  useEffect(() => {
    if (state.phase !== 'feedback') return
    const id = setTimeout(() => {
      dispatch({
        type: 'ADVANCE',
        nextQuestion: generateQuestion(config.tables, state.currentMaxMultiplier),
      })
    }, config.feedbackDelay)
    return () => clearTimeout(id)
  }, [state.phase, state.currentMaxMultiplier, config.tables, config.feedbackDelay])

  // Notify parent when quiz ends
  useEffect(() => {
    if (state.phase === 'ended') onEndRef.current(state.results)
  }, [state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    question: state.question,
    timeLeft: state.timeLeft,
    phase: state.phase,
    selectedValue: state.selectedValue,
    correct: state.correct,
    score: state.score,
    total: state.total,
    currentMaxMultiplier: state.currentMaxMultiplier,
    leveledUp: state.leveledUp,
    answer: (value: number) => dispatch({ type: 'ANSWER', value }),
  }
}
