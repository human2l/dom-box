import { createPortal } from 'react-dom'
import { useGame } from '../context/GameContext.jsx'
import './Toast.css'

export default function ToastContainer() {
  const { state } = useGame()
  return createPortal(
    <div className="toast-container" aria-live="polite">
      {state.toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body
  )
}

function Toast({ toast }) {
  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span className="toast-icon">
        {toast.type === 'key' ? '🔑' : toast.type === 'success' ? '✓' : 'ℹ'}
      </span>
      <span className="toast-message mono">{toast.message}</span>
    </div>
  )
}
