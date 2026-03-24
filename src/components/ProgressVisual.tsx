import { motion, AnimatePresence } from 'framer-motion'
import { useTimerStore } from '../store/timerStore'
import type { VisualTheme } from '../store/timerStore'

// ─── Water Theme ────────────────────────────────────────────────
function WaterTheme({ progress }: { progress: number }) {
  const maxH = 220
  const waterH = Math.max(0, progress * maxH)
  const waterY = 255 - waterH

  return (
    <svg viewBox="0 0 160 280" width="160" height="280">
      <defs>
        <clipPath id="wt-jar">
          <rect x="15" y="15" width="130" height="250" rx="65" />
        </clipPath>
      </defs>
      {/* Jar bg */}
      <rect x="15" y="15" width="130" height="250" rx="65"
        fill="rgba(255,253,245,0.4)" stroke="rgba(45,74,62,0.12)" strokeWidth="1.5" />
      {/* Water fill */}
      <g clipPath="url(#wt-jar)">
        <motion.rect
          x="15" width="130"
          animate={{ y: waterY, height: waterH + 20 }}
          transition={{ duration: 1.1, ease: 'linear' }}
          fill="#76E4B8" opacity={0.7}
        />
        {/* Bubble 1 */}
        {progress > 0.05 && (
          <motion.circle
            cx={55} cy={waterY + 10} r={4}
            fill="white" opacity={0.45}
            animate={{ cy: [waterY + 10, waterY - 30], opacity: [0.45, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
          />
        )}
        {/* Bubble 2 */}
        {progress > 0.15 && (
          <motion.circle
            cx={95} cy={waterY + 15} r={3}
            fill="white" opacity={0.35}
            animate={{ cy: [waterY + 15, waterY - 20], opacity: [0.35, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, delay: 0.8 }}
          />
        )}
      </g>
      {/* Jar border */}
      <rect x="15" y="15" width="130" height="250" rx="65"
        fill="none" stroke="rgba(45,74,62,0.15)" strokeWidth="1.5" />
      {/* Highlight */}
      <rect x="28" y="32" width="18" height="55" rx="9" fill="white" opacity="0.18" />
      {/* % label inside */}
      {progress > 0 && (
        <text x="80" y={Math.max(waterY - 10, 30)} textAnchor="middle"
          fill="rgba(45,74,62,0.5)" fontSize="11" fontWeight="600">
          {Math.round(progress * 100)}%
        </text>
      )}
    </svg>
  )
}

// ─── Moon Theme ──────────────────────────────────────────────────
const STARS = [
  { cx: 28, cy: 38, r: 1.5 }, { cx: 138, cy: 22, r: 1 },
  { cx: 18, cy: 105, r: 1 }, { cx: 148, cy: 78, r: 1.5 },
  { cx: 58, cy: 14, r: 1 }, { cx: 128, cy: 255, r: 1 },
  { cx: 22, cy: 225, r: 1.5 }, { cx: 152, cy: 185, r: 1 },
  { cx: 110, cy: 42, r: 1 }, { cx: 40, cy: 200, r: 1 },
]

function MoonTheme({ progress }: { progress: number }) {
  // Moon cx=90 r=68, left edge=22. Shadow exits when shadowCx+68=22 → shadowCx=-46
  // progress=0: shadowCx=110 (crescent visible on left, ~85% shadow)
  // progress=1: shadowCx=-46 (shadow just exits → full moon)
  const shadowCx = 110 - progress * 156
  const glowOpacity = progress * 0.3
  const glowR = 58 + progress * 28

  return (
    <svg viewBox="0 0 180 280" width="180" height="280">
      <defs>
        <clipPath id="moon-clip">
          <circle cx="90" cy="145" r="68" />
        </clipPath>
      </defs>

      {/* Stars */}
      {STARS.map((s, i) => (
        <motion.circle key={i} cx={s.cx} cy={s.cy} r={s.r}
          fill="#2D4A3E"
          animate={{ opacity: [0.15, 0.5 + progress * 0.4, 0.15] }}
          transition={{ duration: 1.8 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Glow */}
      <motion.circle cx="90" cy="145"
        animate={{ r: glowR, opacity: glowOpacity }}
        transition={{ duration: 0.9 }}
        fill="#FFF1A1"
      />

      {/* Moon body */}
      <circle cx="90" cy="145" r="68" fill="#FFF8DC" />

      {/* Craters (subtle) */}
      <circle cx="105" cy="130" r="8" fill="rgba(200,185,120,0.25)" />
      <circle cx="72" cy="160" r="5" fill="rgba(200,185,120,0.2)" />
      <circle cx="108" cy="165" r="4" fill="rgba(200,185,120,0.18)" />

      {/* Shadow overlay → crescent effect */}
      <motion.circle
        cy="145" r="68"
        fill="rgba(180,175,210,0.88)"
        clipPath="url(#moon-clip)"
        animate={{ cx: shadowCx }}
        transition={{ duration: 1.1, ease: 'linear' }}
      />
    </svg>
  )
}

// ─── Plant Theme ─────────────────────────────────────────────────
function PlantTheme({ progress }: { progress: number }) {
  const stage = progress < 0.2 ? 0 : progress < 0.45 ? 1 : progress < 0.65 ? 2 : progress < 0.88 ? 3 : 4
  const CX = 90, BY = 248

  const stageEls = [
    // 0: Seed
    <g key="seed">
      <ellipse cx={CX} cy={BY - 6} rx="13" ry="11" fill="#A0784A" opacity="0.85" />
      <line x1={CX} y1={BY - 14} x2={CX - 5} y2={BY - 22} stroke="#76C442" strokeWidth="2" strokeLinecap="round" />
    </g>,
    // 1: Sprout
    <g key="sprout">
      <line x1={CX} y1={BY} x2={CX} y2={BY - 55} stroke="#2D9E70" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx={CX - 18} cy={BY - 48} rx="20" ry="11"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(-35 ${CX - 18} ${BY - 48})`} />
      <ellipse cx={CX + 18} cy={BY - 48} rx="20" ry="11"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(35 ${CX + 18} ${BY - 48})`} />
    </g>,
    // 2: Plant
    <g key="plant">
      <line x1={CX} y1={BY} x2={CX} y2={BY - 100} stroke="#2D9E70" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx={CX - 30} cy={BY - 78} rx="28" ry="13"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(-22 ${CX - 30} ${BY - 78})`} />
      <ellipse cx={CX + 30} cy={BY - 78} rx="28" ry="13"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(22 ${CX + 30} ${BY - 78})`} />
      <ellipse cx={CX - 22} cy={BY - 52} rx="20" ry="10"
        fill="#5DCBA0" opacity="0.75"
        transform={`rotate(-38 ${CX - 22} ${BY - 52})`} />
      <ellipse cx={CX + 22} cy={BY - 52} rx="20" ry="10"
        fill="#5DCBA0" opacity="0.75"
        transform={`rotate(38 ${CX + 22} ${BY - 52})`} />
    </g>,
    // 3: Tall plant
    <g key="tall">
      <line x1={CX} y1={BY} x2={CX} y2={BY - 150} stroke="#2D9E70" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx={CX - 36} cy={BY - 118} rx="34" ry="14"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(-20 ${CX - 36} ${BY - 118})`} />
      <ellipse cx={CX + 36} cy={BY - 118} rx="34" ry="14"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(20 ${CX + 36} ${BY - 118})`} />
      <ellipse cx={CX - 28} cy={BY - 85} rx="26" ry="12"
        fill="#5DCBA0" opacity="0.8"
        transform={`rotate(-30 ${CX - 28} ${BY - 85})`} />
      <ellipse cx={CX + 28} cy={BY - 85} rx="26" ry="12"
        fill="#5DCBA0" opacity="0.8"
        transform={`rotate(30 ${CX + 28} ${BY - 85})`} />
      <ellipse cx={CX - 18} cy={BY - 56} rx="18" ry="9"
        fill="#76E4B8" opacity="0.65"
        transform={`rotate(-42 ${CX - 18} ${BY - 56})`} />
      <ellipse cx={CX + 18} cy={BY - 56} rx="18" ry="9"
        fill="#76E4B8" opacity="0.65"
        transform={`rotate(42 ${CX + 18} ${BY - 56})`} />
    </g>,
    // 4: Flower
    <g key="flower">
      <line x1={CX} y1={BY} x2={CX} y2={BY - 178} stroke="#2D9E70" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx={CX - 38} cy={BY - 138} rx="36" ry="14"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(-20 ${CX - 38} ${BY - 138})`} />
      <ellipse cx={CX + 38} cy={BY - 138} rx="36" ry="14"
        fill="#76E4B8" opacity="0.9"
        transform={`rotate(20 ${CX + 38} ${BY - 138})`} />
      <ellipse cx={CX - 28} cy={BY - 100} rx="26" ry="12"
        fill="#5DCBA0" opacity="0.8"
        transform={`rotate(-30 ${CX - 28} ${BY - 100})`} />
      <ellipse cx={CX + 28} cy={BY - 100} rx="26" ry="12"
        fill="#5DCBA0" opacity="0.8"
        transform={`rotate(30 ${CX + 28} ${BY - 100})`} />
      {/* Petals */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const px = CX + 24 * Math.cos(rad)
        const py = BY - 182 + 24 * Math.sin(rad)
        return (
          <ellipse key={deg} cx={px} cy={py} rx="13" ry="8"
            fill="#FFB2C1"
            transform={`rotate(${deg} ${px} ${py})`} />
        )
      })}
      {/* Flower center */}
      <circle cx={CX} cy={BY - 182} r="14" fill="#FFF1A1" />
      <circle cx={CX} cy={BY - 182} r="7" fill="#F5C842" opacity="0.7" />
    </g>,
  ]

  return (
    <svg viewBox="0 0 180 280" width="180" height="280">
      <AnimatePresence mode="wait">
        <motion.g
          key={stage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.5 }}
        >
          {stageEls[stage]}
        </motion.g>
      </AnimatePresence>
      {/* Ground */}
      <ellipse cx={CX} cy={BY + 6} rx="52" ry="9" fill="rgba(139,105,20,0.18)" />
    </svg>
  )
}

// ─── Mosaic Theme ────────────────────────────────────────────────
const COLS = 5, ROWS = 8
const MOSAIC_COLORS = ['#76E4B8', '#FFF1A1', '#FFB2C1', '#B8D4E8', '#D4D4C8']
// Fixed shuffle computed once so order is stable within session
const REVEAL_ORDER: number[] = Array.from({ length: COLS * ROWS }, (_, i) => i)
  .sort(() => Math.random() - 0.5)

function MosaicTheme({ progress }: { progress: number }) {
  const total = COLS * ROWS
  const revealed = Math.floor(progress * total)
  const cellW = 160 / COLS
  const cellH = 260 / ROWS

  return (
    <svg viewBox="0 0 160 260" width="160" height="260" style={{ borderRadius: 20 }}>
      {/* Background */}
      <rect x="0" y="0" width="160" height="260" rx="16" fill="rgba(255,253,245,0.3)" />
      {Array.from({ length: total }).map((_, idx) => {
        const col = idx % COLS
        const row = Math.floor(idx / COLS)
        const revealIdx = REVEAL_ORDER.indexOf(idx)
        const isRevealed = revealIdx < revealed
        const color = MOSAIC_COLORS[(col * 3 + row * 2) % MOSAIC_COLORS.length]
        return (
          <motion.rect
            key={idx}
            x={col * cellW + 2}
            y={row * cellH + 2}
            width={cellW - 4}
            height={cellH - 4}
            rx="6"
            fill={color}
            animate={{ opacity: isRevealed ? 1 : 0.07 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )
      })}
      {/* Completion label */}
      {progress >= 1 && (
        <text x="80" y="138" textAnchor="middle" fill="rgba(45,74,62,0.6)"
          fontSize="13" fontWeight="700">완성!</text>
      )}
    </svg>
  )
}

// ─── Main Component ──────────────────────────────────────────────
const THEME_LABELS: Record<VisualTheme, string> = {
  water: '물이 차오르고 있어요',
  plant: '식물이 자라고 있어요',
  moon: '달이 차오르고 있어요',
  mosaic: '모자이크가 완성되고 있어요',
}

export default function ProgressVisual() {
  const focusMinutes = useTimerStore((s) => s.focusMinutes)
  const visualTheme = useTimerStore((s) => s.visualTheme)
  const isRunning = useTimerStore((s) => s.isRunning)
  const secondsLeft = useTimerStore((s) => s.secondsLeft)

  const totalSeconds = focusMinutes * 60
  const elapsed = totalSeconds - secondsLeft
  const progress = Math.min(elapsed / totalSeconds, 1)

  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={visualTheme}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {visualTheme === 'water' && <WaterTheme progress={progress} />}
          {visualTheme === 'plant' && <PlantTheme progress={progress} />}
          {visualTheme === 'moon' && <MoonTheme progress={progress} />}
          {visualTheme === 'mosaic' && <MosaicTheme progress={progress} />}
        </motion.div>
      </AnimatePresence>

      {isRunning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-dark/40 text-center"
        >
          {THEME_LABELS[visualTheme]}
        </motion.p>
      )}
    </div>
  )
}
