import { useStore } from '../game/store'
import { CATEGORIES } from '../data/words'
import { IconCheck, IconClose } from '../components/icons'

export function Options() {
  const { state, dispatch } = useStore()
  const { enabledCategories } = state.settings
  const nPink = state.teams.pink.players.length
  const nTeal = state.teams.teal.players.length
  const totalRounds = nPink + nTeal

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="topbar">
        <div />
        <button
          className="icon-btn"
          onClick={() => dispatch({ type: 'goto', screen: 'home' })}
          aria-label="Fermer"
        >
          <IconClose />
        </button>
      </div>

      <div className="screen-head">
        <h1>Options</h1>
      </div>

      <div className="options-section">
        <h2>MANCHES</h2>
        <p className="hint" style={{ textAlign: 'left' }}>
          {totalRounds > 0
            ? `Chaque joueur fait deviner une fois : ${totalRounds} manche${totalRounds > 1 ? 's' : ''} au total avec vos équipes actuelles.`
            : 'Chaque joueur fait deviner une fois. Le nombre de manches dépend du nombre de joueurs.'}
        </p>
      </div>

      <div className="options-section">
        <h2>THÈMES DES MOTS</h2>
        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const on = enabledCategories.includes(c.id)
            return (
              <button
                key={c.id}
                className={`cat ${on ? 'on' : ''}`}
                onClick={() => dispatch({ type: 'toggleCategory', id: c.id })}
              >
                <span className="emoji">{c.emoji}</span>
                {c.label}
                <span className="tick">
                  <IconCheck width={18} height={18} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="spacer" />
    </div>
  )
}
