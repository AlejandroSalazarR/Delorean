import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProducts, getUserProfile } from '../services/mockDatabase'

const AppModeContext = createContext(null)

export function AppModeProvider({ children }) {
  const [mode, setMode] = useState('client')
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [userRewards, setUserRewards] = useState(0)
  const [userName, setUserName] = useState('')
  const [drawer, setDrawer] = useState(null) // 'cart' | 'rewards' | null

  const refreshProducts = useCallback(async () => setProducts(await getProducts()), [])

  useEffect(() => {
    refreshProducts()
    getUserProfile().then((u) => {
      setUserRewards(u.rewards)
      setUserName(u.name)
    })
  }, [refreshProducts])

  const addToCart = useCallback((product, size) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === product.id && x.size === size)
      if (i < 0) return [...c, { ...product, size, qty: 1 }]
      return c.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x))
    })
  }, [])

  const removeFromCart = useCallback((id, size) => {
    setCart((c) => c.filter((x) => !(x.id === id && x.size === size)))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const value = useMemo(
    () => ({
      mode, setMode, products, refreshProducts, searchQuery, setSearchQuery,
      activeCategory, setActiveCategory, cart, addToCart, removeFromCart, clearCart,
      selectedProduct, setSelectedProduct, userRewards, userName, drawer, setDrawer,
    }),
    [mode, products, refreshProducts, searchQuery, activeCategory, cart, addToCart, removeFromCart, clearCart, selectedProduct, userRewards, userName, drawer]
  )
  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppMode = () => useContext(AppModeContext)
