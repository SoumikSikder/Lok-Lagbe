from django.urls import path

from booking.views import BookingCreateAPIView, BookingDetailAPIView


app_name = "booking"

urlpatterns = [
    path("bookings/", BookingCreateAPIView.as_view(), name="booking-create"),
    path(
        "bookings/<int:pk>/",
        BookingDetailAPIView.as_view(),
        name="booking-detail",
    ),
]
