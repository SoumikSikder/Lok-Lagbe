Manage Favorite Laborers Feature
================================

Overview
--------
The Favorite Laborers feature allows authenticated users to save reliable local workers for fast re-hiring.

API Endpoints
-------------
* **List Favorites**: ``GET /api/favorites/``
* **Add Favorite**: ``POST /api/favorites/`` with payload ``{"labor": <id>}``
* **Delete Favorite**: ``DELETE /api/favorites/<pk>/``

Classes
-------
.. autoclass:: labor.models.Favorite
   :members:

.. autoclass:: labor.views.FavoriteListCreateAPIView
   :members:

.. autoclass:: labor.views.FavoriteDeleteAPIView
   :members:

.. autoclass:: labor.serializers.FavoriteSerializer
   :members:

Unit Test Suite
---------------
.. autoclass:: labor.test_favorite.FavoriteLaborApiTests
   :members:
