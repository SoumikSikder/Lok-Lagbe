"""Authenticated API views for creating and retrieving bookings."""

from django.db import transaction
from rest_framework import generics, permissions, serializers

from apps.booking.models import Booking
from apps.booking.serializers import BookingSerializer
from apps.labor.models import Labor
from loklagbe.mixins import DatabaseErrorMixin


class BookingCreateAPIView(DatabaseErrorMixin, generics.CreateAPIView):
    """Create a pending booking for the authenticated user."""

    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        """Recheck labor availability and persist the user's booking.

        The availability check is repeated after serializer validation so the
        write path does not rely only on an earlier request-validation step.

        :param serializer: Validated booking serializer supplied by DRF.
        :type serializer: apps.booking.serializers.BookingSerializer
        :raises serializers.ValidationError: If the selected laborer is no
            longer available.
        """
        selected_labor = serializer.validated_data["labor"]
        labor = Labor.objects.get(pk=selected_labor.pk)

        if not labor.available:
            raise serializers.ValidationError(
                {"labor": "This laborer is currently unavailable."}
            )

        serializer.save(user=self.request.user, labor=labor)


class BookingDetailAPIView(DatabaseErrorMixin, generics.RetrieveAPIView):
    """Return one booking only when it belongs to the authenticated user."""

    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Limit booking lookup to the current user's records.

        :return: Owner-scoped bookings with related labor and user loaded.
        :rtype: django.db.models.QuerySet
        """
        return Booking.objects.filter(user=self.request.user).select_related(
            "labor",
            "user",
        )
