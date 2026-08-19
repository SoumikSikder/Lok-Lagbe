"""Django application configuration for the booking domain."""

from django.apps import AppConfig


class BookingConfig(AppConfig):
    """Register the relocated booking app under its stable Django label."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.booking"
    label = "booking"
