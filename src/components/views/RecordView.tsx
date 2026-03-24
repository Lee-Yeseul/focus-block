import { useTimerStore } from '../../store/timerStore'
import type { Session } from '../../types'

// ─── helpers ───────────────────────────────────────────────────
function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10) // 'YYYY-MM-DD'
}

function formatDate(isoStr: string) {
  return new Date(isoStr).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
}
function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function cellColor(count: number) {
  if (count === 0) return 'rgba(45,74,62,0.07)'
  if (count === 1) return '#C5F0DF'
  if (count === 2) return '#76E4B8'
  if (count === 3) return '#4DB896'
  return '#2D9E70'
}

// ─── Grass Grid ─────────────────────────────────────────────────
const WEEKS = 18
const DAY_LABELS = ['일', '', '화', '', '목', '', '토']

function GrassGrid({ sessions }: { sessions: Session[] }) {
  // Build date → count map
  const countMap: Record<string, number> = {}
  sessions.forEach((s) => {
    const key = toDateKey(new Date(s.date))
    countMap[key] = (countMap[key] ?? 0) + 1
  })

  // Build grid: last WEEKS weeks, aligned to Sunday
  const today = new Date()
  const endSunday = new Date(today)
  endSunday.setDate(today.getDate() + (6 - today.getDay())) // end of current week (Saturday)

  const startDate = new Date(endSunday)
  startDate.setDate(endSunday.getDate() - WEEKS * 7 + 1)
  startDate.setDate(startDate.getDate() - startDate.getDay()) // align to Sunday

  // weeks array: each week is 7 days
  const weeks: Date[][] = []
  const cursor = new Date(startDate)
  for (let w = 0; w < WEEKS; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  // Month labels: show month name on first week of each month
  const monthLabels: (string | null)[] = weeks.map((week) => {
    const firstDay = week[0]
    const lastDay = week[6]
    if (firstDay.getDate() <= 7 || firstDay.getMonth() !== lastDay.getMonth()) {
      return (lastDay.getMonth() + 1) + '월'
    }
    return null
  })

  const CELL = 14, GAP = 2

  const totalSessions = sessions.length
  const streak = (() => {
    let s = 0
    const d = new Date(today)
    while (true) {
      if (countMap[toDateKey(d)]) { s++; d.setDate(d.getDate() - 1) }
      else break
    }
    return s
  })()

  return (
    <div className="px-6 pb-4">
      {/* Stats row */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 rounded-2xl px-4 py-3 text-center" style={{ background: 'rgba(255,253,245,0.7)', border: '1px solid rgba(45,74,62,0.08)' }}>
          <p className="text-2xl font-bold text-dark">{totalSessions}</p>
          <p className="text-xs text-dark/40 mt-0.5">총 세션</p>
        </div>
        <div className="flex-1 rounded-2xl px-4 py-3 text-center" style={{ background: 'rgba(255,253,245,0.7)', border: '1px solid rgba(45,74,62,0.08)' }}>
          <p className="text-2xl font-bold text-dark">{streak}</p>
          <p className="text-xs text-dark/40 mt-0.5">연속 일수</p>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,253,245,0.7)', border: '1px solid rgba(45,74,62,0.08)' }}>
        <p className="text-xs font-semibold text-dark/40 mb-3">집중 잔디</p>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
            {/* Month labels */}
            <div style={{ display: 'flex', gap: GAP, marginLeft: 18 }}>
              {weeks.map((_, wi) => (
                <div key={wi} style={{ width: CELL, fontSize: 8, color: 'rgba(45,74,62,0.4)', textAlign: 'center', flexShrink: 0 }}>
                  {monthLabels[wi] ?? ''}
                </div>
              ))}
            </div>
            {/* Day rows */}
            {[0,1,2,3,4,5,6].map((dayIdx) => (
              <div key={dayIdx} style={{ display: 'flex', gap: GAP, alignItems: 'center' }}>
                <div style={{ width: 14, fontSize: 8, color: 'rgba(45,74,62,0.35)', flexShrink: 0, textAlign: 'right' }}>
                  {DAY_LABELS[dayIdx]}
                </div>
                {weeks.map((week, wi) => {
                  const date = week[dayIdx]
                  const key = toDateKey(date)
                  const count = countMap[key] ?? 0
                  const isFuture = date > today
                  return (
                    <div
                      key={wi}
                      title={`${key}: ${count}세션`}
                      style={{
                        width: CELL, height: CELL,
                        borderRadius: 3,
                        flexShrink: 0,
                        backgroundColor: isFuture ? 'transparent' : cellColor(count),
                        opacity: isFuture ? 0 : 1,
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[9px] text-dark/30">적음</span>
          {[0,1,2,3,4].map((i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: cellColor(i) }} />
          ))}
          <span className="text-[9px] text-dark/30">많음</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────
export default function RecordView() {
  const sessions = useTimerStore((s) => s.sessions)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-6 pt-2 pb-4">
        <h2 className="text-xl font-bold text-dark">기록</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <GrassGrid sessions={sessions} />

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 pt-8 text-dark/30">
            <p className="text-sm">아직 기록이 없어요</p>
            <p className="text-xs">집중 세션을 완료하면 잔디가 심어져요</p>
          </div>
        ) : (
          <div className="px-6 space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,253,245,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(45,74,62,0.08)' }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-semibold text-dark text-sm">{formatDate(session.date)}</p>
                    <p className="text-dark/40 text-xs">{formatTime(session.date)}</p>
                  </div>
                  <span className="text-xs font-semibold text-dark/60 bg-secondary/60 px-2.5 py-1 rounded-full">
                    {session.focusDuration}분
                  </span>
                </div>
                {session.log && (
                  <p className="text-dark/70 text-sm mt-2 leading-relaxed">{session.log}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
