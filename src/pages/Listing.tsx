import type { PropertyItem } from '../types'
import PropertyListings from '../components/PropertyListings'

type Props = {
  title: string
  subtitle: string
  properties: PropertyItem[]
}

export default function Listing({ title, subtitle, properties }: Props) {
  return <PropertyListings title={title} subtitle={subtitle} properties={properties} />
}
