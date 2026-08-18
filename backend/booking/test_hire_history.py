"""
Unit tests specifically for the View Hire History feature (Tanzim's Part).
"""

from datetime import date, time, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from booking.models import Booking
from labor.models import Labor


class HireHistoryApiTests(APITestCase):
    """
    Test suite covering retrieving user hire history, status filtering,
    ordering, and user isolation.
    """

    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.user = user_model.objects.create_user(
            username="tanzim_hire_user",
            password="password123",
        )
        cls.other_user = user_model.objects.create_user(
            username="other_hire_user",
            password="password123",
        )

        cls.labor_ac = Labor.objects.create(
            name="Tamim AC Servicing",
            photo="labor_photos/ac.jpg",
            profession="AC Technician",
            category="AC Repair",
            location="Mirpur, Dhaka",
            hourly_wage="600.00",
            rating="4.9",
            review_count=15,
            description="Expert AC installation and maintenance.",
            phone="01900000003",
            email="tamim@example.com",
            available=True,
            experience=6,
            skills=["AC Repair", "Gas Refill"],
        )

        # Booking 1: Pending for main user
        cls.booking_pending = Booking.objects.create(
            user=cls.user,
            labor=cls.labor_ac,
            work_date=date.today() + timedelta(days=2),
            start_time=time(10, 0),
            duration=Decimal("2.00"),
            address="Mirpur 10, Dhaka",
            notes="Master bedroom AC servicing.",
            status=Booking.PENDING,
        )

        # Booking 2: Completed for main user
        cls.booking_completed = Booking.objects.create(
            user=cls.user,
            labor=cls.labor_ac,
            work_date=date.today() - timedelta(days=5),
            start_time=time(14, 30),
            duration=Decimal("3.00"),
            address="Dhanmondi 27, Dhaka",
            notes="Living room AC repair.",
            status=Booking.COMPLETED,
        )

        # Booking 3: For other user (should be excluded from main user's history)
        cls.other_user_booking = Booking.objects.create(
            user=cls.other_user,
            labor=cls.labor_ac,
            work_date=date.today() + timedelta(days=1),
            start_time=time(11, 0),
            duration=Decimal("1.50"),
            address="Gulshan 2, Dhaka",
            notes="Office AC check.",
            status=Booking.PENDING,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_get_hire_history_returns_user_bookings_with_labor_details(self):
        """Verify GET /api/bookings/history/ returns only current user's hire records."""
        response = self.client.get("/api/bookings/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        first_record = response.data[0]
        self.assertEqual(first_record["labor_name"], self.labor_ac.name)
        self.assertEqual(first_record["labor_profession"], "AC Technician")
        self.assertEqual(first_record["labor_hourly_wage"], "600.00")

    def test_hire_history_status_filter(self):
        """Verify filtering hire history by ?status=completed."""
        response = self.client.get("/api/bookings/history/?status=completed")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.booking_completed.id)

    def test_hire_history_pending_filter(self):
        """Verify filtering hire history by ?status=pending."""
        response = self.client.get("/api/bookings/history/?status=pending")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.booking_pending.id)

    def test_unauthenticated_user_cannot_view_hire_history(self):
        """Verify unauthenticated requests to /api/bookings/history/ are forbidden."""
        anonymous_client = APIClient()
        response = anonymous_client.get("/api/bookings/history/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
