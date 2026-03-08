import { useEffect } from 'react'
import Dashboard from './components/Layout/Dashboard.jsx'
import Header from './components/Layout/Header.jsx'
import Sidebar from './components/Layout/Sidebar.jsx'
import ToastContainer from './components/Toast.jsx'
import VictoryModal from './components/VictoryModal.jsx'
import { GameProvider, useGame } from './context/GameContext.jsx'

function AppInner() {
  const { state } = useGame()

  // Apply victory theme to <html> when complete
  useEffect(() => {
    if (state.isComplete) {
      document.documentElement.classList.add('victory-theme')
    } else {
      document.documentElement.classList.remove('victory-theme')
    }
  }, [state.isComplete])

  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <Dashboard />
      <ToastContainer />
      <VictoryModal />
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  )
}
