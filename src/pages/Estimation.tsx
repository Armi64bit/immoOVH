import { useState } from 'react'

export default function Estimation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zone: '',
    propertyType: '',
    transaction: 'Vente',
    surface: '',
    knownFrom: '',
    comments: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
  }

  return (
    <section className="page-panel">
      <div className="page-intro">
        <p className="eyebrow">Estimation</p>
        <h2>Demande d'estimation</h2>
        <p>Remplissez ce formulaire et notre équipe vous contactera sous 48h ouvrées avec une estimation indicative.</p>
      </div>

      <form className="form-card estimation-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>NOM ET PRÉNOM *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=""
              required
            />
          </div>
          <div className="form-group">
            <label>TÉLÉPHONE * (+216 XX XXX XXX)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+216"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="form-group">
            <label>ZONE / QUARTIER *</label>
            <select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              required
            >
              <option value="">—</option>
              <option value="tunis">Tunis (centre)</option>
              <option value="marsa">La Marsa</option>
              <option value="carthage">Carthage</option>
              <option value="lac">Lac</option>
              <option value="ariana">Ariana</option>
              <option value="menzah">Menzah</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>TYPE DE BIEN *</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
            >
              <option value="">—</option>
              <option value="villa">Villa</option>
              <option value="appartement">Appartement</option>
              <option value="terrain">Terrain</option>
              <option value="riad">Riad</option>
            </select>
          </div>
          <div className="form-group">
            <label>TRANSACTION SOUHAITÉE *</label>
            <select
              name="transaction"
              value={formData.transaction}
              onChange={handleChange}
              required
            >
              <option value="Vente">Vente</option>
              <option value="Location">Location</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>SURFACE APPROXIMATIVE (M²)</label>
            <input
              type="number"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="form-group">
            <label>COMMENT NOUS AVEZ-VOUS CONNUS ? *</label>
            <select
              name="knownFrom"
              value={formData.knownFrom}
              onChange={handleChange}
              required
            >
              <option value="">—</option>
              <option value="search">Moteur de recherche</option>
              <option value="social">Réseaux sociaux</option>
              <option value="referral">Recommandation</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        <div className="form-full">
          <label>COMMENTAIRES</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder=""
            rows={6}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          ENVOYER
        </button>
      </form>
    </section>
  )
}
