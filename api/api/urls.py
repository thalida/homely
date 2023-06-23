"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path("", views.home, name="home")
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path("", Home.as_view(), name="home")
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path("blog/", include("blog.urls"))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
from rest_framework import routers
from authentication.views import UserViewSet
from links.views import LinkViewSet
from spaces.views import SpaceViewSet, WidgetViewSet

router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'spaces', SpaceViewSet)
router.register(r'widgets', WidgetViewSet)
router.register(r'links', LinkViewSet)


urlpatterns = [
    path("api/", include(router.urls)),
    re_path(r'^api/auth/', include('drf_social_oauth2.urls', namespace='drf')),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
