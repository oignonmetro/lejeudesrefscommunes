import { useStore } from './game/store'
import { Home } from './screens/Home'
import { Rules } from './screens/Rules'
import { Options } from './screens/Options'
import { Game } from './screens/Game'

export function App() {
  const { state } = useStore()
  return (
    <div className="app">
      {state.screen === 'home' && <Home />}
      {state.screen === 'rules' && <Rules />}
      {state.screen === 'options' && <Options />}
      {state.screen === 'game' && <Game />}
    </div>
  )
}
