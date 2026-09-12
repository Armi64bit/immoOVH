import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PropertyItem } from '../types'

type Props = {
  properties: PropertyItem[]
}

export default function MapPage({ properties }: Props) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null)
  const navigate = useNavigate()
  const mappedProperties = properties.filter((property) => property.googleMapsUrl || property.location)

  const getMapEmbedUrl = () => {
    const mapsUrl = selectedProperty?.googleMapsUrl
    if (mapsUrl) {
      try {
        const query = new URL(mapsUrl).searchParams.get('query')
        if (query) {
          return `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=fr&z=15&output=embed`
        }
      } catch {
        // Use the text location when an imported link is malformed.
      }
    }
    const location = selectedProperty?.location || 'Tunis'
    return `https://www.google.com/maps?q=${encodeURIComponent(location)}&hl=fr&z=10&output=embed`
  }

  const getGoogleMapsUrl = () => {
    if (selectedProperty?.googleMapsUrl) return selectedProperty.googleMapsUrl
    const location = selectedProperty?.location || 'Tunis'
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
  }

  return (
    <section className="page-panel">
      <div className="page-intro">
        <p className="eyebrow">Carte</p>
        <h2>Carte des biens</h2>
        <p>Localisation approximative de nos biens dans le Grand Tunis.</p>
      </div>

      <div className="map-layout">
        <div className="map-container">
          <iframe
            key={selectedProperty?.reference}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '28px' }}
            src={getMapEmbedUrl()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte des biens"
          />
          {selectedProperty && (
            <>
              <div
                className="map-selected-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/property/${selectedProperty.reference}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    navigate(`/property/${selectedProperty.reference}`)
                  }
                }}
              >
                <img src={selectedProperty.imageUrl} alt="" className="map-selected-image" />
                <div>
                  <strong>{selectedProperty.title}</strong>
                  <p className="selected-location">{selectedProperty.location}</p>
                </div>
                <div className="selected-price">{selectedProperty.price}</div>
              </div>
            </>
          )}
          <div className="map-open-link">
            <a
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir dans Google Maps
            </a>
          </div>
          <div className="map-markers-info">
            <p className="markers-legend">
              {mappedProperties.length} biens géolocalisés
            </p>
          </div>
        </div>

        <div className="properties-sidebar">
          <div className="sidebar-header">
            <h3>Biens disponibles</h3>
            <p className="sidebar-count">{properties.length} biens</p>
          </div>
          <div className="properties-list">
            {properties.map((property) => (
              <button
                key={property.reference}
                className={`property-list-item ${selectedProperty?.reference === property.reference ? 'active' : ''}`}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="property-list-image">
                  <img src={property.imageUrl} alt={property.title} />
                </div>
                <div className="property-list-content">
                  <p className="property-list-label">{property.type} · {property.location}</p>
                  <h4>{property.title}</h4>
                  <p className="property-list-price">{property.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
