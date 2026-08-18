from datetime import date, time, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from booking.models import Booking
from labor.models import Labor


class BookingApiTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.user = user_model.objects.create_user(
            username="booking-user",
            password="test-password",
        )
        cls.other_user = user_model.objects.create_user(
            username="other-booking-user",
            password="test-password",
        )
        cls.available_labor = cls._create_labor(
            name="Available Electrician",
            available=True,
        )
        cls.unavailable_labor = cls._create_labor(
            name="Unavailable Plumber",
            available=False,
        )
        cls.existing_booking = Booking.objects.create(
            user=cls.user,
            labor=cls.available_labor,
            work_date=date.today() + timedelta(days=3),
            start_time=time(9, 30),
            duration=Decimal("2.50"),
            address="Dhanmondi, Dhaka",
            notes="Existing booking.",
        )

    @classmethod
    def _create_labor(cls, **overrides):
        values = {
            "name": "Booking Test Labor",
            "photo": "labor_photos/test.jpg",
            "profession": "Electrician",
            "category": "Electrician",
            "location": "Dhaka",
            "hourly_wage": "450.00",
            "rating": "4.5",
            "review_count": 2,
            "description": "Labor profile for booking tests.",
            "phone": "01800000000",
            "email": "booking-worker@example.com",
            "available": True,
            "experience": 4,
            "skills": ["Wiring"],
        }
        values.update(overrides)
        return Labor.objects.create(**values)

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def _valid_payload(self, **overrides):
        payload = {
            "labor": self.available_labor.id,
            "work_date": (date.today() + timedelta(days=1)).isoformat(),
            "start_time": "10:00",
            "duration": 2.5,
            "address": "Uttara, Dhaka",
            "notes": "Bring standard tools.",
        }
        payload.update(overrides)
        return payload

    def test_booking_creation_requires_authentication(self):
        anonymous_client = APIClient()

        response = anonymous_client.post(
            "/api/bookings/",
            self._valid_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_booking_returns_pending_record(self):
        response = self.client.post(
            "/api/bookings/",
            self._valid_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"], self.user.id)
        self.assertEqual(response.data["status"], Booking.PENDING)
        self.assertEqual(
            response.data["labor_name"],
            self.available_labor.name,
        )
        self.assertEqual(response.data["labor_hourly_wage"], "450.00")

    def test_past_work_date_returns_400(self):
        response = self.client.post(
            "/api/bookings/",
            self._valid_payload(
                work_date=(date.today() - timedelta(days=1)).isoformat()
            ),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("work_date", response.data)

    def test_duration_outside_allowed_range_returns_400(self):
        response = self.client.post(
            "/api/bookings/",
            self._valid_payload(duration=25),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("duration", response.data)

    def test_unavailable_labor_returns_400(self):
        response = self.client.post(
            "/api/bookings/",
            self._valid_payload(labor=self.unavailable_labor.id),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("labor", response.data)

    def test_booking_detail_is_limited_to_owner(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.get(
            f"/api/bookings/{self.existing_booking.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_booking_owner_can_retrieve_complete_record(self):
        response = self.client.get(
            f"/api/bookings/{self.existing_booking.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["address"], "Dhanmondi, Dhaka")
        self.assertEqual(response.data["status_display"], "Pending")
        self.assertEqual(
            response.data["labor_name"],
            self.available_labor.name,
        )

    def test_booking_history_list_and_filtering(self):
        response = self.client.get("/api/bookings/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["labor_name"], self.available_labor.name)
        self.assertIn("labor_profession", response.data[0])

        filtered_response = self.client.get("/api/bookings/history/?status=pending")
        self.assertEqual(filtered_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(filtered_response.data), 1)

        empty_filter_response = self.client.get("/api/bookings/history/?status=completed")
        self.assertEqual(empty_filter_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(empty_filter_response.data), 0)

    def test_booking_history_unauthenticated_returns_403(self):
        anonymous_client = APIClient()
        response = anonymous_client.get("/api/bookings/history/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

