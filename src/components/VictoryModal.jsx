import { createPortal } from 'react-dom'
import { useGame } from '../context/GameContext.jsx'
import './VictoryModal.css'

export default function VictoryModal() {
  const { state } = useGame()
  if (!state.isComplete) return null

  const elapsed = state.stats.startTime
    ? Math.round((Date.now() - state.stats.startTime) / 1000)
    : 0
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`

  return createPortal(
    <div className="victory-overlay" role="dialog" aria-modal="true" aria-label="Victory">
      <div className="victory-modal">
        {/* Animated glow orb */}
        <div className="victory-orb" />

        <div className="victory-content">
          <p className="victory-tag">TICKET #4096</p>
          <h1 className="victory-title">System Restored</h1>
          <p className="victory-subtitle">
            All modules are back online. The DOM Box has been unlocked.
          </p>

          <div className="victory-stats">
            <div className="victory-stat">
              <span className="victory-stat-value mono">{timeStr}</span>
              <span className="victory-stat-label">Time elapsed</span>
            </div>
            <div className="victory-stat-divider" />
            <div className="victory-stat">
              <span className="victory-stat-value mono">{state.stats.moveCount}</span>
              <span className="victory-stat-label">Total moves</span>
            </div>
            <div className="victory-stat-divider" />
            <div className="victory-stat">
              <span className="victory-stat-value mono">4/4</span>
              <span className="victory-stat-label">Modules fixed</span>
            </div>
          </div>

          <div className="victory-key-display">
            <span className="victory-key-label">Recovery Key</span>
            <span className="victory-key-value mono">DOM-BOX</span>
          </div>

          <button
            className="victory-share-btn"
            onClick={() => {
              const text = `I solved DOM Box in ${timeStr} with ${state.stats.moveCount} moves! 🔓 #DOMBox`
              if (navigator.share) {
                navigator.share({ text }).catch(() => {})
              } else {
                navigator.clipboard?.writeText(text)
                  .then(() => alert('Copied to clipboard!'))
                  .catch(() => {})
              }
            }}
          >
            Share Challenge ↗
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
