import Bolt from '../ui/Bolt'

const MESSAGES = [
  'ENVÍOS ASEGURADOS A TODA COLOMBIA',
  '10 AÑOS DE HISTORIA EN COPACABANA, ANTIOQUIA',
  'STREETWEAR, ANIME Y COLECCIONISMO OFICIAL',
]

export default function TopAnnouncementBar() {
  return (
    <div className="flex h-9 items-center justify-center overflow-hidden bg-[#111111] px-4 text-xs tracking-[-0.01em] text-white">
      <ul className="flex items-center gap-4 whitespace-nowrap">
        {MESSAGES.map((m, i) => (
          <li key={m} className={`flex items-center gap-4 ${i > 0 ? 'max-md:hidden' : ''}`}>
            {i > 0 && <Bolt className="h-3 w-auto" stroke="#111111" core="#FFD600" />}
            {m}
          </li>
        ))}
      </ul>
    </div>
  )
}
