import { useParams, useNavigate } from 'react-router-dom'
import { featuredProperties, whatsappNumbers } from '../data/siteData'
import FloatingActions from '../components/FloatingActions'

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const property = featuredProperties.find((p) => p.reference === id)

  if (!property) {
    return (
      <section className="page-panel">
        <div className="page-intro">
          <h2>Propriété non trouvée</h2>
          <p>Cette propriété n'existe pas.</p>
          <button onClick={() => navigate('/Vente')} className="btn btn-primary">
            Retourner aux annonces
          </button>
        </div>
      </section>
    )
  }

  const getMapEmbedUrl = () => {
    if (property.lat && property.lng) {
      const { lat, lng } = property
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.123456789!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}%2C${lng}!5e0!3m2!1sfr!2stn!4v1234567890`
    }
    return ''
  }

  const whatsappNumber = whatsappNumbers[0].replace(/\D/g, '')

  return (
    <article className="page-panel property-detail">
      <div className="detail-breadcrumb">
        <button onClick={() => navigate('/Vente')} className="breadcrumb-btn">
          ← Toutes les annonces
        </button>
      </div>

      <header className="detail-header">
        <div className="detail-meta">
          <span className="meta-badge">{property.status}</span>
          <span className="meta-badge">·</span>
          <span className="meta-badge">{property.type}</span>
          <span className="meta-badge">·</span>
          <span className="meta-badge">{property.location}</span>
        </div>

        <div>
          <h1 className="detail-title">{property.title}</h1>
          <p className="detail-subtitle">Finitions soignées, résidence calme et sécurisée.</p>
        </div>

        <div className="detail-ref-price">
          <span className="detail-ref">RÉFÉRENCE {property.reference}</span>
          <span className="detail-price">{property.price}</span>
          <span className="detail-available">{property.status?.toUpperCase()}</span>
        </div>

        {/* <div className="icons-row">
          <div className="icon-item">
            <div className="icon">📐</div>
            <div className="label">{property.area ? `${property.area} m²` : 'N/A'}</div>
          </div>
          <div className="icon-item">
            <div className="icon">🏠</div>
            <div className="label">{property.rooms ?? '—'} Pièces</div>
          </div>
          <div className="icon-item">
            <div className="icon">🛏️</div>
            <div className="label">{property.bedrooms ?? '—'} Chambres</div>
          </div>
          <div className="icon-item">
            <div className="icon">🚿</div>
            <div className="label">{property.bathrooms ?? '—'} Salles de bains</div>
          </div>
        </div> */}
      </header>

      <div className="detail-layout">
        <div className="detail-main">
          <img src={property.imageUrl} alt={property.title} className="detail-image" />

          <section className="detail-section">
            <h2>À propos de ce bien</h2>
            <p>{property.details}</p>
          </section>

          <section className="detail-section">
            <h2>Emplacement</h2>
            <div className="map-embed">
              {getMapEmbedUrl() ? (
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen={true}
                  src={getMapEmbedUrl()}
                  title={`Carte de ${property.location}`}
                />
              ) : (
                <div className="map-fallback">Carte non disponible</div>
              )}
            </div>
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <div className="detail-specs">
              <div className="spec-item" >
                <span className="spec-label">Surface</span>
                <span className="spec-value">{property.area ? `${property.area} m²` : (() => { const match = property.details.match(/(\d+)\s*m²/); return match ? `${match[1]} m²` : 'N/A'})()}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Pièces</span>
                <span className="spec-value">{property.rooms ?? (property.details.includes('S+') ? property.details.split('·')[1]?.trim() : 'N/A')}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Salles de bain</span>
                <span className="spec-value">{property.bathrooms ?? 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Étage</span>
                <span className="spec-value">{property.floor ?? 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Orientation</span>
                <span className="spec-value">{property.orientation ?? 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Type du sol</span>
                <span className="spec-value">{property.floorType ?? 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Années</span>
                <span className="spec-value">{property.years ?? 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Caractéristiques</h3>
            <div className="characteristics-tags">
              {(property.features && property.features.length > 0) ? (
                property.features.map((f) => (
                  <span key={f} className="char-tag">{f}</span>
                ))
              ) : (
                <>
                  <span className="char-tag">Parking</span>
                  <span className="char-tag">Ascenseur</span>
                  <span className="char-tag">Climatisation</span>
                  <span className="char-tag">Terrasse</span>
                </>
              )}
            </div>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9(e)%20par%20le%20bien%20${encodeURIComponent(
              property.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            WhatsApp
          </a>

          <button className="btn btn-dark">Demander des informations</button>
        </aside>
      </div>

      <FloatingActions numbers={whatsappNumbers} />
    </article>
  )
}
