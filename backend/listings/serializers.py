from rest_framework import serializers

from .models import Property


class PropertySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    image_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "type",
            "price",
            "location",
            "details",
            "reference",
            "image",
            "image_url",
            "image_display_url",
            "status",
            "lat",
            "lng",
            "area",
            "rooms",
            "bedrooms",
            "bathrooms",
            "floor",
            "orientation",
            "years",
            "floor_type",
            "features",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "image_display_url", "created_at", "updated_at"]

    def get_image_display_url(self, obj):
        """Absolute URL of the uploaded file, falling back to the external URL."""
        if obj.image:
            request = self.context.get("request")
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return obj.image_url

