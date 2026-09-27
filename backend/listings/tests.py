from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

import json

from .models import ContactMessage, EstimationRequest, Property


class FormSubmissionAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.estimation_payload = {
            "name": "John Doe",
            "phone": "+21622132278",
            "email": "john@example.com",
            "zone": "Menzah 6",
            "property_type": "appartement",
            "transaction": "Vente",
            "surface": "185",
            "known_from": "search",
            "comments": "Une note.",
        }
        self.contact_payload = {
            "name": "Jane Doe",
            "phone": "+21622132278",
            "email": "jane@example.com",
            "subject": "Question",
            "message": "Bonjour, je voudrais plus d'informations.",
        }

    def test_anonymous_can_submit_estimation(self):
        response = self.client.post("/api/estimations/", self.estimation_payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(EstimationRequest.objects.count(), 1)

    def test_anonymous_can_submit_contact(self):
        response = self.client.post("/api/contacts/", self.contact_payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_anonymous_cannot_list_estimations(self):
        response = self.client.get("/api/estimations/")
        self.assertIn(response.status_code, (401, 403))

    def test_staff_can_list_estimations(self):
        User = get_user_model()
        user = User.objects.create_user(username="admin", password="pw", is_staff=True)
        self.client.force_authenticate(user)
        response = self.client.get("/api/estimations/")
        self.assertEqual(response.status_code, 200)

    def test_invalid_estimation_rejected(self):
        response = self.client.post(
            "/api/estimations/", {"name": "", "phone": ""}, format="json"
        )
        self.assertEqual(response.status_code, 400)


class DashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(
            username="staff", password="pw", is_staff=True
        )

    def test_dashboard_requires_staff(self):
        response = self.client.get("/dashboard/")
        self.assertIn(response.status_code, (302, 403, 401))

    def test_dashboard_renders_for_staff(self):
        self.client.force_login(self.user)
        response = self.client.get("/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Tableau de bord")
        self.assertContains(response, "estimations")
        self.assertContains(response, "contacts")

    def test_set_status_updates_property(self):
        prop = Property.objects.create(
            title="Test", type="À vendre", price="100 TND", location="Tunis",
            reference="IC-TEST", status="Disponible", is_published=True,
        )
        self.client.force_login(self.user)
        response = self.client.post(
            "/biens/%d/statut/" % prop.pk,
            data=json.dumps({"status": "Réservé", "is_published": False}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        prop.refresh_from_db()
        self.assertEqual(prop.status, "Réservé")
        self.assertFalse(prop.is_published)

    def test_set_status_requires_staff(self):
        prop = Property.objects.create(
            title="Test", type="À vendre", price="100 TND", location="Tunis",
            reference="IC-TEST2", status="Disponible",
        )
        response = self.client.post(
            "/biens/%d/statut/" % prop.pk,
            data=json.dumps({"status": "Vendu"}),
            content_type="application/json",
        )
        self.assertIn(response.status_code, (302, 403, 401))

    def test_admin_index_renders_with_adminlte_theme(self):
        user = get_user_model().objects.create_superuser(
            username="boss", password="pw", email="boss@example.com"
        )
        self.client.force_login(user)
        response = self.client.get("/admin/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "adminlte")


class PropertyRedirectTests(TestCase):
    dashboard_url = "https://adminimmo.pythonanywhere.com/dashboard/"

    def setUp(self):
        user = get_user_model().objects.create_user(
            username="staff", password="pw", is_staff=True
        )
        self.client.force_login(user)

    def form_data(self, reference, title="Test property"):
        return {
            "title": title,
            "type": "À vendre",
            "price": "100 TND",
            "location": "Tunis",
            "reference": reference,
            "status": "Disponible",
            "is_published": "on",
        }

    def assert_dashboard_redirect(self, response):
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, self.dashboard_url)

    def test_property_creation_redirects_to_dashboard(self):
        response = self.client.post(
            "/biens/nouveau/", self.form_data("IC-CREATE")
        )
        self.assert_dashboard_redirect(response)

    def test_property_update_redirects_to_dashboard(self):
        prop = Property.objects.create(
            title="Original", type="À vendre", price="100 TND",
            location="Tunis", reference="IC-UPDATE",
        )
        response = self.client.post(
            "/biens/%d/" % prop.pk,
            self.form_data("IC-UPDATE", title="Updated"),
        )
        self.assert_dashboard_redirect(response)

    def test_property_delete_redirects_to_dashboard(self):
        prop = Property.objects.create(
            title="To delete", type="À vendre", price="100 TND",
            location="Tunis", reference="IC-DELETE",
        )
        response = self.client.post("/biens/%d/supprimer/" % prop.pk)
        self.assert_dashboard_redirect(response)
        self.assertFalse(Property.objects.filter(pk=prop.pk).exists())


class PropertyAdminRedirectTests(TestCase):
    dashboard_url = "https://adminimmo.pythonanywhere.com/dashboard/"

    def setUp(self):
        user = get_user_model().objects.create_superuser(
            username="boss", password="pw", email="boss@example.com"
        )
        self.client.force_login(user)

    def admin_form_data(self, reference, title="Admin property"):
        return {
            "title": title,
            "type": "À vendre",
            "property_type": "Appartement",
            "price": "100 TND",
            "location": "Tunis",
            "details": "",
            "description": "",
            "reference": reference,
            "image_url": "",
            "status": "Disponible",
            "google_maps_url": "",
            "area": "",
            "rooms": "",
            "bedrooms": "",
            "bathrooms": "",
            "floor": "",
            "orientation": "",
            "years": "",
            "floor_type": "",
            "features": "[]",
            "is_published": "on",
            "_save": "Save",
        }

    def assert_dashboard_redirect(self, response):
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, self.dashboard_url)

    def test_admin_property_create_update_and_delete_redirect_to_dashboard(self):
        response = self.client.post(
            "/admin/listings/property/add/", self.admin_form_data("IC-ADMIN")
        )
        self.assert_dashboard_redirect(response)
        prop = Property.objects.get(reference="IC-ADMIN")
        prop.is_published = False
        prop.save(update_fields=["is_published"])

        response = self.client.post(
            "/admin/listings/property/",
            {
                "action": "publish_properties",
                "_selected_action": str(prop.pk),
                "index": "0",
            },
        )
        self.assert_dashboard_redirect(response)
        prop.refresh_from_db()
        self.assertTrue(prop.is_published)

        response = self.client.post(
            "/admin/listings/property/%d/change/" % prop.pk,
            self.admin_form_data("IC-ADMIN", title="Updated admin property"),
        )
        self.assert_dashboard_redirect(response)

        response = self.client.post(
            "/admin/listings/property/%d/delete/" % prop.pk,
            {"post": "yes"},
        )
        self.assert_dashboard_redirect(response)
        self.assertFalse(Property.objects.filter(pk=prop.pk).exists())

class AdminAuthenticationTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_superuser(
            username="boss", password="pw", email="boss@example.com"
        )

    def test_admin_login_redirects_to_configured_url(self):
        response = self.client.post(
            "/admin/login/",
            {"username": "boss", "password": "pw", "next": "/admin/"},
        )
        self.assertRedirects(
            response,
            "https://adminimmo.pythonanywhere.com/",
            fetch_redirect_response=False,
        )

    def test_admin_logout_ends_session(self):
        self.client.force_login(self.user)
        response = self.client.post("/admin/logout/")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, "/admin/login/")
        self.assertNotIn("_auth_user_id", self.client.session)
