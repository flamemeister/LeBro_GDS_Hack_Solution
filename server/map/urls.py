from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationsViewSet, DistancesViewSet

router = DefaultRouter()
router.register(r'locations', LocationsViewSet)
router.register(r'distances', DistancesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
