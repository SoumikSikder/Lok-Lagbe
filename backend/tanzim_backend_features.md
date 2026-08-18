# Tanzim Ahamad's Backend Features: View Hire History & Manage Favorite Laborers

This document contains all backend models, serializers, views, URL routes, and Pytest test suites implemented for Tanzim's assigned features.

---

## 1. Manage Favorite Laborers

### A. Model (`backend/labor/models.py`)
```python
from django.conf import settings
from django.db import models
from labor.models import Labor

class Favorite(models.Model):
    """
    Model representing a user's favorited laborer profile.

    Attributes:
        user (ForeignKey): User who favorited the laborer.
        labor (ForeignKey): Laborer profile that was favorited.
        created_at (DateTimeField): Timestamp when the favorite was created.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_laborers",
    )
    labor = models.ForeignKey(
        Labor,
        on_delete=models.CASCADE,
        related_name="favorited_by",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "labor"],
                name="unique_favorite_per_user_and_labor",
            ),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        """Return a readable string representation of the favorite entry."""
        return f"{self.user} favorited {self.labor.name}"
```

### B. Serializer (`backend/labor/serializers.py`)
```python
from rest_framework import serializers
from labor.models import Favorite
from labor.serializers import LaborListSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Favorite model.

    Includes nested labor details via `labor_detail` for single-request presentation.
    """

    labor_detail = LaborListSerializer(source="labor", read_only=True)

    class Meta:
        model = Favorite
        fields = [
            "id",
            "user",
            "labor",
            "labor_detail",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "labor_detail",
            "created_at",
        ]
```

### C. Views (`backend/labor/views.py`)
```python
from django.db import IntegrityError
from rest_framework import generics, permissions, serializers
from labor.models import Favorite
from labor.serializers import FavoriteSerializer
from loklagbe.mixins import DatabaseErrorMixin

class FavoriteListCreateAPIView(
    DatabaseErrorMixin,
    generics.ListCreateAPIView,
):
    """
    API view for listing and creating user favorite laborers.

    Allows authenticated users to fetch their favorited laborers or save a new laborer.
    """

    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Retrieve favorite records owned by the authenticated user."""
        return Favorite.objects.filter(
            user=self.request.user
        ).select_related("labor")

    def perform_create(self, serializer):
        """Save a new favorite record for the requesting user, catching duplicate entries."""
        labor = serializer.validated_data["labor"]

        try:
            serializer.save(user=self.request.user)
        except IntegrityError as exception:
            raise serializers.ValidationError(
                {"labor": "This laborer is already in your favorites."}
            ) from exception


class FavoriteDeleteAPIView(
    DatabaseErrorMixin,
    generics.DestroyAPIView,
):
    """
    API view for removing a laborer from user's favorites.

    Restricted to deleting entries owned by the requesting user.
    """

    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter favorite deletion scope to the current authenticated user."""
        return Favorite.objects.filter(
            user=self.request.user
        )
```

### D. URL Routes (`backend/labor/urls.py`)
```python
from django.urls import path
from labor.views import FavoriteListCreateAPIView, FavoriteDeleteAPIView

urlpatterns = [
    path("favorites/", FavoriteListCreateAPIView.as_view(), name="favorite-list-create"),
    path("favorites/<int:pk>/", FavoriteDeleteAPIView.as_view(), name="favorite-delete"),
]
```

### E. Test Suite (`backend/labor/test_favorite.py`)
```python
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from labor.models import Favorite, Labor

class FavoriteLaborApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.user = user_model.objects.create_user(username="tanzim", password="password123")
        cls.other_user = user_model.objects.create_user(username="other", password="password123")
        cls.labor = Labor.objects.create(
            name="Rahim Electrician",
            profession="Electrician",
            category="Electrician",
            location="Dhaka",
            hourly_wage="500.00",
            phone="01700000001",
        )

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_add_favorite_laborer_returns_201_created(self):
        response = self.client.post("/api/favorites/", {"labor": self.labor.id}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_favorite_laborers_returns_only_user_favorites(self):
        Favorite.objects.create(user=self.user, labor=self.labor)
        response = self.client.get("/api/favorites/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_duplicate_favorite_returns_400_bad_request(self):
        Favorite.objects.create(user=self.user, labor=self.labor)
        response = self.client.post("/api/favorites/", {"labor": self.labor.id}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_favorite_laborer_returns_204(self):
        fav = Favorite.objects.create(user=self.user, labor=self.labor)
        response = self.client.delete(f"/api/favorites/{fav.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
```

---

## 2. View Hire History

### A. Serializer (`backend/booking/serializers.py`)
```python
from rest_framework import serializers
from booking.models import Booking

class BookingSerializer(serializers.ModelSerializer):
    labor_hourly_wage = serializers.DecimalField(source="labor.hourly_wage", max_digits=8, decimal_places=2, read_only=True)
    labor_name = serializers.CharField(source="labor.name", read_only=True)
    labor_profession = serializers.CharField(source="labor.profession", read_only=True)
    labor_photo = serializers.ImageField(source="labor.photo", read_only=True)
    labor_rating = serializers.DecimalField(source="labor.rating", max_digits=2, decimal_places=1, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "user", "labor", "labor_hourly_wage", "labor_name",
            "labor_profession", "labor_photo", "labor_rating",
            "work_date", "start_time", "duration", "address", "notes",
            "status", "status_display", "created_at",
        ]
        read_only_fields = ["id", "user", "labor_hourly_wage", "labor_name", "labor_profession", "labor_photo", "labor_rating", "status", "status_display", "created_at"]
```

### B. View (`backend/booking/views.py`)
```python
from rest_framework import generics, permissions
from booking.models import Booking
from booking.serializers import BookingSerializer
from loklagbe.mixins import DatabaseErrorMixin

class BookingHistoryAPIView(DatabaseErrorMixin, generics.ListAPIView):
    """
    API view for retrieving the authenticated user's hire/booking history.

    Supports optional query filtering by `status` (e.g. `?status=pending`)
    and orders results by creation date (`-created_at`).
    """

    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter booking history records to the authenticated user.

        Optionally filters by booking status if provided in request query parameters.
        """
        queryset = Booking.objects.filter(
            user=self.request.user
        ).select_related("labor", "user")

        status_filter = self.request.query_params.get("status", "").strip()
        if status_filter:
            queryset = queryset.filter(status__iexact=status_filter)

        return queryset.order_by("-created_at")
```

### C. URL Route (`backend/booking/urls.py`)
```python
from django.urls import path
from booking.views import BookingHistoryAPIView

urlpatterns = [
    path("bookings/history/", BookingHistoryAPIView.as_view(), name="booking-history"),
]
```

### D. Test Suite (`backend/booking/test_hire_history.py`)
```python
from datetime import date, time, timedelta
from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from booking.models import Booking
from labor.models import Labor

class HireHistoryApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.user = user_model.objects.create_user(username="tanzim", password="password123")
        cls.labor = Labor.objects.create(name="Tamim AC", profession="AC Repair", hourly_wage="600.00")
        cls.booking = Booking.objects.create(
            user=cls.user,
            labor=cls.labor,
            work_date=date.today() + timedelta(days=2),
            start_time=time(10, 0),
            duration=Decimal("2.00"),
            address="Mirpur, Dhaka",
            status=Booking.PENDING,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_get_hire_history_returns_user_bookings(self):
        response = self.client.get("/api/bookings/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_hire_history_status_filter(self):
        response = self.client.get("/api/bookings/history/?status=pending")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
```
