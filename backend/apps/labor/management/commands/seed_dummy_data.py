"""Create reusable demonstration data for local development."""

from datetime import date, time, timedelta
from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Avg, Count
from django.utils.text import slugify
from PIL import Image, ImageDraw, ImageFont

from apps.booking.models import Booking
from apps.labor.models import Labor, Review


LABOR_DATA = [
    {
        "name": "Rahim Uddin",
        "profession": "Residential Electrician",
        "category": "Electrician",
        "location": "Dhanmondi, Dhaka",
        "hourly_wage": "450.00",
        "description": (
            "Experienced in household wiring, switchboards, and electrical "
            "fault diagnosis."
        ),
        "phone": "01710000001",
        "email": "rahim.electrician@example.com",
        "available": True,
        "experience": 8,
        "skills": ["House wiring", "Circuit repair", "Safety inspection"],
        "color": "#2563EB",
    },
    {
        "name": "Karim Mia",
        "profession": "Plumber",
        "category": "Plumber",
        "location": "Mirpur, Dhaka",
        "hourly_wage": "380.00",
        "description": (
            "Handles pipe installation, leak repair, and bathroom fitting "
            "work."
        ),
        "phone": "01710000002",
        "email": "karim.plumber@example.com",
        "available": True,
        "experience": 6,
        "skills": ["Leak repair", "Pipe fitting", "Bathroom fixtures"],
        "color": "#0891B2",
    },
    {
        "name": "Selim Ahmed",
        "profession": "Furniture Carpenter",
        "category": "Carpenter",
        "location": "Uttara, Dhaka",
        "hourly_wage": "520.00",
        "description": (
            "Builds and repairs custom wooden furniture for homes and small "
            "offices."
        ),
        "phone": "01710000003",
        "email": "selim.carpenter@example.com",
        "available": False,
        "experience": 12,
        "skills": ["Furniture making", "Wood polishing", "Cabinet repair"],
        "color": "#B45309",
    },
    {
        "name": "Nasima Akter",
        "profession": "House Painter",
        "category": "Painter",
        "location": "Mohammadpur, Dhaka",
        "hourly_wage": "350.00",
        "description": (
            "Provides clean interior and exterior painting with careful "
            "surface preparation."
        ),
        "phone": "01710000004",
        "email": "nasima.painter@example.com",
        "available": True,
        "experience": 5,
        "skills": ["Interior painting", "Wall preparation", "Color mixing"],
        "color": "#DB2777",
    },
    {
        "name": "Jamal Hossain",
        "profession": "Construction Mason",
        "category": "Mason",
        "location": "Savar, Dhaka",
        "hourly_wage": "480.00",
        "description": (
            "Works on brick walls, plastering, floor repair, and small "
            "construction projects."
        ),
        "phone": "01710000005",
        "email": "jamal.mason@example.com",
        "available": True,
        "experience": 10,
        "skills": ["Brickwork", "Plastering", "Floor repair"],
        "color": "#DC2626",
    },
    {
        "name": "Shahana Begum",
        "profession": "Home Cleaner",
        "category": "Cleaner",
        "location": "Banani, Dhaka",
        "hourly_wage": "280.00",
        "description": (
            "Offers dependable home, kitchen, and post-renovation cleaning "
            "services."
        ),
        "phone": "01710000006",
        "email": "shahana.cleaner@example.com",
        "available": True,
        "experience": 4,
        "skills": ["Deep cleaning", "Kitchen cleaning", "Window cleaning"],
        "color": "#059669",
    },
    {
        "name": "Babul Chandra",
        "profession": "Garden Care Worker",
        "category": "Gardener",
        "location": "Gazipur",
        "hourly_wage": "300.00",
        "description": (
            "Maintains gardens through planting, pruning, lawn care, and pest "
            "control."
        ),
        "phone": "01710000007",
        "email": "babul.gardener@example.com",
        "available": False,
        "experience": 7,
        "skills": ["Planting", "Pruning", "Lawn care"],
        "color": "#16A34A",
    },
    {
        "name": "Faruk Hasan",
        "profession": "AC Service Technician",
        "category": "AC Technician",
        "location": "Bashundhara, Dhaka",
        "hourly_wage": "650.00",
        "description": (
            "Diagnoses, cleans, and repairs residential air-conditioning "
            "systems."
        ),
        "phone": "01710000008",
        "email": "faruk.ac@example.com",
        "available": True,
        "experience": 9,
        "skills": ["AC servicing", "Gas refill", "Compressor diagnosis"],
        "color": "#7C3AED",
    },
    {
        "name": "Rina Khatun",
        "profession": "Office Cleaner",
        "category": "Cleaner",
        "location": "Motijheel, Dhaka",
        "hourly_wage": "320.00",
        "description": (
            "Provides scheduled office cleaning with attention to shared "
            "workspaces."
        ),
        "phone": "01710000009",
        "email": "rina.cleaner@example.com",
        "available": True,
        "experience": 6,
        "skills": ["Office cleaning", "Floor care", "Waste management"],
        "color": "#0D9488",
    },
    {
        "name": "Habib Rahman",
        "profession": "Commercial Electrician",
        "category": "Electrician",
        "location": "Agrabad, Chattogram",
        "hourly_wage": "580.00",
        "description": (
            "Installs and maintains electrical systems for shops and small "
            "businesses."
        ),
        "phone": "01710000010",
        "email": "habib.electrician@example.com",
        "available": True,
        "experience": 11,
        "skills": ["Commercial wiring", "Panel setup", "Load testing"],
        "color": "#4F46E5",
    },
    {
        "name": "Monirul Islam",
        "profession": "Sanitary Plumber",
        "category": "Plumber",
        "location": "Sonadanga, Khulna",
        "hourly_wage": "340.00",
        "description": (
            "Specializes in sanitary lines, water tanks, and drainage repair."
        ),
        "phone": "01710000011",
        "email": "monirul.plumber@example.com",
        "available": True,
        "experience": 5,
        "skills": ["Sanitary lines", "Tank fitting", "Drain cleaning"],
        "color": "#0284C7",
    },
    {
        "name": "Abdul Kader",
        "profession": "Door and Window Carpenter",
        "category": "Carpenter",
        "location": "Zindabazar, Sylhet",
        "hourly_wage": "460.00",
        "description": (
            "Repairs and installs wooden doors, windows, locks, and frames."
        ),
        "phone": "01710000012",
        "email": "kader.carpenter@example.com",
        "available": True,
        "experience": 8,
        "skills": ["Door fitting", "Window repair", "Lock installation"],
        "color": "#C2410C",
    },
]

USER_DATA = [
    ("demo_amina", "Amina", "Rahman", "amina@example.com"),
    ("demo_tanvir", "Tanvir", "Ahmed", "tanvir@example.com"),
    ("demo_sadia", "Sadia", "Islam", "sadia@example.com"),
    ("demo_nabil", "Nabil", "Hasan", "nabil@example.com"),
]

REVIEW_DATA = [
    ("demo_amina", "rahim.electrician@example.com", 5, "Very professional."),
    ("demo_tanvir", "rahim.electrician@example.com", 4, "Arrived on time."),
    ("demo_sadia", "karim.plumber@example.com", 5, "Fixed the leak quickly."),
    ("demo_nabil", "karim.plumber@example.com", 4, "Good quality work."),
    ("demo_amina", "selim.carpenter@example.com", 5, "Excellent finish."),
    ("demo_tanvir", "nasima.painter@example.com", 4, "Neat painting work."),
    ("demo_sadia", "jamal.mason@example.com", 5, "Strong brickwork."),
    ("demo_nabil", "shahana.cleaner@example.com", 5, "Thorough cleaning."),
    ("demo_amina", "babul.gardener@example.com", 4, "Garden looks fresh."),
    ("demo_tanvir", "faruk.ac@example.com", 5, "AC works perfectly now."),
    ("demo_sadia", "rina.cleaner@example.com", 4, "Reliable service."),
    ("demo_nabil", "habib.electrician@example.com", 5, "Highly skilled."),
    ("demo_amina", "monirul.plumber@example.com", 3, "Work was satisfactory."),
    ("demo_tanvir", "kader.carpenter@example.com", 4, "Good door repair."),
]


class Command(BaseCommand):
    """Seed local development data without creating duplicate records."""

    help = "Create dummy labor profiles, users, reviews, and bookings."

    @transaction.atomic
    def handle(self, *args, **options):
        """Create or update every dummy record in one transaction."""
        users = self._create_users()
        labors = self._create_labors()
        self._create_reviews(users, labors)
        self._update_review_summaries(labors)
        self._create_bookings(users, labors)

        self.stdout.write(
            self.style.SUCCESS(
                "Dummy data ready: 12 labors, 4 users, 14 reviews, "
                "and 6 bookings."
            )
        )

    def _create_users(self):
        """Create non-login demo users required by bookings and reviews."""
        user_model = get_user_model()
        users = {}

        for username, first_name, last_name, email in USER_DATA:
            user, created = user_model.objects.get_or_create(
                username=username,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                },
            )
            if created:
                user.set_unusable_password()
                user.save(update_fields=["password"])
            users[username] = user

        return users

    def _create_labors(self):
        """Create labor profiles and a placeholder photo for each one."""
        labors = {}

        for item in LABOR_DATA:
            data = item.copy()
            color = data.pop("color")
            email = data.pop("email")
            photo_name = self._create_photo(data["name"], color)
            data["photo"] = photo_name

            labor, _ = Labor.objects.update_or_create(
                email=email,
                defaults=data,
            )
            labors[email] = labor

        return labors

    def _create_photo(self, name, color):
        """Create a simple JPEG containing the laborer's initials."""
        photo_directory = Path(settings.MEDIA_ROOT) / "labor_photos"
        photo_directory.mkdir(parents=True, exist_ok=True)
        file_name = f"{slugify(name)}.jpg"
        photo_path = photo_directory / file_name

        if not photo_path.exists():
            image = Image.new("RGB", (640, 480), color)
            draw = ImageDraw.Draw(image)
            font = ImageFont.load_default(size=96)
            initials = "".join(part[0] for part in name.split()[:2]).upper()
            bounds = draw.textbbox((0, 0), initials, font=font)
            text_width = bounds[2] - bounds[0]
            text_height = bounds[3] - bounds[1]
            position = (
                (image.width - text_width) / 2,
                (image.height - text_height) / 2,
            )
            draw.text(position, initials, fill="white", font=font)
            image.save(photo_path, quality=90)

        return f"labor_photos/{file_name}"

    def _create_reviews(self, users, labors):
        """Create one review for every configured user and labor pair."""
        for username, labor_email, rating, comment in REVIEW_DATA:
            Review.objects.update_or_create(
                user=users[username],
                labor=labors[labor_email],
                defaults={"rating": rating, "comment": comment},
            )

    def _update_review_summaries(self, labors):
        """Synchronize cached rating values on each labor profile."""
        for labor in labors.values():
            summary = labor.reviews.aggregate(
                average=Avg("rating"),
                count=Count("id"),
            )
            average = summary["average"] or 0
            labor.rating = Decimal(str(average)).quantize(Decimal("0.1"))
            labor.review_count = summary["count"]
            labor.save(update_fields=["rating", "review_count"])

    def _create_bookings(self, users, labors):
        """Create bookings covering each supported status."""
        booking_data = [
            (
                "DUMMY-BK-001",
                "demo_amina",
                "rahim.electrician@example.com",
                2,
                time(9, 0),
                "2.00",
                "House 12, Dhanmondi, Dhaka",
                Booking.PENDING,
            ),
            (
                "DUMMY-BK-002",
                "demo_tanvir",
                "karim.plumber@example.com",
                3,
                time(10, 30),
                "1.50",
                "Road 5, Mirpur, Dhaka",
                Booking.ACCEPTED,
            ),
            (
                "DUMMY-BK-003",
                "demo_sadia",
                "nasima.painter@example.com",
                5,
                time(8, 0),
                "8.00",
                "Block C, Mohammadpur, Dhaka",
                Booking.ACCEPTED,
            ),
            (
                "DUMMY-BK-004",
                "demo_nabil",
                "faruk.ac@example.com",
                -3,
                time(14, 0),
                "2.00",
                "Bashundhara R/A, Dhaka",
                Booking.COMPLETED,
            ),
            (
                "DUMMY-BK-005",
                "demo_amina",
                "jamal.mason@example.com",
                7,
                time(7, 30),
                "6.00",
                "Savar Bus Stand, Dhaka",
                Booking.PENDING,
            ),
            (
                "DUMMY-BK-006",
                "demo_tanvir",
                "selim.carpenter@example.com",
                -5,
                time(11, 0),
                "3.00",
                "Sector 7, Uttara, Dhaka",
                Booking.REJECTED,
            ),
        ]

        for (
            reference,
            username,
            labor_email,
            day_offset,
            start_time,
            duration,
            address,
            status,
        ) in booking_data:
            Booking.objects.update_or_create(
                user=users[username],
                labor=labors[labor_email],
                notes=reference,
                defaults={
                    "work_date": date.today() + timedelta(days=day_offset),
                    "start_time": start_time,
                    "duration": Decimal(duration),
                    "address": address,
                    "status": status,
                },
            )
