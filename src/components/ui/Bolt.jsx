// Rayo bitono Delorean: silueta naranja + núcleo amarillo, borde oscuro.
export default function Bolt({ className = '', stroke = '#111111', core = '#FFB800' }) {
  return (
    <svg viewBox="0 0 64 96" className={className} aria-hidden="true">
      <polygon
        points="40,2 8,54 28,54 20,94 56,36 34,36"
        fill="#FF6B00"
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="miter"
      />
      <polygon points="38,16 20,46 34,46 28,72 46,40 32,40" fill={core} />
    </svg>
  )
}
