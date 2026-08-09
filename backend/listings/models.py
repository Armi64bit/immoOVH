from django.db import models


class Property(models.Model):
    """A real-estate listing, matching the shape used by the React frontend."""

    TYPE_SALE = "À vendre"
    TYPE_RENT = "À louer"
    TYPE_CHOICES = [
        (TYPE_SALE, "À vendre"),
        (TYPE_RENT, "À louer"),
    ]

    STATUS_AVAILABLE = "Disponible"
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, "Disponible"),
        ("Réservé", "Réservé"),
        ("Vendu", "Vendu"),
        ("Loué", "Loué"),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=16, choices=TYPE_CHOICES, default=TYPE_SALE)
    price = models.CharField(max_length=64)
    location = models.CharField(max_length=128)
    details = models.CharField(max_length=255, blank=True)
    reference = models.CharField(max_length=32, unique=True)
    image = models.ImageField(
        upload_to="properties/",
        blank=True,
        null=True,
        help_text="Uploaded image (stored on the Railway volume). Takes priority over image_url.",
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        help_text="External image URL, used when no file is uploaded.",
    )
    status = models.CharField(
        max_length=32, choices=STATUS_CHOICES, default=STATUS_AVAILABLE
    )

    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    area = models.PositiveIntegerField(null=True, blank=True, help_text="Surface area in m²")
    rooms = models.PositiveIntegerField(null=True, blank=True)
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)

    floor = models.CharField(max_length=64, blank=True)
    orientation = models.CharField(max_length=64, blank=True)
    years = models.CharField(max_length=64, blank=True)
    floor_type = models.CharField(max_length=64, blank=True)

    features = models.JSONField(default=list, blank=True)

    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Property"
        verbose_name_plural = "Properties"

    def __str__(self) -> str:
        return f"{self.reference} — {self.title}"
