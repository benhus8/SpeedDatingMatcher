from rest_framework import generics

from .models import Person
from .serializers import PersonCreateSerializer, PersonUpdateSerializer, PersonDeleteSerializer


class PersonCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonCreateSerializer

class PersonUpdateView(generics.UpdateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonUpdateSerializer

class PersonDeleteView(generics.DestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonDeleteSerializer