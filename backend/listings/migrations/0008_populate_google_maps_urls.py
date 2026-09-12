from urllib.parse import quote_plus

from django.db import migrations


def populate_missing_google_maps_urls(apps, schema_editor):
    Property = apps.get_model("listings", "Property")

    for property_obj in Property.objects.filter(google_maps_url__isnull=True) | Property.objects.filter(google_maps_url=""):
        location = (property_obj.location or "").strip()
        if location:
            property_obj.google_maps_url = (
                "https://www.google.com/maps/search/?api=1&query="
                f"{quote_plus(location + ', Tunis, Tunisia')}"
            )
            property_obj.save(update_fields=["google_maps_url"])


class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0007_property_google_maps_url"),
    ]

    operations = [
        migrations.RunPython(
            populate_missing_google_maps_urls,
            migrations.RunPython.noop,
        ),
    ]
