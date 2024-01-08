from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Person, ContactRequest
from .serializers import PersonCreateSerializer, PersonUpdateSerializer, GetAllPersonsWithContactsReqSerializer, \
    ContactRequestCreateSerializer, PersonSerializer


class PersonCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonCreateSerializer

class PersonUpdateView(generics.UpdateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonUpdateSerializer

class GetAllPersonsWithContactsReqView(APIView):
    def get(self, request, *args, **kwargs):
        contact_requests = ContactRequest.objects.all()

        serialized_data_dict = {}

        for contact_request in contact_requests:
            person_requesting_contact_data = PersonSerializer(contact_request.person_requesting_contact).data
            preferred_person_data = PersonSerializer(contact_request.preferred_person).data

            if person_requesting_contact_data['number'] not in serialized_data_dict:

                serialized_data_dict[person_requesting_contact_data['number']] = {
                    'number': person_requesting_contact_data['number'],
                    'first_name': person_requesting_contact_data['first_name'],
                    'email': person_requesting_contact_data['email'],
                    'preferred_person': [preferred_person_data['number']]
                }
            else:

                serialized_data_dict[person_requesting_contact_data['number']]['preferred_person'].append(
                    preferred_person_data['number']
                )

        serialized_data = list(serialized_data_dict.values())

        return Response(serialized_data)

class ContactRequestCreateView(generics.ListCreateAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PersonDeleteView(generics.DestroyAPIView):
    queryset = Person.objects.all()