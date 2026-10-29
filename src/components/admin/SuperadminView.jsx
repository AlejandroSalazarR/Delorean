import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { useAppMode } from '../../context/AppModeContext'
import { createProduct, formatCOP, updateProduct } from '../../services/mockDatabase'

const STATUS_OPTIONS = [
  ['in_stock', 'En stock'],
  ['low_stock', 'Últimas unidades'],
  ['preorder', 'Preventa'],
  ['sold_out', 'Agotado'],
]
const CATEGORIES = ['Streetwear', 'Anime', 'Cultura Pop', 'Coleccionismo']
const IMAGES = ['Camisa.png', 'Gorras.png', 'Figuras.png']
const hairline = 'border border-[rgba(0,0,0,0.06)]'
const field = `rounded-full bg-[#F8F9FA] px-3 py-2 text-sm outline-none transition-colors focus:border-[#FF6B00] ${hairline}`

// Non-negative integer from an input string, or null when invalid.
const toInt = (v) => (/^\d+$/.test(String(v).trim()) ? Number(v) : null)

// Keep status coherent with stock: 0 units means sold out unless it is a preorder.
function statusForStock(stock, status) {
  if (stock === 0 && status !== 'preorder') return 'sold_out'
  if (stock > 0 && status === 'sold_out') return 'in_stock'
  return status
}

function Stat({ label, value }) {
  return (
    <div className={`rounded-[24px] bg-white p-5 shadow-[0_12px_32px_-8px_rgba(17,17,17,0.06)] ${hairline}`}>
      <p className="text-sm text-[#111111]/60">{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums tracking-[-0.04em] sm:text-3xl">{value}</p>
    </div>
  )
}

function ProductRow({ product, saved, onSave }) {
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stockCount))

  const commitPrice = () => {
    const n = toInt(price)
    if (n === null) return setPrice(String(product.price))
    if (n !== product.price) onSave({ price: n, rewardPoints: Math.round(n / 1000) })
  }
  const commitStock = () => {
    const n = toInt(stock)
    if (n === null) return setStock(String(product.stockCount))
    if (n !== product.stockCount) onSave({ stockCount: n, stockStatus: statusForStock(n, product.stockStatus) })
  }
  const onEnter = (e) => e.key === 'Enter' && e.currentTarget.blur()

  return (
    <tr className={`transition-colors duration-700 ${saved ? 'bg-[#FF6B00]/[0.06]' : ''}`}>
      <td className="py-3 pl-5 pr-3">
        <div className="flex items-center gap-3">
          <img src={product.images[0]} alt="" className="h-12 w-10 shrink-0 rounded-[10px] bg-[#F8F9FA] object-cover" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{product.name}</p>
            <p className="text-xs text-[#111111]/50">{product.category}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <label className="sr-only" htmlFor={`price-${product.id}`}>Precio de {product.name}</label>
        <input
          id={`price-${product.id}`}
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={commitPrice}
          onKeyDown={onEnter}
          className={`${field} w-32 tabular-nums`}
        />
        <p className="mt-1 pl-3 text-xs text-[#111111]/50">{formatCOP(product.price)}</p>
      </td>
      <td className="px-3 py-3">
        <label className="sr-only" htmlFor={`stock-${product.id}`}>Stock de {product.name}</label>
        <input
          id={`stock-${product.id}`}
          inputMode="numeric"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          onBlur={commitStock}
          onKeyDown={onEnter}
          className={`${field} w-20 tabular-nums`}
        />
      </td>
      <td className="px-3 py-3">
        <label className="sr-only" htmlFor={`status-${product.id}`}>Estado de {product.name}</label>
        <select
          id={`status-${product.id}`}
          value={product.stockStatus}
          onChange={(e) => onSave({ stockStatus: e.target.value })}
          className={`${field} pr-8 ${product.stockStatus === 'preorder' ? 'text-[#FF6B00]' : ''}`}
        >
          {STATUS_OPTIONS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </td>
      <td className="w-28 py-3 pl-3 pr-5 text-right">
        <span
          aria-live="polite"
          className={`inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B00] transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}
        >
          <Check size={14} /> Guardado
        </span>
      </td>
    </tr>
  )
}

function NewProductForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({ name: '', category: 'Streetwear', price: '', stockCount: '', image: 'Camisa.png', unique: false, stockStatus: 'in_stock' })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const price = toInt(form.price)
    const stockCount = toInt(form.stockCount)
    if (!form.name.trim()) return setError('Escribe el nombre del producto.')
    if (price === null || price === 0) return setError('El precio debe ser un número entero mayor que 0, en COP.')
    if (stockCount === null) return setError('El stock debe ser un número entero (0 o más).')
    const product = await createProduct({
      name: form.name.trim(),
      category: form.category,
      price,
      image: form.image,
      stockCount,
      stockStatus: statusForStock(stockCount, form.stockStatus),
      sizes: form.unique ? ['Única'] : ['S', 'M', 'L', 'XL'],
      rewardPoints: Math.round(price / 1000),
    })
    onCreated(product.id)
  }

  return (
    <form onSubmit={submit} className={`mb-6 rounded-[24px] bg-white p-5 shadow-[0_12px_32px_-8px_rgba(17,17,17,0.06)] sm:p-6 ${hairline}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-[-0.04em]">Nuevo producto</h2>
        <button type="button" onClick={onCancel} aria-label="Cancelar" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F8F9FA]">
          <X size={18} />
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="grid gap-1 text-sm sm:col-span-2 lg:col-span-1">
          Nombre
          <input value={form.name} onChange={set('name')} className={field} placeholder="Camiseta Oversize Medellín Nights" />
        </label>
        <label className="grid gap-1 text-sm">
          Categoría
          <select value={form.category} onChange={set('category')} className={field}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Foto
          <select value={form.image} onChange={set('image')} className={field}>
            {IMAGES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Precio (COP)
          <input inputMode="numeric" value={form.price} onChange={set('price')} className={field} placeholder="125000" />
        </label>
        <label className="grid gap-1 text-sm">
          Stock
          <input inputMode="numeric" value={form.stockCount} onChange={set('stockCount')} className={field} placeholder="10" />
        </label>
        <label className="grid gap-1 text-sm">
          Estado
          <select value={form.stockStatus} onChange={set('stockStatus')} className={field}>
            {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.unique} onChange={set('unique')} className="h-4 w-4 accent-[#FF6B00]" />
        Talla única (gorras, totes, coleccionables)
      </label>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-[#FF6B00]">{error}</p>}
      <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]">
        <Plus size={16} /> Crear producto
      </button>
    </form>
  )
}

export default function SuperadminView() {
  const { products, refreshProducts } = useAppMode()
  const [savedId, setSavedId] = useState(null)
  const [adding, setAdding] = useState(false)

  const flash = (id) => {
    setSavedId(id)
    setTimeout(() => setSavedId((cur) => (cur === id ? null : cur)), 1600)
  }
  const save = async (id, data) => {
    await updateProduct(id, data)
    await refreshProducts()
    flash(id)
  }

  const units = products.reduce((n, p) => n + p.stockCount, 0)
  const value = products.reduce((n, p) => n + p.stockCount * p.price, 0)
  const preorders = products.filter((p) => p.stockStatus === 'preorder').length

  return (
    <section className="py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Gestión de catálogo</h1>
          <p className="mt-1 text-[#111111]/60">Los cambios se guardan al salir de cada campo y se ven al instante en la tienda.</p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
          >
            <Plus size={16} /> Nuevo producto
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat label="Productos" value={products.length} />
        <Stat label="Unidades en stock" value={units} />
        <Stat label="Valor del inventario" value={formatCOP(value)} />
        <Stat label="En preventa" value={preorders} />
      </div>

      <div className="mt-8">
        {adding && (
          <NewProductForm
            onCancel={() => setAdding(false)}
            onCreated={async (id) => {
              await refreshProducts()
              setAdding(false)
              flash(id)
            }}
          />
        )}

        <div className={`overflow-x-auto rounded-[24px] bg-white shadow-[0_12px_32px_-8px_rgba(17,17,17,0.06)] ${hairline}`}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[rgba(0,0,0,0.06)] text-xs text-[#111111]/50">
              <tr>
                <th scope="col" className="py-3 pl-5 pr-3 font-medium">Producto</th>
                <th scope="col" className="px-3 py-3 font-medium">Precio</th>
                <th scope="col" className="px-3 py-3 font-medium">Stock</th>
                <th scope="col" className="px-3 py-3 font-medium">Estado</th>
                <th scope="col" className="py-3 pl-3 pr-5"><span className="sr-only">Guardado</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {products.map((p) => (
                <ProductRow
                  key={`${p.id}-${p.price}-${p.stockCount}`}
                  product={p}
                  saved={savedId === p.id}
                  onSave={(data) => save(p.id, data)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
