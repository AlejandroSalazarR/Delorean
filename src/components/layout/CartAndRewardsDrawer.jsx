import { useState } from 'react'
import { Check, Lock, MessageCircle, ShoppingBag, X } from 'lucide-react'
import Bolt from '../ui/Bolt'
import PaymentSimulator from '../checkout/PaymentSimulator'
import useOverlay from '../../hooks/useOverlay'
import { useAppMode } from '../../context/AppModeContext'
import { formatCOP, whatsappLink } from '../../services/mockDatabase'

const CHECKOUT_MODES = [
  ['whatsapp', 'Pedido rápido por WhatsApp'],
  ['online', 'Pago online seguro'],
]
const cta =
  'flex w-full items-center justify-center gap-3 rounded-full bg-[#FF6B00] px-5 py-3 text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60'

function CtaLabel({ title, total, earn }) {
  return (
    <span className="text-left">
      <span className="block font-semibold">{title}</span>
      <span className="block text-xs text-white/85">
        {formatCOP(total)} y +{earn} Puntos Delorean
      </span>
    </span>
  )
}

function Receipt({ receipt, onClose }) {
  return (
    <div className="mt-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B00] text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)]">
        <Check size={28} />
      </span>
      <p className="mt-4 text-xl font-black tracking-[-0.04em]">Pago aprobado</p>
      <p className="mt-1 text-sm text-[#111111]/60">Simulación de {receipt.gateway}: no se hizo ningún cobro real.</p>
      <dl className="mx-auto mt-6 max-w-xs space-y-2 rounded-[20px] bg-[#F8F9FA] p-4 text-left text-sm">
        {[
          ['Referencia', receipt.ref],
          ['Medio', receipt.detail],
          ['Total', formatCOP(receipt.total)],
          ['Puntos Delorean', `+${receipt.earn}`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-[#111111]/60">{k}</dt>
            <dd className="text-right font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <button type="button" onClick={onClose} className="mt-6 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF6B00]">
        Seguir comprando
      </button>
    </div>
  )
}

function DrawerPanel({ view, onClose }) {
  const { cart, removeFromCart, clearCart, userRewards, userName } = useAppMode()
  useOverlay(onClose)
  const [checkout, setCheckout] = useState('whatsapp')
  const [processing, setProcessing] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const total = cart.reduce((n, x) => n + x.qty * x.price, 0)
  const earn = cart.reduce((n, x) => n + x.qty * x.rewardPoints, 0)

  const waText = [
    `Hola Delorean, soy ${userName}. Quiero finalizar mi pedido:`,
    ...cart.map((x) => `• ${x.qty} × ${x.name} (Talla ${x.size}): ${formatCOP(x.qty * x.price)}`),
    '',
    `Total: ${formatCOP(total)}`,
    `Puntos Delorean a acumular: ${earn}`,
  ].join('\n')

  // shortcut: fake gateway latency and approval, replace with the Wompi / Mercado Pago widget callback.
  const pay = ({ gateway, detail }) => {
    setProcessing(true)
    setTimeout(() => {
      setReceipt({ gateway, detail, total, earn, ref: `DLR-${Date.now().toString(36).toUpperCase().slice(-6)}` })
      clearCart()
      setProcessing(false)
    }, 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#111111]/40 backdrop-blur-sm animate-[overlay-in_300ms_ease-out]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute inset-3 flex flex-col overflow-hidden rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_32px_64px_-24px_rgba(17,17,17,0.3)] animate-[drawer-in_500ms_cubic-bezier(0.22,1,0.36,1)] sm:left-auto sm:w-[440px]"
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
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

          {receipt ? (
            <Receipt receipt={receipt} onClose={onClose} />
          ) : cart.length ? (
            <>
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

              <section aria-labelledby="checkout-title" className="mt-4 border-t border-[rgba(0,0,0,0.06)] pt-5">
                <h3 id="checkout-title" className="mb-3 font-semibold tracking-[-0.04em]">Cómo quieres pagar</h3>
                <div role="radiogroup" aria-label="Forma de compra" className="grid gap-2">
                  {CHECKOUT_MODES.map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={checkout === v}
                      onClick={() => setCheckout(v)}
                      className={`flex items-center gap-3 rounded-full border px-4 py-3 text-left text-sm font-semibold transition-colors duration-300 ${
                        checkout === v ? 'border-[#FF6B00] bg-[#FF6B00]/[0.06]' : 'border-[rgba(0,0,0,0.06)] hover:bg-[#F8F9FA]'
                      }`}
                    >
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${checkout === v ? 'border-[#FF6B00]' : 'border-[#111111]/20'}`}>
                        {checkout === v && <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />}
                      </span>
                      {label}
                      <span className="ml-auto text-xs font-normal text-[#111111]/50">{v === 'online' ? 'Wompi o Mercado Pago' : 'Te asesoramos'}</span>
                    </button>
                  ))}
                </div>
                {checkout === 'online' && (
                  <div className="mt-5">
                    <PaymentSimulator formId="pay-form" onPay={pay} />
                  </div>
                )}
              </section>
            </>
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

        {cart.length > 0 && !receipt && (
          <footer className="sticky bottom-0 shrink-0 border-t border-[rgba(0,0,0,0.06)] bg-white/95 p-4 backdrop-blur">
            {/* shrink-0 + min-h-0 on the scroll body keep this CTA on screen however long the payment form gets */}
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
            {checkout === 'whatsapp' ? (
              <a href={whatsappLink(waText)} target="_blank" rel="noreferrer" className={`${cta} mt-3`}>
                <MessageCircle size={22} className="shrink-0" />
                <CtaLabel title="Finalizar pedido por WhatsApp" total={total} earn={earn} />
              </a>
            ) : (
              <button type="submit" form="pay-form" disabled={processing} className={`${cta} mt-3`}>
                <Lock size={20} className="shrink-0" />
                <CtaLabel title={processing ? 'Procesando pago…' : 'Pagar seguro en línea'} total={total} earn={earn} />
              </button>
            )}
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
