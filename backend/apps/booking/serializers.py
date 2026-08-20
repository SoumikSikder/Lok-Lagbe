from datetime import date

from rest_framework import serializers

from apps.booking.models import Booking


class BookingSerializer(serializers.ModelSerializer):

    labor_hourly_wage = serializers.DecimalField(
        source="labor.hourly_wage",
        max_digits=8,
        decimal_places=2,
        read_only=True,
    )
    labor_name = serializers.CharField(source="labor.name", read_only=True)
    labor_profession = serializers.CharField(source="labor.profession", read_only=True)
    labor_photo = serializers.ImageField(source="labor.photo", read_only=True)
    labor_rating = serializers.DecimalField(
        source="labor.rating",
        max_digits=2,
        decimal_places=1,
        read_only=True,
    )
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
            "labor_profession",
            "labor_photo",
            "labor_rating",
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
            "labor_profession",
            "labor_photo",
            "labor_rating",
            "status",
            "status_display",
            "created_at",
        ]

    def validate_work_date(self, value):
        if value < date.today():
            raise serializers.ValidationError(
                "Work date cannot be in the past."
            )
        return value

    def validate_labor(self, value):
        if not value.available:
            raise serializers.ValidationError(
                "This laborer is currently unavailable."
            )
        return value
