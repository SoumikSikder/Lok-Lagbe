"""
Native Pytest test suite for View Hire History feature.
Uses @pytest.mark.django_db, pytest fixtures, and native assert statements.
"""

from datetime import date, time, timedelta
from decimal import Decimal
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from booking.models import Booking
from labor.models import Labor


@pytest.fixture
def hire_user(db):
    """Pytest fixture to create test user for hire history."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return User.objects.create_user(
        username="pytest_hire_user",
        password="password123",
    )


@pytest.fixture
def other_hire_user(db):
    """Pytest fixture to create another user."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return User.objects.create_user(
        username="pytest_other_hire_user",
        password="password123",
    )


@pytest.fixture
def authenticated_hire_client(hire_user):
    """Pytest fixture for authenticated APIClient."""
    client = APIClient()
    client.force_authenticate(user=hire_user)
    return client


@pytest.fixture
def sample_ac_labor(db):
    """Pytest fixture for AC technician labor profile."""
    return Labor.objects.create(
        name="Tamim AC Servicing",
        photo="labor_photos/ac.jpg",
        profession="AC Technician",
        category="AC Repair",
        location="Mirpur, Dhaka",
        hourly_wage=Decimal("600.00"),
        rating=Decimal("4.9"),
        review_count=15,
        description="Expert AC installation and maintenance.",
        phone="01900000003",
        email="tamim@example.com",
        available=True,
        experience=6,
        skills=["AC Repair", "Gas Refill"],
    )


@pytest.fixture
def sample_bookings(hire_user, other_hire_user, sample_ac_labor):
    """Pytest fixture providing test bookings."""
    pending_booking = Booking.objects.create(
        user=hire_user,
        labor=sample_ac_labor,
        work_date=date.today() + timedelta(days=2),
        start_time=time(10, 0),
        duration=Decimal("2.00"),
        address="Mirpur 10, Dhaka",
        notes="Master bedroom AC servicing.",
        status=Booking.PENDING,
    )

    completed_booking = Booking.objects.create(
        user=hire_user,
        labor=sample_ac_labor,
        work_date=date.today() - timedelta(days=5),
        start_time=time(14, 30),
        duration=Decimal("3.00"),
        address="Dhanmondi 27, Dhaka",
        notes="Living room AC repair.",
        status=Booking.COMPLETED,
    )

    other_booking = Booking.objects.create(
        user=other_hire_user,
        labor=sample_ac_labor,
        work_date=date.today() + timedelta(days=1),
        start_time=time(11, 0),
        duration=Decimal("1.50"),
        address="Gulshan 2, Dhaka",
        notes="Office AC check.",
        status=Booking.PENDING,
    )

    return pending_booking, completed_booking, other_booking


@pytest.mark.django_db
def test_get_hire_history_returns_user_bookings_with_labor_details(authenticated_hire_client, sample_bookings, sample_ac_labor):
    """Pytest test case: GET /api/bookings/history/ returns current user's hire records."""
    response = authenticated_hire_client.get("/api/bookings/history/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2

    first_record = response.data[0]
    assert first_record["labor_name"] == sample_ac_labor.name
    assert first_record["labor_profession"] == "AC Technician"
    assert first_record["labor_hourly_wage"] == "600.00"


@pytest.mark.django_db
def test_hire_history_completed_status_filter(authenticated_hire_client, sample_bookings):
    """Pytest test case: filter hire history by ?status=completed."""
    pending_booking, completed_booking, _ = sample_bookings
    response = authenticated_hire_client.get("/api/bookings/history/?status=completed")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["id"] == completed_booking.id


@pytest.mark.django_db
def test_hire_history_pending_status_filter(authenticated_hire_client, sample_bookings):
    """Pytest test case: filter hire history by ?status=pending."""
    pending_booking, _, _ = sample_bookings
    response = authenticated_hire_client.get("/api/bookings/history/?status=pending")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["id"] == pending_booking.id


@pytest.mark.django_db
def test_unauthenticated_user_cannot_view_hire_history():
    """Pytest test case: unauthenticated GET /api/bookings/history/ returns 403 forbidden."""
    anonymous_client = APIClient()
    response = anonymous_client.get("/api/bookings/history/")
    assert response.status_code == status.HTTP_403_FORBIDDEN
