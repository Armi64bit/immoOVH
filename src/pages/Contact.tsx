import { useState } from 'react'
import { submitContact } from '../api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      await submitContact(formData)
      setStatus({ ok: true, text: 'Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.' })
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setSubmitting(false)
    }
  }

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

      <form className="form-card contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Nom et prénom *
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom" required />
          </label>
          <label>
            Téléphone *
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+216 XX XXX XXX" required />
          </label>
        </div>

        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Votre email" />
        </label>

        <label>
          Sujet
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Sujet de votre message" />
        </label>

        <label>
          Message *
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Votre message" rows={6} required />
        </label>

        {status && (
          <p className={`form-status ${status.ok ? 'form-status-ok' : 'form-status-error'}`}>{status.text}</p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'ENVOI EN COURS…' : 'Envoyer'}
        </button>
      </form>
    </section>
  )
}
