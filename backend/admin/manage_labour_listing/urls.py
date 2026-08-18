from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LaborListingViewSet

router = DefaultRouter()
router.register(r'labour-listings', LaborListingViewSet, basename='labour-listing')

urlpatterns = [
    path('', include(router.urls)),
]
