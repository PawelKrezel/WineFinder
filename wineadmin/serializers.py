from rest_framework import serializers
from .models import Wine

# This code was created with assistance of generative AI
class WineAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wine
        fields = '__all__'