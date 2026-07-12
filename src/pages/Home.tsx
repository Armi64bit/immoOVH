import { Link } from 'react-router-dom'
import type { PropertyItem } from '../types'

type Props = {
  featuredProperties: PropertyItem[]
  zones: string[]
  onNavigate: (page: 'vente' | 'location' | 'estimation') => void
}

export default function Home({ featuredProperties, zones, onNavigate }: Props) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-eyebrow">Agence immobilière · Grand Tunis</p>
              <h1>L'immobilier autrement.</h1>
              <p className="hero-intro">Une sélection rigoureuse de biens à la vente et à la location dans les plus beaux quartiers du Grand Tunis.</p>
              <div className="hero-actions">
        <button type="button" className="header-cta" onClick={() => onNavigate('estimation')}>
          Estimer mon bien
        </button>
                <button type="button" className="btn btn-primary" onClick={() => onNavigate('vente')}>Vente</button>
                <button type="button" className="btn btn-secondary" onClick={() => onNavigate('location')}>Location</button>
              </div>
            </div>
            <div className="hero-summary">
              <div className="hero-card">
                <strong>Élégance & performance</strong>
                <p>Un accompagnement haut de gamme, des présentations soignées, des transactions optimisées.</p>
              </div>
              <div className="hero-stats">
                <div>
                  <span>120+</span>
                  <p>Biens premium</p>
                </div>
                <div>
                  <span>24h</span>
                  <p>Réponse garantie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      <section className="section-block">
        <div className="section-heading section-heading-space">
          <div>
            <p className="eyebrow">Biens en vedette</p>
            <h2>Des biens sélectionnés pour des projets ambitieux.</h2>
          </div>
          <button type="button" className="link-button" onClick={() => onNavigate('vente')}>
            Voir toutes les annonces →
          </button>
        </div>
        <div className="card-grid">
          {featuredProperties.map((property) => (
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

      <section className="section-block section-zones">
        <div className="zone-header">
          <div>
            <p className="eyebrow">Nos zones</p>
            <h2>Nous couvrons l'ensemble du Grand Tunis.</h2>
            <p>Expertise locale sur les quartiers les plus recherchés.</p>
          </div>
        </div>
        <div  className="tag-list">
          {zones.map((zone) => (
            <button key={zone} type="button" className="zone-chip">
              {zone}
            </button>
          ))}
        </div>
      </section>

      <section className="estimation-banner">
        <div>
          <p className="eyebrow">Estimation</p>
          <h2>Quelle est la valeur de votre bien ?</h2>
          <p>Recevez une estimation indicative gratuite, réalisée par notre équipe.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('estimation')}>
          Estimer mon bien
        </button>
      </section>
    </>
  )
}
