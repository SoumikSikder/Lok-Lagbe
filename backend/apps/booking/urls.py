from django.urls import path

from apps.booking.views import (
    BookingCreateAPIView,
    BookingDetailAPIView,
    BookingHistoryAPIView,
)

app_name = "booking"

urlpatterns = [
    path("bookings/", BookingCreateAPIView.as_view(), name="booking-create"),
    path(
        "bookings/<int:pk>/",
        BookingDetailAPIView.as_view(),
        name="booking-detail",
    ),
    path(
        "bookings/history/",
        BookingHistoryAPIView.as_view(),
        name="booking-history",
    ),
]