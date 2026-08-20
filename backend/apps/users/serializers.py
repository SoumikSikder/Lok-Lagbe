<<<<<<< HEAD
from rest_framework import serializers
from apps.users.models import User

=======
from django.contrib.auth import authenticate

from rest_framework import serializers

from apps.users.models import User
>>>>>>> build

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for handling user registration data.

    Validates incoming registration data and creates a new user
    using the create_user service function.

    Fields:
        username (str): The user's chosen username.
        email (str): The user's email address.
        password (str): The user's password. Write only, never returned in response.
        phone_number (str): The user's phone number. Optional.
        address (str): The user's home address. Optional.
        avatar (int): The user's selected avatar between 1 and 5.
    """

    # password is write only so it never gets returned in any response.
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'phone_number',
            'address',
            'avatar',
        ]

    def validate_email(self, value):
        """
        Checks that the email address is not already registered.

        Args:
            value (str): The email address to validate.

        Returns:
            str: The validated email address.

        Raises:
            serializers.ValidationError: If the email is already in use.
        """

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value

    def validate_username(self, value):
        """
        Checks that the username is not already taken.

        Args:
            value (str): The username to validate.

        Returns:
            str: The validated username.

        Raises:
            serializers.ValidationError: If the username is already taken.
        """

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def create(self, validated_data):
        """
        Creates a new user using the validated data.

        Args:
            validated_data (dict): The validated registration data.

        Returns:
            User: The newly created user object.
        """

        from apps.users.services import create_user

        return create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number'),
            address=validated_data.get('address'),
            avatar=validated_data.get('avatar', 1),
<<<<<<< HEAD
        )
=======
        )


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
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'avatar',
        ]

        read_only_fields = [
            'id',
            'username',
        ]


class LoginSerializer(serializers.Serializer):
    """
    Serializer for validating user login credentials.
    """

    username = serializers.CharField()

    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Authenticate user credentials.

        Args:
            data (dict): Login information.

        Returns:
            dict: Validated login data.

        Raises:
            serializers.ValidationError: If login credentials are invalid.
        """

        user = authenticate(
            username=data.get('username'),
            password=data.get('password'),
        )

        if user is None:
            raise serializers.ValidationError('Invalid username or password.')

        data['user'] = user

        return data
>>>>>>> build
