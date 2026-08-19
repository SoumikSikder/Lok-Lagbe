from django.contrib.auth import authenticate

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying and updating user profile information.
    """

    class Meta:
        """
        Defines the model and fields for user data.
        """

        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "address",
            "avatar",
        ]

        read_only_fields = [
            "id",
            "username",
        ]


class LoginSerializer(serializers.Serializer):
    """
    Serializer for validating user login credentials.
    """

    username = serializers.CharField()

    password = serializers.CharField(
        write_only=True
    )


    def validate(self, data):
        """
        Authenticate user credentials.

        Args:
            data (dict): Login information.

        Returns:
            dict: Validated login data.

        Raises:
            ValidationError: If login credentials are invalid.
        """

        user = authenticate(
            username=data.get("username"),
            password=data.get("password")
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        data["user"] = user

        return data