"""
Native Pytest test suite for Manage Favorite Laborers feature.
Uses @pytest.mark.django_db, pytest fixtures, and native assert statements.
"""

from decimal import Decimal
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.labor.models import Favorite, Labor


@pytest.fixture
def test_user(db):
    """Pytest fixture to create a test user."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return User.objects.create_user(
        username="pytest_tanzim",
        password="password123",
        first_name="Tanzim",
        last_name="Ahamad",
    )


@pytest.fixture
def other_user(db):
    """Pytest fixture to create a second test user."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return User.objects.create_user(
        username="pytest_other",
        password="password123",
    )


@pytest.fixture
def authenticated_client(test_user):
    """Pytest fixture providing an authenticated APIClient for test_user."""
    client = APIClient()
    client.force_authenticate(user=test_user)
    return client


@pytest.fixture
def sample_electrician(db):
    """Pytest fixture to create an electrician labor profile."""
    return Labor.objects.create(
        name="Rahim Electrician",
        photo="labor_photos/test1.jpg",
        profession="Electrician",
        category="Electrician",
        location="Dhaka",
        hourly_wage=Decimal("500.00"),
        rating=Decimal("4.8"),
        review_count=10,
        description="Expert electrical wiring specialist.",
        phone="01700000001",
        email="rahim@example.com",
        available=True,
        experience=5,
        skills=["Wiring", "Circuit Repair"],
    )


@pytest.fixture
def sample_plumber(db):
    """Pytest fixture to create a plumber labor profile."""
    return Labor.objects.create(
        name="Karim Plumber",
        photo="labor_photos/test2.jpg",
        profession="Plumber",
        category="Plumber",
        location="Chattogram",
        hourly_wage=Decimal("400.00"),
        rating=Decimal("4.5"),
        review_count=6,
        description="Experienced pipefitter.",
        phone="01800000002",
        email="karim@example.com",
        available=True,
        experience=4,
        skills=["Leak repair"],
    )


@pytest.mark.django_db
def test_add_favorite_laborer_returns_201_created(authenticated_client, sample_electrician):
    """Pytest test case: user can add a laborer to favorites."""
    response = authenticated_client.post(
        "/api/favorites/",
        {"labor": sample_electrician.id},
        format="json",
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["labor"] == sample_electrician.id
    assert response.data["labor_detail"]["name"] == sample_electrician.name


@pytest.mark.django_db
def test_list_favorite_laborers_returns_only_user_favorites(authenticated_client, test_user, other_user, sample_electrician, sample_plumber):
    """Pytest test case: GET /api/favorites/ returns only current user's favorites with labor details."""
    Favorite.objects.create(user=test_user, labor=sample_electrician)
    Favorite.objects.create(user=other_user, labor=sample_plumber)

    response = authenticated_client.get("/api/favorites/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["labor"] == sample_electrician.id
    assert response.data[0]["labor_detail"]["profession"] == "Electrician"


@pytest.mark.django_db
def test_duplicate_favorite_returns_400_bad_request(authenticated_client, test_user, sample_plumber):
    """Pytest test case: adding same laborer twice returns 400 validation error."""
    Favorite.objects.create(user=test_user, labor=sample_plumber)

    response = authenticated_client.post(
        "/api/favorites/",
        {"labor": sample_plumber.id},
        format="json",
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already in your favorites" in str(response.data).lower()


@pytest.mark.django_db
def test_delete_favorite_laborer_returns_204(authenticated_client, test_user, sample_electrician):
    """Pytest test case: user can delete a favorite laborer by ID."""
    fav = Favorite.objects.create(user=test_user, labor=sample_electrician)

    response = authenticated_client.delete(f"/api/favorites/{fav.id}/")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Favorite.objects.filter(user=test_user).count() == 0


@pytest.mark.django_db
def test_unauthenticated_user_cannot_access_favorites():
    """Pytest test case: unauthenticated request to /api/favorites/ returns 403 forbidden."""
    anonymous_client = APIClient()
    response = anonymous_client.get("/api/favorites/")
    assert response.status_code == status.HTTP_403_FORBIDDEN
