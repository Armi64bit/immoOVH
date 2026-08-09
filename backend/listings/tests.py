from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import ContactMessage, EstimationRequest


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
