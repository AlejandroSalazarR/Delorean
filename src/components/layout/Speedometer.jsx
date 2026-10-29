const MAX_MPH = 88
const SWEEP = 240 // grados totales del arco, de -120° a +120°

// Velocímetro estilo Volver al Futuro. progress: 0..1
export default function Speedometer({ progress }) {
  const mph = Math.round(progress * MAX_MPH)
  const pct = Math.round(progress * 100)
  const angle = -SWEEP / 2 + progress * SWEEP
  const ticks = Array.from({ length: 12 }, (_, i) => -SWEEP / 2 + (i * SWEEP) / 11)

  return (
    <div className="flex flex-col items-center gap-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Cargando">
      <svg viewBox="0 0 200 130" className="w-56 sm:w-72">
        <path d="M 20 110 A 80 80 0 1 1 180 110" fill="none" stroke="#111" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 20 110 A 80 80 0 1 1 180 110"
          fill="none"
          stroke="#FFB800"
          strokeWidth="8"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${progress * 100} 100`}
          style={{ transition: "stroke-dasharray 550ms linear" }}
        />
        {ticks.map((a, i) => (
          <line key={i} x1="100" y1="22" x2="100" y2={i % 3 === 0 ? 34 : 29} stroke="#F8F9FA" strokeWidth="2" transform={`rotate(${a} 100 100)`} />
        ))}
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '100px 100px', transition: "transform 550ms linear" }}>
          <polygon points="97,100 100,30 103,100" fill="#FF6B00" stroke="#111" strokeWidth="1.5" />
        </g>
        <circle cx="100" cy="100" r="7" fill="#111" stroke="#FFB800" strokeWidth="3" />
      </svg>
      <p className="font-pixel text-[10px] sm:text-xs text-rayo -mt-6 bg-black/80 px-3 py-2 border-2 border-delorean">
        {mph} MPH ({pct}%)
      </p>
    </div>
  )
}
