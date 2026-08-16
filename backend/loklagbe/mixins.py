from django.db import DatabaseError
from rest_framework import status
from rest_framework.response import Response


class DatabaseErrorMixin:

    def handle_exception(self, exception):
        """Convert database exceptions into an HTTP 500 response."""
        if isinstance(exception, DatabaseError):
            return Response(
                {"detail": "A database error occurred. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return super().handle_exception(exception)
