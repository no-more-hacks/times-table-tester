export type Screen = 'setup' | 'quiz' | 'results'

export interface QuizConfig {
  tables: number[]
  duration: number // seconds
}

export interface Question {
  a: number
  b: number
  answer: number
  options: number[] // 4 values, shuffled, includes answer
}

export interface QuizResult {
  question: Question
  selectedIndex: number
  correct: boolean
}

export interface AppState {
  screen: Screen
  config: QuizConfig
  results: QuizResult[]
}

export type AppAction =
  | { type: 'START_QUIZ'; config: QuizConfig }
  | { type: 'END_QUIZ'; results: QuizResult[] }
  | { type: 'PLAY_AGAIN' }
