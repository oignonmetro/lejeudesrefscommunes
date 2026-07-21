import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { CATEGORIES, drawWord } from '../data/words'

export type TeamId = 'pink' | 'blue'
export type Screen = 'home' | 'rules' | 'options' | 'game'

export interface TeamState {
  players: string[]
  score: number
  /** Index de rotation des couples (conteur / complice) au sein de l'équipe. */
  rotation: number
}

/** Phase à l'intérieur d'une manche. */
export type Phase = 'pass' | 'reveal' | 'win'

export interface GameState {
  screen: Screen
  teams: Record<TeamId, TeamState>
  settings: {
    enabledCategories: string[]
  }
  // État de la partie en cours
  playing: boolean
  phase: Phase
  currentTeam: TeamId
  word: string
  recentWords: string[]
  /** Ordre des tours pour la partie : une manche par joueur, toutes équipes confondues. */
  turnOrder: TeamId[]
  turnIndex: number
  winner: TeamId | null
}

/** Répartit les tours entre les deux équipes le plus équitablement possible,
 * de sorte que chaque joueur ait exactement une manche (nPink + nBlue manches au total). */
function buildTurnOrder(nPink: number, nBlue: number): TeamId[] {
  const total = nPink + nBlue
  const order: TeamId[] = []
  let usedPink = 0
  let usedBlue = 0
  for (let i = 0; i < total; i++) {
    const pinkRatio = nPink === 0 ? Infinity : usedPink / nPink
    const blueRatio = nBlue === 0 ? Infinity : usedBlue / nBlue
    if (pinkRatio <= blueRatio) {
      order.push('pink')
      usedPink++
    } else {
      order.push('blue')
      usedBlue++
    }
  }
  return order
}

const STORAGE_KEY = 'refs-communes:v2'

function defaultState(): GameState {
  return {
    screen: 'home',
    teams: {
      pink: { players: [], score: 0, rotation: 0 },
      blue: { players: [], score: 0, rotation: 0 },
    },
    settings: {
      enabledCategories: CATEGORIES.map((c) => c.id),
    },
    playing: false,
    phase: 'pass',
    currentTeam: 'pink',
    word: '',
    recentWords: [],
    turnOrder: [],
    turnIndex: 0,
    winner: null,
  }
}

/** Charge les réglages/joueurs persistés, sans reprendre une partie en cours. */
function loadState(): GameState {
  const base = defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<GameState>
    return {
      ...base,
      teams: {
        pink: { ...base.teams.pink, players: saved.teams?.pink?.players ?? [] },
        blue: { ...base.teams.blue, players: saved.teams?.blue?.players ?? [] },
      },
      settings: {
        enabledCategories:
          saved.settings?.enabledCategories?.length
            ? saved.settings.enabledCategories
            : base.settings.enabledCategories,
      },
    }
  } catch {
    return base
  }
}

export type Action =
  | { type: 'goto'; screen: Screen }
  | { type: 'addPlayer'; team: TeamId; name: string }
  | { type: 'removePlayer'; team: TeamId; index: number }
  | { type: 'toggleCategory'; id: string }
  | { type: 'startGame' }
  | { type: 'ready' } // le conteur a pris le téléphone -> révèle le mot
  | { type: 'result'; success: boolean }
  | { type: 'redraw' } // changer de mot sans marquer de point
  | { type: 'quitGame' }
  | { type: 'newGame' } // remet les scores à zéro, garde équipes/réglages

function firstEnabledOr(state: GameState, id: string): boolean {
  const enabled = state.settings.enabledCategories
  return enabled.length > 1 || enabled[0] !== id
}

function nextWord(state: GameState): string {
  return drawWord(state.settings.enabledCategories, state.recentWords)
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'goto':
      return { ...state, screen: action.screen }

    case 'addPlayer': {
      const name = action.name.trim()
      if (!name) return state
      const team = state.teams[action.team]
      if (team.players.length >= 12) return state
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.team]: { ...team, players: [...team.players, name] },
        },
      }
    }

    case 'removePlayer': {
      const team = state.teams[action.team]
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.team]: {
            ...team,
            players: team.players.filter((_, i) => i !== action.index),
          },
        },
      }
    }

    case 'toggleCategory': {
      const enabled = state.settings.enabledCategories
      const has = enabled.includes(action.id)
      // On empêche de tout désactiver.
      if (has && !firstEnabledOr(state, action.id)) return state
      return {
        ...state,
        settings: {
          ...state.settings,
          enabledCategories: has
            ? enabled.filter((c) => c !== action.id)
            : [...enabled, action.id],
        },
      }
    }

    case 'startGame': {
      const turnOrder = buildTurnOrder(
        state.teams.pink.players.length,
        state.teams.blue.players.length,
      )
      return {
        ...state,
        teams: {
          pink: { ...state.teams.pink, score: 0, rotation: 0 },
          blue: { ...state.teams.blue, score: 0, rotation: 0 },
        },
        playing: true,
        phase: 'pass',
        currentTeam: turnOrder[0] ?? 'pink',
        recentWords: [],
        turnOrder,
        turnIndex: 0,
        winner: null,
        screen: 'game',
      }
    }

    case 'ready': {
      const word = nextWord(state)
      return {
        ...state,
        phase: 'reveal',
        word,
        recentWords: [word, ...state.recentWords].slice(0, 30),
      }
    }

    case 'redraw': {
      const word = nextWord(state)
      return {
        ...state,
        word,
        recentWords: [word, ...state.recentWords].slice(0, 30),
      }
    }

    case 'result': {
      const teamId = state.currentTeam
      const team = state.teams[teamId]
      const newScore = action.success ? team.score + 1 : team.score
      const updatedTeams = {
        ...state.teams,
        [teamId]: { ...team, score: newScore, rotation: team.rotation + 1 },
      }
      const nextIndex = state.turnIndex + 1
      if (nextIndex >= state.turnOrder.length) {
        const pinkScore = updatedTeams.pink.score
        const blueScore = updatedTeams.blue.score
        const winner: TeamId | null =
          pinkScore === blueScore ? null : pinkScore > blueScore ? 'pink' : 'blue'
        return {
          ...state,
          teams: updatedTeams,
          turnIndex: nextIndex,
          phase: 'win',
          winner,
        }
      }
      return {
        ...state,
        teams: updatedTeams,
        turnIndex: nextIndex,
        currentTeam: state.turnOrder[nextIndex],
        phase: 'pass',
        word: '',
      }
    }

    case 'quitGame':
      return { ...state, playing: false, screen: 'home', phase: 'pass', word: '' }

    case 'newGame': {
      const turnOrder = buildTurnOrder(
        state.teams.pink.players.length,
        state.teams.blue.players.length,
      )
      return {
        ...state,
        teams: {
          pink: { ...state.teams.pink, score: 0, rotation: 0 },
          blue: { ...state.teams.blue, score: 0, rotation: 0 },
        },
        playing: true,
        phase: 'pass',
        currentTeam: turnOrder[0] ?? 'pink',
        recentWords: [],
        turnOrder,
        turnIndex: 0,
        winner: null,
        screen: 'game',
      }
    }

    default:
      return state
  }
}

interface Store {
  state: GameState
  dispatch: (a: Action) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  // Persiste équipes + réglages (pas la partie en cours).
  useEffect(() => {
    const toSave = {
      teams: {
        pink: { players: state.teams.pink.players },
        blue: { players: state.teams.blue.players },
      },
      settings: state.settings,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {
      /* stockage indisponible : on ignore */
    }
  }, [state.teams.pink.players, state.teams.blue.players, state.settings])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore doit être utilisé dans <StoreProvider>')
  return ctx
}

/** Renvoie le couple (conteur, complice) pour l'équipe qui joue. */
export function currentPair(state: GameState): { describer: string; guesser: string } {
  const team = state.teams[state.currentTeam]
  const n = team.players.length
  if (n === 0) return { describer: '?', guesser: '?' }
  if (n === 1) return { describer: team.players[0], guesser: team.players[0] }
  const describer = team.players[team.rotation % n]
  const guesser = team.players[(team.rotation + 1) % n]
  return { describer, guesser }
}
