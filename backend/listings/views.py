from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse
from rest_framework import filters, viewsets
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAdminUser

from .forms import PropertyForm
from .models import ContactMessage, EstimationRequest, Property
from .serializers import (
    ContactMessageSerializer,
    EstimationRequestSerializer,
    PropertySerializer,
)


class PropertyViewSet(viewsets.ModelViewSet):
    """
    Property listings API.

    - GET (list/retrieve) is public and returns only *published* properties,
      so the public website can read them.
    - All write operations (POST/PUT/PATCH/DELETE) require an admin
      (JWT bearer token or Django admin session).

    Query params: `?search=`, `?type=`, `?status=`, `?location=`.
    """

    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "reference", "location", "price"]
    ordering_fields = ["price", "created_at", "updated_at", "location", "area"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_staff:
            queryset = Property.objects.all()
        else:
            queryset = Property.objects.filter(is_published=True)

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


class EstimationRequestViewSet(viewsets.ModelViewSet):
    """
    Estimation requests from the public « Estimer mon bien » form.

    - POST (create) is public so anyone can submit the form.
    - Everything else requires an admin (JWT bearer token or admin session).
    """

    queryset = EstimationRequest.objects.all()
    serializer_class = EstimationRequestSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "phone", "email", "zone", "comments"]
    ordering_fields = [
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
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    Contact messages from the public « Contact » form.

    - POST (create) is public so anyone can submit the form.
    - Everything else requires an admin (JWT bearer token or admin session).
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "phone", "email", "subject", "message"]
    ordering_fields = ["name", "phone", "email", "subject", "created_at"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]


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
