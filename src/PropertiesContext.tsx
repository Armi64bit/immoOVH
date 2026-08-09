import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchProperties } from './api'
import type { PropertyItem } from './types'

type PropertiesState = {
  properties: PropertyItem[]
  loading: boolean
  error: string | null
  vente: PropertyItem[]
  location: PropertyItem[]
}

const PropertiesContext = createContext<PropertiesState>({
  properties: [],
  loading: true,
  error: null,
  vente: [],
  location: [],
})

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchProperties()
      .then((data) => {
        if (!cancelled) {
          setProperties(data)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Impossible de charger les biens')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<PropertiesState>(() => {
    const vente = properties.filter((p) => p.type === 'À vendre')
    const location = properties.filter((p) => p.type === 'À louer')
    return { properties, loading, error, vente, location }
  }, [properties, loading, error])

  return <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProperties() {
  return useContext(PropertiesContext)
}
