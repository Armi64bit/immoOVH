import type { PropertyItem } from './types'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://tender-determination-production.up.railway.app'

type ApiProperty = {
  id: number
  title: string
  type: string
  price: string
  location: string
  details: string
  reference: string
  image_display_url: string
  status: string
  lat: number | null
  lng: number | null
  area: number | null
  rooms: number | null
  bedrooms: number | null
  bathrooms: number | null
  floor: string
  orientation: string
  years: string
  floor_type: string
  features: string[]
}

type ApiListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: ApiProperty[]
}

function mapApiProperty(p: ApiProperty): PropertyItem {
  return {
    title: p.title,
    type: p.type,
    price: p.price,
    location: p.location,
    details: p.details,
    reference: p.reference,
    imageUrl: p.image_display_url,
    status: p.status,
    lat: p.lat ?? undefined,
    lng: p.lng ?? undefined,
    area: p.area ?? undefined,
    rooms: p.rooms ?? undefined,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    floor: p.floor || undefined,
    orientation: p.orientation || undefined,
    years: p.years || undefined,
    floorType: p.floor_type || undefined,
    features: p.features ?? [],
  }
}

export async function fetchProperties(): Promise<PropertyItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/properties/`)
  if (!response.ok) {
    throw new Error(`Erreur API (${response.status})`)
  }
  const data: unknown = await response.json()

  if (Array.isArray(data)) {
    return data.map((item) => mapApiProperty(item as ApiProperty))
  }

  const list = data as ApiListResponse
  if (Array.isArray(list.results)) {
    return list.results.map((item) => mapApiProperty(item))
  }

  throw new Error('Réponse API invalide')
}

export type EstimationSubmission = {
  name: string
  phone: string
  email: string
  zone: string
  propertyType: string
  transaction: string
  surface: string
  knownFrom: string
  comments: string
}

export type ContactSubmission = {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

async function postJson(url: string, body: unknown): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`Erreur API (${response.status})`)
  }
}

export async function submitEstimation(data: EstimationSubmission): Promise<void> {
  await postJson('/api/estimations/', {
    name: data.name,
    phone: data.phone,
    email: data.email,
    zone: data.zone,
    property_type: data.propertyType,
    transaction: data.transaction,
    surface: data.surface,
    known_from: data.knownFrom,
    comments: data.comments,
  })
}

export async function submitContact(data: ContactSubmission): Promise<void> {
  await postJson('/api/contacts/', {
    name: data.name,
    phone: data.phone,
    email: data.email,
    subject: data.subject,
    message: data.message,
  })
}
