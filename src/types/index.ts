export type Mode = 'focus' | 'break'
export type View = 'focus' | 'record' | 'settings'

export interface BlobBlock {
  id: string
  color: string
  width: number
  height: number
  x: number
  minuteIndex: number
}

export interface Session {
  id: string
  date: string
  focusDuration: number
  log: string
  blockCount: number
}
