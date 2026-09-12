from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0002_property_image_alter_property_image_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="property_type",
            field=models.CharField(
                choices=[
                    ("Appartement", "Appartement"),
                    ("Villa / Maison", "Villa / Maison"),
                    ("Duplex / Triplex", "Duplex / Triplex"),
                    ("Rez-de-chaussée", "Rez-de-chaussée"),
                    ("Studio", "Studio"),
                    (
                        "Bureau / Espace professionnel",
                        "Bureau / Espace professionnel",
                    ),
                    ("Local commercial", "Local commercial"),
                    ("Terrain", "Terrain"),
                ],
                default="Appartement",
                max_length=64,
            ),
        ),
    ]
