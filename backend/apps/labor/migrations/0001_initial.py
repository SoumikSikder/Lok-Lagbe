from decimal import Decimal

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Labor",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=150)),
                ("photo", models.ImageField(upload_to="labor_photos/")),
                ("profession", models.CharField(max_length=100)),
                ("category", models.CharField(db_index=True, max_length=100)),
                ("location", models.CharField(db_index=True, max_length=255)),
                (
                    "hourly_wage",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(
                                Decimal("0.01")
                            )
                        ],
                    ),
                ),
                (
                    "rating",
                    models.DecimalField(
                        decimal_places=1,
                        default=Decimal("0.0"),
                        max_digits=2,
                        validators=[
                            django.core.validators.MinValueValidator(0),
                            django.core.validators.MaxValueValidator(5),
                        ],
                    ),
                ),
                ("review_count", models.PositiveIntegerField(default=0)),
                ("description", models.TextField()),
                ("phone", models.CharField(max_length=20)),
                ("email", models.EmailField(max_length=254)),
                ("available", models.BooleanField(db_index=True, default=True)),
                (
                    "experience",
                    models.PositiveIntegerField(
                        default=0,
                        help_text="Number of complete years of work experience.",
                    ),
                ),
                ("skills", models.JSONField(blank=True, default=list)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-rating", "name"],
            },
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "rating",
                    models.PositiveSmallIntegerField(
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(5),
                        ]
                    ),
                ),
                ("comment", models.TextField(blank=True)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "labor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to="labor.labor",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews_written",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-date"],
            },
        ),
        migrations.AddIndex(
            model_name="labor",
            index=models.Index(
                fields=["category", "hourly_wage"],
                name="labor_category_wage_idx",
            ),
        ),
        migrations.AddConstraint(
            model_name="review",
            constraint=models.UniqueConstraint(
                fields=("user", "labor"),
                name="unique_review_per_user_and_labor",
            ),
        ),
    ]
