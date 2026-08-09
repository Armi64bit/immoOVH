from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from listings.views import (
    dashboard,
    landing,
    property_form_add_edit,
    property_form_delete,
    property_form_list,
    property_set_status,
)

urlpatterns = [
    path("", landing, name="home"),
    path("dashboard/", dashboard, name="dashboard"),
    path("admin/", admin.site.urls),
    # Friendly property management pages for staff
    path("biens/", property_form_list, name="property_form_list"),
    path("biens/nouveau/", property_form_add_edit, name="property_form_add"),
    path("biens/<int:pk>/", property_form_add_edit, name="property_form_edit"),
    path("biens/<int:pk>/supprimer/", property_form_delete, name="property_form_delete"),
    path("biens/<int:pk>/statut/", property_set_status, name="property_set_status"),
    # API, Swagger and health check
    path("api/", include("listings.urls")),
]

# In development, serve uploaded files. Production uses WhiteNoise (wsgi.py).
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
