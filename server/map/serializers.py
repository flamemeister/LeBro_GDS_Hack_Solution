from rest_framework import serializers
from .models import Locations, Distances

class LocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locations
        fields = '__all__'

class DistancesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distances
        fields = '__all__'
