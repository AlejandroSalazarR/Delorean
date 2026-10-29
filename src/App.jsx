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
import InstagramFeed from './components/updates/InstagramFeed'

function Store() {
  const { mode } = useAppMode()
  return (
    <>
      <TopAnnouncementBar />
      <Navbar />
      <main id="catalogo" className="mx-auto w-[94%] max-w-[1720px]">
        {mode === 'superadmin' ? (
          <SuperadminView />
        ) : (
          <>
            <ProductGrid />
            <InstagramFeed />
          </>
        )}
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
