Labor Listing Test Suite
========================

The feature suite exercises the public labor-listing endpoint through Django
REST Framework's in-process test client and an isolated pytest-django database.
Six test functions expand into sixteen cases through parameterization.

Fixtures
--------

.. automodule:: tests.conftest
   :members:
   :private-members:
   :show-inheritance:


Feature Tests
-------------

.. automodule:: tests.test_labor_listings
   :members:
   :private-members:
   :show-inheritance:
