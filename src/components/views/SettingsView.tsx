import { useTimerStore } from '../../store/timerStore'

function StepInput({
  label,
  value,
  onChange,
  min = 1,
  max = 120,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
}) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center justify-between"
      style={{ background: 'rgba(255,253,245,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(45,74,62,0.08)' }}
    >
      <span className="font-semibold text-dark text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full bg-dark/8 text-dark flex items-center justify-center text-lg hover:bg-dark/15 transition-colors font-bold"
        >
          −
        </button>
        <span className="text-dark font-bold w-10 text-center tabular-nums">{value}분</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full bg-dark/8 text-dark flex items-center justify-center text-lg hover:bg-dark/15 transition-colors font-bold"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function SettingsView() {
  const focusMinutes = useTimerStore((s) => s.focusMinutes)
  const breakMinutes = useTimerStore((s) => s.breakMinutes)
  const setFocusMinutes = useTimerStore((s) => s.setFocusMinutes)
  const setBreakMinutes = useTimerStore((s) => s.setBreakMinutes)
  const sessions = useTimerStore((s) => s.sessions)

  const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.focusDuration, 0)
  const totalBlocks = sessions.reduce((sum, s) => sum + s.blockCount, 0)

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-6 pt-2 pb-4">
        <h2 className="text-xl font-bold text-dark">설정</h2>
        <p className="text-dark/40 text-sm mt-0.5">타이머와 앱을 설정하세요</p>
      </div>

      <div className="px-6 space-y-3 pb-6">
        <p className="text-xs font-semibold text-dark/40 uppercase tracking-wider mb-2">타이머</p>
        <StepInput
          label="집중 시간"
          value={focusMinutes}
          onChange={setFocusMinutes}
          min={1}
          max={120}
        />
        <StepInput
          label="휴식 시간"
          value={breakMinutes}
          onChange={setBreakMinutes}
          min={1}
          max={60}
        />

        <p className="text-xs font-semibold text-dark/40 uppercase tracking-wider mt-4 mb-2">통계</p>
        <div
          className="rounded-2xl p-4 grid grid-cols-2 gap-4"
          style={{ background: 'rgba(255,253,245,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(45,74,62,0.08)' }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-dark tabular-nums">{sessions.length}</p>
            <p className="text-xs text-dark/40 mt-0.5">총 세션</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-dark tabular-nums">{totalFocusMinutes}</p>
            <p className="text-xs text-dark/40 mt-0.5">총 집중(분)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-dark tabular-nums">{totalBlocks}</p>
            <p className="text-xs text-dark/40 mt-0.5">총 블록</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-dark tabular-nums">
              {sessions.length > 0 ? Math.round(totalFocusMinutes / sessions.length) : 0}
            </p>
            <p className="text-xs text-dark/40 mt-0.5">평균(분)</p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-dark/30 text-center">FocusBlock • Mochi Mint & Honey</p>
        </div>
      </div>
    </div>
  )
}
