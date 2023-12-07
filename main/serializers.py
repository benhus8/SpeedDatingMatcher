from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator

from .models import Person


class PersonCreateSerializer(serializers.ModelSerializer):
    def validate_number(self, value):
        if value <= 0:
            raise serializers.ValidationError("NUMBER_MUST_BE_GREATER_THAN_ZERO")
        return value

    class Meta:
        model = Person
        fields = ['number', 'first_name', 'email']
        validators = [
            UniqueTogetherValidator(
                queryset=Person.objects.all(),
                fields=['email'],
                message= "EMAIL_MUST_BE_UNIQUE"
            )
        ]

class PersonUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['first_name', 'email']
        validators = [
            UniqueTogetherValidator(
                queryset=Person.objects.all(),
                fields=['email']
            )
        ]

class PersonDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['number', 'first_name', 'email']
