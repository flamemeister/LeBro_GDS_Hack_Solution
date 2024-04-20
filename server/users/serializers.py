from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'surname', 'role', 'profile_image', 'keywords', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'keywords': {'required': True}  # Make keywords required during user creation
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
