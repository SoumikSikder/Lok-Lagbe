import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    """
    Returns an unauthenticated API test client.

    Returns:
        APIClient: DRF test client instance.
    """
<<<<<<< HEAD
    return APIClient()

=======
    return APIClient()
>>>>>>> build
