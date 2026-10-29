// Mock async DB persisted in localStorage; swap bodies for Supabase calls later.
export const WHATSAPP_NUMBER = '573000000000'
export const formatCOP = (n) => `$${n.toLocaleString('es-CO')} COP`
export const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

const KEY = 'delorean_products_v3' // bumped when SEED or the schema changes so stale catalogs are replaced
const USER_KEY = 'delorean_user_v1'

export const CATEGORIES = ['Streetwear', 'Anime', 'Cultura Pop', 'Coleccionismo']
export const STOCK_STATUSES = ['in_stock', 'low_stock', 'preorder', 'sold_out']
export const LOCAL_IMAGES = ['/productos/Camisa.png', '/productos/Gorras.png', '/productos/Figuras.png']
const SIZES = ['S', 'M', 'L', 'XL']

/*
 * Product row, shaped for a future Supabase `products` table (camelCase here, snake_case there):
 * id text pk, name text, category text, price int (COP), images text[], sizes text[],
 * stock_status text, stock_count int, reward_points int, featured bool,
 * description text, finish_details text, created_at timestamptz, updated_at timestamptz.
 */
export class ProductValidationError extends Error {}

const isImageUrl = (u) => /^(\/|https:\/\/)\S+$/.test(u)

// Single gate for every write: coerces types and rejects rows the future table would refuse.
export function normalizeProduct(data) {
  const name = String(data.name ?? '').trim()
  const price = Number(data.price)
  const stockCount = Number(data.stockCount)
  const images = (data.images ?? []).map((u) => String(u).trim()).filter(Boolean)
  if (!name) throw new ProductValidationError('El nombre es obligatorio.')
  if (!CATEGORIES.includes(data.category)) throw new ProductValidationError('Categoría no válida.')
  if (!Number.isInteger(price) || price <= 0) throw new ProductValidationError('El precio debe ser un entero mayor que 0, en COP.')
  if (!Number.isInteger(stockCount) || stockCount < 0) throw new ProductValidationError('El stock debe ser un entero de 0 o más.')
  if (!STOCK_STATUSES.includes(data.stockStatus)) throw new ProductValidationError('Estado no válido.')
  if (!images.length || !images.every(isImageUrl)) throw new ProductValidationError('Cada foto debe ser una ruta /productos/... o una URL https://.')
  return {
    id: data.id,
    name,
    category: data.category,
    price,
    images,
    sizes: data.sizes?.length ? data.sizes : SIZES,
    stockStatus: data.stockStatus,
    stockCount,
    rewardPoints: Math.round(price / 1000),
    featured: Boolean(data.featured),
    description: String(data.description ?? '').trim(),
    finishDetails: String(data.finishDetails ?? '').trim(),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

const SEED_DATE = '2026-10-01T00:00:00.000Z'
const p = (id, name, category, price, img, extra) =>
  normalizeProduct({
    id, name, category, price, images: [`/productos/${img}`], stockStatus: 'in_stock', stockCount: 12,
    createdAt: SEED_DATE, updatedAt: SEED_DATE, ...extra,
  })

const SEED = [
  p('p1', 'Camiseta Oversize Tokyo Drift', 'Streetwear', 125000, 'Camisa.png', { featured: true, description: 'Silueta oversize de hombro caído con gráfica de carreras nocturnas en la espalda.', finishDetails: 'Algodón pesado 260g, estampado serigráfico de alta densidad' }),
  p('p2', 'Camiseta Boxy Neo Kyoto', 'Anime', 119000, 'Camisa.png', { stockCount: 3, stockStatus: 'low_stock', description: 'Corte boxy con ilustración inspirada en el anime de los 90.', finishDetails: 'Algodón peinado 240g, bordado frontal en relieve' }),
  p('p3', 'Camiseta Retro Arcade 85', 'Cultura Pop', 109000, 'Camisa.png', { description: 'Homenaje a las salas de arcade, con paleta neón desgastada.', finishDetails: 'Algodón jersey 220g, estampado vintage cuarteado' }),
  p('p4', 'Gorra Snapback Delorean', 'Streetwear', 85000, 'Gorras.png', { featured: true, sizes: ['Única'], description: 'La gorra insignia de la tienda, con el rayo bordado al frente.', finishDetails: 'Sarga de algodón, logo bordado 3D, cierre ajustable' }),
  p('p5', 'Gorra Trucker Shonen', 'Anime', 79000, 'Gorras.png', { sizes: ['Única'], stockCount: 2, stockStatus: 'low_stock', description: 'Trucker ligera con parche de estética shonen.', finishDetails: 'Malla transpirable, parche tejido' }),
  p('p6', 'Tote Bag Editorial Delorean', 'Streetwear', 69000, 'Figuras.png', { featured: true, sizes: ['Única'], stockCount: 5, description: 'Tote amplia para el día a día, con diseño editorial a dos tintas.', finishDetails: 'Lona de algodón 12 oz, estampado serigráfico a dos tintas' }),
  p('p7', 'Tote Bag Pop Icons', 'Cultura Pop', 65000, 'Figuras.png', { sizes: ['Única'], stockStatus: 'preorder', stockCount: 0, description: 'Íconos de la cultura pop en un estampado full color.', finishDetails: 'Lona natural, asas reforzadas, estampado full color' }),
  p('p8', 'Tote Bag Streetwear Daily', 'Streetwear', 59000, 'Figuras.png', { sizes: ['Única'], description: 'Tote resistente con bolsillo interior para llevar lo esencial.', finishDetails: 'Algodón grueso, bolsillo interior, costuras dobles' }),
]

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch { /* storage unavailable */ }
  return fallback
}
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

export async function getProducts() {
  const stored = read(KEY, null)
  if (stored) return stored
  write(KEY, SEED)
  return SEED
}

export async function updateProduct(id, data) {
  const rows = await getProducts()
  const current = rows.find((x) => x.id === id)
  if (!current) throw new ProductValidationError('El producto ya no existe.')
  const product = normalizeProduct({ ...current, ...data, id, createdAt: current.createdAt, updatedAt: new Date().toISOString() })
  write(KEY, rows.map((x) => (x.id === id ? product : x)))
  return product
}

export async function createProduct(data) {
  const now = new Date().toISOString()
  const product = normalizeProduct({ ...data, id: `p${Date.now()}`, createdAt: now, updatedAt: now })
  write(KEY, [...(await getProducts()), product])
  return product
}

export async function deleteProduct(id) {
  write(KEY, (await getProducts()).filter((x) => x.id !== id))
}

export async function getUserProfile() {
  return read(USER_KEY, null) ?? (write(USER_KEY, { name: 'Marty', rewards: 250 }), { name: 'Marty', rewards: 250 })
}

// shortcut: static mock of the last 3 posts, swap for the Instagram Graph API once there is a business token.
export const INSTAGRAM_HANDLE = 'delorean_store'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`

export async function getInstagramPosts() {
  return [
    { id: 'ig1', image: '/productos/Camisa.png', caption: 'Preventa abierta: oversize Tokyo Drift en algodón 260g. Separa la tuya por DM o WhatsApp antes del viernes.', date: '2026-10-27', likes: 482, comments: 37, tag: 'Preventa' },
    { id: 'ig2', image: '/productos/Gorras.png', caption: 'Llegaron las snapback Delorean con logo bordado 3D. Pocas unidades por color en la tienda de Copacabana.', date: '2026-10-22', likes: 356, comments: 21, tag: 'Nuevo drop' },
    { id: 'ig3', image: '/productos/Figuras.png', caption: 'Totes editoriales para el día a día: lona de 12 oz y estampado a dos tintas. Disponibles en tienda y online.', date: '2026-10-18', likes: 291, comments: 14, tag: 'Streetwear' },
  ].map((post) => ({ ...post, url: INSTAGRAM_URL }))
}
