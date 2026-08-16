from django.urls import path

from labor.views import (
    LaborDetailAPIView,
    LaborListAPIView,
    ReviewCreateAPIView,
)


app_name = "labor"

urlpatterns = [
    path("labors/", LaborListAPIView.as_view(), name="labor-list"),
    path(
        "labors/<int:pk>/",
        LaborDetailAPIView.as_view(),
        name="labor-detail",
    ),
    path("reviews/", ReviewCreateAPIView.as_view(), name="review-create"),
]
