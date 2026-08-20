from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.labor.models import Labor


class Booking(models.Model):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (ACCEPTED, "Accepted"),
        (REJECTED, "Rejected"),
        (COMPLETED, "Completed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    labor = models.ForeignKey(
        Labor,
        on_delete=models.PROTECT,
        related_name="bookings",
    )
    work_date = models.DateField()
    start_time = models.TimeField()
    duration = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.50")),
            MaxValueValidator(Decimal("24.00")),
        ],
        help_text="Job duration in hours, from 0.5 to 24.",
    )
    address = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        """Return the booking number, laborer, and work date."""
        return f"Booking {self.pk}: {self.labor.name} on {self.work_date}"
