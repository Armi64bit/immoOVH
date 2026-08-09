from django import forms

from .models import Property


class PropertyForm(forms.ModelForm):
    """Simple, guided form for non-technical staff."""

    features = forms.CharField(
        required=False,
        label="Équipements",
        help_text="Séparez chaque équipement par une virgule. Ex. : Piscine, Garage, Jardin",
        widget=forms.Textarea(attrs={"rows": 2, "placeholder": "Piscine, Garage, Jardin"}),
    )

    class Meta:
        model = Property
        fields = [
            "title",
            "type",
            "price",
            "location",
            "details",
            "reference",
            "image",
            "image_url",
            "status",
            "is_published",
            "area",
            "rooms",
            "bedrooms",
            "bathrooms",
            "floor",
            "orientation",
            "years",
            "floor_type",
            "features",
            "lat",
            "lng",
        ]
        widgets = {
            "details": forms.TextInput(attrs={"placeholder": "Ex. : 165 m² · S+3"}),
            "price": forms.TextInput(attrs={"placeholder": "Ex. : 580 000 TND"}),
            "image_url": forms.URLInput(attrs={"placeholder": "https://..."}),
        }

    def clean_features(self):
        raw = self.cleaned_data.get("features") or ""
        return [item.strip() for item in raw.split(",") if item.strip()]
