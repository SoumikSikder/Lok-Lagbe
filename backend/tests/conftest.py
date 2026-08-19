"""Reusable pytest fixtures for labor-listing API tests.

Pytest discovers this module automatically and injects fixtures into test
functions by matching their argument names.
"""

from decimal import Decimal

import pytest
from rest_framework.test import APIClient

from apps.labor.models import Labor


@pytest.fixture
def api_client():
    """Return an unauthenticated Django REST Framework test client.

    The listing endpoint is public, so the client deliberately has no user
    credentials.

    :return: Client used to send in-process requests to the Django API.
    :rtype: rest_framework.test.APIClient
    """
    return APIClient()


@pytest.fixture
def labor_factory(db):
    """Return a factory that creates valid, customizable labor records.

    The factory supplies deterministic defaults and accepts keyword
    overrides for fields relevant to an individual test. The ``db`` fixture
    enables access to pytest-django's isolated test database.

    :param db: Pytest-django fixture that enables database access.
    :return: Callable that creates and returns a :class:`Labor` instance.
    :rtype: collections.abc.Callable
    """
    sequence = 0

    def _create_labor(**overrides):
        """Create one labor record using defaults and field overrides.

        :param overrides: Model fields that replace the default values.
        :return: Persisted labor profile in the current test database.
        :rtype: apps.labor.models.Labor
        """
        nonlocal sequence
        sequence += 1
        values = {
            "name": f"Laborer {sequence}",
            "photo": f"labor_photos/laborer-{sequence}.jpg",
            "profession": "General Worker",
            "category": "General",
            "location": "Dhaka",
            "hourly_wage": Decimal("300.00"),
            "rating": Decimal("4.0"),
            "review_count": 0,
            "description": "Experienced local professional.",
            "phone": f"0170000{sequence:04d}",
            "email": f"laborer-{sequence}@example.com",
            "available": True,
            "experience": 3,
            "skills": ["Communication"],
        }
        values.update(overrides)
        return Labor.objects.create(**values)

    return _create_labor


@pytest.fixture
def listing_labors(labor_factory):
    """Create the deterministic records used by listing feature tests.

    The returned mapping contains an electrician, cleaner, and plumber with
    distinct search fields, wages, ratings, and review counts. Those
    differences make filtering and ordering assertions unambiguous.

    :param labor_factory: Fixture that creates valid labor records.
    :return: Records keyed by ``electrician``, ``cleaner``, and ``plumber``.
    :rtype: dict[str, apps.labor.models.Labor]
    """
    return {
        "electrician": labor_factory(
            name="Rahim Uddin",
            profession="Residential Electrician",
            category="Electrician",
            location="Dhaka",
            hourly_wage=Decimal("500.00"),
            rating=Decimal("4.8"),
            review_count=8,
        ),
        "cleaner": labor_factory(
            name="Nadia Akter",
            profession="Home Cleaner",
            category="Cleaner",
            location="Khulna",
            hourly_wage=Decimal("250.00"),
            rating=Decimal("4.2"),
            review_count=12,
        ),
        "plumber": labor_factory(
            name="Karim Mia",
            profession="Sanitary Plumber",
            category="Plumber",
            location="Chattogram",
            hourly_wage=Decimal("350.00"),
            rating=Decimal("4.9"),
            review_count=3,
        ),
    }
