from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from labor.models import Labor, Review


class LaborApiTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.user = user_model.objects.create_user(
            username="amina",
            password="test-password",
            first_name="Amina",
            last_name="Rahman",
        )
        cls.other_user = user_model.objects.create_user(
            username="karim",
            password="test-password",
            first_name="Karim",
            last_name="Hasan",
        )
        cls.electrician = cls._create_labor(
            name="Rahim Electric",
            profession="Electrician",
            category="Electrician",
            location="Dhaka",
            hourly_wage="500.00",
            rating="3.0",
            review_count=1,
        )
        cls.plumber = cls._create_labor(
            name="Salma Plumbing",
            profession="Plumber",
            category="Plumber",
            location="Chattogram",
            hourly_wage="350.00",
            rating="4.8",
            review_count=8,
        )
        cls.dhaka_cleaner = cls._create_labor(
            name="Nadia Akter",
            profession="Cleaner",
            category="Cleaner",
            location="Dhaka",
            hourly_wage="250.00",
            rating="4.2",
            review_count=4,
        )
        Review.objects.create(
            user=cls.other_user,
            labor=cls.electrician,
            rating=3,
            comment="Reliable work.",
        )

    @classmethod
    def _create_labor(cls, **overrides):
        values = {
            "name": "Test Labor",
            "photo": "labor_photos/test.jpg",
            "profession": "Worker",
            "category": "General",
            "location": "Dhaka",
            "hourly_wage": "300.00",
            "rating": "0.0",
            "review_count": 0,
            "description": "Experienced worker for API tests.",
            "phone": "01700000000",
            "email": "worker@example.com",
            "available": True,
            "experience": 5,
            "skills": ["Safety", "Communication"],
        }
        values.update(overrides)
        return Labor.objects.create(**values)

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_labor_list_is_available_without_authentication(self):
        anonymous_client = APIClient()

        response = anonymous_client.get("/api/labors/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)

    def test_labor_detail_is_available_without_authentication(self):
        anonymous_client = APIClient()

        response = anonymous_client.get(
            f"/api/labors/{self.electrician.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.electrician.id)

    def test_search_filters_sorting_and_pagination(self):
        response = self.client.get(
            "/api/labors/",
            {
                "search": "Dhaka",
                "rating": "4",
                "min_wage": "200",
                "max_wage": "300",
                "sort": "lowest_wage",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertIn("experience", response.data["results"][0])
        self.assertEqual(
            response.data["results"][0]["id"],
            self.dhaka_cleaner.id,
        )

    def test_invalid_wage_range_returns_400(self):
        response = self.client.get(
            "/api/labors/",
            {"min_wage": "500", "max_wage": "200"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("max_wage", response.data)

    def test_labor_detail_contains_complete_profile_and_reviews(self):
        response = self.client.get(
            f"/api/labors/{self.electrician.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["phone"], "01700000000")
        self.assertEqual(response.data["skills"], ["Safety", "Communication"])
        self.assertEqual(len(response.data["reviews"]), 1)
        self.assertEqual(
            response.data["reviews"][0]["user_name"],
            "Karim Hasan",
        )

    def test_review_creation_updates_rating_summary(self):
        response = self.client.post(
            "/api/reviews/",
            {
                "labor": self.electrician.id,
                "rating": 5,
                "comment": "Excellent service.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.electrician.refresh_from_db()
        self.assertEqual(self.electrician.review_count, 2)
        self.assertEqual(self.electrician.rating, Decimal("4.0"))

    def test_duplicate_review_returns_400(self):
        Review.objects.create(
            user=self.user,
            labor=self.plumber,
            rating=4,
            comment="First review.",
        )

        response = self.client.post(
            "/api/reviews/",
            {
                "labor": self.plumber.id,
                "rating": 5,
                "comment": "Duplicate review.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already reviewed", str(response.data).lower())

    def test_review_rating_must_be_between_one_and_five(self):
        response = self.client.post(
            "/api/reviews/",
            {
                "labor": self.plumber.id,
                "rating": 6,
                "comment": "Invalid rating.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("rating", response.data)

    def test_add_and_list_favorite_laborers(self):
        create_response = self.client.post(
            "/api/favorites/",
            {"labor": self.electrician.id},
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_response.data["labor"], self.electrician.id)
        self.assertEqual(
            create_response.data["labor_detail"]["name"],
            self.electrician.name,
        )

        list_response = self.client.get("/api/favorites/")
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)

    def test_duplicate_favorite_returns_400(self):
        self.client.post(
            "/api/favorites/",
            {"labor": self.plumber.id},
            format="json",
        )
        duplicate_response = self.client.post(
            "/api/favorites/",
            {"labor": self.plumber.id},
            format="json",
        )
        self.assertEqual(
            duplicate_response.status_code, status.HTTP_400_BAD_REQUEST
        )
        self.assertIn("already in your favorites", str(duplicate_response.data).lower())

    def test_delete_favorite_laborer(self):
        create_response = self.client.post(
            "/api/favorites/",
            {"labor": self.dhaka_cleaner.id},
            format="json",
        )
        fav_id = create_response.data["id"]

        delete_response = self.client.delete(f"/api/favorites/{fav_id}/")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        list_response = self.client.get("/api/favorites/")
        self.assertEqual(len(list_response.data), 0)

