from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, UserSerializer


class LoginView(APIView):
    """
    Handles user login and JWT token generation.
    """
    permission_classes = [
        AllowAny
    ]

    def post(self, request):
        """
        Authenticate user and return JWT tokens.

        Args:
            request: HTTP request containing username and password.

        Returns:
            Response containing access and refresh tokens.
        """

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "message": "Login successful",
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    """
    Handles viewing and updating user profile information.
    """

    permission_classes = [
        IsAuthenticated
    ]


    def get(self, request):
        """
        Retrieve logged-in user's profile data.

        Args:
            request: HTTP request.

        Returns:
            Response containing user profile information.
        """

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


    def put(self, request):
        """
        Update logged-in user's profile information.

        Args:
            request: HTTP request containing updated data.

        Returns:
            Response containing updated profile data.
        """

        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Profile updated successfully",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
