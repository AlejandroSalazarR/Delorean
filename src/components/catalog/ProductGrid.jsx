import { ArrowDown } from 'lucide-react'
import Bolt from '../ui/Bolt'
import FloatingProductCard from './FloatingProductCard'
import useScrollReveal, { useScrollProgress } from '../../hooks/useScrollReveal'
import { useAppMode } from '../../context/AppModeContext'

const CATEGORIES = [
  ['Todas', 'Todos'],
  ['Streetwear', 'Streetwear'],
  ['Anime', 'Anime'],
  ['Cultura Pop', 'Cultura Pop'],
  ['Coleccionismo', 'Coleccionismo'],
]

const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

function Hero() {
  const stageRef = useScrollProgress()
  const copyRef = useScrollReveal()
  return (
    <section ref={stageRef} className="cine-hero pt-4 sm:pt-6">
      <div className="cine-frame relative isolate flex items-center justify-between gap-8 overflow-hidden rounded-[28px] px-6 py-8 md:px-12 md:py-10">
        <div aria-hidden="true" className="cine-marble absolute inset-0 -z-20" />
        <div aria-hidden="true" className="cine-dark absolute inset-0 -z-10 bg-[#111111]" />

        <div ref={copyRef} className="cine-copy relative max-w-2xl text-white">
          <p data-reveal className="inline-flex w-fit rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
            Copacabana, Antioquia, desde 2016
          </p>
          <h1 data-reveal className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Diez años vistiendo la cultura que coleccionas.
          </h1>
          <p data-reveal className="mt-4 max-w-md text-white/70">
            Streetwear, anime, cultura pop y piezas de colección elegidas una a una. Pides por WhatsApp y llega asegurado a
            cualquier rincón de Colombia.
          </p>
          <a data-reveal href="#coleccion" className={`${cta} mt-6`}>
            Ver la colección <ArrowDown size={18} />
          </a>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none opacity-30 md:static md:translate-y-0 md:opacity-100 lg:mr-6"
        >
          <div className="cine-mark relative">
            <span className="block text-[9rem] font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_#FFD600] lg:text-[12rem]">
              10
            </span>
            <Bolt className="absolute left-1/2 top-1/2 h-32 w-auto -translate-x-1/2 -translate-y-1/2 rotate-12 lg:h-44" core="#FFD600" />
          </div>
        </div>
      </div>
    </section>
  )
}

const cta =
  'inline-flex w-fit items-center gap-2 rounded-full bg-[#FF6B00] px-6 py-3 font-semibold text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD600]'

export default function ProductGrid() {
  const { products, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useAppMode()
  const q = norm(searchQuery.trim())
  const matching = products.filter((p) => !q || norm(`${p.name} ${p.category} ${p.description ?? ''} ${p.finishDetails}`).includes(q))
  const visible = matching.filter((p) => activeCategory === 'Todos' || p.category === activeCategory)
  const gridRef = useScrollReveal([visible.map((p) => p.id).join()])
  const title = activeCategory === 'Todos' ? 'Toda la colección' : activeCategory

  return (
    <>
      <Hero />
      <section id="coleccion" className="scroll-mt-24 pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h2>
          <p className="shrink-0 text-sm text-[#111111]/50" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'pieza' : 'piezas'}
          </p>
        </div>

        <nav aria-label="Filtrar por categoría" className="-mx-1 mb-5 mt-4 flex gap-2 overflow-x-auto px-1 py-1">
          {CATEGORIES.map(([label, value]) => {
            const active = activeCategory === value
            const count = matching.filter((p) => value === 'Todos' || p.category === value).length
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveCategory(value)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color,box-shadow,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 ${
                  active
                    ? 'bg-[#FF6B00] text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)]'
                    : 'border border-[rgba(0,0,0,0.06)] bg-white hover:border-[#FF6B00]/40 hover:text-[#FF6B00]'
                }`}
              >
                {label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-white/20' : 'bg-[#F8F9FA] text-[#111111]/50'}`}>{count}</span>
              </button>
            )
          })}
        </nav>

        {visible.length ? (
          <div ref={gridRef} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
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
