from django.core.management.base import BaseCommand

from listings.models import Property

LOCATIONS = [
    "El Menzah 9",
    "El Menzah 6",
    "Menzah 7",
    "Menzah 8",
    "Menzah 1",
    "Menzah 5",
    "Ennasr 1",
    "Ennasr 2",
    "Jardins d'El Menzah 1",
    "Jardins d'El Menzah 2",
    "Mutuelleville",
    "Centre Urbain Nord",
    "Notre Dame",
    "Les Berges du Lac 1",
    "Les Berges du Lac 2",
    "La Marsa",
    "Carthage",
    "La Soukra",
    "L'Aouina",
    "Tunis (Centre)",
    "Ariana Medina",
    "Nouvelle Ariana",
    "Ghazala",
    "Riadh Andalous",
    "Ariana Supérieur",
]

PROPERTY_TYPES = [
    "Appartement",
    "Villa / Maison",
    "Duplex / Triplex",
    "Rez-de-chaussée",
    "Studio",
    "Bureau / Espace professionnel",
    "Local commercial",
    "Terrain",
]

PROPERTY_DETAILS = {
    "Appartement": ("120 m² · S+3", 120, 4, 3, 2),
    "Villa / Maison": ("320 m² · S+4", 320, 6, 4, 3),
    "Duplex / Triplex": ("240 m² · S+4", 240, 6, 4, 3),
    "Rez-de-chaussée": ("150 m² · S+3", 150, 4, 3, 2),
    "Studio": ("55 m² · S+1", 55, 2, 1, 1),
    "Bureau / Espace professionnel": ("95 m² · Open space", 95, 0, 0, 1),
    "Local commercial": ("110 m² · Local commercial", 110, 0, 0, 1),
    "Terrain": ("500 m² · Terrain constructible", 500, 0, 0, 0),
}


class Command(BaseCommand):
    help = "Seed one pictured property for each requested Tunisian location."

    def handle(self, *args, **options):
        created, updated = 0, 0

        for index, location in enumerate(LOCATIONS, start=1):
            property_type = PROPERTY_TYPES[(index - 1) % len(PROPERTY_TYPES)]
            details, area, rooms, bedrooms, bathrooms = PROPERTY_DETAILS[property_type]
            reference = f"TN-CAT-{index:03d}"
            listing_type = "À louer" if index % 3 == 0 else "À vendre"
            price = "2 500 TND / mois" if listing_type == "À louer" else "450 000 TND"

            defaults = {
                "title": f"{property_type} à {location}",
                "type": listing_type,
                "property_type": property_type,
                "price": price,
                "location": location,
                "details": details,
                "image_url": f"https://picsum.photos/seed/{reference}/1200/800",
                "status": "Disponible",
                "area": area,
                "rooms": rooms,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "floor": "Terrain" if property_type == "Terrain" else "Rez-de-chaussée",
                "orientation": "Sud-Est",
                "years": "Moins d'un an",
                "floor_type": "Carrelage",
                "features": ["Climatisation", "Parking"],
                "is_published": True,
            }

            _, was_created = Property.objects.update_or_create(
                reference=reference,
                defaults=defaults,
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Done: {created} created, {updated} updated. "
                f"Total properties: {Property.objects.count()}."
            )
        )
