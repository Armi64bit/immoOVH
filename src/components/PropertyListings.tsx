import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PropertyItem } from '../types'

type Props = {
  title: string
  subtitle: string
  properties: PropertyItem[]
  introText?: string
  showFilters?: boolean
  variant?: 'page' | 'home'
}

const getPropertyCategory = (property: PropertyItem) => {
  const title = property.title.toLowerCase()

  if (title.includes('villa')) return 'Villa'
  if (title.includes('appartement') || title.includes('studio') || title.includes('penthouse') || title.includes('duplex')) return 'Appartement'
  if (title.includes('terrain')) return 'Terrain'

  return 'Autre'
}

const getSurface = (property: PropertyItem) => {
  const match = property.details.match(/(\d+)\s*m²/)
  return match ? Number(match[1]) : 0
}

const getPieces = (property: PropertyItem) => {
  const match = property.details.match(/S\+(\d+)/)
  return match ? Number(match[1]) : 0
}

const getPriceValue = (property: PropertyItem) => {
  const match = property.price.match(/(\d[\d\s]*)/)
  return match ? Number(match[1].replace(/\s/g, '')) : 0
}

export default function PropertyListings({
  title,
  subtitle,
  properties,
  introText,
  showFilters = true,
  variant = 'page'
}: Props) {
  const [filters, setFilters] = useState({
    type: 'Tous',
    zone: 'Tous',
    priceMin: '',
    priceMax: '',
    surfaceMin: '',
    pieces: 'Tous'
  })

  const availableTypes = useMemo(() => {
    const categories = Array.from(new Set(properties.map(getPropertyCategory)))
    return ['Tous', ...categories]
  }, [properties])

  const availableZones = useMemo(() => {
    const zones = Array.from(new Set(properties.map((property) => property.location)))
    return ['Tous', ...zones]
  }, [properties])

  const filteredProperties = useMemo(() => {
    const minPrice = filters.priceMin === '' ? Number.NEGATIVE_INFINITY : Number(filters.priceMin)
    const maxPrice = filters.priceMax === '' ? Number.POSITIVE_INFINITY : Number(filters.priceMax)
    const minSurface = filters.surfaceMin === '' ? Number.NEGATIVE_INFINITY : Number(filters.surfaceMin)
    const piecesFilter = filters.pieces === 'Tous' ? null : Number(filters.pieces)

    return properties.filter((property) => {
      const matchesType = filters.type === 'Tous' || getPropertyCategory(property) === filters.type
      const matchesZone = filters.zone === 'Tous' || property.location === filters.zone
      const priceValue = getPriceValue(property)
      const matchesPrice = priceValue >= minPrice && priceValue <= maxPrice
      const matchesSurface = getSurface(property) >= minSurface
      const matchesPieces = piecesFilter === null || getPieces(property) >= piecesFilter

      return matchesType && matchesZone && matchesPrice && matchesSurface && matchesPieces
    })
  }, [filters, properties])

  const content = (
    <>
      {variant === 'page' ? (
        <section className="page-panel" style={{ padding: '2rem', borderRadius: '0.5rem' }}>
          <div className="page-intro">
            <h3 className="eyebrow">{title}</h3>
            <h3>{subtitle}</h3>
            <p>{introText ?? 'Retrouvez des villas, appartements et terrains dans les quartiers les plus recherchés de la région.'}</p>
          </div>

          {showFilters && (
            <div className="filter-panel">
              <div className="filter-group">
                <label>TYPE</label>
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>ZONE</label>
                <select value={filters.zone} onChange={(e) => setFilters({ ...filters, zone: e.target.value })}>
                  {availableZones.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>PRIX MIN</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                />
              </div>

              <div className="filter-group">
                <label>PRIX MAX</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                />
              </div>

              <div className="filter-group">
                <label>SURFACE MIN</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.surfaceMin}
                  onChange={(e) => setFilters({ ...filters, surfaceMin: e.target.value })}
                />
              </div>

              <div className="filter-group">
                <label>PIÈCES</label>
                <select value={filters.pieces} onChange={(e) => setFilters({ ...filters, pieces: e.target.value })}>
                  <option value="Tous">Tous</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
          )}

          <div className="card-grid">
            {filteredProperties.map((property) => (
              <Link key={property.title} to={`/property/${property.reference}`} className="property-card-link">
                <article className="property-card property-card-listing">
                  <div className="property-card-image">
                    <img src={property.imageUrl} alt={property.title} />
                    <span className="property-status">{property.status}</span>
                    <span className="property-star">★</span>
                    <span className="property-ref">{property.reference}</span>
                  </div>
                  <div className="property-card-body">
                    <p className="property-label">{property.type} · {property.location}</p>
                    <h3>{property.title}</h3>
                    <p className="property-meta">{property.details}</p>
                  </div>
                  <div className="property-price">{property.price}</div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="section-block">
          <div className="section-heading section-heading-space">
            <div>
              <p className="eyebrow">{title}</p>
              <h2>{subtitle}</h2>
            </div>
          </div>
          <div className="card-grid">
            {filteredProperties.map((property) => (
              <Link key={property.title} to={`/property/${property.reference}`} className="property-card-link">
                <article className="property-card property-card-listing">
                  <div className="property-card-image">
                    <img src={property.imageUrl} alt={property.title} />
                    <span className="property-status">{property.status}</span>
                    <span className="property-star">★</span>
                    <span className="property-ref">{property.reference}</span>
                  </div>
                  <div className="property-card-body">
                    <p className="property-label">{property.type} · {property.location}</p>
                    <h3>{property.title}</h3>
                    <p className="property-meta">{property.details}</p>
                  </div>
                  <div className="property-price">{property.price}</div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )

  return content
}
