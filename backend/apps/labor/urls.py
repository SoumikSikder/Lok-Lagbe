from django.urls import path

from apps.labor.views import (
    FavoriteDeleteAPIView,
    FavoriteListCreateAPIView,
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
    path(
        "favorites/",
        FavoriteListCreateAPIView.as_view(),
        name="favorite-list-create",
    ),
    path(
        "favorites/<int:pk>/",
        FavoriteDeleteAPIView.as_view(),
        name="favorite-delete",
    ),
]