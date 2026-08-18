from django.db import transaction
from rest_framework import generics, permissions, serializers

from booking.models import Booking
from booking.serializers import BookingSerializer
from labor.models import Labor
from loklagbe.mixins import DatabaseErrorMixin


class BookingCreateAPIView(DatabaseErrorMixin, generics.CreateAPIView):

    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        selected_labor = serializer.validated_data["labor"]
        labor = Labor.objects.get(pk=selected_labor.pk)

        if not labor.available:
            raise serializers.ValidationError(
                {"labor": "This laborer is currently unavailable."}
            )

        serializer.save(user=self.request.user, labor=labor)


class BookingDetailAPIView(DatabaseErrorMixin, generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Limit booking lookup to the current user's records."""
        return Booking.objects.filter(user=self.request.user).select_related(
            "labor",
            "user",
        )

class BookingHistoryAPIView(DatabaseErrorMixin, generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Booking.objects.filter(
            user=self.request.user
        ).select_related("labor", "user")

        status_filter = self.request.query_params.get("status", "").strip()
        if status_filter:
            queryset = queryset.filter(status__iexact=status_filter)

        return queryset.order_by("-created_at")

