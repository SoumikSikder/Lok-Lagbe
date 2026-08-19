"""Feature tests for the public labor-listing API.

The suite verifies the response contract, supported searches and filters,
deterministic sorting, pagination metadata, and query-parameter validation.
Parameterized inputs expand the six test functions into sixteen test cases.
"""

from decimal import Decimal

import pytest
from rest_framework import status


LIST_URL = "/api/labors/"

pytestmark = pytest.mark.django_db


def _result_ids(response):
    """Extract ordered labor IDs from a paginated API response.

    :param response: Django REST Framework response returned by ``APIClient``.
    :return: Labor primary keys in their serialized response order.
    :rtype: list[int]
    """
    return [result["id"] for result in response.json()["results"]]


def test_listing_is_public_and_returns_the_expected_contract(
    api_client,
    listing_labors,
):
    """Verify anonymous access, response fields, and default ordering.

    :param api_client: Unauthenticated REST Framework test client.
    :param listing_labors: Deterministic labor records for list assertions.
    """
    response = api_client.get(LIST_URL)

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["count"] == 3
    assert set(body) == {"count", "next", "previous", "results"}
    assert set(body["results"][0]) == {
        "id",
        "name",
        "photo",
        "profession",
        "category",
        "location",
        "hourly_wage",
        "rating",
        "review_count",
        "description",
        "available",
        "experience",
    }
    assert _result_ids(response) == [
        listing_labors["plumber"].id,
        listing_labors["electrician"].id,
        listing_labors["cleaner"].id,
    ]


@pytest.mark.parametrize(
    ("query", "expected_key"),
    [
        ("Rahim", "electrician"),
        ("Residential", "electrician"),
        ("Cleaner", "cleaner"),
        ("Chattogram", "plumber"),
    ],
)
def test_search_matches_supported_labor_fields(
    api_client,
    listing_labors,
    query,
    expected_key,
):
    """Verify search matching by name, profession, category, and location.

    :param api_client: Unauthenticated REST Framework test client.
    :param listing_labors: Mapping of deterministic labor records.
    :param str query: Search value supplied by the parameterized case.
    :param str expected_key: Mapping key for the expected labor record.
    """
    response = api_client.get(LIST_URL, {"search": query})

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 1
    assert _result_ids(response) == [listing_labors[expected_key].id]


def test_combined_filters_return_only_matching_labor(
    api_client,
    listing_labors,
):
    """Verify search, category, rating, and wage filters combine with AND.

    :param api_client: Unauthenticated REST Framework test client.
    :param listing_labors: Mapping of deterministic labor records.
    """
    response = api_client.get(
        LIST_URL,
        {
            "search": "Khulna",
            "category": "cleaner",
            "rating": "4",
            "min_wage": "200",
            "max_wage": "300",
        },
    )

    assert response.status_code == status.HTTP_200_OK
    assert _result_ids(response) == [listing_labors["cleaner"].id]


@pytest.mark.parametrize(
    ("sort", "expected_keys"),
    [
        ("highest_rated", ["plumber", "electrician", "cleaner"]),
        ("lowest_wage", ["cleaner", "plumber", "electrician"]),
        ("highest_wage", ["electrician", "plumber", "cleaner"]),
        ("most_reviewed", ["cleaner", "electrician", "plumber"]),
    ],
)
def test_sort_options_return_deterministic_order(
    api_client,
    listing_labors,
    sort,
    expected_keys,
):
    """Verify every supported sort option returns the complete expected order.

    :param api_client: Unauthenticated REST Framework test client.
    :param listing_labors: Mapping of deterministic labor records.
    :param str sort: API sorting option supplied by the parameterized case.
    :param list[str] expected_keys: Labor keys in their expected order.
    """
    response = api_client.get(LIST_URL, {"sort": sort})

    assert response.status_code == status.HTTP_200_OK
    assert _result_ids(response) == [
        listing_labors[key].id for key in expected_keys
    ]


def test_pagination_returns_requested_page_and_navigation_links(
    api_client,
    labor_factory,
):
    """Verify page slicing, total count, and next/previous navigation links.

    :param api_client: Unauthenticated REST Framework test client.
    :param labor_factory: Factory used to create a multi-page dataset.
    """
    for index in range(10):
        labor_factory(
            name=f"Worker {index:02d}",
            rating=Decimal("4.0"),
        )

    response = api_client.get(LIST_URL, {"page": 2, "page_size": 3})

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["count"] == 10
    assert len(body["results"]) == 3
    assert "page=3" in body["next"]
    assert "page_size=3" in body["previous"]


@pytest.mark.parametrize(
    ("parameters", "error_field"),
    [
        ({"rating": "not-a-number"}, "rating"),
        ({"rating": "6"}, "rating"),
        ({"min_wage": "-1"}, "min_wage"),
        ({"min_wage": "500", "max_wage": "200"}, "max_wage"),
        ({"sort": "newest"}, "sort"),
    ],
)
def test_invalid_listing_parameters_return_field_errors(
    api_client,
    parameters,
    error_field,
):
    """Verify malformed listing parameters return field-specific HTTP 400s.

    :param api_client: Unauthenticated REST Framework test client.
    :param dict parameters: Invalid query parameters for this test case.
    :param str error_field: Response field expected to describe the error.
    """
    response = api_client.get(LIST_URL, parameters)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert error_field in response.json()
