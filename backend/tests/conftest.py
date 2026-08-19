from decimal import Decimal

import pytest
from rest_framework.test import APIClient

from apps.labor.models import Labor


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def labor_factory(db):
    sequence = 0

    def _create_labor(**overrides):
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
