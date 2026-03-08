import { useGame } from '../../context/GameContext.jsx'
import './Header.css'

export default function Header() {
  const { state } = useGame()

  const solvedCount = [state.layer1.solved, state.layer2.solved, state.layer3.solved, state.layer4.solved].filter(Boolean).length
  const priority = state.isComplete ? 'resolved' : solvedCount >= 2 ? 'medium' : 'high'
  const priorityLabel = state.isComplete ? 'Resolved ✓' : solvedCount >= 2 ? 'Medium' : 'Critical'

  return (
    <header className="header">
      <div className="header-ticket">
        <div className={`header-ticket-indicator ${priority}`} />
        <div className="header-ticket-info">
          <span className="header-ticket-id">Ticket #4096</span>
          <span className="header-ticket-desc">Dashboard anomaly detected — all modules require inspection</span>
        </div>
        <div className={`header-ticket-badge ${priority}`}>
          {priorityLabel}
        </div>
      </div>

      <div className="header-right">
        <div className="header-module-count">
          <span className="header-module-value">{solvedCount}</span>
          <span className="header-module-total">/4 fixed</span>
        </div>
        <div className="header-avatar">
          <span>E</span>
        </div>
      </div>
    </header>
  )
}
