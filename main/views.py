from rest_framework import generics

from .models import Person, ContactRequest
from .serializers import PersonCreateSerializer, PersonUpdateSerializer, GetAllPersonsWithContactsReqSerializer


class PersonCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonCreateSerializer

class PersonUpdateView(generics.UpdateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonUpdateSerializer

class GetAllPersonsWithContactsReqView(generics.ListAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = GetAllPersonsWithContactsReqSerializer