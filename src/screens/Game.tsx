import { useState } from 'react'
import {
  useStore,
  currentPair,
  trioCurrentPair,
  TRIO_ORDER,
  type TeamId,
} from '../game/store'
import { IconClose, IconCheck, IconPlay, IconRefresh, IconEye, IconEyeOff } from '../components/icons'

function Star({ team, active }: { team: TeamId; active: boolean }) {
  const { state } = useStore()
  const color = team === 'pink' ? 'var(--pink)' : 'var(--blue)'
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
      <Star team="pink" active={state.currentTeam === 'pink'} />
      <Star team="blue" active={state.currentTeam === 'blue'} />
    </div>
  )
}

function TrioStar({ index, idle }: { index: number; idle: boolean }) {
  const { state } = useStore()
  const trio = state.trio!
  return (
    <div className={`score-badge trio ${idle ? 'trio-idle' : ''}`}>
      <div className="star">
        <svg viewBox="0 0 100 100" aria-hidden>
          <path
            fill="#ffffff"
            d="M50 3l9 11 13-6 1 14 14-1-5 13 12 7-11 8 11 8-12 7 5 13-14-1-1 14-13-6-9 11-9-11-13 6-1-14-14 1 5-13-12-7 11-8-11-8 12-7-5-13 14 1 1-14 13 6z"
          />
        </svg>
        <span style={{ color: '#2b3642' }}>{trio.scores[index]}</span>
      </div>
      <small>{trio.players[index]}</small>
    </div>
  )
}

function TrioScorebar() {
  const { state } = useStore()
  const round = state.phase === 'win' ? null : TRIO_ORDER[state.turnIndex]
  return (
    <div className="scorebar trio">
      {state.trio!.players.map((_, i) => (
        <TrioStar key={i} index={i} idle={round !== null && i !== round[0] && i !== round[1]} />
      ))}
    </div>
  )
}

function TrioGame() {
  const { state, dispatch } = useStore()
  const [hidden, setHidden] = useState(false)
  const { describer, guesser } = trioCurrentPair(state)

  if (state.phase === 'win') {
    const trio = state.trio!
    const winners = state.trioWinners ?? []
    const isTie = winners.length > 1
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <TrioScorebar />
        <div className="game-center win">
          <div className="win-title">
            {isTie
              ? `🤝 Égalité entre ${winners.map((i) => trio.players[i]).join(' et ')} !`
              : `🎉 ${trio.players[winners[0]]} gagne !`}
          </div>
          <div className="win-sub">
            {trio.players.map((p, i) => `${p} : ${trio.scores[i]}`).join(' · ')}
          </div>
        </div>
        <div className="game-actions">
          <button className="pill" onClick={() => dispatch({ type: 'quitGame' })}>
            <IconClose /> Accueil
          </button>
          <button className="pill blue-accent" onClick={() => dispatch({ type: 'newGame' })}>
            <span className="ic" style={{ background: 'var(--blue)' }}>
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

      <TrioScorebar />

      {state.phase === 'pass' ? (
        <>
          <div className="game-center">
            <div className="big-instruction">{describer} doit prendre le téléphone.</div>
          </div>
          <div className="game-actions">
            <button
              className="pill blue-accent"
              onClick={() => {
                setHidden(false)
                dispatch({ type: 'ready' })
              }}
            >
              <span className="ic" style={{ background: 'var(--blue)' }}>
                <IconPlay width={16} height={16} />
              </span>
              Prêt
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="game-center">
            <div className="reveal-lead">
              {describer}, avec complicité, tu dois faire deviner à {guesser} :
            </div>
            <div className={`word ${hidden ? 'hidden' : ''}`}>{state.word}</div>
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
              className="pill blue-accent"
              onClick={() => dispatch({ type: 'result', success: false })}
            >
              <span className="ic" style={{ background: 'var(--blue)' }}>
                <IconClose width={16} height={16} />
              </span>
              Échec
            </button>
            <button
              className="pill blue-accent"
              onClick={() => dispatch({ type: 'result', success: true })}
            >
              <span className="ic" style={{ background: 'var(--blue)' }}>
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

function TeamsGame() {
  const { state, dispatch } = useStore()
  const [hidden, setHidden] = useState(false)
  const team = state.currentTeam
  const { describer, guesser } = currentPair(state)

  if (state.phase === 'win') {
    const w = state.winner
    const accentClass = w ? `${w}-accent` : 'pink-accent'
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Scorebar />
        <div className="game-center win">
          {w ? (
            <>
              <div className={`win-title ${w}`}>
                🎉 {w === 'pink' ? 'L’équipe rose' : 'L’équipe bleue'} gagne !
              </div>
              <div className="win-sub">
                {state.teams[w].score} manche{state.teams[w].score > 1 ? 's' : ''} remportée
                {state.teams[w].score > 1 ? 's' : ''}
              </div>
            </>
          ) : (
            <>
              <div className="win-title">🤝 Égalité !</div>
              <div className="win-sub">
                {state.teams.pink.score} partout, {state.turnOrder.length} manche
                {state.turnOrder.length > 1 ? 's' : ''} jouées
              </div>
            </>
          )}
        </div>
        <div className="game-actions">
          <button className="pill" onClick={() => dispatch({ type: 'quitGame' })}>
            <IconClose /> Accueil
          </button>
          <button className={`pill ${accentClass}`} onClick={() => dispatch({ type: 'newGame' })}>
            <span className="ic" style={{ background: 'var(--blue)' }}>
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
              <span className="ic" style={{ background: 'var(--blue)' }}>
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
              <span className="ic" style={{ background: 'var(--blue)' }}>
                <IconClose width={16} height={16} />
              </span>
              Échec
            </button>
            <button
              className={`pill ${team}-accent`}
              onClick={() => dispatch({ type: 'result', success: true })}
            >
              <span className="ic" style={{ background: 'var(--blue)' }}>
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

export function Game() {
  const { state } = useStore()
  return state.mode === 'trio' ? <TrioGame /> : <TeamsGame />
}
