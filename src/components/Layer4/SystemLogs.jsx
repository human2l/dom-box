import { useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { LOG_LINES, TOAST_KEY_FRAGMENT } from '../../data/constants.js'
import './SystemLogs.css'

export default function SystemLogs() {
  const { state, setInput, addToast, markToastShown } = useGame()
  const { inputValue, toastShown, solved } = state.layer4
  const locked = !state.layer3.solved
  const [open, setOpen] = useState(false)
  const logRef = useRef(null)

  // Trigger toast once when accordion first opens
  useEffect(() => {
    if (open && !toastShown && !locked) {
      const timer = setTimeout(() => {
        addToast(TOAST_KEY_FRAGMENT, 'key')
        markToastShown()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [open, toastShown, locked, addToast, markToastShown])

  // Auto-scroll logs to show special lines (roughly the middle)
  useEffect(() => {
    if (open && logRef.current) {
      setTimeout(() => {
        if (logRef.current) logRef.current.scrollTop = 0
      }, 100)
    }
  }, [open])

  return (
    <div className={`card log-card ${solved ? 'solved' : ''} ${locked ? 'locked' : ''}`}>
      <div className="card-title">
        <span className={`status-dot ${solved ? 'active' : ''}`} />
        System Logs
        {solved && <span className="card-solved-tag">✓ Resolved</span>}
      </div>

      {/* Accordion trigger */}
      <button
        id="log-accordion-toggle"
        className={`log-accordion-btn ${open ? 'open' : ''}`}
        onClick={() => !locked && setOpen(o => !o)}
        disabled={locked}
        aria-expanded={open}
      >
        <span>Latest log entries ({LOG_LINES.length})</span>
        <span className="log-accordion-arrow">{open ? '▴' : '▾'}</span>
      </button>

      {/* Log content */}
      {open && (
        <div className="log-content" ref={logRef}>
          {LOG_LINES.map((line) => {
            const level = getLogLevel(line.text)
            return (
              <div
                key={line.id}
                className={`log-line ${level} ${line.special ? 'special' : ''}`}
                title={line.special ? line.clueChar : undefined}
              >
                <span className="log-level-tag">{getLogLevelTag(level)}</span>
                <span className="log-text">{formatLogText(line.text)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Recovery input — visible when accordion is open */}
      {open && (
        <div className="log-recovery">
          <label className="log-recovery-label" htmlFor="recovery-input">
            Recovery Key
          </label>
          <div className="log-recovery-row">
            <input
              id="recovery-input"
              type="text"
              value={inputValue}
              disabled={solved}
              onChange={(e) => setInput(e.target.value)}
              className={`log-recovery-input mono ${solved ? 'correct' : inputValue.length > 0 ? 'wrong' : ''}`}
              placeholder="Enter recovery key..."
              autoComplete="off"
              spellCheck={false}
            />
            <span className={`log-recovery-indicator ${solved ? 'ok' : inputValue.length > 0 ? 'fail' : ''}`}>
              {solved ? '✓' : inputValue.length > 0 ? '✗' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function getLogLevel(text) {
  if (text.includes('[ERROR]')) return 'error'
  if (text.includes('[WARN]'))  return 'warn'
  return 'info'
}

function getLogLevelTag(level) {
  if (level === 'error') return 'ERR'
  if (level === 'warn')  return 'WRN'
  return 'INF'
}

function formatLogText(text) {
  return text.replace(/^\[(INFO|WARN|ERROR)\]\s*/, '')
}
