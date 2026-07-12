import { useState } from 'react'

export default function Recrutement() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('Agent(e) Immobilier')
  const [message, setMessage] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    setCvFile(f || null)
  }

  const validate = () => {
    if (!firstName || !lastName || !email || !phone) return 'Veuillez remplir les champs obligatoires.'
    if (!consent) return 'Vous devez accepter le traitement des données (RGPD).'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) {
      setError(v)
      return
    }

    setSubmitting(true)

    try {
      // Build form data (suitable for a real backend endpoint)
      const form = new FormData()
      form.append('firstName', firstName)
      form.append('lastName', lastName)
      form.append('phone', phone)
      form.append('email', email)
      form.append('position', position)
      form.append('message', message)
      form.append('consent', consent ? 'yes' : 'no')
      if (cvFile) form.append('cv', cvFile)

      // NOTE: replace '/api/recrutement' with your real server endpoint.
      // For now we simulate success since there is no backend in this repo.
      await new Promise((res) => setTimeout(res, 800))

      setSuccess(true)
      // Optionally clear form
      setFirstName('')
      setLastName('')
      setPhone('')
      setEmail('')
      setMessage('')
      setCvFile(null)
      setConsent(false)
    } catch (err) {
      setError('Erreur lors de l envoi. Réessayez plus tard.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-panel">
      <div className="zone-header">
        <h1>Rejoignez IMMO CONNECT</h1>
        <p>Vous êtes passionné par l'immobilier ? Nous sommes toujours à la recherche de nouveaux talents pour agrandir notre équipe.</p>
      </div>

      {success ? (
        <div className="form-success">
          <h3>Votre candidature a été envoyée avec succès !</h3>
          <p>Nous avons bien reçu votre candidature et notre équipe vous contactera sous peu.</p>
        </div>
      ) : (
        <form className="form-card contact-form" onSubmit={handleSubmit} encType="multipart/form-data">
          {error && <div style={{ color: '#f55', marginBottom: '0.75rem' }}>{error}</div>}

          <div className="form-row">
            <label className="form-group">
              Prénom*
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label className="form-group">
              Nom*
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
          </div>

          <div className="form-row" style={{ marginTop: '0.5rem' }}>
            <label className="form-group">
              Numéro de téléphone*
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="form-group">
              Adresse E-mail*
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>

          <label className="form-group" style={{ marginTop: '0.75rem' }}>
            Poste souhaité
            <select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option>Agent(e) Immobilier</option>
              <option>Assistant(e) Administratif(ve)</option>
              <option>Candidature Spontanée</option>
            </select>
          </label>

          <label className="form-group" style={{ marginTop: '0.75rem' }}>
            Joindre un CV
            <input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} />
            {cvFile && <div style={{ marginTop: '0.5rem' }}>{cvFile.name}</div>}
          </label>

          <label className="form-group" style={{ marginTop: '0.75rem' }}>
            Message
            <textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>

          <label className="checkbox-row" style={{ marginTop: '0.75rem' }}>
            <input className="checkbox-input" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>J'accepte que mes données soient traitées dans le cadre de ma candidature.</span>
          </label>

          <div style={{ marginTop: '0.75rem' }}>
            {/* reCAPTCHA placeholder: integrate real reCAPTCHA on server/client as needed */}
            <div style={{ opacity: 0.9, padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <small>reCAPTCHA placeholder (intégrer Google reCAPTCHA côté client)</small>
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Envoi…' : 'Envoyer ma candidature'}</button>
            <button type="button" className="btn" onClick={() => { setFirstName(''); setLastName(''); setPhone(''); setEmail(''); setMessage(''); setCvFile(null); setConsent(false); }}>Réinitialiser</button>
          </div>
        </form>
      )}
    </section>
  )
}
