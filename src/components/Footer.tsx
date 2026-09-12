import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="main-footer">
      <div>
        <h3>ImmoConnect</h3>
        <p>Luxury real estate, made trustworthy.</p>
      </div>
      <div>
        <h4>Liens utiles</h4>
        <Link to="/Vente">Vente</Link>
        <Link to="/Location">Location</Link>
        <Link to="/A-propos">À propos</Link>
        <Link to="/Contact">Contact</Link>
        <Link to="/Recrutement">Recrutement</Link>
      </div>
      <div>
        <h4>Coordonnées</h4>
        <p>Centre X, El Menzah 9, Tunis</p>
        <p>+216 71 000 000</p>
        <p>contact@immoconnect.tn</p>
        <p>recrutement@immoconnect.tn</p>
      </div>
    </footer>
  )
}
