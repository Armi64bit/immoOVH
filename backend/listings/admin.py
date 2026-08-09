from django.contrib import admin

from .models import Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        "reference",
        "title",
        "type",
        "price",
        "location",
        "status",
        "is_published",
        "updated_at",
    ]
    list_filter = ["type", "status", "is_published", "location"]
    search_fields = ["reference", "title", "location", "price"]
    list_editable = ["status", "is_published"]
    ordering = ["-updated_at"]
    fieldsets = (
        (
            "Listing",
            {"fields": ("title", "type", "price", "location", "details", "reference", "status")},
        ),
        (
            "Media & Publishing",
            {"fields": ("image", "image_url", "is_published")},
        ),
        (
            "Details",
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
            "Location",
            {"fields": ("lat", "lng")},
        ),
    )
