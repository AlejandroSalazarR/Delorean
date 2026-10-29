import { useEffect, useRef, useState } from 'react'
import Bolt from '../ui/Bolt'
import PixelSprite from './PixelSprite'
import Speedometer from './Speedometer'
import { CHIBIS } from './chibis'

const TOTAL_MS = 3850
const STEP_MS = 550

// Posiciones fijas (sin Math.random en render) para las partículas del universo.
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 7) % 100}%`,
  size: 14 + ((i * 5) % 14),
  dur: `${1.1 + ((i * 3) % 9) / 10}s`,
  delay: `${-((i * 7) % 12) / 10}s`,
}))

function pickNext(prev) {
  let next
  do next = Math.floor(Math.random() * CHIBIS.length)
  while (next === prev)
  return next
}

export default function DeloreanPreloader({ onDone }) {
  const [tick, setTick] = useState(0)
  const [idx, setIdx] = useState(() => pickNext(-1))
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1)
      setIdx((i) => pickNext(i))
    }, STEP_MS)
    return () => clearInterval(id)
  }, [])

  const progress = Math.min(1, (tick * STEP_MS) / TOTAL_MS)

  useEffect(() => {
    if (progress < 1) return
    setLeaving(true)
    const t = setTimeout(() => doneRef.current?.(), 400)
    return () => clearTimeout(t)
  }, [progress])

  const chibi = CHIBIS[idx]
  const u = chibi.universe

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden flex flex-col items-center justify-between py-10 transition-opacity duration-[400ms] ${leaving ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: u.bg }}
      role="status"
      aria-live="polite"
      aria-label="Cargando Delorean Store"
    >
      <div className="absolute inset-0" style={{ background: u.pattern }} />
      <div className="absolute inset-0 halftone-lg opacity-40" style={{ color: u.dot, maskImage: 'linear-gradient(180deg, transparent, #000 70%)' }} />

      {PARTICLES.map((p, i) => (
        <span
          key={`${idx}-${i}`}
          className="anim-rise absolute bottom-0 select-none font-bold"
          style={{ left: p.left, fontSize: p.size, color: u.glyphColor, '--dur': p.dur, '--delay': p.delay }}
          aria-hidden="true"
        >
          {u.glyph}
        </span>
      ))}

      <p className="relative font-display text-3xl sm:text-4xl tracking-widest text-white drop-shadow-[3px_3px_0_#111]">
        DELOREAN <span className="text-rayo">STORE</span>
      </p>

      <div className="relative flex items-center justify-center">
        <div key={`flash-${tick}`} className="anim-flash fixed inset-0 bg-white pointer-events-none" aria-hidden="true" />
        <Bolt key={`bolt-${tick}`} className="anim-bolt absolute -top-28 h-[26rem] sm:h-[30rem] opacity-90 pointer-events-none" />
        <div key={`chibi-${tick}`} className="anim-pop relative">
          <PixelSprite chibi={chibi} className="w-44 sm:w-56 drop-shadow-[0_8px_0_rgba(0,0,0,0.45)]" />
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-3">
        <p className="font-pixel text-[10px] text-white bg-black/70 px-3 py-1">{chibi.name}</p>
        <Speedometer progress={progress} />
      </div>
    </div>
  )
}
