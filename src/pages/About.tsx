import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">ImmoConnect · Grand Tunis</p>
          <h1>Des lieux choisis avec intention.</h1>
          <p>Nous rapprochons les personnes des adresses qui correspondent vraiment à leur manière de vivre, d'investir et de grandir.</p>
          <div className="about-hero-actions">
            <Link to="/Vente" className="btn btn-primary">Découvrir nos biens</Link>
            <Link to="/Contact" className="about-text-link">Parler à notre équipe <span>↗</span></Link>
          </div>
        </div>
        <div className="about-hero-image">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85" alt="Intérieur lumineux d'une propriété sélectionnée par ImmoConnect" />
          <div className="about-image-caption">
            <span>01</span>
            <span>Une autre façon d'habiter</span>
          </div>
        </div>
      </div>

      <div className="about-introduction">
        <p className="eyebrow">Notre signature</p>
        <h2>L'immobilier avec plus de clarté, de présence et de justesse.</h2>
        <p>De La Marsa à El Menzah, nous connaissons les rythmes, les détails et les opportunités qui donnent leur valeur aux quartiers du Grand Tunis.</p>
      </div>

      <div className="about-stats" aria-label="Quelques chiffres sur ImmoConnect">
        <div><strong>Grand Tunis</strong><span>Notre terrain de jeu</span></div>
        <div><strong>24h</strong><span>Pour une première réponse</span></div>
        <div><strong>360°</strong><span>Un accompagnement complet</span></div>
      </div>

      <div className="about-principles">
        <div className="about-principles-heading">
          <p className="eyebrow">Ce qui nous guide</p>
          <h2>Une relation durable commence par une attention sincère.</h2>
        </div>
        <div className="about-principles-list">
          <article className="about-principle">
            <span>01</span>
            <div><h3>Connaissance locale</h3><p>Des conseils ancrés dans la réalité des quartiers, des prix et des usages.</p></div>
          </article>
          <article className="about-principle">
            <span>02</span>
            <div><h3>Présentation juste</h3><p>Chaque bien mérite des images, des mots et une mise en scène à sa hauteur.</p></div>
          </article>
          <article className="about-principle">
            <span>03</span>
            <div><h3>Présence réelle</h3><p>Une équipe disponible, transparente et impliquée jusqu'à la dernière signature.</p></div>
          </article>
        </div>
      </div>

      <div className="about-office">
        <div>
          <p className="eyebrow">Venez nous rencontrer</p>
          <h2>Centre X, El Menzah 9, Tunis</h2>
        </div>
        <Link to="/Contact" className="btn btn-primary">Nous contacter</Link>
      </div>
    </section>
  )
}
