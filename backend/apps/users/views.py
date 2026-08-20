<<<<<<< HEAD
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from apps.users.serializers import RegisterSerializer

=======
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)

>>>>>>> build

class RegisterView(APIView):
    """
    API view for handling user registration.

    Accepts POST requests with user registration data,
    validates it and creates a new user account.

    Methods:
        post: Handles the registration request.
    """

    # Allow anyone to access this endpoint.
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handles POST request for user registration.

        Args:
            request (Request): The incoming HTTP request containing
            the registration data in the request body.

        Returns:
            Response: A success message with 201 status if registration
            is successful, or validation errors with 400 status if not.
        """

        # Pass the incoming data to the serializer for validation.
        serializer = RegisterSerializer(data=request.data)

        # Check if the data is valid
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Account created successfully.'},
                status=status.HTTP_201_CREATED
            )

        # If data is invalid return the errors.
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
<<<<<<< HEAD
        )
=======
        )


class LoginView(APIView):
    """
    Handles user login and JWT token generation.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Authenticate user and return JWT tokens.

        Args:
            request: HTTP request containing username and password.

        Returns:
            Response containing access and refresh tokens.
        """

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful',
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    """
    Handles viewing and updating user profile information.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve logged-in user's profile data.

        Args:
            request: HTTP request.

        Returns:
            Response containing user profile information.
        """

        serializer = UserSerializer(request.user)

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

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                'message': 'Profile updated successfully',
                'data': serializer.data,
            },
            status=status.HTTP_200_OK,
        )
>>>>>>> build
