export type Screen = 'setup' | 'quiz' | 'results'

export type InputMode = 'choice' | 'keypad'
export type Progression = 'fixed' | 'progressive'

export interface QuizConfig {
  tables: number[]
  duration: number // seconds
  feedbackDelay: number // ms before advancing to next question
  inputMode: InputMode
  progression: Progression
  advanceAfter: number // progressive: correct answers needed to unlock next multiplier
}

export interface Question {
  a: number
  b: number
  answer: number
  options?: number[] // populated for choice mode only
}

export interface QuizResult {
  question: Question
  selectedValue: number | null // null = no answer recorded (e.g. ran out of time)
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
