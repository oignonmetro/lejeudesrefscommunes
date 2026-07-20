import { useState } from 'react'
import { useStore, type TeamId } from '../game/store'
import { IconGear, IconInfo, IconPlay, Logo } from '../components/icons'

function TeamEditor({ team }: { team: TeamId }) {
  const { state, dispatch } = useStore()
  const [name, setName] = useState('')
  const players = state.teams[team].players
  const label = team === 'red' ? 'Équipe rouge' : 'Équipe jaune'

  const add = () => {
    dispatch({ type: 'addPlayer', team, name })
    setName('')
  }

  return (
    <div className="team-block">
      <div className={`team-label ${team}`}>{label}</div>
      <div className={`team-input-row ${team}`}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Ajouter des joueurs"
          enterKeyHint="done"
          aria-label={`Ajouter un joueur à l'${label.toLowerCase()}`}
        />
        <button className="add-btn" onClick={add} aria-label="Ajouter">
          +
        </button>
      </div>
      {players.length > 0 && (
        <div className="chips">
          {players.map((p, i) => (
            <span className={`chip ${team}`} key={`${p}-${i}`}>
              {p}
              <button
                onClick={() => dispatch({ type: 'removePlayer', team, index: i })}
                aria-label={`Retirer ${p}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function Home() {
  const { state, dispatch } = useStore()
  const red = state.teams.red.players.length
  const yellow = state.teams.yellow.players.length
  const canPlay = red >= 2 && yellow >= 2

  let hint = ''
  if (!canPlay) {
    if (red < 2 && yellow < 2) hint = 'Chaque équipe a besoin d’au moins 2 joueurs.'
    else if (red < 2) hint = 'Ajoute au moins 2 joueurs à l’équipe rouge.'
    else hint = 'Ajoute au moins 2 joueurs à l’équipe jaune.'
  }

  return (
    <div className="home fade-in">
      <Logo className="logo" />

      <TeamEditor team="red" />
      <TeamEditor team="yellow" />

      <div className="home-actions">
        <button className="pill" onClick={() => dispatch({ type: 'goto', screen: 'options' })}>
          <span className="ic" style={{ color: '#2b3642' }}>
            <IconGear />
          </span>
          Options
        </button>
        <button
          className="pill red-accent"
          disabled={!canPlay}
          onClick={() => dispatch({ type: 'startGame' })}
        >
          <span className="ic" style={{ background: 'var(--yellow)' }}>
            <IconPlay width={16} height={16} />
          </span>
          Jouer
        </button>
      </div>

      <div className="hint">{hint}</div>

      <div className="home-links">
        <button className="text-link" onClick={() => dispatch({ type: 'goto', screen: 'rules' })}>
          <span className="badge-ic">
            <IconInfo />
          </span>
          Règles du jeu
        </button>
      </div>
    </div>
  )
}
