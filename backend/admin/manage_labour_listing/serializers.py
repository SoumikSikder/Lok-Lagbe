import os
from rest_framework import serializers
from .models import LaborListing


class LaborListingSerializer(serializers.ModelSerializer):
    """
    Serializer for the LaborListing model.

    Handles validation for mandatory fields, profile image format,
    and enforces the rule that email cannot be modified after registration.
    """

    ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

    class Meta:
        model = LaborListing
        fields = [
            'id',
            'name',
            'email',
            'category',
            'skills',
            'availability',
            'status',
            'phone',
            'profile_image',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_profile_image(self, value):
        """
        Validates the file extension of the uploaded profile image.

        :parameter value: The uploaded file object
        :return: Validated file object
        :raises serializers.ValidationError: If format is unsupported
        """
        if value:
            extension = os.path.splitext(value.name)[1].lower()
            if extension not in self.ALLOWED_IMAGE_EXTENSIONS:
                raise serializers.ValidationError(
                    "Unsupported image format. "
                    "Please upload a JPG, JPEG, PNG, or WEBP image."
                )
        return value

    def validate_email(self, value):
        """
        Validates that mandatory email is provided and not duplicated.

        :parameter value: Email string
        :return: Validated email string
        :raises serializers.ValidationError: If email is empty
        """
        if not value or not value.strip():
            raise serializers.ValidationError(
                "Email field is mandatory and cannot be empty."
            )
        return value.strip()

    def update(self, instance, validated_data):
        """
        Updates an existing LaborListing instance.

        Enforces the exception rule that email cannot be edited after creation.

        :parameter instance: Existing LaborListing object
        :parameter validated_data: Dictionary of validated field values
        :return: Updated LaborListing instance
        :raises serializers.ValidationError: If email change is attempted
        """
        new_email = validated_data.get('email')
        if new_email and new_email.lower() != instance.email.lower():
            raise serializers.ValidationError(
                {'email': 'The email field is locked and cannot be edited.'}
            )

        return super().update(instance, validated_data)
