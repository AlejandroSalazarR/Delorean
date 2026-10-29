import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import RewardsBadge from '../rewards/RewardsBadge'
import SizePicker from './SizePicker'
import { useAppMode } from '../../context/AppModeContext'
import { formatCOP } from '../../services/mockDatabase'
import { STOCK_STATUS, isSoldOut } from './stockStatus'

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

export default function FloatingProductCard({ product }) {
  const { addToCart, setSelectedProduct } = useAppMode()
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : null)
  const [added, setAdded] = useState(false)
  const status = STOCK_STATUS[product.stockStatus] ?? STOCK_STATUS.in_stock
  const open = () => setSelectedProduct(product)

  const add = () => {
    addToCart(product, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article
      data-reveal
      className={`group flex flex-col rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white p-2.5 shadow-[0_12px_32px_-8px_rgba(17,17,17,0.06)] transition-[translate,box-shadow] duration-500 ${ease} hover:-translate-y-1.5 hover:shadow-[0_28px_48px_-16px_rgba(17,17,17,0.16)]`}
    >
      <button
        type="button"
        onClick={open}
        aria-label={`Ver detalle de ${product.name}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]"
      >
        <img
          src={product.images[0]}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ${ease} group-hover:scale-[1.04]`}
        />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${status.className}`}>
          {status.label}
        </span>
        <span className="absolute bottom-3 left-3">
          <RewardsBadge variant="product" points={product.rewardPoints} />
        </span>
      </button>

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3 tracking-[-0.02em]">
        <p className="text-xs text-[#111111]/50">{product.category}</p>
        <h3 className="mt-0.5 font-semibold leading-snug">
          <button type="button" onClick={open} className="text-left transition-colors hover:text-[#FF6B00]">
            {product.name}
          </button>
        </h3>
        <p className="mt-1 font-semibold tabular-nums">{formatCOP(product.price)}</p>

        <div className="mb-3 mt-3">
          <SizePicker sizes={product.sizes} value={size} onChange={setSize} />
        </div>

        <button
          type="button"
          disabled={!size || isSoldOut(product)}
          onClick={add}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-2.5 text-sm font-semibold text-white transition-[background-color,box-shadow] duration-500 ${ease} hover:bg-[#FF6B00] hover:shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] disabled:bg-[#F8F9FA] disabled:text-[#111111]/40 disabled:shadow-none`}
        >
          {isSoldOut(product) ? (
            'Agotado'
          ) : added ? (
            <>
              <Check size={16} /> Añadida
            </>
          ) : size ? (
            <>
              <Plus size={16} /> Añadir a la bolsa
            </>
          ) : (
            'Elige tu talla'
          )}
        </button>
      </div>
    </article>
  )
}
