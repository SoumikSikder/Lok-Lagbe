Lok-Lagbe - Feature Documentation (Tanzim Ahamad)
===================================================

This documentation covers the assigned features implemented for the Lok-Lagbe platform:
1. **View Hire History**
2. **Manage Favorite Laborers**

Generated automatically using **Sphinx**.

.. toctree::
   :maxdepth: 2
   :caption: Features:

   hire_history
   favorites

View Hire History Feature
-------------------------
.. autoclass:: booking.views.BookingHistoryAPIView
   :members:
   :undoc-members:

.. autoclass:: booking.serializers.BookingSerializer
   :members:
   :undoc-members:

Manage Favorite Laborers Feature
--------------------------------
.. autoclass:: labor.models.Favorite
   :members:
   :undoc-members:

.. autoclass:: labor.views.FavoriteListCreateAPIView
   :members:
   :undoc-members:

.. autoclass:: labor.views.FavoriteDeleteAPIView
   :members:
   :undoc-members:

.. autoclass:: labor.serializers.FavoriteSerializer
   :members:
   :undoc-members:
