import { useGame } from '../../context/GameContext.jsx'
import ServiceStatus from '../Layer1/ServiceStatus.jsx'
import PerformanceTuning from '../Layer2/PerformanceTuning.jsx'
import RegionConfig from '../Layer3/RegionConfig.jsx'
import SystemLogs from '../Layer4/SystemLogs.jsx'
import './Dashboard.css'

export default function Dashboard() {
  const { state } = useGame()

  return (
    <main className="dashboard">
      <div className="dashboard-grid">
        <ServiceStatus />
        <PerformanceTuning />
        <RegionConfig />
        <SystemLogs />
      </div>

      {/* Subtle instruction bar at the bottom */}
      {!state.isComplete && (
        <div className="dashboard-footer">
          <span className="dashboard-footer-text">
            Ticket #4096 — Inspect each module and resolve all anomalies to close the ticket.
          </span>
        </div>
      )}
    </main>
  )
}
