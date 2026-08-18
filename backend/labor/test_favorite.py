"""
Unit tests specifically for the Manage Favorite Laborers feature (Tanzim's Part).
"""

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from labor.models import Favorite, Labor


class FavoriteLaborApiTests(APITestCase):
    """
    Test suite covering listing, adding, duplicate checking,
    and removing favorite laborers.
    """

    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.user = user_model.objects.create_user(
            username="tanzim_user",
            password="password123",
            first_name="Tanzim",
            last_name="Ahamad",
        )
        cls.other_user = user_model.objects.create_user(
            username="other_user",
            password="password123",
        )

        cls.labor_electrician = Labor.objects.create(
            name="Rahim Electrician",
            photo="labor_photos/test1.jpg",
            profession="Electrician",
            category="Electrician",
            location="Dhaka",
            hourly_wage="500.00",
            rating="4.8",
            review_count=10,
            description="Expert electrical wiring specialist.",
            phone="01700000001",
            email="rahim@example.com",
            available=True,
            experience=5,
            skills=["Wiring", "Circuit Repair"],
        )

        cls.labor_plumber = Labor.objects.create(
            name="Karim Plumber",
            photo="labor_photos/test2.jpg",
            profession="Plumber",
            category="Plumber",
            location="Chattogram",
            hourly_wage="400.00",
            rating="4.5",
            review_count=6,
            description="Experienced pipefitter and plumber.",
            phone="01800000002",
            email="karim@example.com",
            available=True,
            experience=4,
            skills=["Pipe fitting", "Leak repair"],
        )

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_add_favorite_laborer_returns_201_created(self):
        """Verify user can add a laborer to favorites."""
        response = self.client.post(
            "/api/favorites/",
            {"labor": self.labor_electrician.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["labor"], self.labor_electrician.id)
        self.assertEqual(
            response.data["labor_detail"]["name"],
            self.labor_electrician.name,
        )

    def test_list_favorite_laborers_returns_only_user_favorites(self):
        """Verify GET /api/favorites/ returns favorited laborers with full details."""
        Favorite.objects.create(user=self.user, labor=self.labor_electrician)
        Favorite.objects.create(user=self.other_user, labor=self.labor_plumber)

        response = self.client.get("/api/favorites/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["labor"], self.labor_electrician.id)
        self.assertEqual(
            response.data[0]["labor_detail"]["profession"],
            "Electrician",
        )

    def test_duplicate_favorite_returns_400_bad_request(self):
        """Verify user cannot add the same laborer to favorites twice."""
        Favorite.objects.create(user=self.user, labor=self.labor_plumber)

        response = self.client.post(
            "/api/favorites/",
            {"labor": self.labor_plumber.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already in your favorites", str(response.data).lower())

    def test_delete_favorite_laborer_returns_204(self):
        """Verify user can remove a favorite laborer by favorite ID."""
        fav = Favorite.objects.create(
            user=self.user,
            labor=self.labor_electrician,
        )

        response = self.client.delete(f"/api/favorites/{fav.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Favorite.objects.filter(user=self.user).count(), 0)

    def test_unauthenticated_user_cannot_access_favorites(self):
        """Verify unauthenticated requests to /api/favorites/ are forbidden."""
        anonymous_client = APIClient()
        response = anonymous_client.get("/api/favorites/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
