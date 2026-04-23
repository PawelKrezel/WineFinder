from rest_framework import serializers
from .models import Wine

# This code was created with assistance of generative AI, OpenAI ChatGPT 5.3
class WineAdminSerializer(serializers.ModelSerializer):
    slots = serializers.SerializerMethodField()

    class Meta:
        model = Wine
        fields = '__all__'

    def get_slots(self, obj):
        return [slot.id for slot in obj.slots.all()]