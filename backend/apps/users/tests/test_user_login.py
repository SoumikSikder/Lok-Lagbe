from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class TestUserLogin(APITestCase):
    """
    Test cases for user login functionality.
    """

    def setUp(self):
        """
        Create a test user before each test.
        """

        self.user = User.objects.create_user(
            username="testuser",
            email="test@gmail.com",
            password="testpassword123",
        )

    def test_user_login_success(self):
        """
        Test successful user login with valid credentials.
        """

        response = self.client.post(
            "/api/users/login/",
            {
                "username": "testuser",
                "password": "testpassword123",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn(
            "access",
            response.data,
        )

        self.assertIn(
            "refresh",
            response.data,
        )

    def test_user_login_failed(self):
        """
        Test login failure with incorrect password.
        """

        response = self.client.post(
            "/api/users/login/",
            {
                "username": "testuser",
                "password": "wrongpassword",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
