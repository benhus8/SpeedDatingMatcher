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
        fields = ['number', 'first_name', 'email', 'email_verified', 'preferred_persons']

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
    preferred_persons = serializers.ListField(child=serializers.IntegerField(), required=True)

    def validate(self, data):
        person_requesting_contact_id = self.context['view'].kwargs.get('person_requesting_contact_id')
        person_requesting_contact = Person.objects.filter(pk=person_requesting_contact_id).first()

        if not person_requesting_contact:
            raise serializers.ValidationError("Person requesting contact does not exist")

        preferred_persons = data.get('preferred_persons', [])
        if not preferred_persons:
            raise serializers.ValidationError("Preferred persons list cannot be empty")

        for preferred_person_id in preferred_persons:
            preferred_person = Person.objects.filter(pk=preferred_person_id).first()
            if not preferred_person:
                raise serializers.ValidationError("One or more preferred persons do not exist")

            if person_requesting_contact_id == preferred_person_id:
                raise serializers.ValidationError("It cannot be the same person")

            existing_request = ContactRequest.objects.filter(
                person_requesting_contact=person_requesting_contact,
                preferred_person=preferred_person
            )
            if existing_request.exists():
                raise serializers.ValidationError(
                    f"ContactRequest between {person_requesting_contact_id} and {preferred_person_id} already exists")
        return data

    def create(self, validated_data):
        person_requesting_contact_id = self.context['view'].kwargs.get('person_requesting_contact_id')
        person_requesting_contact = Person.objects.get(pk=person_requesting_contact_id)

        if not person_requesting_contact:
            raise serializers.ValidationError(f"Person with id {person_requesting_contact_id} does not exist!")

        preferred_persons = validated_data['preferred_persons']
        contact_request_ids = []

        for preferred_person_id in preferred_persons:
            preferred_person = Person.objects.get(pk=preferred_person_id)
            ContactRequest.objects.create(
                person_requesting_contact=person_requesting_contact,
                preferred_person=preferred_person
            )

        return {'preferred_persons': contact_request_ids}

class ContactRequestDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = '__all__'


class SimplePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['number', 'first_name']
