from django.db import models

import re


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

    title = models.CharField(max_length=255, verbose_name="Titre")
    type = models.CharField(
        max_length=16,
        choices=TYPE_CHOICES,
        default=TYPE_SALE,
        verbose_name="Type",
        help_text="À vendre ou à louer.",
    )
    price = models.CharField(
        max_length=64,
        verbose_name="Prix",
        help_text="Ex. : 580 000 TND ou 2 400 TND / mois",
    )
    location = models.CharField(max_length=128, verbose_name="Localisation")
    details = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Détails",
        help_text="Ex. : 165 m² · S+3",
    )
    reference = models.CharField(max_length=32, unique=True, verbose_name="Référence")
    image = models.ImageField(
        upload_to="properties/",
        blank=True,
        null=True,
        verbose_name="Photo (fichier)",
        help_text="Photo importée (stockée sur le volume Railway). Prioritaire sur l'URL.",
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        verbose_name="Photo (URL externe)",
        help_text="Utilisée uniquement si aucune photo n'est importée.",
    )
    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default=STATUS_AVAILABLE,
        verbose_name="Statut",
    )

    lat = models.FloatField(null=True, blank=True, verbose_name="Latitude")
    lng = models.FloatField(null=True, blank=True, verbose_name="Longitude")
    area = models.PositiveIntegerField(
        null=True, blank=True, verbose_name="Surface (m²)"
    )
    rooms = models.PositiveIntegerField(null=True, blank=True, verbose_name="Pièces")
    bedrooms = models.PositiveIntegerField(null=True, blank=True, verbose_name="Chambres")
    bathrooms = models.PositiveIntegerField(null=True, blank=True, verbose_name="Salles de bain")

    floor = models.CharField(max_length=64, blank=True, verbose_name="Étage")
    orientation = models.CharField(max_length=64, blank=True, verbose_name="Orientation")
    years = models.CharField(max_length=64, blank=True, verbose_name="Âge du bien")
    floor_type = models.CharField(max_length=64, blank=True, verbose_name="Revêtement")

    features = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Équipements",
        help_text="Liste d'équipements, ex. : Piscine, Garage, Jardin",
    )

    is_published = models.BooleanField(default=True, verbose_name="Publié sur le site")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Bien immobilier"
        verbose_name_plural = "Biens immobiliers"

    def __str__(self) -> str:
        return f"{self.reference} — {self.title}"

    @property
    def price_sort_value(self) -> int:
        """Numeric value of the price string, used to sort by price."""
        digits = re.sub(r"\D", "", self.price)
        return int(digits) if digits else 0

    @property
    def image_display_url(self) -> str:
        """URL of the uploaded file, falling back to the external URL."""
        return self.image.url if self.image else self.image_url


class EstimationRequest(models.Model):
    """Demande envoyée via le formulaire « Estimer mon bien »."""

    TRANSACTION_CHOICES = [
        ("Vente", "Vente"),
        ("Location", "Location"),
    ]
    PROPERTY_TYPE_CHOICES = [
        ("villa", "Villa"),
        ("appartement", "Appartement"),
        ("terrain", "Terrain"),
        ("riad", "Riad"),
    ]
    KNOWN_FROM_CHOICES = [
        ("search", "Moteur de recherche"),
        ("social", "Réseaux sociaux"),
        ("referral", "Recommandation"),
        ("other", "Autre"),
    ]

    name = models.CharField(max_length=128, verbose_name="Nom et prénom")
    phone = models.CharField(max_length=32, verbose_name="Téléphone")
    email = models.EmailField(blank=True, verbose_name="Email")
    zone = models.CharField(max_length=128, verbose_name="Zone / quartier")
    property_type = models.CharField(
        max_length=32,
        choices=PROPERTY_TYPE_CHOICES,
        blank=True,
        verbose_name="Type de bien",
    )
    transaction = models.CharField(
        max_length=16,
        choices=TRANSACTION_CHOICES,
        default="Vente",
        verbose_name="Transaction",
    )
    surface = models.CharField(max_length=32, blank=True, verbose_name="Surface (m²)")
    known_from = models.CharField(
        max_length=32,
        choices=KNOWN_FROM_CHOICES,
        blank=True,
        verbose_name="Comment nous avez-vous connus ?",
    )
    comments = models.TextField(blank=True, verbose_name="Commentaires")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Reçu le")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Demande d'estimation"
        verbose_name_plural = "Demandes d'estimation"

    def __str__(self) -> str:
        return f"{self.name} — {self.zone} ({self.created_at:%d/%m/%Y})"


class ContactMessage(models.Model):
    """Message envoyé via le formulaire de contact."""

    name = models.CharField(max_length=128, verbose_name="Nom et prénom")
    phone = models.CharField(max_length=32, verbose_name="Téléphone")
    email = models.EmailField(blank=True, verbose_name="Email")
    subject = models.CharField(max_length=255, blank=True, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Reçu le")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"

    def __str__(self) -> str:
        return f"{self.name} — {self.subject or self.message[:40]}"
