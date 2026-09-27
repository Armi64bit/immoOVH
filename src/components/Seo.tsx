import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useProperties } from '../PropertiesContext'

const SITE_ORIGIN = 'https://www.immoconnect.tn'
const DEFAULT_TITLE = 'Agence immobilière en Tunisie | ImmoConnect'
const DEFAULT_DESCRIPTION = 'Découvrez des biens immobiliers à vendre et à louer en Tunisie avec ImmoConnect.'

const pages: Record<string, { path: string; title: string; description: string }> = {
  '/': {
    path: '/',
    title: DEFAULT_TITLE,
    description: 'Trouvez votre prochain bien immobilier en Tunisie. Villas, appartements et locations sélectionnés par ImmoConnect.',
  },
  '/vente': {
    path: '/vente',
    title: 'Biens immobiliers à vendre en Tunisie | ImmoConnect',
    description: 'Consultez les biens immobiliers à vendre en Tunisie : appartements, villas, maisons et terrains sélectionnés par ImmoConnect.',
  },
  '/location': {
    path: '/location',
    title: 'Biens immobiliers à louer en Tunisie | ImmoConnect',
    description: 'Découvrez des appartements, maisons et autres biens immobiliers à louer en Tunisie avec ImmoConnect.',
  },
  '/carte': {
    path: '/carte',
    title: 'Carte des biens immobiliers en Tunisie | ImmoConnect',
    description: 'Explorez sur la carte les biens immobiliers proposés à la vente et à la location en Tunisie.',
  },
  '/estimation': {
    path: '/estimation',
    title: 'Estimation immobilière en Tunisie | ImmoConnect',
    description: 'Demandez une estimation de votre bien immobilier en Tunisie auprès de l’équipe ImmoConnect.',
  },
  '/a-propos': {
    path: '/a-propos',
    title: 'À propos d’ImmoConnect | Immobilier en Tunisie',
    description: 'Découvrez ImmoConnect, votre partenaire pour acheter, vendre ou louer un bien immobilier en Tunisie.',
  },
  '/recrutement': {
    path: '/recrutement',
    title: 'Recrutement immobilier en Tunisie | ImmoConnect',
    description: 'Découvrez les opportunités professionnelles et rejoignez l’équipe ImmoConnect en Tunisie.',
  },
  '/contact': {
    path: '/contact',
    title: 'Contacter ImmoConnect | Immobilier en Tunisie',
    description: 'Contactez ImmoConnect pour vos projets immobiliers de vente, de location ou d’estimation en Tunisie.',
  },
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

function cleanDescription(value: string) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  return normalized.length > 160 ? `${normalized.slice(0, 157).trimEnd()}...` : normalized
}

export default function Seo() {
  const { pathname } = useLocation()
  const { properties } = useProperties()

  useEffect(() => {
    const normalizedPath = pathname.toLowerCase()
    const staticPage = pages[normalizedPath]
    const propertyId = normalizedPath.startsWith('/property/')
      ? decodeURIComponent(pathname.split('/')[2] ?? '')
      : ''
    const property = propertyId
      ? properties.find((item) => item.reference.toLowerCase() === propertyId.toLowerCase())
      : undefined

    const title = property
      ? `${property.title} ${property.type.toLowerCase()} à ${property.location} | ImmoConnect`
      : staticPage?.title ?? DEFAULT_TITLE
    const description = property
      ? cleanDescription(`${property.description?.trim() || property.details} ${property.location} · ${property.price}.`)
      : staticPage?.description ?? DEFAULT_DESCRIPTION
    const canonicalPath = property
      ? `/property/${encodeURIComponent(property.reference)}`
      : staticPage?.path
    const canonicalUrl = canonicalPath ? `${SITE_ORIGIN}${canonicalPath}` : ''
    const imageUrl = property?.imageUrl || `${SITE_ORIGIN}/logod.png`
    const isIndexable = Boolean(staticPage || property)

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', isIndexable ? 'index, follow' : 'noindex, follow')
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'ImmoConnect')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:locale', 'fr_TN')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonicalPath) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.append(canonical)
      }
      canonical.href = canonicalUrl
      setMeta('property', 'og:url', canonicalUrl)
    } else {
      canonical?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }
  }, [pathname, properties])

  return null
}