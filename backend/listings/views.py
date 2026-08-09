from django.db.models import Q
from django.http import JsonResponse
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAdminUser

from .models import Property
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD for property listings.

    Authenticate with a JWT bearer token or a Django admin session.
    Query params: `?search=`, `?type=`, `?status=`, `?location=`.
    """

    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "reference", "location", "price"]
    ordering_fields = ["price", "created_at", "updated_at", "location", "area"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        listing_type = self.request.query_params.get("type")
        status = self.request.query_params.get("status")
        location = self.request.query_params.get("location")

        if listing_type:
            queryset = queryset.filter(type=listing_type)
        if status:
            queryset = queryset.filter(status=status)
        if location:
            queryset = queryset.filter(location__icontains=location)
        return queryset


def health(request):
    """Liveness probe for Railway."""
    return JsonResponse({"status": "ok"})
