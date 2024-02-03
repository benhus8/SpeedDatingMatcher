from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator

from .models import Person, ContactRequest


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
                message="EMAIL_MUST_BE_UNIQUE"
            )
        ]


class PersonWithPreferredPersonsSerializer(serializers.ModelSerializer):
    preferred_persons = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ['number', 'first_name', 'email', 'preferred_persons']

    def get_preferred_persons(self, obj):
        contact_requests = ContactRequest.objects.filter(person_requesting_contact=obj)
        preferred_persons_list = [request.preferred_person.number for request in contact_requests]
        return preferred_persons_list


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

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['first_name', 'email']

class ContactRequestCreateSerializer(serializers.Serializer):
    person_requesting_contact_id = serializers.IntegerField(required=True)
    preferred_person_id = serializers.IntegerField(required=True)

    def validate(self, data):
        person_requesting_contact_id = data.get('person_requesting_contact_id')
        preferred_person_id = data.get('preferred_person_id')

        if person_requesting_contact_id == preferred_person_id:
            raise serializers.ValidationError("It cannot be the same person")

        person_requesting_contact = Person.objects.filter(pk=person_requesting_contact_id).first()
        preferred_person = Person.objects.filter(pk=preferred_person_id).first()

        if not person_requesting_contact or not preferred_person:
            raise serializers.ValidationError("One or more persons do not exist")

        existing_request = ContactRequest.objects.filter(
            person_requesting_contact=person_requesting_contact,
            preferred_person=preferred_person
        )

        if existing_request.exists():
            raise serializers.ValidationError("ContactRequest already exists")

        return data

    def create(self, validated_data):
        person_requesting_contact_id = validated_data.get('person_requesting_contact_id')
        preferred_person_id = validated_data.get('preferred_person_id')

        person_requesting_contact = Person.objects.get(pk=person_requesting_contact_id)
        preferred_person = Person.objects.get(pk=preferred_person_id)

        contact_request = ContactRequest(
            person_requesting_contact=person_requesting_contact,
            preferred_person=preferred_person
        )
        contact_request.save()

        return contact_request


class ContactRequestDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model=ContactRequest
        fields='__all__'


class SimplePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['number', 'first_name']

