import { useReducer } from 'react'
import type { AppAction, AppState, QuizConfig } from '../types'

const DEFAULT_CONFIG: QuizConfig = {
  tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  duration: 60,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_QUIZ':
      return { screen: 'quiz', config: action.config, results: [] }
    case 'END_QUIZ':
      return { ...state, screen: 'results', results: action.results }
    case 'PLAY_AGAIN':
      return { screen: 'setup', config: state.config, results: [] }
  }
}

export function useAppState() {
  return useReducer(reducer, { screen: 'setup', config: DEFAULT_CONFIG, results: [] })
}
