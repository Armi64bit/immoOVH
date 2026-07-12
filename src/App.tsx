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
import { navItems, featuredProperties, zones, whatsappNumbers } from './data/siteData'

const venteProperties = featuredProperties.filter((property) => property.type === 'À vendre')
const locationProperties = featuredProperties.filter((property) => property.type === 'À louer')

function AppContent() {
  const navigate = useNavigate()

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
        <Routes>
          <Route path="/" element={<Home featuredProperties={featuredProperties} zones={zones} onNavigate={handleNavigate} />} />
          <Route path="/Vente" element={<Listing title="Biens à vendre" subtitle="Explorez des propriétés soigneusement sélectionnées." properties={venteProperties} />} />
          <Route path="/Location" element={<Listing title="Biens à louer" subtitle="Des locations élégantes pour un quotidien premium." properties={locationProperties} />} />
          <Route path="/Carte" element={<MapPage properties={[...venteProperties, ...locationProperties]} />} />
          <Route path="/Estimation" element={<Estimation />} />
          <Route path="/Recrutement" element={<Recrutement />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </main>

      <FloatingActions numbers={whatsappNumbers} />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
