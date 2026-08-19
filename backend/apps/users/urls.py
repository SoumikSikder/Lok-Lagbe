from django.urls import path

from apps.users.views import LoginView, ProfileView, RegisterView

# URL patterns for the users app
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
