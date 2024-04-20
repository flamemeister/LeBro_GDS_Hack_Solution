from rest_framework import viewsets
from .models import Locations, Distances
from .serializers import LocationsSerializer, DistancesSerializer

class LocationsViewSet(viewsets.ModelViewSet):
    queryset = Locations.objects.all()
    serializer_class = LocationsSerializer

class DistancesViewSet(viewsets.ModelViewSet):
    queryset = Distances.objects.all()
    serializer_class = DistancesSerializer
