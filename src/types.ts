export type Screen = 'setup' | 'quiz' | 'results'

export interface QuizConfig {
  tables: number[]
  duration: number // seconds
}

export interface AppState {
  screen: Screen
  config: QuizConfig
}

export type AppAction =
  | { type: 'START_QUIZ'; config: QuizConfig }
  | { type: 'END_QUIZ' }
  | { type: 'PLAY_AGAIN' }
