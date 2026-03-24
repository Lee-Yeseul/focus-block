import { useTimerStore } from '../store/timerStore'

export default function ProgressBar() {
  const minutesElapsed = useTimerStore((s) => s.minutesElapsed)
  const focusMinutes = useTimerStore((s) => s.focusMinutes)
  const secondsLeft = useTimerStore((s) => s.secondsLeft)
  const mode = useTimerStore((s) => s.mode)

  const totalSeconds = focusMinutes * 60
  const elapsed = totalSeconds - secondsLeft
  const fraction = mode === 'focus' ? Math.min(elapsed / totalSeconds, 1) : 0

  return (
    <div className="px-6">
      <div className="flex justify-between text-xs text-dark/40 mb-1.5">
        <span>진행률</span>
        <span>{minutesElapsed}/{focusMinutes}분</span>
      </div>
      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}
