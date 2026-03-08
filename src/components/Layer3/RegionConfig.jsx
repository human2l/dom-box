import { useGame } from '../../context/GameContext.jsx'
import { REGIONS_TREE } from '../../data/constants.js'
import './RegionConfig.css'

const PRIMARY_OPTIONS = Object.keys(REGIONS_TREE)

export default function RegionConfig() {
  const { state, setRegion, getFailovers, getCdns } = useGame()
  const { selections, error, solved } = state.layer3
  const locked = !state.layer2.solved

  const failoverOptions = getFailovers(selections.primary)
  const cdnOptions = getCdns(selections.primary, selections.failover)

  return (
    <div className={`card region-card ${solved ? 'solved' : ''} ${locked ? 'locked' : ''}`}>
      <div className="card-title">
        <span className={`status-dot ${solved ? 'active' : ''}`} />
        Region Configuration
        {solved && <span className="card-solved-tag">✓ Resolved</span>}
      </div>

      <div className="region-selects">
        {/* Primary Region */}
        <div className="region-select-group">
          <label className="region-label" htmlFor="select-primary">Primary Region</label>
          <div className={`select-wrapper ${selections.primary && !solved ? 'has-value' : ''} ${solved ? 'resolved' : ''}`}>
            <select
              id="select-primary"
              value={selections.primary}
              disabled={solved || locked}
              onChange={(e) => setRegion('primary', e.target.value)}
              className="region-select"
            >
              <option value="">— Select region —</option>
              {PRIMARY_OPTIONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

        {/* Failover Region */}
        <div className="region-select-group">
          <label className="region-label" htmlFor="select-failover">Failover Region</label>
          <div className={`select-wrapper ${selections.failover && !solved ? 'has-value' : ''} ${solved ? 'resolved' : ''} ${!selections.primary ? 'dimmed' : ''}`}>
            <select
              id="select-failover"
              value={selections.failover}
              disabled={solved || locked || !selections.primary}
              onChange={(e) => setRegion('failover', e.target.value)}
              className="region-select"
            >
              <option value="">— Select failover —</option>
              {failoverOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

        {/* CDN Edge */}
        <div className="region-select-group">
          <label className="region-label" htmlFor="select-cdn">CDN Edge Node</label>
          <div className={`select-wrapper ${selections.cdn && !solved ? 'has-value' : ''} ${solved ? 'resolved' : ''} ${!selections.failover ? 'dimmed' : ''}`}>
            <select
              id="select-cdn"
              value={selections.cdn}
              disabled={solved || locked || !selections.failover}
              onChange={(e) => setRegion('cdn', e.target.value)}
              className="region-select"
            >
              <option value="">— Select CDN edge —</option>
              {cdnOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>
      </div>

      {/* Error / hint message */}
      {error && !solved && (
        <div className="region-error">
          <span className="region-error-icon">⚠</span>
          <span className="region-error-text mono">{error}</span>
        </div>
      )}
    </div>
  )
}
