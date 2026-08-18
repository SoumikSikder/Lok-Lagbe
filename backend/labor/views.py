from decimal import Decimal, InvalidOperation

from django.db import IntegrityError, transaction
from django.db.models import Avg, Count, Q
from rest_framework import generics, permissions, serializers
from rest_framework.pagination import PageNumberPagination

from labor.models import Favorite, Labor, Review
from labor.serializers import (
    FavoriteSerializer,
    LaborDetailSerializer,
    LaborListSerializer,
    ReviewSerializer,
)
from loklagbe.mixins import DatabaseErrorMixin


class LaborPagination(PageNumberPagination):

    page_size = 8
    page_size_query_param = "page_size"
    max_page_size = 50


class LaborListAPIView(DatabaseErrorMixin, generics.ListAPIView):

    serializer_class = LaborListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = LaborPagination

    SORT_OPTIONS = {
        "highest_rated": ("-rating", "-review_count", "name"),
        "lowest_wage": ("hourly_wage", "-rating", "name"),
        "highest_wage": ("-hourly_wage", "-rating", "name"),
        "most_reviewed": ("-review_count", "-rating", "name"),
    }

    def get_queryset(self):
        queryset = Labor.objects.all()
        parameters = self.request.query_params

        search = parameters.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(profession__icontains=search)
                | Q(category__icontains=search)
                | Q(location__icontains=search)
            )

        category = parameters.get("category", "").strip()
        if category:
            queryset = queryset.filter(category__iexact=category)

        rating = self._parse_decimal_parameter(
            "rating",
            minimum=Decimal("0"),
            maximum=Decimal("5"),
        )
        if rating is not None:
            queryset = queryset.filter(rating__gte=rating)

        minimum_wage = self._parse_decimal_parameter(
            "min_wage",
            minimum=Decimal("0"),
        )
        maximum_wage = self._parse_decimal_parameter(
            "max_wage",
            minimum=Decimal("0"),
        )
        if minimum_wage is not None:
            queryset = queryset.filter(hourly_wage__gte=minimum_wage)
        if maximum_wage is not None:
            queryset = queryset.filter(hourly_wage__lte=maximum_wage)
        if (
            minimum_wage is not None
            and maximum_wage is not None
            and minimum_wage > maximum_wage
        ):
            raise serializers.ValidationError(
                {"max_wage": "Maximum wage must not be below minimum wage."}
            )

        sort = parameters.get("sort", "highest_rated").strip()
        if sort not in self.SORT_OPTIONS:
            valid_options = ", ".join(self.SORT_OPTIONS)
            raise serializers.ValidationError(
                {"sort": f"Choose one of: {valid_options}."}
            )

        return queryset.order_by(*self.SORT_OPTIONS[sort])

    def _parse_decimal_parameter(self, name, minimum=None, maximum=None):
        raw_value = self.request.query_params.get(name)
        if raw_value in (None, ""):
            return None

        try:
            value = Decimal(raw_value)
        except InvalidOperation as exception:
            raise serializers.ValidationError(
                {name: "Enter a valid number."}
            ) from exception

        if not value.is_finite():
            raise serializers.ValidationError(
                {name: "Enter a finite number."}
            )
        if minimum is not None and value < minimum:
            raise serializers.ValidationError(
                {name: f"Ensure this value is at least {minimum}."}
            )
        if maximum is not None and value > maximum:
            raise serializers.ValidationError(
                {name: f"Ensure this value is at most {maximum}."}
            )

        return value


class LaborDetailAPIView(DatabaseErrorMixin, generics.RetrieveAPIView):

    queryset = Labor.objects.prefetch_related("reviews__user")
    serializer_class = LaborDetailSerializer
    permission_classes = [permissions.AllowAny]


class ReviewCreateAPIView(DatabaseErrorMixin, generics.CreateAPIView):

    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        labor = serializer.validated_data["labor"]

        try:
            serializer.save(user=self.request.user)
        except IntegrityError as exception:
            raise serializers.ValidationError(
                {"labor": "You have already reviewed this laborer."}
            ) from exception

        summary = Review.objects.filter(labor=labor).aggregate(
            average=Avg("rating"),
            count=Count("id"),
        )
        labor.rating = Decimal(str(summary["average"])).quantize(
            Decimal("0.1")
        )
        labor.review_count = summary["count"]
        labor.save(update_fields=["rating", "review_count"])

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
