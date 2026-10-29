import { MessageCircle, ShoppingBag, X } from 'lucide-react'
import Bolt from '../ui/Bolt'
import useOverlay from '../../hooks/useOverlay'
import { useAppMode } from '../../context/AppModeContext'
import { formatCOP, whatsappLink } from '../../services/mockDatabase'

function DrawerPanel({ view, onClose }) {
  const { cart, removeFromCart, userRewards, userName } = useAppMode()
  useOverlay(onClose)
  const total = cart.reduce((n, x) => n + x.qty * x.price, 0)
  const earn = cart.reduce((n, x) => n + x.qty * x.rewardPoints, 0)

  const waText = [
    `Hola Delorean, soy ${userName}. Quiero finalizar mi pedido:`,
    ...cart.map((x) => `• ${x.qty} × ${x.name} (Talla ${x.size}): ${formatCOP(x.qty * x.price)}`),
    '',
    `Total: ${formatCOP(total)}`,
    `Puntos Delorean a acumular: ${earn}`,
  ].join('\n')

  return (
    <div
      className="fixed inset-0 z-50 bg-[#111111]/40 backdrop-blur-sm animate-[overlay-in_300ms_ease-out]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute inset-3 flex flex-col overflow-hidden rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_32px_64px_-24px_rgba(17,17,17,0.3)] animate-[drawer-in_500ms_cubic-bezier(0.22,1,0.36,1)] sm:left-auto sm:w-[420px]"
      >
        <header className="flex items-center justify-between px-5 pb-3 pt-5">
          <h2 id="drawer-title" className="text-xl font-black tracking-[-0.04em]">
            {view === 'rewards' ? 'Mis Puntos Delorean' : 'Tu bolsa'}
          </h2>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,0,0,0.06)] transition-colors hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-[#FF6B00]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <section className="relative overflow-hidden rounded-[20px] bg-[#111111] p-5 text-white">
            <Bolt className="absolute -right-3 -top-4 h-28 w-auto rotate-12 opacity-90" core="#FFD600" />
            <p className="text-sm text-white/60">Saldo disponible</p>
            <p className="mt-1 text-4xl font-black tabular-nums tracking-[-0.04em] text-[#FFD600]">
              {userRewards.toLocaleString('es-CO')} <span className="text-base font-semibold text-white">pts</span>
            </p>
            <p className="mt-3 text-sm text-white/70">
              {earn ? `Con esta bolsa sumas +${earn} puntos.` : 'Cada compra suma puntos para tu próximo pedido.'}
            </p>
          </section>

          {cart.length ? (
            <ul className="mt-5 divide-y divide-[rgba(0,0,0,0.06)]">
              {cart.map((x) => (
                <li key={`${x.id}-${x.size}`} className="flex gap-3 py-3">
                  <img src={x.images[0]} alt="" className="h-20 w-16 shrink-0 rounded-[14px] bg-[#F8F9FA] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{x.name}</p>
                    <p className="text-sm text-[#111111]/60">
                      Talla {x.size}, cantidad {x.qty}
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums">{formatCOP(x.qty * x.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(x.id, x.size)}
                    aria-label={`Quitar ${x.name} talla ${x.size}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full text-[#111111]/50 transition-colors hover:bg-[#F8F9FA] hover:text-[#111111]"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 text-center">
              <ShoppingBag className="mx-auto text-[#111111]/25" size={32} />
              <p className="mt-3 font-semibold">Tu bolsa está vacía</p>
              <p className="mt-1 text-sm text-[#111111]/60">Agrega piezas de la colección para empezar tu pedido.</p>
              <a
                href="#coleccion"
                onClick={onClose}
                className="mt-5 inline-flex rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF6B00]"
              >
                Ver la colección
              </a>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="border-t border-[rgba(0,0,0,0.06)] px-5 pb-5 pt-4">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#111111]/60">Total</dt>
                <dd className="text-lg font-black tabular-nums tracking-[-0.04em]">{formatCOP(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#111111]/60">Puntos que ganas</dt>
                <dd className="font-semibold tabular-nums">+{earn}</dd>
              </div>
            </dl>
            <a
              href={whatsappLink(waText)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] py-3.5 font-semibold text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
            >
              <MessageCircle size={18} /> Finalizar pedido por WhatsApp
            </a>
          </footer>
        )}
      </aside>
    </div>
  )
}

export default function CartAndRewardsDrawer() {
  const { drawer, setDrawer } = useAppMode()
  if (!drawer) return null
  return <DrawerPanel view={drawer} onClose={() => setDrawer(null)} />
}
