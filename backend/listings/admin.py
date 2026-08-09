from django.contrib import admin
from django.utils.html import format_html

from .models import ContactMessage, EstimationRequest, Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        "image_preview",
        "reference",
        "title",
        "type",
        "price",
        "location",
        "status",
        "is_published",
        "updated_at",
    ]
    list_display_links = ["reference", "title"]
    list_filter = ["type", "status", "is_published", "location"]
    search_fields = ["reference", "title", "location", "price"]
    list_editable = ["status", "is_published"]
    list_per_page = 25
    ordering = ["-updated_at"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        (
            "Informations principales",
            {
                "fields": ("title", "type", "price", "location", "details", "reference", "status"),
                "description": "Les informations affichées sur la fiche du bien sur le site.",
            },
        ),
        (
            "Photo et publication",
            {
                "fields": ("image", "image_url", "is_published"),
                "description": "Importez une photo ou indiquez une URL externe. Décochez « Publié » pour masquer le bien du site.",
            },
        ),
        (
            "Détails du bien",
            {
                "fields": (
                    "area",
                    "rooms",
                    "bedrooms",
                    "bathrooms",
                    "floor",
                    "orientation",
                    "years",
                    "floor_type",
                    "features",
                )
            },
        ),
        (
            "Position GPS",
            {"fields": ("lat", "lng"), "classes": ("collapse",)},
        ),
        (
            "Dates",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    actions = ["publish_properties", "unpublish_properties"]

    @admin.display(description="Photo")
    def image_preview(self, obj):
        url = obj.image.url if obj.image else obj.image_url
        if not url:
            return "—"
        return format_html(
            '<img src="{}" style="max-height:50px;max-width:70px;border-radius:4px;object-fit:cover;" alt=""/>',
            url,
        )

    @admin.action(description="Publier les biens sélectionnés")
    def publish_properties(self, request, queryset):
        queryset.update(is_published=True)
        self.message_user(request, "Biens publiés sur le site.")

    @admin.action(description="Dépublier les biens sélectionnés")
    def unpublish_properties(self, request, queryset):
        queryset.update(is_published=False)
        self.message_user(request, "Biens dépubliés du site.")


admin.site.site_header = "Administration ImmoConnect"
admin.site.site_title = "ImmoConnect Admin"
admin.site.index_title = "Gestion des biens immobiliers"


@admin.register(EstimationRequest)
class EstimationRequestAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "phone",
        "email",
        "zone",
        "property_type",
        "transaction",
        "surface",
        "known_from",
        "created_at",
    ]
    list_filter = ["transaction", "property_type", "zone", "known_from"]
    search_fields = ["name", "phone", "email", "zone", "comments"]
    list_per_page = 25
    ordering = ["-created_at"]
    date_hierarchy = "created_at"
    readonly_fields = ["created_at"]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "phone", "email", "subject", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["name", "phone", "email", "subject", "message"]
    list_per_page = 25
    ordering = ["-created_at"]
    date_hierarchy = "created_at"
    readonly_fields = ["created_at"]
