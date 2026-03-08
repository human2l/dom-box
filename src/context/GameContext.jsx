import { createContext, useCallback, useContext, useReducer } from 'react'
import { REGIONS_TREE, SERVICES, SLIDERS } from '../data/constants.js'
import {
    applySwitch,
    getCdnOptions,
    getDropdownError,
    getFailoverOptions,
    getResonanceScore,
    isDropdownsSolved,
    isRecoveryKeySolved,
    isSlidersSolved,
    isSwitchesSolved,
} from '../engine/puzzleEngine.js'

// ============================================================
//  Initial State
// ============================================================
const initialSwitches = Object.fromEntries(SERVICES.map(s => [s.id, false]))
const initialSliders = Object.fromEntries(SLIDERS.map(s => [s.id, s.initial]))

const initialState = {
  currentLayer: 1,
  isComplete: false,

  layer1: {
    switches: initialSwitches,
    solved: false,
  },
  layer2: {
    sliders: initialSliders,
    resonance: 0,
    solved: false,
  },
  layer3: {
    selections: { primary: '', failover: '', cdn: '' },
    error: null,
    solved: false,
  },
  layer4: {
    inputValue: '',
    toastShown: false,
    solved: false,
  },

  stats: {
    startTime: null,
    moveCount: 0,
  },

  toasts: [],  // { id, message, type }
}

// ============================================================
//  Reducer
// ============================================================
function gameReducer(state, action) {
  switch (action.type) {

    // ----- Layer 1 -----
    case 'TOGGLE_SWITCH': {
      if (state.layer1.solved) return state
      const newSwitches = applySwitch(state.layer1.switches, action.serviceId)
      const solved = isSwitchesSolved(newSwitches)
      return {
        ...state,
        layer1: { switches: newSwitches, solved },
        currentLayer: solved ? Math.max(state.currentLayer, 2) : state.currentLayer,
        stats: {
          ...state.stats,
          startTime: state.stats.startTime ?? Date.now(),
          moveCount: state.stats.moveCount + 1,
        },
      }
    }

    // ----- Layer 2 -----
    case 'SET_SLIDER': {
      if (state.layer2.solved) return state
      const newSliders = { ...state.layer2.sliders, [action.id]: action.value }
      const resonance = getResonanceScore(newSliders)
      const solved = isSlidersSolved(newSliders)
      return {
        ...state,
        layer2: { sliders: newSliders, resonance, solved },
        currentLayer: solved ? Math.max(state.currentLayer, 3) : state.currentLayer,
        stats: { ...state.stats, moveCount: state.stats.moveCount + 1 },
      }
    }

    // ----- Layer 3 -----
    case 'SET_REGION': {
      if (state.layer3.solved) return state
      let newSelections = { ...state.layer3.selections, [action.key]: action.value }
      // Reset downstream selections when upstream changes
      if (action.key === 'primary') newSelections = { primary: action.value, failover: '', cdn: '' }
      if (action.key === 'failover') newSelections = { ...newSelections, cdn: '' }

      const solved = isDropdownsSolved(newSelections)
      const error = solved ? null : getDropdownError(newSelections)
      return {
        ...state,
        layer3: { selections: newSelections, error, solved },
        currentLayer: solved ? Math.max(state.currentLayer, 4) : state.currentLayer,
        stats: { ...state.stats, moveCount: state.stats.moveCount + 1 },
      }
    }

    // ----- Layer 4 -----
    case 'SET_INPUT': {
      if (state.layer4.solved) return state
      const inputValue = action.value
      const solved = isRecoveryKeySolved(inputValue)
      return {
        ...state,
        layer4: { ...state.layer4, inputValue, solved },
        isComplete: solved,
        stats: { ...state.stats, moveCount: state.stats.moveCount + 1 },
      }
    }

    case 'MARK_TOAST_SHOWN': {
      return {
        ...state,
        layer4: { ...state.layer4, toastShown: true },
      }
    }

    // ----- Toasts -----
    case 'ADD_TOAST': {
      const toast = { id: Date.now(), message: action.message, type: action.toastType ?? 'info' }
      return { ...state, toasts: [...state.toasts, toast] }
    }
    case 'REMOVE_TOAST': {
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    }

    default:
      return state
  }
}

// ============================================================
//  Context + Provider
// ============================================================
const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const toggleSwitch = useCallback((serviceId) => {
    dispatch({ type: 'TOGGLE_SWITCH', serviceId })
  }, [])

  const setSlider = useCallback((id, value) => {
    dispatch({ type: 'SET_SLIDER', id, value })
  }, [])

  const setRegion = useCallback((key, value) => {
    dispatch({ type: 'SET_REGION', key, value })
  }, [])

  const setInput = useCallback((value) => {
    dispatch({ type: 'SET_INPUT', value })
  }, [])

  const markToastShown = useCallback(() => {
    dispatch({ type: 'MARK_TOAST_SHOWN' })
  }, [])

  const addToast = useCallback((message, toastType = 'info') => {
    const id = Date.now()
    dispatch({ type: 'ADD_TOAST', message, toastType })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3500)
  }, [])

  // Computed helpers
  const getFailovers = useCallback((primary) => getFailoverOptions(REGIONS_TREE, primary), [])
  const getCdns = useCallback((primary, failover) => getCdnOptions(REGIONS_TREE, primary, failover), [])

  return (
    <GameContext.Provider value={{
      state,
      toggleSwitch,
      setSlider,
      setRegion,
      setInput,
      markToastShown,
      addToast,
      getFailovers,
      getCdns,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
