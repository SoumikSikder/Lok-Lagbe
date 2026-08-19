"""Django application configuration for the labor domain."""

from django.apps import AppConfig


class LaborConfig(AppConfig):
    """Register the relocated labor app while preserving its Django label."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.labor"
    label = "labor"
