import { useEffect, useRef, useState } from 'react'
import { Search, ShoppingBag, MessageCircle, Gift, Store, ShieldCheck } from 'lucide-react'
import Bolt from '../ui/Bolt'
import RewardsBadge from '../rewards/RewardsBadge'
import { useAppMode } from '../../context/AppModeContext'
import { WHATSAPP_NUMBER, formatCOP } from '../../services/mockDatabase'

const hairline = 'border border-[rgba(0,0,0,0.06)]'
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

function ModeOption({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm transition-colors duration-300 ${
        active ? 'bg-[#FF6B00]/10 font-semibold text-[#FF6B00]' : 'hover:bg-[#F8F9FA]'
      }`}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-[#FF6B00]' : 'bg-transparent'}`} />
    </button>
  )
}

function AvatarMenu() {
  const { mode, setMode, userRewards, userName, setDrawer } = useAppMode()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initial = (userName || 'M')[0].toUpperCase()
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de perfil"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white transition-transform duration-500 ${ease} hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]`}
      >
        {initial}
      </button>
      {open && (
        <div role="menu" className={`absolute right-0 top-12 z-50 w-72 rounded-[24px] bg-white p-3 shadow-[0_12px_32px_-8px_rgba(17,17,17,0.12)] ${hairline}`}>
          <div className="flex items-center gap-3 p-2">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-lg font-bold text-white">{initial}</span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{userName}</p>
              <p className="text-xs text-[#111111]/60">Copacabana, COL</p>
              <div className="mt-1.5">
                <RewardsBadge variant="compact" points={userRewards} />
              </div>
            </div>
          </div>
          <div className="my-2 border-t border-[rgba(0,0,0,0.06)]" />
          <p className="px-3 pb-1 text-xs text-[#111111]/50">Cambiar vista</p>
          <ModeOption active={mode === 'client'} icon={Store} label="Modo Cliente (Tienda)" onClick={() => setMode('client')} />
          <ModeOption active={mode === 'superadmin'} icon={ShieldCheck} label="Modo Superadmin (Gestión)" onClick={() => setMode('superadmin')} />
          <div className="my-2 border-t border-[rgba(0,0,0,0.06)]" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              setDrawer('rewards')
            }}
            className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm hover:bg-[#F8F9FA]"
          >
            <Gift size={16} /> Mis Puntos Delorean
          </button>
          <a role="menuitem" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-full px-3 py-2 text-sm hover:bg-[#F8F9FA]">
            <MessageCircle size={16} /> Soporte WhatsApp Directo
          </a>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { mode, searchQuery, setSearchQuery, cart, setDrawer } = useAppMode()
  const count = cart.reduce((n, x) => n + x.qty, 0)
  const total = cart.reduce((n, x) => n + x.qty * x.price, 0)

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(0,0,0,0.06)] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-[94%] max-w-[1720px] flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <a href="/" className="flex items-center gap-2">
          <Bolt className="h-7 w-auto" />
          <span className="text-xl font-black tracking-[-0.04em]">DELOREAN</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#111111]/60 max-sm:hidden ${hairline}`}>EST. 2016</span>
          {mode === 'superadmin' && (
            <span className="rounded-full bg-[#FF6B00]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FF6B00]">MODO ADMIN</span>
          )}
        </a>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="order-last flex w-full flex-1 items-center md:order-none md:w-auto">
          <div className={`flex w-full max-w-xl items-center rounded-full bg-[#F8F9FA] py-1 pl-4 pr-1 md:mx-auto ${hairline}`}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca camisetas, gorras, figuras"
              aria-label="Buscar productos"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#111111]/40"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-white shadow-[0_8px_20px_-4px_rgba(255,107,0,0.5)] transition-transform duration-500 ${ease} hover:scale-110 active:scale-95`}
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          {mode === 'client' && (
            <a href="#actualizaciones" className="text-sm font-semibold transition-colors hover:text-[#FF6B00] max-sm:hidden">
              Actualizaciones
            </a>
          )}
          <button
            type="button"
            onClick={() => setDrawer('cart')}
            aria-label={`Abrir bolsa, ${count} ${count === 1 ? 'pieza' : 'piezas'}`}
            className={`flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#F8F9FA] ${hairline}`}
          >
            <ShoppingBag size={16} />
            <span>{count}</span>
            <span className="tabular-nums text-[#111111]/60 max-sm:hidden">{formatCOP(total)}</span>
          </button>
          <AvatarMenu />
        </div>

      </div>
    </header>
  )
}
