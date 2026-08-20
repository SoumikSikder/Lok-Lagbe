View Hire History Feature
=========================

Overview
--------
The Hire History feature enables consumers to track past and current hires across Bangladesh.

API Endpoints
-------------
* **List Booking History**: ``GET /api/bookings/history/``
* **Status Filter**: ``GET /api/bookings/history/?status=pending|accepted|completed|rejected``

Classes
-------
.. autoclass:: booking.views.BookingHistoryAPIView
   :members:

.. autoclass:: booking.serializers.BookingSerializer
   :members:

Unit Test Suite
---------------
.. autoclass:: booking.test_hire_history.HireHistoryApiTests
   :members:
