import { useGame } from '../../context/GameContext.jsx'
import { SERVICES } from '../../data/constants.js'
import './ServiceStatus.css'

export default function ServiceStatus() {
  const { state, toggleSwitch } = useGame()
  const { switches, solved } = state.layer1

  return (
    <div className={`card service-status-card ${solved ? 'solved' : ''}`}>
      <div className="card-title">
        <span className={`status-dot ${solved ? 'active' : ''}`} />
        Service Status
        {solved && <span className="card-solved-tag">✓ Resolved</span>}
      </div>

      <div className="service-list">
        {SERVICES.map((service) => {
          const isOn = switches[service.id]
          return (
            <div key={service.id} className="service-item">
              <div className="service-info">
                <span className={`service-light ${isOn ? 'on' : 'off'}`} />
                <span className="service-name">{service.label}</span>
                {service.dep.length > 0 && (
                  <span
                    className="service-dep-hint"
                    data-tooltip={`Affects: ${service.dep.join(', ')}`}
                  >
                    ⟳
                  </span>
                )}
              </div>
              <button
                id={`switch-${service.id}`}
                className={`toggle-switch ${isOn ? 'on' : 'off'} ${solved ? 'disabled' : ''}`}
                onClick={() => !solved && toggleSwitch(service.id)}
                aria-pressed={isOn}
                aria-label={`Toggle ${service.label}`}
                disabled={solved}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          )
        })}
      </div>

      {!solved && (
        <p className="service-hint">
          Some services have hidden dependencies. Watch for interactions.
        </p>
      )}
    </div>
  )
}
