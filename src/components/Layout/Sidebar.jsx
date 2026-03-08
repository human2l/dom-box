import { useGame } from '../../context/GameContext.jsx'
import { NAV_ITEMS_DEFAULT, NAV_ITEMS_LAYER1_SOLVED } from '../../data/constants.js'
import './Sidebar.css'

export default function Sidebar() {
  const { state } = useGame()
  const navItems = state.layer1.solved ? NAV_ITEMS_LAYER1_SOLVED : NAV_ITEMS_DEFAULT

  const layerProgress = [
    { layer: 1, solved: state.layer1.solved },
    { layer: 2, solved: state.layer2.solved },
    { layer: 3, solved: state.layer3.solved },
    { layer: 4, solved: state.layer4.solved },
  ]

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">◈</span>
        <span className="sidebar-brand-name">SysControl</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-nav-item ${item.id === 'dashboard' ? 'active' : ''}`}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Progress indicator */}
      <div className="sidebar-progress">
        <p className="sidebar-progress-label">Module Integrity</p>
        <div className="sidebar-progress-steps">
          {layerProgress.map(({ layer, solved }) => (
            <div
              key={layer}
              className={`sidebar-progress-step ${solved ? 'solved' : ''} ${state.currentLayer === layer && !solved ? 'active' : ''}`}
              title={`Module ${layer}`}
            >
              {solved ? '✓' : layer}
            </div>
          ))}
        </div>
        <div className="sidebar-progress-bar">
          <div
            className="sidebar-progress-fill"
            style={{ width: `${(layerProgress.filter(l => l.solved).length / 4) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  )
}
