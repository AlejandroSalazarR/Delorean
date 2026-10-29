// Mock async DB persisted in localStorage; swap bodies for Supabase calls later.
export const WHATSAPP_NUMBER = '573000000000'
export const formatCOP = (n) => `$${n.toLocaleString('es-CO')} COP`
export const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

const KEY = 'delorean_products_v2' // bumped when SEED changes so stale catalogs are replaced
const USER_KEY = 'delorean_user_v1'
const SIZES = ['S', 'M', 'L', 'XL']

const p = (id, name, category, price, img, extra) => ({
  id, name, category, price, images: [`/productos/${img}`], sizes: SIZES,
  stockStatus: 'in_stock', stockCount: 12, rewardPoints: Math.round(price / 1000),
  featured: false, finishDetails: '', ...extra,
})

const SEED = [
  p('p1', 'Camiseta Oversize Tokyo Drift', 'Streetwear', 125000, 'Camisa.png', { featured: true, finishDetails: 'Algodón pesado 260g, estampado serigráfico de alta densidad' }),
  p('p2', 'Camiseta Boxy Neo Kyoto', 'Anime', 119000, 'Camisa.png', { stockCount: 3, stockStatus: 'low_stock', finishDetails: 'Algodón peinado 240g, bordado frontal en relieve' }),
  p('p3', 'Camiseta Retro Arcade 85', 'Cultura Pop', 109000, 'Camisa.png', { finishDetails: 'Algodón jersey 220g, estampado vintage cuarteado' }),
  p('p4', 'Gorra Snapback Delorean', 'Streetwear', 85000, 'Gorras.png', { featured: true, sizes: ['Única'], finishDetails: 'Sarga de algodón, logo bordado 3D, cierre ajustable' }),
  p('p5', 'Gorra Trucker Shonen', 'Anime', 79000, 'Gorras.png', { sizes: ['Única'], stockCount: 2, stockStatus: 'low_stock', finishDetails: 'Malla transpirable, parche tejido' }),
  p('p6', 'Tote Bag Editorial Delorean', 'Streetwear', 69000, 'Figuras.png', { featured: true, sizes: ['Única'], stockCount: 5, finishDetails: 'Lona de algodón 12 oz, estampado serigráfico a dos tintas' }),
  p('p7', 'Tote Bag Pop Icons', 'Cultura Pop', 65000, 'Figuras.png', { sizes: ['Única'], stockStatus: 'preorder', stockCount: 0, finishDetails: 'Lona natural, asas reforzadas, estampado full color' }),
  p('p8', 'Tote Bag Streetwear Daily', 'Streetwear', 59000, 'Figuras.png', { sizes: ['Única'], finishDetails: 'Algodón grueso, bolsillo interior, costuras dobles' }),
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
  const next = (await getProducts()).map((x) => (x.id === id ? { ...x, ...data, id } : x))
  write(KEY, next)
  return next.find((x) => x.id === id)
}

export async function createProduct(data) {
  const { name = 'Nuevo producto', category = 'Streetwear', price = 0, image = 'Camisa.png', ...rest } = data
  const product = p(`p${Date.now()}`, name, category, price, image, rest)
  write(KEY, [...(await getProducts()), product])
  return product
}

export async function getUserProfile() {
  return read(USER_KEY, null) ?? (write(USER_KEY, { name: 'Marty', rewards: 250 }), { name: 'Marty', rewards: 250 })
}
