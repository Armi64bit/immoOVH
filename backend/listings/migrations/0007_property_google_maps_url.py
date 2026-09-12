from django.db import migrations, models


def populate_google_maps_urls(apps, schema_editor):
    Property = apps.get_model("listings", "Property")

    for property_obj in Property.objects.all():
        if property_obj.lat is not None and property_obj.lng is not None:
            property_obj.google_maps_url = (
                "https://www.google.com/maps/search/?api=1&query="
                f"{property_obj.lat},{property_obj.lng}"
            )
            property_obj.save(update_fields=["google_maps_url"])


class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0006_populate_property_descriptions"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="google_maps_url",
            field=models.URLField(
                blank=True,
                max_length=500,
                verbose_name="Lien Google Maps",
                help_text="Collez le lien Google Maps vers l'emplacement du bien.",
            ),
        ),
        migrations.RunPython(populate_google_maps_urls, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="property",
            name="lat",
        ),
        migrations.RemoveField(
            model_name="property",
            name="lng",
        ),
    ]
