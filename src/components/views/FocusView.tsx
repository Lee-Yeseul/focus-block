import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTimerStore } from '../../store/timerStore'
import TimerDisplay from '../TimerDisplay'
import ProgressBar from '../ProgressBar'
import ProgressVisual from '../ProgressVisual'

export default function FocusView() {
  const isRunning = useTimerStore((s) => s.isRunning)
  const mode = useTimerStore((s) => s.mode)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const reset = useTimerStore((s) => s.reset)
  const tick = useTimerStore((s) => s.tick)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      tick()
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, tick])

  return (
    <div className="flex flex-col gap-5 flex-1 overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <ProgressVisual />
      </div>

      <TimerDisplay />

      {mode === 'focus' && <ProgressBar />}

      <div className="flex justify-center gap-4 pb-2">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={reset}
          className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-dark/60 hover:bg-white/80 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04 }}
          onClick={isRunning ? pause : start}
          className="w-20 h-20 rounded-full bg-dark text-neutral flex items-center justify-center shadow-lg hover:bg-dark/90 transition-colors"
        >
          {isRunning ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </motion.button>

        <div className="w-12 h-12" />
      </div>
    </div>
  )
}
