import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { CATEGORIES, drawWord } from '../data/words'

export type TeamId = 'red' | 'yellow'
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
    pointsToWin: number
    enabledCategories: string[]
  }
  // État de la partie en cours
  playing: boolean
  phase: Phase
  currentTeam: TeamId
  word: string
  recentWords: string[]
  winner: TeamId | null
}

const STORAGE_KEY = 'refs-communes:v1'

function defaultState(): GameState {
  return {
    screen: 'home',
    teams: {
      red: { players: [], score: 0, rotation: 0 },
      yellow: { players: [], score: 0, rotation: 0 },
    },
    settings: {
      pointsToWin: 5,
      enabledCategories: CATEGORIES.map((c) => c.id),
    },
    playing: false,
    phase: 'pass',
    currentTeam: 'red',
    word: '',
    recentWords: [],
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
        red: { ...base.teams.red, players: saved.teams?.red?.players ?? [] },
        yellow: { ...base.teams.yellow, players: saved.teams?.yellow?.players ?? [] },
      },
      settings: {
        pointsToWin: saved.settings?.pointsToWin ?? base.settings.pointsToWin,
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
  | { type: 'setPointsToWin'; value: number }
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

    case 'setPointsToWin':
      return { ...state, settings: { ...state.settings, pointsToWin: action.value } }

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
      const reset: GameState = {
        ...state,
        teams: {
          red: { ...state.teams.red, score: 0, rotation: 0 },
          yellow: { ...state.teams.yellow, score: 0, rotation: 0 },
        },
        playing: true,
        phase: 'pass',
        currentTeam: 'red',
        recentWords: [],
        winner: null,
        screen: 'game',
      }
      return reset
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
      if (newScore >= state.settings.pointsToWin) {
        return {
          ...state,
          teams: updatedTeams,
          phase: 'win',
          winner: teamId,
        }
      }
      const next: TeamId = teamId === 'red' ? 'yellow' : 'red'
      return {
        ...state,
        teams: updatedTeams,
        currentTeam: next,
        phase: 'pass',
        word: '',
      }
    }

    case 'quitGame':
      return { ...state, playing: false, screen: 'home', phase: 'pass', word: '' }

    case 'newGame':
      return {
        ...state,
        teams: {
          red: { ...state.teams.red, score: 0, rotation: 0 },
          yellow: { ...state.teams.yellow, score: 0, rotation: 0 },
        },
        playing: true,
        phase: 'pass',
        currentTeam: 'red',
        recentWords: [],
        winner: null,
        screen: 'game',
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
        red: { players: state.teams.red.players },
        yellow: { players: state.teams.yellow.players },
      },
      settings: state.settings,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {
      /* stockage indisponible : on ignore */
    }
  }, [state.teams.red.players, state.teams.yellow.players, state.settings])

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
