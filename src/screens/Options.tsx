import { useStore } from '../game/store'
import { CATEGORIES } from '../data/words'
import { IconCheck, IconClose } from '../components/icons'

const POINT_CHOICES = [3, 5, 7, 10]

export function Options() {
  const { state, dispatch } = useStore()
  const { pointsToWin, enabledCategories } = state.settings

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
        <h2>MANCHES POUR GAGNER</h2>
        <div className="seg">
          {POINT_CHOICES.map((v) => (
            <button
              key={v}
              className={v === pointsToWin ? 'active' : ''}
              onClick={() => dispatch({ type: 'setPointsToWin', value: v })}
            >
              {v}
            </button>
          ))}
        </div>
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
