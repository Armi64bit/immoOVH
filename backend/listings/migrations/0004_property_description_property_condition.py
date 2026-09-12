from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0003_property_property_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="description",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="property",
            name="condition",
            field=models.CharField(blank=True, max_length=128),
        ),
    ]
