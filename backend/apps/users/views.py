from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from apps.users.serializers import RegisterSerializer


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
        )