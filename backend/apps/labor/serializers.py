from rest_framework import serializers

from apps.labor.models import Labor, Review


class LaborListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Labor
        fields = [
            "id",
            "name",
            "photo",
            "profession",
            "category",
            "location",
            "hourly_wage",
            "rating",
            "review_count",
            "description",
            "available",
            "experience",
        ]
        read_only_fields = fields


class ReviewSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(
        source="user.get_full_name",
        read_only=True,
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "user_name",
            "labor",
            "rating",
            "comment",
            "date",
        ]
        read_only_fields = ["id", "user", "user_name", "date"]

    def validate(self, attributes):
        request = self.context.get("request")
        labor = attributes.get("labor")

        if request and request.user.is_authenticated and labor:
            reviews = Review.objects.filter(
                user=request.user,
                labor=labor,
            )
            if self.instance:
                reviews = reviews.exclude(pk=self.instance.pk)
            if reviews.exists():
                raise serializers.ValidationError(
                    {"labor": "You have already reviewed this laborer."}
                )

        return attributes


class LaborDetailSerializer(serializers.ModelSerializer):

    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Labor
        fields = [
            "id",
            "name",
            "photo",
            "profession",
            "category",
            "location",
            "hourly_wage",
            "rating",
            "review_count",
            "description",
            "phone",
            "email",
            "available",
            "experience",
            "skills",
            "created_at",
            "reviews",
        ]
        read_only_fields = fields
