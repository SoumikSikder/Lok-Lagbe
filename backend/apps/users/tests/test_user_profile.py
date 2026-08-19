from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase

from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class TestUserProfile(APITestCase):
    """
    Test cases for user profile management.
    """

    def setUp(self):
        """
        Create test user and generate JWT token.
        """

        self.user = User.objects.create_user(
            username="profileuser",
            email="profile@gmail.com",
            password="profilepassword123",
        )

        refresh = RefreshToken.for_user(self.user)

        self.access_token = str(refresh.access_token)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}"
        )

    def test_view_profile_success(self):
        """
        Test authenticated user can view profile.
        """

        response = self.client.get("/api/users/profile/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["username"],
            "profileuser",
        )

    def test_update_profile_success(self):
        """
        Test authenticated user can update profile.
        """

        response = self.client.put(
            "/api/users/profile/",
            {
                "phone_number": "01700000000",
                "address": "Dhaka",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["data"]["phone_number"],
            "01700000000",
        )

    def test_profile_without_authentication(self):
        """
        Test profile access without JWT token.
        """

        self.client.credentials()

        response = self.client.get("/api/users/profile/")

        # DRF returns 403 (not 401) because SessionAuthentication is the
        # first authenticator in DEFAULT_AUTHENTICATION_CLASSES and sends no
        # WWW-Authenticate header. Matches the labor and booking app tests.
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )
