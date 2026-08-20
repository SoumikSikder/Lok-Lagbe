from rest_framework import status, viewsets, serializers
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import DatabaseError
from rest_framework.permissions import AllowAny
from .models import LaborListing
from .serializers import LaborListingSerializer


class LaborListingViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing labor listings.

    Provides CRUD endpoints (list, retrieve, create, update, delete)
    for system administrators to manage labor profiles.
    """

    queryset = LaborListing.objects.all()
    serializer_class = LaborListingSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request, *args, **kwargs):
        """
        Retrieves a list of all labor listing profiles.

        :parameter request: Django HTTP request object
        :return: Response containing list of labor profiles
        """
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Labor listings retrieved successfully.',
                    'data': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except DatabaseError:
            return Response(
                {
                    'success': False,
                    'message': 'Database update fails. Please try again.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request, *args, **kwargs):
        """
        Creates a new labor listing profile.

        :parameter request: Django HTTP request object containing labor data
        :return: Response indicating creation success or validation error
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    'success': False,
                    'message': 'Validation failed. Please check mandatory fields.',
                    'errors': serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            self.perform_create(serializer)
            return Response(
                {
                    'success': True,
                    'message': 'Labor listing has been created successfully.',
                    'data': serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        except DatabaseError:
            return Response(
                {
                    'success': False,
                    'message': 'Database update fails. Changes not saved.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, *args, **kwargs):
        """
        Updates an existing labor listing profile.

        :parameter request: Django HTTP request object containing updated data
        :return: Response indicating update status
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        if not serializer.is_valid():
            return Response(
                {
                    'success': False,
                    'message': 'Validation failed. Check entered fields.',
                    'errors': serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            self.perform_update(serializer)
            return Response(
                {
                    'success': True,
                    'message': 'Labor listing has been updated successfully.',
                    'data': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except serializers.ValidationError as exc:
            return Response(
                {
                    'success': False,
                    'message': 'Validation failed. Check entered fields.',
                    'errors': exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DatabaseError:
            return Response(
                {
                    'success': False,
                    'message': 'Database update fails. Changes not saved.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, *args, **kwargs):
        """
        Removes a labor listing profile from the system.

        :parameter request: Django HTTP request object
        :return: Response confirming removal
        """
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
            return Response(
                {
                    'success': True,
                    'message': 'Labor listing removed successfully.',
                },
                status=status.HTTP_200_OK,
            )
        except DatabaseError:
            return Response(
                {
                    'success': False,
                    'message': 'Database update fails. Unable to remove listing.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
