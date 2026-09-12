from django.db import migrations, models


def seed_existing_descriptions(apps, schema_editor):
    Property = apps.get_model("listings", "Property")

    for property_obj in Property.objects.filter(description=""):
        summary = property_obj.details or "Bien immobilier soigneusement sélectionné"
        property_obj.description = (
            f"{property_obj.title} est situé à {property_obj.location}. "
            f"Ce bien propose {summary}. "
            "Notre équipe ImmoConnect reste à votre disposition pour vous présenter "
            "ses caractéristiques et organiser une visite."
        )
        property_obj.save(update_fields=["description"])


def remove_seeded_descriptions(apps, schema_editor):
    Property = apps.get_model("listings", "Property")
    Property.objects.update(description="")


class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0004_merge_property_type_and_forms"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="description",
            field=models.TextField(
                blank=True,
                help_text="Description complète affichée dans la section « À propos de ce bien ».",
                verbose_name="À propos du bien",
            ),
        ),
        migrations.RunPython(seed_existing_descriptions, remove_seeded_descriptions),
    ]
