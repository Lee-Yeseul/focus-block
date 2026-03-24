import { useTimerStore } from '../store/timerStore'

export default function TimerDisplay() {
  const secondsLeft = useTimerStore((s) => s.secondsLeft)
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const seconds = (secondsLeft % 60).toString().padStart(2, '0')

  return (
    <div className="text-center">
      <span className="text-6xl font-bold text-dark tracking-tighter tabular-nums">
        {minutes}:{seconds}
      </span>
    </div>
  )
}
