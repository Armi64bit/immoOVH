import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { NavItem } from '../types'

type Props = {
  activePage: string
  navItems: NavItem[]
  onChangePage: (page: string) => void
  onEstimateClick: () => void
}

export default function Header({ navItems, onEstimateClick }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const getActivePage = () => {
    const path = location.pathname.toLowerCase()
    if (path === '/') return 'accueil'
    if (path.includes('vente')) return 'vente'
    if (path.includes('location')) return 'location'
    if (path.includes('carte')) return 'carte'
    if (path.includes('estimation')) return 'estimation'
    if (path.includes('contact')) return 'contact'
    return 'accueil'
  }

  const activePage = getActivePage()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const getRouteForKey = (key: string) => {
    const routeMap: Record<string, string> = {
      accueil: '/',
      vente: '/Vente',
      location: '/Location',
      carte: '/Carte',
      estimation: '/Estimation',
      recrutement: '/Recrutement',
      contact: '/Contact'
    }
    return routeMap[key] || '/'
  }

  const handleNavigate = (route: string) => {
    navigate(route)
    setMenuOpen(false)
  }

  const handleEstimateClick = () => {
    onEstimateClick()
    handleNavigate('/Estimation')
  }

  return (
    <header className="main-header">
      <div className="topbar">
        <Link to="/" className="brand" role="banner">
          <img
            src="/logod.png"
            alt="ImmoConnect logo"
            className="brand-logo"
          />
        </Link>

        <div className="mobile-toolbox">
          <button
            type="button"
            className="menu-toggle"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav className="nav-links desktop-nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={getRouteForKey(item.key)}
              className={activePage === item.key ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions desktop-actions">
          <button type="button" className="header-cta" onClick={handleEstimateClick}>
            Estimer mon bien
          </button>
          <button type="button" className="locale-button">EN</button>
        </div>
      </div>

      <div id="mobile-nav-panel" className={`mobile-nav-panel ${menuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links" aria-label="Navigation mobile">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={getRouteForKey(item.key)}
              className={activePage === item.key ? 'nav-link active' : 'nav-link'}
              onClick={() => handleNavigate(getRouteForKey(item.key))}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

