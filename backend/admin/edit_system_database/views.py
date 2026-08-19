from django.contrib.auth import get_user_model
from django.db import DatabaseError, IntegrityError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from admin.manage_labour_listing.models import LaborListing

User = get_user_model()


def _get_model_by_table_name(table_name):
    """
    Helper function to map table name string to Django ORM model class.

    :parameter table_name: Table identifier string ('users' or 'labor_listings')
    :return: Django Model class or None
    """
    mapping = {
        'users': User,
        'labor_listings': LaborListing,
    }
    return mapping.get(table_name.lower())


@api_view(['GET'])
@permission_classes([AllowAny])
def list_system_tables(request):
    """
    API view to list available system database tables and record counts.

    :parameter request: Django HTTP request object
    :return: Response containing table metadata and record counts
    """
    try:
        tables = [
            {
                'table_key': 'users',
                'display_name': 'System Users',
                'record_count': User.objects.count(),
            },
            {
                'table_key': 'labor_listings',
                'display_name': 'Labor Listings',
                'record_count': LaborListing.objects.count(),
            },
        ]
        return Response(
            {
                'success': True,
                'message': 'System database tables retrieved successfully.',
                'data': tables,
            },
            status=status.HTTP_200_OK,
        )
    except DatabaseError:
        return Response(
            {
                'success': False,
                'message': (
                    'Server or database connection fails. '
                    'Please try again.'
                ),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def list_table_records(request):
    """
    API view to list all database records for a selected table.

    :parameter request: Django HTTP request object containing 'table' query param
    :return: Response containing list of record dictionaries
    """
    table_name = request.query_params.get('table', '')
    model_class = _get_model_by_table_name(table_name)

    if not model_class:
        return Response(
            {
                'success': False,
                'message': 'Invalid system table selected.',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        records = list(model_class.objects.values())
        return Response(
            {
                'success': True,
                'message': 'Database records retrieved successfully.',
                'table': table_name,
                'data': records,
            },
            status=status.HTTP_200_OK,
        )
    except DatabaseError:
        return Response(
            {
                'success': False,
                'message': (
                    'Server or database connection fails. '
                    'Please try again.'
                ),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_record_detail(request):
    """
    API view to retrieve detailed current information of a selected record.

    :parameter request: Django HTTP request object with 'table' and 'id' params
    :return: Response containing record field values or 404 error
    """
    table_name = request.query_params.get('table', '')
    record_id = request.query_params.get('id', '')

    model_class = _get_model_by_table_name(table_name)
    if not model_class or not record_id:
        return Response(
            {
                'success': False,
                'message': 'Please specify valid table name and record ID.',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        instance = model_class.objects.filter(id=record_id).values().first()
        if not instance:
            return Response(
                {
                    'success': False,
                    'message': 'Selected record cannot be found.',
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                'success': True,
                'message': 'Record information retrieved successfully.',
                'data': instance,
            },
            status=status.HTTP_200_OK,
        )
    except DatabaseError:
        return Response(
            {
                'success': False,
                'message': (
                    'Server or database connection fails. '
                    'Please try again.'
                ),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['PUT', 'POST'])
@permission_classes([AllowAny])
def update_system_record(request):
    """
    API view to update a selected database record with validation.

    Handles empty required fields, record existence, unique constraints,
    and database error exceptions.

    :parameter request: Django HTTP request object with record payload
    :return: Response indicating update status
    """
    table_name = request.data.get('table', '')
    record_id = request.data.get('id', '')
    fields_data = request.data.get('fields', {})

    model_class = _get_model_by_table_name(table_name)
    if not model_class or not record_id:
        return Response(
            {
                'success': False,
                'message': 'Please specify valid table name and record ID.',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check for empty mandatory values
    for field_key, value in fields_data.items():
        if value is None or (isinstance(value, str) and not value.strip()):
            return Response(
                {
                    'success': False,
                    'message': (
                        f"Field '{field_key}' is mandatory. "
                        "Please complete all mandatory fields."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    try:
        record_obj = model_class.objects.filter(id=record_id).first()
        if not record_obj:
            return Response(
                {
                    'success': False,
                    'message': (
                        'Selected record cannot be found. '
                        'Database records refreshed.'
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Update field attributes dynamically
        for field_key, value in fields_data.items():
            if hasattr(record_obj, field_key):
                setattr(record_obj, field_key, value)

        record_obj.save()

        return Response(
            {
                'success': True,
                'message': 'Database record has been updated successfully.',
                'data': model_class.objects.filter(id=record_id).values().first(),
            },
            status=status.HTTP_200_OK,
        )
    except IntegrityError:
        return Response(
            {
                'success': False,
                'message': (
                    'Updated information violates system constraints '
                    '(such as duplicate unique values). '
                    'Please provide valid unique information.'
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    except DatabaseError:
        return Response(
            {
                'success': False,
                'message': (
                    'Server or database connection fails. '
                    'Please try again.'
                ),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
