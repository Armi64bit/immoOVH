export default function Contact() {
  return (
    <section className="page-panel contact-grid">
      <div className="contact-info">
        <h1 className="eyebrow">Contact</h1>
        <p className="contact-copy">Notre équipe est à votre écoute du lundi au samedi.</p>
        <div className="office-card">
          <h3>Notre bureau</h3>
          <p>Bureau 25, Centre X, Menzah 9, Tunis 1013</p>
          <a href="mailto:contact@immoconnect.tn">contact@immoconnect.tn</a>
          <a href="tel:+21622132278">+216 22 13 22 78</a>

          <div className="social-links">
            <a href="https://facebook.com/immoconnect" target="_blank" rel="noopener noreferrer" className="social-link">
              Facebook
            </a>
            <a href="https://instagram.com/immoconnect" target="_blank" rel="noopener noreferrer" className="social-link">
              Instagram
            </a>
          </div>
        </div>

        <div className="map-preview" style={{ margin: '.5rem' }}>
          <iframe
            title="Localisation Immo Connect"
            src="https://www.google.com/maps?q=Centre+X,+Menzah+9,+Tunis+1013&output=embed"
            loading="lazy"
          />
        </div>
      </div>

      <form className="form-card contact-form">
        <div className="form-row">
          <label>
            Nom et prénom *
            <input type="text" placeholder="Votre nom" required />
          </label>
          <label>
            Téléphone *
            <input type="tel" placeholder="+216 XX XXX XXX" required />
          </label>
        </div>

        <label>
          Email
          <input type="email" placeholder="Votre email" />
        </label>

        <label>
          Sujet
          <input type="text" placeholder="Sujet de votre message" />
        </label>

        <label>
          Message *
          <textarea placeholder="Votre message" rows={6} required />
        </label>

        <button type="submit">Envoyer</button>
      </form>
    </section>
  )
}
