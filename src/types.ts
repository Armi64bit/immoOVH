export type PageKey = 'accueil' | 'vente' | 'location' | 'carte' | 'estimation' | 'a-propos' | 'contact' | 'recrutement'

export type NavItem = {
  key: PageKey
  label: string
}

export type PropertyItem = {
  title: string
  type: string
  propertyType: string
  price: string
  location: string
  details: string
  description?: string
  reference: string
  imageUrl: string
  status: string
  lat?: number
  lng?: number
  area?: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  floor?: string | number
  orientation?: string
  years?: string
  condition?: string
  floorType?: string
  features?: string[]
}
