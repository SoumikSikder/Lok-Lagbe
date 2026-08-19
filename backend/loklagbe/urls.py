"""
URL configuration for loklagbe project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),

    path(
        "api/",
        include("apps.users.urls"),
    ),
]