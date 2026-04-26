import { useReducer, useEffect, useRef } from 'react'
import type { QuizConfig, Question, QuizResult } from '../types'
import { generateQuestion } from '../quiz/generateQuestion'

type Phase = 'answering' | 'feedback' | 'ended'

interface QuizState {
  question: Question
  timeLeft: number // tenths of a second (100ms ticks)
  phase: Phase
  selectedIndex: number | null
  correct: boolean | null
  score: number
  total: number
  results: QuizResult[]
}

type QuizAction =
  | { type: 'TICK' }
  | { type: 'ANSWER'; index: number }
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
      const correct = state.question.options[action.index] === state.question.answer
      return {
        ...state,
        phase: 'feedback',
        selectedIndex: action.index,
        correct,
        score: correct ? state.score + 1 : state.score,
        total: state.total + 1,
        results: [
          ...state.results,
          { question: state.question, selectedIndex: action.index, correct },
        ],
      }
    }
    case 'ADVANCE':
      return {
        ...state,
        question: action.nextQuestion,
        phase: 'answering',
        selectedIndex: null,
        correct: null,
      }
  }
}

export function useQuiz(config: QuizConfig, onEnd: (results: QuizResult[]) => void) {
  const [state, dispatch] = useReducer(reducer, config, (cfg): QuizState => ({
    question: generateQuestion(cfg.tables),
    timeLeft: cfg.duration * 10,
    phase: 'answering',
    selectedIndex: null,
    correct: null,
    score: 0,
    total: 0,
    results: [],
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
      dispatch({ type: 'ADVANCE', nextQuestion: generateQuestion(config.tables) })
    }, 600)
    return () => clearTimeout(id)
  }, [state.phase, config.tables])

  // Notify parent when quiz ends
  useEffect(() => {
    if (state.phase === 'ended') onEndRef.current(state.results)
  }, [state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard: 1–4 → answer buttons 0–3
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (state.phase !== 'answering') return
      const i = ['1', '2', '3', '4'].indexOf(e.key)
      if (i !== -1) dispatch({ type: 'ANSWER', index: i })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [state.phase])

  return {
    question: state.question,
    timeLeft: state.timeLeft,
    phase: state.phase,
    selectedIndex: state.selectedIndex,
    correct: state.correct,
    score: state.score,
    total: state.total,
    answer: (index: number) => dispatch({ type: 'ANSWER', index }),
  }
}
