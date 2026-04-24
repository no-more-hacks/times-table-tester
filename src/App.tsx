import { useAppState } from './hooks/useAppState'
import { SetupScreen } from './screens/SetupScreen'
import { QuizScreen } from './screens/QuizScreen'
import { ResultsScreen } from './screens/ResultsScreen'

export default function App() {
  const [state, dispatch] = useAppState()

  return (
    <div className="min-h-screen">
      {state.screen === 'setup' && (
        <SetupScreen onStart={config => dispatch({ type: 'START_QUIZ', config })} />
      )}
      {state.screen === 'quiz' && (
        <QuizScreen config={state.config} onEnd={() => dispatch({ type: 'END_QUIZ' })} />
      )}
      {state.screen === 'results' && (
        <ResultsScreen config={state.config} onPlayAgain={() => dispatch({ type: 'PLAY_AGAIN' })} />
      )}
    </div>
  )
}
