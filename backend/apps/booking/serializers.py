"""REST Framework serializer and validation for labor bookings."""

from datetime import date

from rest_framework import serializers

from apps.booking.models import Booking


class BookingSerializer(serializers.ModelSerializer):
    """Serialize booking input and read-only labor/status information.

    Clients select a laborer and submit scheduling details. The authenticated
    user, initial status, labor name, labor wage, and display status are
    controlled by the backend.
    """

    labor_hourly_wage = serializers.DecimalField(
        source="labor.hourly_wage",
        max_digits=8,
        decimal_places=2,
        read_only=True,
    )
    labor_name = serializers.CharField(source="labor.name", read_only=True)
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "labor",
            "labor_hourly_wage",
            "labor_name",
            "work_date",
            "start_time",
            "duration",
            "address",
            "notes",
            "status",
            "status_display",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "labor_hourly_wage",
            "labor_name",
            "status",
            "status_display",
            "created_at",
        ]

    def validate_work_date(self, value):
        """Require the requested work date to be today or later.

        :param datetime.date value: Deserialized booking date.
        :return: Validated date.
        :rtype: datetime.date
        :raises serializers.ValidationError: If the date is in the past.
        """
        if value < date.today():
            raise serializers.ValidationError(
                "Work date cannot be in the past."
            )
        return value

    def validate_labor(self, value):
        """Require the selected laborer to be currently available.

        :param apps.labor.models.Labor value: Selected labor profile.
        :return: Available labor profile.
        :rtype: apps.labor.models.Labor
        :raises serializers.ValidationError: If the laborer is unavailable.
        """
        if not value.available:
            raise serializers.ValidationError(
                "This laborer is currently unavailable."
            )
        return value
