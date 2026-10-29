import { ArrowDown } from 'lucide-react'
import Bolt from '../ui/Bolt'
import FloatingProductCard from './FloatingProductCard'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useAppMode } from '../../context/AppModeContext'

const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

function Hero() {
  const ref = useScrollReveal()
  return (
    <section ref={ref} className="pt-4 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-[#111111] px-6 py-16 text-white sm:px-12 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-6 top-1/2 -z-10 -translate-y-1/2 select-none opacity-40 sm:opacity-100 lg:right-10">
          <span className="block text-[11rem] font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_#FFD600] sm:text-[16rem] lg:text-[20rem]">
            10
          </span>
          <Bolt className="absolute left-1/2 top-1/2 h-40 w-auto -translate-x-1/2 -translate-y-1/2 rotate-12 sm:h-56 lg:h-72" core="#FFD600" />
        </div>

        <div className="max-w-2xl">
          <p data-reveal className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
            Copacabana, Antioquia, desde 2016
          </p>
          <h1 data-reveal className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl">
            Diez años vistiendo la cultura que coleccionas.
          </h1>
          <p data-reveal className="mt-6 max-w-md text-white/70">
            Streetwear, anime, cultura pop y piezas de colección elegidas una a una. Pides por WhatsApp y llega asegurado a
            cualquier rincón de Colombia.
          </p>
          <a
            data-reveal
            href="#coleccion"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-6 py-3 font-semibold shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD600]"
          >
            Ver la colección <ArrowDown size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default function ProductGrid() {
  const { products, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useAppMode()
  const q = norm(searchQuery.trim())
  const visible = products.filter(
    (p) =>
      (activeCategory === 'Todos' || p.category === activeCategory) &&
      (!q || norm(`${p.name} ${p.category} ${p.finishDetails}`).includes(q))
  )
  const gridRef = useScrollReveal([visible.map((p) => p.id).join()])
  const title = activeCategory === 'Todos' ? 'Toda la colección' : activeCategory

  return (
    <>
      <Hero />
      <section id="coleccion" className="scroll-mt-40 py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h2>
          <p className="shrink-0 text-sm text-[#111111]/50" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'pieza' : 'piezas'}
          </p>
        </div>

        {visible.length ? (
          <div ref={gridRef} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
            {visible.map((p) => (
              <FloatingProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white px-6 py-16 text-center">
            <Bolt className="mx-auto h-10 w-auto opacity-30" />
            <p className="mt-4 text-lg font-semibold tracking-[-0.04em]">
              {q ? `Nada coincide con “${searchQuery.trim()}”` : 'Aún no hay piezas en esta categoría'}
            </p>
            <p className="mt-1 text-sm text-[#111111]/60">Prueba otra palabra o revisa toda la colección.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('Todos')
              }}
              className="mt-6 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF6B00]"
            >
              Ver toda la colección
            </button>
          </div>
        )}
      </section>
    </>
  )
}
