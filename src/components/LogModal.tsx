import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimerStore } from '../store/timerStore'

export default function LogModal() {
  const showLogModal = useTimerStore((s) => s.showLogModal)
  const saveSession = useTimerStore((s) => s.saveSession)
  const [log, setLog] = useState('')

  const handleSave = () => {
    saveSession(log)
    setLog('')
  }

  return (
    <AnimatePresence>
      {showLogModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(45,74,62,0.2)' }}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="w-full max-w-sm mx-4 mb-8 rounded-3xl p-6 shadow-2xl"
            style={{ background: '#FFFDF5' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl">
                🎉
              </div>
              <div>
                <h2 className="font-bold text-dark text-lg">집중 완료!</h2>
                <p className="text-dark/50 text-sm">오늘 무엇을 했나요?</p>
              </div>
            </div>

            <textarea
              value={log}
              onChange={(e) => setLog(e.target.value)}
              placeholder="예: 리포트 초안 작성, 코드 리뷰..."
              rows={3}
              className="w-full rounded-2xl p-4 text-sm text-dark bg-white/80 border border-dark/10 resize-none focus:outline-none focus:border-primary transition-colors placeholder:text-dark/30"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleSave()}
                className="flex-1 py-3 rounded-2xl bg-dark text-neutral font-semibold text-sm hover:bg-dark/90 transition-colors"
              >
                저장하기
              </button>
              <button
                onClick={() => handleSave()}
                className="py-3 px-4 rounded-2xl bg-white/60 text-dark/60 text-sm hover:bg-white/80 transition-colors"
              >
                건너뛰기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
