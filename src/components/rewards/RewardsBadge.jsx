import Bolt from '../ui/Bolt'

export default function RewardsBadge({ points, variant = 'compact' }) {
  const product = variant === 'product'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#111111] text-xs font-semibold text-white ${
        product ? 'px-3 py-1.5' : 'px-3 py-1'
      }`}
    >
      <Bolt className="h-3.5 w-auto" stroke="#111111" core="#FFD600" />
      {product ? (
        <span>+{points} Puntos Delorean</span>
      ) : (
        <span>
          <span className="text-[#FFD600]">{points.toLocaleString('es-CO')}</span> pts
        </span>
      )}
    </span>
  )
}
