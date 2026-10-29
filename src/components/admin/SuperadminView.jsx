import { useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useAppMode } from '../../context/AppModeContext'
import {
  CATEGORIES, LOCAL_IMAGES, createProduct, deleteProduct, formatCOP, updateProduct,
} from '../../services/mockDatabase'

const STATUS_OPTIONS = [
  ['in_stock', 'En stock'],
  ['low_stock', 'Últimas unidades'],
  ['preorder', 'Preventa'],
  ['sold_out', 'Agotado'],
]
const hairline = 'border border-[rgba(0,0,0,0.06)]'
const field = `rounded-full bg-[#F8F9FA] px-3 py-2 text-sm outline-none transition-colors focus:border-[#FF6B00] ${hairline}`
const area = `rounded-[18px] bg-[#F8F9FA] px-3 py-2 text-sm outline-none transition-colors focus:border-[#FF6B00] ${hairline}`
const primary = 'inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]'
const iconBtn = 'flex h-9 w-9 items-center justify-center rounded-full text-[#111111]/60 transition-colors hover:bg-[#F8F9FA] hover:text-[#111111]'

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

function ProductRow({ product, saved, onSave, onEdit, onDelete }) {
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stockCount))
  const [confirming, setConfirming] = useState(false)

  const commitPrice = () => {
    const n = toInt(price)
    if (n === null || n === 0) return setPrice(String(product.price))
    if (n !== product.price) onSave({ price: n })
  }
  const commitStock = () => {
    const n = toInt(stock)
    if (n === null) return setStock(String(product.stockCount))
    if (n !== product.stockCount) onSave({ stockCount: n, stockStatus: statusForStock(n, product.stockStatus) })
  }
  const onEnter = (e) => e.key === 'Enter' && e.currentTarget.blur()

  return (
    <tr className={`transition-colors duration-700 ${saved ? 'bg-[#FF6B00]/[0.06]' : confirming ? 'bg-[#F8F9FA]' : ''}`}>
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
        <input id={`price-${product.id}`} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={commitPrice} onKeyDown={onEnter} className={`${field} w-32 tabular-nums`} />
        <p className="mt-1 pl-3 text-xs text-[#111111]/50">{formatCOP(product.price)}</p>
      </td>
      <td className="px-3 py-3">
        <label className="sr-only" htmlFor={`stock-${product.id}`}>Stock de {product.name}</label>
        <input id={`stock-${product.id}`} inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} onBlur={commitStock} onKeyDown={onEnter} className={`${field} w-20 tabular-nums`} />
      </td>
      <td className="px-3 py-3">
        <label className="sr-only" htmlFor={`status-${product.id}`}>Estado de {product.name}</label>
        <select
          id={`status-${product.id}`}
          value={product.stockStatus}
          onChange={(e) => onSave({ stockStatus: e.target.value })}
          className={`${field} pr-8 ${product.stockStatus === 'preorder' ? 'text-[#FF6B00]' : ''}`}
        >
          {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </td>
      <td className="py-3 pl-3 pr-5">
        {confirming ? (
          <div role="alertdialog" aria-label={`Confirmar eliminación de ${product.name}`} className="flex items-center justify-end gap-2">
            <span className="text-xs font-semibold">¿Eliminar?</span>
            <button type="button" autoFocus onClick={onDelete} className="rounded-full bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#FF6B00]">
              Sí, eliminar
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-white">
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <span aria-live="polite" className={`mr-2 inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B00] transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}>
              <Check size={14} /> Guardado
            </span>
            <button type="button" onClick={onEdit} aria-label={`Editar ${product.name}`} className={iconBtn}>
              <Pencil size={16} />
            </button>
            <button type="button" onClick={() => setConfirming(true)} aria-label={`Eliminar ${product.name}`} className={`${iconBtn} hover:text-[#FF6B00]`}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}

const EMPTY = {
  name: '', category: 'Streetwear', price: '', stockCount: '', stockStatus: 'in_stock', description: '', finishDetails: '',
  images: LOCAL_IMAGES[0], unique: false, featured: false,
}

function ProductForm({ product, onDone, onCancel }) {
  const [form, setForm] = useState(() =>
    product
      ? { ...product, price: String(product.price), stockCount: String(product.stockCount), images: product.images.join('\n'), unique: product.sizes.includes('Única') }
      : EMPTY
  )
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const urls = form.images.split('\n').map((u) => u.trim()).filter(Boolean)
  const addImage = (url) => !urls.includes(url) && setForm((f) => ({ ...f, images: [...urls, url].join('\n') }))

  const submit = async (e) => {
    e.preventDefault()
    const price = toInt(form.price)
    const stockCount = toInt(form.stockCount)
    const data = {
      name: form.name,
      category: form.category,
      price: price ?? NaN,
      stockCount: stockCount ?? NaN,
      stockStatus: stockCount === null ? form.stockStatus : statusForStock(stockCount, form.stockStatus),
      description: form.description,
      finishDetails: form.finishDetails,
      images: urls,
      sizes: form.unique ? ['Única'] : ['S', 'M', 'L', 'XL'],
      featured: form.featured,
    }
    try {
      const saved = product ? await updateProduct(product.id, data) : await createProduct(data)
      onDone(saved.id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit} className={`mb-6 rounded-[24px] bg-white p-5 shadow-[0_12px_32px_-8px_rgba(17,17,17,0.06)] sm:p-6 ${hairline}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-[-0.04em]">{product ? `Editar ${product.name}` : 'Nuevo producto'}</h2>
        <button type="button" onClick={onCancel} aria-label="Cerrar formulario" className={iconBtn}>
          <X size={18} />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-1 text-sm sm:col-span-2">
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
          Estado
          <select value={form.stockStatus} onChange={set('stockStatus')} className={field}>
            {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Precio (COP)
          <input inputMode="numeric" value={form.price} onChange={set('price')} className={`${field} tabular-nums`} placeholder="125000" />
        </label>
        <label className="grid gap-1 text-sm">
          Stock
          <input inputMode="numeric" value={form.stockCount} onChange={set('stockCount')} className={`${field} tabular-nums`} placeholder="10" />
        </label>
        <div className="flex flex-col justify-end gap-2 pb-1 text-sm sm:col-span-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.unique} onChange={set('unique')} className="h-4 w-4 accent-[#FF6B00]" />
            Talla única (gorras, totes, coleccionables)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 accent-[#FF6B00]" />
            Producto destacado
          </label>
        </div>
        <label className="grid gap-1 text-sm sm:col-span-2">
          Descripción
          <textarea rows={3} value={form.description} onChange={set('description')} className={area} placeholder="Qué es y por qué vale la pena, en una o dos frases." />
        </label>
        <label className="grid gap-1 text-sm sm:col-span-2">
          Acabados y construcción
          <textarea rows={3} value={form.finishDetails} onChange={set('finishDetails')} className={area} placeholder="Algodón pesado 260g, estampado serigráfico" />
        </label>
        <div className="grid gap-2 text-sm sm:col-span-2 lg:col-span-4">
          <label htmlFor="product-images">Fotos (una URL por línea: /productos/... o https://...)</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea id="product-images" rows={3} value={form.images} onChange={set('images')} className={`${area} flex-1 font-mono text-xs`} />
            <div className="flex gap-2">
              {urls.map((u) => (
                <img key={u} src={u} alt="" className="h-20 w-16 rounded-[12px] bg-[#F8F9FA] object-cover" />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#111111]/60">
            Añadir foto de la tienda:
            {LOCAL_IMAGES.map((u) => (
              <button key={u} type="button" onClick={() => addImage(u)} disabled={urls.includes(u)} className={`rounded-full bg-white px-3 py-1 font-semibold text-[#111111] transition-colors hover:border-[#FF6B00] disabled:opacity-40 ${hairline}`}>
                {u.split('/').pop()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-semibold text-[#FF6B00]">{error}</p>}
      <div className="mt-5 flex gap-2">
        <button type="submit" className={primary}>
          {product ? <Check size={16} /> : <Plus size={16} />} {product ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[#F8F9FA]">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function SuperadminView() {
  const { products, refreshProducts } = useAppMode()
  const [savedId, setSavedId] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const [error, setError] = useState('')

  const flash = (id) => {
    setSavedId(id)
    setTimeout(() => setSavedId((cur) => (cur === id ? null : cur)), 1600)
  }
  const save = async (id, data) => {
    try {
      await updateProduct(id, data)
      setError('')
      flash(id)
    } catch (err) {
      setError(err.message)
    }
    await refreshProducts()
  }
  const remove = async (id) => {
    await deleteProduct(id)
    if (editing?.id === id) setEditing(null)
    await refreshProducts()
  }
  const openForm = (target) => {
    setEditing(target)
    requestAnimationFrame(() => document.getElementById('product-form')?.scrollIntoView({ block: 'start' }))
  }

  const units = products.reduce((n, p) => n + p.stockCount, 0)
  const value = products.reduce((n, p) => n + p.stockCount * p.price, 0)
  const preorders = products.filter((p) => p.stockStatus === 'preorder').length

  return (
    <section className="py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Gestión de catálogo</h1>
          <p className="mt-1 text-[#111111]/60">Edita en la tabla o abre la ficha completa. Los cambios se ven al instante en la tienda.</p>
        </div>
        {!editing && (
          <button type="button" onClick={() => openForm('new')} className={primary}>
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

      <div id="product-form" className="mt-8 scroll-mt-28">
        {editing && (
          <ProductForm
            key={editing === 'new' ? 'new' : editing.id}
            product={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onDone={async (id) => {
              await refreshProducts()
              setEditing(null)
              flash(id)
            }}
          />
        )}

        {error && <p role="alert" className="mb-3 text-sm font-semibold text-[#FF6B00]">{error}</p>}

        <div className={`overflow-x-auto rounded-[24px] bg-white shadow-[0_12px_32px_-8px_rgba(17,17,17,0.06)] ${hairline}`}>
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-[rgba(0,0,0,0.06)] text-xs text-[#111111]/50">
              <tr>
                <th scope="col" className="py-3 pl-5 pr-3 font-medium">Producto</th>
                <th scope="col" className="px-3 py-3 font-medium">Precio</th>
                <th scope="col" className="px-3 py-3 font-medium">Stock</th>
                <th scope="col" className="px-3 py-3 font-medium">Estado</th>
                <th scope="col" className="py-3 pl-3 pr-5 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {products.map((p) => (
                <ProductRow
                  key={`${p.id}-${p.updatedAt}`}
                  product={p}
                  saved={savedId === p.id}
                  onSave={(data) => save(p.id, data)}
                  onEdit={() => openForm(p)}
                  onDelete={() => remove(p.id)}
                />
              ))}
            </tbody>
          </table>
          {!products.length && <p className="px-5 py-10 text-center text-sm text-[#111111]/60">No hay productos. Crea el primero con “Nuevo producto”.</p>}
        </div>
      </div>
    </section>
  )
}
