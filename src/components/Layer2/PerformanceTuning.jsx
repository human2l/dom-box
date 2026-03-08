import { useCallback, useEffect, useRef } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { SLIDERS } from '../../data/constants.js'
import './PerformanceTuning.css'

function Waveform({ resonance }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const timeRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    timeRef.current += 0.04

    const noiseAmp = (1 - resonance) * 18    // chaos from low resonance
    const sineAmp = resonance * 12           // clean sine at high resonance
    const frequency = 2 + resonance * 1.5   // frequency tightens at resonance

    // Gradient color: red → amber → green as resonance increases
    const h = Math.round(resonance * 120)  // 0=red, 120=green
    const color = `hsl(${h}, 75%, 55%)`
    const glowColor = `hsla(${h}, 80%, 60%, 0.3)`

    // Glow pass
    ctx.shadowBlur = 12
    ctx.shadowColor = glowColor
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.beginPath()

    for (let x = 0; x < width; x++) {
      const t = (x / width) * Math.PI * 2 * frequency + timeRef.current
      const sine = Math.sin(t) * sineAmp
      const noise = noiseAmp > 0
        ? (Math.sin(t * 3.7 + timeRef.current * 2.1) * 0.5 +
           Math.sin(t * 7.3 - timeRef.current * 1.3) * 0.3 +
           Math.sin(t * 13.1 + timeRef.current * 0.7) * 0.2) * noiseAmp
        : 0
      const y = height / 2 + sine + noise
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    animRef.current = requestAnimationFrame(draw)
  }, [resonance])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  return <canvas ref={canvasRef} className="waveform-canvas" width={360} height={60} />
}

export default function PerformanceTuning() {
  const { state, setSlider } = useGame()
  const { sliders, resonance, solved } = state.layer2
  const locked = !state.layer1.solved

  const sum = sliders.cpu + sliders.memory + sliders.bandwidth

  return (
    <div className={`card perf-card ${solved ? 'solved' : ''} ${locked ? 'locked' : ''}`}>
      <div className="card-title">
        <span className={`status-dot ${solved ? 'active' : ''}`} />
        Performance Tuning
        {solved && <span className="card-solved-tag">✓ Resolved</span>}
      </div>

      {/* Waveform */}
      <div className="waveform-container">
        <Waveform resonance={resonance} />
        <p className="waveform-label">
          {solved ? 'Resonance locked ✓' : `Target: Resonance @ 150Hz`}
        </p>
      </div>

      {/* Sliders */}
      <div className="slider-list">
        {SLIDERS.map((slider) => (
          <div key={slider.id} className="slider-row">
            <div className="slider-row-header">
              <span className="slider-label">{slider.label}</span>
              <span className="slider-value mono">{sliders[slider.id]}{slider.unit}</span>
            </div>
            <input
              id={`slider-${slider.id}`}
              type="range"
              min={slider.min}
              max={slider.max}
              value={sliders[slider.id]}
              disabled={solved || locked}
              onChange={(e) => setSlider(slider.id, Number(e.target.value))}
              className="slider-input"
              aria-label={slider.label}
            />
          </div>
        ))}
      </div>

      <div className="slider-sum-row">
        <span className="slider-sum-label">Total Allocated</span>
        <span className={`slider-sum-value mono ${sum === 150 ? 'target' : ''}`}>
          {sum} / 150
        </span>
      </div>
    </div>
  )
}
