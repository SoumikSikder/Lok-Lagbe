"""Database models for labor profiles and customer reviews."""

from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Labor(models.Model):
    """Represent a local professional displayed in the labor marketplace.

    Profiles contain public listing information, contact details, availability,
    experience, and the denormalized rating summary used for sorting.
    """

    name = models.CharField(max_length=150)
    photo = models.ImageField(upload_to="labor_photos/")
    profession = models.CharField(max_length=100)
    category = models.CharField(max_length=100, db_index=True)
    location = models.CharField(max_length=255, db_index=True)
    hourly_wage = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=Decimal("0.0"),
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    review_count = models.PositiveIntegerField(default=0)
    description = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    available = models.BooleanField(default=True, db_index=True)
    experience = models.PositiveIntegerField(
        default=0,
        help_text="Number of complete years of work experience.",
    )
    skills = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-rating", "name"]
        indexes = [
            models.Index(
                fields=["category", "hourly_wage"],
                name="labor_category_wage_idx",
            ),
        ]

    def __str__(self):
        """Return the laborer's name and profession."""
        return f"{self.name} - {self.profession}"


class Review(models.Model):
    """Store one authenticated user's rating of a laborer.

    A database constraint prevents a user from reviewing the same laborer more
    than once.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews_written",
    )
    labor = models.ForeignKey(
        Labor,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:

        ordering = ["-date"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "labor"],
                name="unique_review_per_user_and_labor",
            ),
        ]

    def __str__(self):
        """Return a readable summary of the review."""
        return f"{self.user} rated {self.labor.name} {self.rating}/5"
