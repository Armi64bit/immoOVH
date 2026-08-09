import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'
import Home from './pages/Home'
import Listing from './pages/Listing'
import MapPage from './pages/MapPage'
import Estimation from './pages/Estimation'
import Contact from './pages/Contact'
import Recrutement from './pages/Recrutement'
import PropertyDetail from './pages/PropertyDetail'
import { PropertiesProvider, useProperties } from './PropertiesContext'
import { navItems, zones, whatsappNumbers } from './data/siteData'

function LoadingState() {
  return (
    <section className="page-panel">
      <div className="page-intro">
        <p className="eyebrow">Chargement</p>
        <h2>Nos biens arrivent…</h2>
      </div>
    </section>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="page-panel">
      <div className="page-intro">
        <p className="eyebrow">Erreur</p>
        <h2>Impossible de charger les biens</h2>
        <p>{message}</p>
      </div>
    </section>
  )
}

function AppContent() {
  const navigate = useNavigate()
  const { properties, vente, location, loading, error } = useProperties()

  const handleNavigate = (page: 'vente' | 'location' | 'estimation') => {
    const routes: Record<'vente' | 'location' | 'estimation', string> = {
      vente: '/Vente',
      location: '/Location',
      estimation: '/Estimation'
    }

    navigate(routes[page])
  }

  return (
    <div className="app-shell">
      <Header
        activePage="accueil"
        navItems={navItems}
        onChangePage={() => {}}
        onEstimateClick={() => {}}
      />

      <main className="main-content">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <Routes>
            <Route path="/" element={<Home featuredProperties={properties} zones={zones} onNavigate={handleNavigate} />} />
            <Route path="/Vente" element={<Listing title="Biens à vendre" subtitle="Explorez des propriétés soigneusement sélectionnées." properties={vente} />} />
            <Route path="/Location" element={<Listing title="Biens à louer" subtitle="Des locations élégantes pour un quotidien premium." properties={location} />} />
            <Route path="/Carte" element={<MapPage properties={properties} />} />
            <Route path="/Estimation" element={<Estimation />} />
            <Route path="/Recrutement" element={<Recrutement />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        )}
      </main>

      <FloatingActions numbers={whatsappNumbers} />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <PropertiesProvider>
        <AppContent />
      </PropertiesProvider>
    </Router>
  )
}

export default App
