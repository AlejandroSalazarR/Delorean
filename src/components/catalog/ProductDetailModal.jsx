import { useState } from 'react'
import { Check, MessageCircle, Plus, X } from 'lucide-react'
import RewardsBadge from '../rewards/RewardsBadge'
import SizePicker from './SizePicker'
import { STOCK_STATUS, isSoldOut } from './stockStatus'
import useOverlay from '../../hooks/useOverlay'
import { useAppMode } from '../../context/AppModeContext'
import { formatCOP, whatsappLink } from '../../services/mockDatabase'

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

function ModalBody({ product, onClose }) {
  const { addToCart } = useAppMode()
  useOverlay(onClose)
  const [img, setImg] = useState(0)
  const [origin, setOrigin] = useState('50% 50%')
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : null)
  const [added, setAdded] = useState(false)
  const status = STOCK_STATUS[product.stockStatus] ?? STOCK_STATUS.in_stock
  const canBuy = Boolean(size) && !isSoldOut(product)

  const waText = [
    'Hola Delorean, quiero comprar:',
    `• ${product.name}`,
    `• Talla: ${size}`,
    `• Precio: ${formatCOP(product.price)}`,
    `• Puntos Delorean a acumular: ${product.rewardPoints}`,
  ].join('\n')

  const add = () => {
    addToCart(product, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#111111]/40 p-3 backdrop-blur-sm animate-[overlay-in_300ms_ease-out] sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdm-title"
        className={`relative grid max-h-[92vh] w-full max-w-5xl gap-4 overflow-y-auto rounded-[28px] border border-[rgba(0,0,0,0.06)] bg-white p-3 shadow-[0_32px_64px_-24px_rgba(17,17,17,0.3)] animate-[panel-in_500ms_cubic-bezier(0.22,1,0.36,1)] md:grid-cols-2 md:gap-8 md:p-4`}
      >
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,0,0,0.06)] bg-white/90 backdrop-blur-sm transition-colors hover:bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-[#FF6B00]"
        >
          <X size={18} />
        </button>

        <div>
          <div
            className="aspect-[4/5] overflow-hidden rounded-[22px] bg-[#F8F9FA]"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
            }}
          >
            <img
              src={product.images[img]}
              alt={product.name}
              style={{ transformOrigin: origin }}
              className={`h-full w-full object-cover transition-transform duration-500 ${ease} hover:scale-[1.15]`}
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setImg(i)}
                  aria-label={`Ver ángulo ${i + 1}`}
                  aria-current={img === i}
                  className={`h-16 w-14 overflow-hidden rounded-[14px] bg-[#F8F9FA] ring-2 transition ${img === i ? 'ring-[#FF6B00]' : 'ring-transparent hover:ring-[#111111]/15'}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col px-2 pb-3 md:py-8 md:pr-6">
          <p className="text-sm text-[#111111]/50">{product.category}</p>
          <h2 id="pdm-title" className="mt-1 text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-4xl">
            {product.name}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-semibold tabular-nums">{formatCOP(product.price)}</p>
            <RewardsBadge variant="product" points={product.rewardPoints} />
          </div>
          <p className={`mt-3 w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className} border border-[rgba(0,0,0,0.06)]`}>
            {status.label}
          </p>

          {product.description && <p className="mt-5 max-w-prose text-[#111111]/70">{product.description}</p>}

          {product.finishDetails && (
            <div className="mt-6 rounded-[20px] bg-[#F8F9FA] p-4">
              <h3 className="text-sm font-semibold">Acabados y Construcción</h3>
              <p className="mt-1 text-sm text-[#111111]/70">{product.finishDetails}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">{size ? `Talla ${size}` : 'Elige tu talla'}</p>
            <SizePicker sizes={product.sizes} value={size} onChange={setSize} large />
          </div>

          <div className="mt-8 grid gap-2 md:mt-auto md:pt-8">
            <a
              href={canBuy ? whatsappLink(waText) : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!canBuy}
              className={`flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold transition-[transform,background-color] duration-500 ${ease} ${
                canBuy
                  ? 'bg-[#FF6B00] text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] hover:scale-[1.02]'
                  : 'pointer-events-none bg-[#F8F9FA] text-[#111111]/40'
              }`}
            >
              <MessageCircle size={18} /> Comprar ahora por WhatsApp
            </a>
            <button
              type="button"
              disabled={!canBuy}
              onClick={add}
              className="flex items-center justify-center gap-2 rounded-full border border-[rgba(0,0,0,0.06)] py-3.5 font-semibold transition-colors hover:bg-[#F8F9FA] disabled:text-[#111111]/40 disabled:hover:bg-transparent"
            >
              {added ? <Check size={18} /> : <Plus size={18} />}
              {added ? 'Agregada a la Bolsa' : 'Agregar a la Bolsa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct } = useAppMode()
  if (!selectedProduct) return null
  return <ModalBody key={selectedProduct.id} product={selectedProduct} onClose={() => setSelectedProduct(null)} />
}
