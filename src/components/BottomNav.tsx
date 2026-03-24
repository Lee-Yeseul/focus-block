import { useTimerStore } from '../store/timerStore'
import type { View } from '../types'

const tabs: { id: View; label: string; icon: React.ReactNode }[] = [
  {
    id: 'focus',
    label: '집중',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'record',
    label: '기록',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const currentView = useTimerStore((s) => s.currentView)
  const setView = useTimerStore((s) => s.setView)

  return (
    <div
      style={{
        background: 'rgba(255,253,245,0.7)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(45,74,62,0.08)',
      }}
      className="flex justify-around py-3 px-4"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-all duration-200 ${
            currentView === tab.id
              ? 'text-dark'
              : 'text-dark/35 hover:text-dark/60'
          }`}
        >
          {tab.icon}
          <span className={`text-[10px] font-semibold ${currentView === tab.id ? 'opacity-100' : 'opacity-60'}`}>
            {tab.label}
          </span>
          {currentView === tab.id && (
            <div className="w-1 h-1 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  )
}
