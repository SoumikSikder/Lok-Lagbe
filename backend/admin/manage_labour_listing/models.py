from django.db import models


class LaborListing(models.Model):
    """
    Model representing a labor listing profile in the system.

    Stores contact information, skill sets, availability status,
    and profile pictures of registered laborers.
    """

    CATEGORY_CHOICES = [
        ('Electrician', 'Electrician'),
        ('Plumber', 'Plumber'),
        ('Painter', 'Painter'),
        ('Carpenter', 'Carpenter'),
        ('Cleaner', 'Cleaner'),
        ('Mason', 'Mason'),
        ('Gardener', 'Gardener'),
        ('General Laborer', 'General Laborer'),
    ]

    AVAILABILITY_CHOICES = [
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Weekends', 'Weekends'),
        ('On Call', 'On Call'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Pending', 'Pending'),
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    skills = models.TextField(blank=True, default='')
    availability = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default='Full Time'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Active'
    )
    phone = models.CharField(max_length=15)
    profile_image = models.ImageField(
        upload_to='labor_images/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Labor Listing'
        verbose_name_plural = 'Labor Listings'

    def __str__(self):
        """
        Returns a string representation of the labor listing.

        :return: Name and profession of the laborer
        """
        return f"{self.name} - {self.category}"
