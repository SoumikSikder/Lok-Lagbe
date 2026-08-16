from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model extending Django's built in AbstractUser.

    Attributes:
        phone_number (str): The user's phone number.
        address (str): The user's home address.
        avatar (int): The user's selected avatar between 1 and 5.
        created_at (datetime): Timestamp when the account was created.
        updated_at (datetime): Timestamp when the account was last updated.
    """
    
    AVATAR_CHOICES = [
        (1, 'Avatar 1'),
        (2, 'Avatar 2'),
        (3, 'Avatar 3'),
        (4, 'Avatar 4'),
        (5, 'Avatar 5'),
    ]

    phone_number = models.CharField(max_length=11, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    avatar = models.IntegerField(choices=AVATAR_CHOICES, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """
        Returns a string representation of the user.

        Returns:
            str: The user's username.
        """
        return self.username