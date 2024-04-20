from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttractionViewSet, BestAttractionsRatingAPIView

# Create a router and register our viewset with it.
router = DefaultRouter()
router.register(r'attractions', AttractionViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('best_attractions_rating/', BestAttractionsRatingAPIView.as_view(), name='best_attractions_rating'),
]
