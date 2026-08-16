from django.urls import path
from apps.users.views import RegisterView

# URL patterns for the users app
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
]