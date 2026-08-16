import pytest
from rest_framework import status
from apps.users.models import User


@pytest.mark.django_db
class TestRegistration:
    """
    Test suite for the user registration API endpoint.

    Tests cover successful registration, duplicate username,
    duplicate email, short password and missing required fields.
    """

    def test_successful_registration(self, api_client):
        """
        Tests that a user can successfully create an account
        with valid data.

        Args:
            api_client: The unauthenticated API test client.
        """

        # Sample registration data with all valid fields
        data = {
            'username': 'testuser',
            'email': 'test@test.com',
            'password': 'testpass123',
            'phone_number': '01700000000',
            'address': 'Dhaka, Bangladesh',
            'avatar': 1,
        }

        response = api_client.post('/api/users/register/', data)

        # Check that the response status is 201 created
        assert response.status_code == status.HTTP_201_CREATED

        # Check that the success message is returned
        assert response.data['message'] == 'Account created successfully.'

        # Check that the user was actually created in the database
        assert User.objects.filter(username='testuser').exists()

    def test_duplicate_username(self, api_client):
        """
        Tests that registration fails when the username
        is already taken.

        Args:
            api_client: The unauthenticated API test client.
        """

        # Create a user first
        User.objects.create_user(
            username='testuser',
            email='first@test.com',
            password='testpass123'
        )

        # Try to register with the same username
        data = {
            'username': 'testuser',
            'email': 'second@test.com',
            'password': 'testpass123',
        }

        response = api_client.post('/api/users/register/', data)

        # Check that the response status is 400 bad request
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_duplicate_email(self, api_client):
        """
        Tests that registration fails when the email
        is already registered.

        Args:
            api_client: The unauthenticated API test client.
        """

        # Create a user first
        User.objects.create_user(
            username='firstuser',
            email='test@test.com',
            password='testpass123'
        )

        # Try to register with the same email
        data = {
            'username': 'seconduser',
            'email': 'test@test.com',
            'password': 'testpass123',
        }

        response = api_client.post('/api/users/register/', data)

        # Check that the response status is 400 bad request
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_password_too_short(self, api_client):
        """
        Tests that registration fails when the password
        is less than 8 characters.

        Args:
            api_client: The unauthenticated API test client.
        """

        data = {
            'username': 'testuser',
            'email': 'test@test.com',
            'password': '123',
        }

        response = api_client.post('/api/users/register/', data)

        # Check that the response status is 400 bad request
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_missing_required_fields(self, api_client):
        """
        Tests that registration fails when required fields
        are missing from the request.

        Args:
            api_client: The unauthenticated API test client.
        """

        # Send empty data
        data = {}

        response = api_client.post('/api/users/register/', data)

        # Check that the response status is 400 bad request
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_optional_fields_not_required(self, api_client):
        """
        Tests that registration succeeds even when optional
        fields like phone number and address are not provided.

        Args:
            api_client: The unauthenticated API test client.
        """

        # Only send the required fields
        data = {
            'username': 'testuser',
            'email': 'test@test.com',
            'password': 'testpass123',
        }

        response = api_client.post('/api/users/register/', data)

        # Check that the response status is 201 created
        assert response.status_code == status.HTTP_201_CREATED