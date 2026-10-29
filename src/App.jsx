import { useState } from 'react'
import { AppModeProvider, useAppMode } from './context/AppModeContext'
import DeloreanPreloader from './components/layout/DeloreanPreloader'
import TopAnnouncementBar from './components/layout/TopAnnouncementBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartAndRewardsDrawer from './components/layout/CartAndRewardsDrawer'
import ProductGrid from './components/catalog/ProductGrid'
import ProductDetailModal from './components/catalog/ProductDetailModal'
import SuperadminView from './components/admin/SuperadminView'

function Store() {
  const { mode } = useAppMode()
  return (
    <>
      <TopAnnouncementBar />
      <Navbar />
      <main id="catalogo" className="mx-auto max-w-7xl px-4 sm:px-6">
        {mode === 'superadmin' ? <SuperadminView /> : <ProductGrid />}
      </main>
      <Footer />
      <CartAndRewardsDrawer />
      <ProductDetailModal />
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  if (loading) return <DeloreanPreloader onDone={() => setLoading(false)} />
  return (
    <AppModeProvider>
      <Store />
    </AppModeProvider>
  )
}
