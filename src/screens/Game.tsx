import { useState } from 'react'
import { useStore, currentPair, type TeamId } from '../game/store'
import { IconClose, IconCheck, IconPlay, IconRefresh, IconEye, IconEyeOff } from '../components/icons'

function Star({ team, active }: { team: TeamId; active: boolean }) {
  const { state } = useStore()
  const color = team === 'red' ? 'var(--red)' : 'var(--yellow)'
  const players = state.teams[team].players
  const label = players.map((p) => p.charAt(0).toUpperCase()).join(' ')
  return (
    <div className={`score-badge ${team} ${active ? 'active' : ''}`} style={{ color }}>
      <div className="star">
        <svg viewBox="0 0 100 100" aria-hidden>
          <path
            fill={color}
            d="M50 3l9 11 13-6 1 14 14-1-5 13 12 7-11 8 11 8-12 7 5 13-14-1-1 14-13-6-9 11-9-11-13 6-1-14-14 1 5-13-12-7 11-8-11-8 12-7-5-13 14 1 1-14 13 6z"
          />
        </svg>
        <span>{state.teams[team].score}</span>
      </div>
      <small>{label}</small>
    </div>
  )
}

function Scorebar() {
  const { state } = useStore()
  return (
    <div className="scorebar">
      <Star team="red" active={state.currentTeam === 'red'} />
      <Star team="yellow" active={state.currentTeam === 'yellow'} />
    </div>
  )
}

export function Game() {
  const { state, dispatch } = useStore()
  const [hidden, setHidden] = useState(false)
  const team = state.currentTeam
  const { describer, guesser } = currentPair(state)

  if (state.phase === 'win' && state.winner) {
    const w = state.winner
    const name = w === 'red' ? 'L’équipe rouge' : 'L’équipe jaune'
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Scorebar />
        <div className="game-center win">
          <div className={`win-title ${w}`}>🎉 {name} gagne !</div>
          <div className="win-sub">
            {state.teams[w].score} manche{state.teams[w].score > 1 ? 's' : ''} remportée
            {state.teams[w].score > 1 ? 's' : ''}
          </div>
        </div>
        <div className="game-actions">
          <button className="pill" onClick={() => dispatch({ type: 'quitGame' })}>
            <IconClose /> Accueil
          </button>
          <button className={`pill ${w}-accent`} onClick={() => dispatch({ type: 'newGame' })}>
            <span className="ic" style={{ background: 'var(--yellow)' }}>
              <IconPlay width={16} height={16} />
            </span>
            Rejouer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="topbar">
        <div />
        <button
          className="icon-btn"
          onClick={() => dispatch({ type: 'quitGame' })}
          aria-label="Quitter la partie"
        >
          <IconClose />
        </button>
      </div>

      <Scorebar />

      {state.phase === 'pass' ? (
        <>
          <div className="game-center">
            <div className={`big-instruction ${team}`}>
              {describer} doit prendre le téléphone.
            </div>
          </div>
          <div className="game-actions">
            <button
              className={`pill ${team}-accent`}
              onClick={() => {
                setHidden(false)
                dispatch({ type: 'ready' })
              }}
            >
              <span className="ic" style={{ background: 'var(--yellow)' }}>
                <IconPlay width={16} height={16} />
              </span>
              Prêt
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="game-center">
            <div className={`reveal-lead ${team}`}>
              {describer}, avec complicité, tu dois faire deviner à {guesser} :
            </div>
            <div className={`word ${team} ${hidden ? 'hidden' : ''}`}>{state.word}</div>
            <button
              className="eye-btn"
              onClick={() => setHidden((h) => !h)}
              aria-label={hidden ? 'Afficher le mot' : 'Masquer le mot'}
            >
              {hidden ? <IconEye width={26} height={26} /> : <IconEyeOff width={26} height={26} />}
            </button>
          </div>
          <div className="game-actions">
            <button
              className={`pill ${team}-accent`}
              onClick={() => dispatch({ type: 'result', success: false })}
            >
              <span className="ic" style={{ background: 'var(--yellow)' }}>
                <IconClose width={16} height={16} />
              </span>
              Échec
            </button>
            <button
              className={`pill ${team}-accent`}
              onClick={() => dispatch({ type: 'result', success: true })}
            >
              <span className="ic" style={{ background: 'var(--yellow)' }}>
                <IconCheck width={16} height={16} />
              </span>
              Succès
            </button>
            <button
              className="round-btn"
              onClick={() => dispatch({ type: 'redraw' })}
              aria-label="Changer de mot"
            >
              <IconRefresh />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
