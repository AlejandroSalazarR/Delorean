import Bolt from '../ui/Bolt'
import { WHATSAPP_NUMBER } from '../../services/mockDatabase'

const CATEGORIES = ['Streetwear', 'Anime', 'Cultura Pop', 'Coleccionismo']
const link = 'transition-colors hover:text-[#FF6B00]'

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,0,0,0.06)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <Bolt className="h-7 w-auto" />
            <span className="text-xl font-black tracking-[-0.04em]">DELOREAN</span>
          </div>
          <p className="mt-4 text-[#111111]/70">
            Desde 2016 vestimos y coleccionamos la cultura que nos mueve. Diez años en Copacabana, Antioquia, trayendo
            streetwear, anime, cultura pop y piezas de colección a quienes las buscan en serio.
          </p>
        </div>
        <div>
          <h2 className="font-semibold tracking-[-0.04em]">Categorías</h2>
          <ul className="mt-4 space-y-2 text-[#111111]/70">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <a href="#coleccion" className={link}>{c}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold tracking-[-0.04em]">Contacto</h2>
          <ul className="mt-4 space-y-2 text-[#111111]/70">
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className={link}>WhatsApp directo</a>
            </li>
            <li>
              <a href="#rewards" className={link}>Puntos Delorean</a>
            </li>
            <li>Copacabana, Antioquia</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-[rgba(0,0,0,0.06)] py-5 text-center text-xs text-[#111111]/50">
        © 2016–2026 Delorean. Envíos asegurados a toda Colombia.
      </p>
    </footer>
  )
}
