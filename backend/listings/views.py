from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAdminUser

from .forms import PropertyForm
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


def landing(request):
    """Friendly welcome page explaining how to use the backend."""
    published_count = Property.objects.filter(is_published=True).count()
    total_count = Property.objects.count()
    return render(
        request,
        "listings/landing.html",
        {
            "published_count": published_count,
            "total_count": total_count,
            "is_staff": request.user.is_staff if request.user.is_authenticated else False,
        },
    )


@staff_member_required
def property_form_list(request):
    """List all properties with edit/delete actions."""
    properties = Property.objects.all()
    return render(
        request,
        "listings/property_form_list.html",
        {"properties": properties},
    )


@staff_member_required
def property_form_add_edit(request, pk=None):
    """Add or edit a property via the simple form."""
    instance = get_object_or_404(Property, pk=pk) if pk else None

    if request.method == "POST":
        form = PropertyForm(request.POST, request.FILES, instance=instance)
        if form.is_valid():
            form.save()
            if instance:
                messages.success(request, "Le bien a été mis à jour.")
            else:
                messages.success(request, "Le bien a été créé.")
            return redirect("property_form_list")
    else:
        form = PropertyForm(instance=instance)

    return render(
        request,
        "listings/property_form.html",
        {"form": form, "instance": instance, "is_edit": instance is not None},
    )


@staff_member_required
def property_form_delete(request, pk):
    """Delete a property."""
    property_obj = get_object_or_404(Property, pk=pk)
    if request.method == "POST":
        property_obj.delete()
        messages.success(request, "Le bien a été supprimé.")
    return redirect("property_form_list")
