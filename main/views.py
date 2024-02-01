from django.http import JsonResponse
from rest_framework import generics
from .models import  Person, ContactRequest
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import PersonCreateSerializer, PersonUpdateSerializer, ContactRequestCreateSerializer, \
    PersonWithPreferredPersonsSerializer, ContactRequestDeleteSerializer, SimplePersonSerializer


class PersonCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonCreateSerializer


class PersonUpdateView(generics.UpdateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonUpdateSerializer


class ContactRequestDeleteView(generics.DestroyAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestDeleteSerializer
    def delete(self, request, *args, **kwargs):
        person_requesting_contact_id = self.kwargs.get('person_requesting_contact_id')
        preferred_person_id = self.kwargs.get('preferred_person_id')

        contact_request = get_object_or_404(ContactRequest,
                                           person_requesting_contact_id=person_requesting_contact_id,
                                           preferred_person_id=preferred_person_id)

        contact_request.delete()

        return JsonResponse({'message': 'Contact request deleted successfully'})


class PersonListAPIView(generics.ListAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonWithPreferredPersonsSerializer

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


class PossibleContactsAPIView(generics.RetrieveAPIView):
    queryset = Person.objects.all()
    serializer_class = SimplePersonSerializer
    lookup_field = 'number'

    def get(self, request, *args, **kwargs):
        try:
            person = self.get_object()
            possible_contacts = Person.objects.exclude(number=person.number).exclude(preferred_person__person_requesting_contact=person)
            serializer = self.get_serializer(possible_contacts, many=True)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)
        except Person.DoesNotExist:
            return JsonResponse({"message": "Person not found."}, status=status.HTTP_404_NOT_FOUND)
