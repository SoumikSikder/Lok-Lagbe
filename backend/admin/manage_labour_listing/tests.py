from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from .models import LaborListing


class LaborListingBackendTestCase(TestCase):
    """
    Test suite for the Manage Labour Listing backend API.

    Verifies CRUD operations, mandatory field validations, profile picture
    extension rules, and email lock enforcement during updates.
    """

    def setUp(self):
        """
        Sets up test database records and API client instance.

        :return: None
        """
        self.client = APIClient()
        self.listing = LaborListing.objects.create(
            name="Rahim Ahmed",
            email="rahim@example.com",
            category="Electrician",
            skills="Wiring, Circuit Repair",
            availability="Full Time",
            status="Active",
            phone="01711000000"
        )
        self.list_url = "/api/admin/labour-listings/"
        self.detail_url = f"/api/admin/labour-listings/{self.listing.id}/"

    def test_list_labor_listings(self):
        """
        Tests retrieving all labor listings.

        :return: None
        """
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_create_labor_listing_success(self):
        """
        Tests creating a new labor listing with valid fields.

        :return: None
        """
        payload = {
            "name": "Karim Hossain",
            "email": "karim@example.com",
            "category": "Plumber",
            "skills": "Pipe Fitting, Leak Repair",
            "availability": "Part Time",
            "status": "Active",
            "phone": "01811000000"
        }
        response = self.client.post(self.list_url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])

    def test_create_labor_listing_empty_mandatory_field(self):
        """
        Tests creating a listing with missing mandatory fields.

        :return: None
        """
        payload = {
            "name": "",
            "email": "invalid@example.com",
            "category": "Painter",
            "phone": ""
        }
        response = self.client.post(self.list_url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_update_labor_listing_success(self):
        """
        Tests updating listing details without changing email.

        :return: None
        """
        payload = {
            "name": "Rahim Ahmed Updated",
            "email": "rahim@example.com",
            "category": "Electrician",
            "skills": "Advanced Wiring",
            "availability": "Weekends",
            "status": "Active",
            "phone": "01711999999"
        }
        response = self.client.put(self.detail_url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_update_labor_listing_email_locked_exception(self):
        """
        Tests that modifying the email address during update fails.

        :return: None
        """
        payload = {
            "name": "Rahim Ahmed",
            "email": "new_rahim@example.com",
            "category": "Electrician",
            "phone": "01711000000"
        }
        response = self.client.put(self.detail_url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('email', response.data['errors'])

    def test_upload_invalid_image_format_exception(self):
        """
        Tests that uploading unsupported image formats is rejected.

        :return: None
        """
        text_file = SimpleUploadedFile(
            "test_doc.txt",
            b"file_content",
            content_type="text/plain"
        )
        payload = {
            "name": "Salam Ali",
            "email": "salam@example.com",
            "category": "Mason",
            "phone": "01911000000",
            "profile_image": text_file
        }
        response = self.client.post(
            self.list_url,
            data=payload,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('profile_image', response.data['errors'])

    def test_delete_labor_listing(self):
        """
        Tests deleting an existing labor listing.

        :return: None
        """
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertFalse(
            LaborListing.objects.filter(id=self.listing.id).exists()
        )
