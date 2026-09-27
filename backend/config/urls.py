from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import include, path

from listings.views import (
    dashboard,
    landing,
    property_form_add_edit,
    property_form_delete,
    property_form_list,
    property_set_status,
)


def admin_login(request):
    if request.method == "GET" and admin.site.has_permission(request):
        return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
    if request.method == "GET":
        request.GET = request.GET.copy()
        request.GET["next"] = settings.LOGIN_REDIRECT_URL
    elif request.method == "POST":
        request.POST = request.POST.copy()
        request.POST["next"] = settings.LOGIN_REDIRECT_URL
    return admin.site.login(request)


urlpatterns = [
    path("", landing, name="home"),
    path("dashboard/", dashboard, name="dashboard"),
    path("admin/login/", admin_login, name="admin_login"),
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
