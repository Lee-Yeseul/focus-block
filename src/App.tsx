import { useTimerStore } from './store/timerStore'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import LogModal from './components/LogModal'
import FocusView from './components/views/FocusView'
import RecordView from './components/views/RecordView'
import SettingsView from './components/views/SettingsView'

export default function App() {
  const currentView = useTimerStore((s) => s.currentView)

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 0% 100%, #FFB2C1 0%, transparent 50%),
          radial-gradient(ellipse at 100% 0%, #76E4B8 0%, transparent 50%),
          #FFFDF5
        `,
      }}
    >
      <Header />

      <div className="flex-1 flex flex-col overflow-hidden py-4">
        {currentView === 'focus' && <FocusView />}
        {currentView === 'record' && <RecordView />}
        {currentView === 'settings' && <SettingsView />}
      </div>

      <BottomNav />
      <LogModal />
    </div>
  )
}
