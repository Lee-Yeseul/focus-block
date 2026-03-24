import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Mode, Session, View } from '../types'

export type VisualTheme = 'water' | 'plant' | 'moon' | 'mosaic'
const THEMES: VisualTheme[] = ['water', 'plant', 'moon', 'mosaic']
function randomTheme(): VisualTheme {
  return THEMES[Math.floor(Math.random() * THEMES.length)]
}

interface TimerState {
  mode: Mode
  secondsLeft: number
  isRunning: boolean
  focusMinutes: number
  breakMinutes: number
  minutesElapsed: number
  visualTheme: VisualTheme
  currentView: View
  showLogModal: boolean
  sessions: Session[]

  start(): void
  pause(): void
  reset(): void
  tick(): void
  saveSession(log: string): void
  setView(v: View): void
  setFocusMinutes(n: number): void
  setBreakMinutes(n: number): void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      secondsLeft: 25 * 60,
      isRunning: false,
      focusMinutes: 25,
      breakMinutes: 5,
      minutesElapsed: 0,
      visualTheme: randomTheme(),
      currentView: 'focus',
      showLogModal: false,
      sessions: [],

      start() {
        set({ isRunning: true })
      },

      pause() {
        set({ isRunning: false })
      },

      reset() {
        const { mode, focusMinutes, breakMinutes } = get()
        set({
          isRunning: false,
          secondsLeft: (mode === 'focus' ? focusMinutes : breakMinutes) * 60,
          minutesElapsed: 0,
          visualTheme: randomTheme(),
        })
      },

      tick() {
        const { secondsLeft, mode, focusMinutes } = get()
        if (secondsLeft <= 1) {
          if (mode === 'focus') {
            set({ isRunning: false, secondsLeft: 0, showLogModal: true })
          } else {
            const { focusMinutes: fm } = get()
            set({ isRunning: false, secondsLeft: fm * 60, mode: 'focus', minutesElapsed: 0, visualTheme: randomTheme() })
          }
          return
        }

        const newSecondsLeft = secondsLeft - 1
        const totalElapsed = focusMinutes * 60 - newSecondsLeft
        const newMinutesElapsed = Math.floor(totalElapsed / 60)
        set({ secondsLeft: newSecondsLeft, minutesElapsed: newMinutesElapsed })
      },

      saveSession(log: string) {
        const { minutesElapsed, focusMinutes, sessions, breakMinutes } = get()
        const session: Session = {
          id: `session-${Date.now()}`,
          date: new Date().toISOString(),
          focusDuration: focusMinutes,
          log,
          blockCount: minutesElapsed,
        }
        set({
          sessions: [session, ...sessions],
          showLogModal: false,
          mode: 'break',
          secondsLeft: breakMinutes * 60,
          minutesElapsed: 0,
          visualTheme: randomTheme(),
        })
      },

      setView(v: View) {
        set({ currentView: v })
      },

      setFocusMinutes(n: number) {
        const { mode, isRunning } = get()
        set({ focusMinutes: n })
        if (mode === 'focus' && !isRunning) {
          set({ secondsLeft: n * 60 })
        }
      },

      setBreakMinutes(n: number) {
        const { mode, isRunning } = get()
        set({ breakMinutes: n })
        if (mode === 'break' && !isRunning) {
          set({ secondsLeft: n * 60 })
        }
      },
    }),
    {
      name: 'focusblock-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        focusMinutes: state.focusMinutes,
        breakMinutes: state.breakMinutes,
      }),
    }
  )
)
