"""
URL configuration for YouveGotMail project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from main.views import PersonCreateView, PersonUpdateView, ContactRequestCreateView, PersonDeleteView, \
    ContactRequestDeleteView, PersonListAPIView, PossibleContactsAPIView, ObtainTokenPairView

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Swagger for YouVe Got Mail",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('admin/', admin.site.urls),
    path('api/persons', PersonCreateView.as_view(), name='create-person'),
    path('api/persons/<int:pk>/', PersonUpdateView.as_view(), name='update-person'),
    path('api/contact-requests/<int:person_requesting_contact_id>/', ContactRequestCreateView.as_view(), name='create-contact-request'),
    path('api/persons/<int:pk>/delete/', PersonDeleteView.as_view(), name='delete-person'),
    path('api/persons/contacts/', PersonListAPIView.as_view(), name='get-all-persons-with-contacts'),
    path('api/delete-contact-requests/<int:person_requesting_contact_id>/<int:preferred_person_id>/', ContactRequestDeleteView.as_view(), name='delete-person-contact-request'),
    path('api/persons/<int:number>/possible-contacts/', PossibleContactsAPIView.as_view(), name='get-possible-contacts'),
    path('api/token/', ObtainTokenPairView.as_view(), name='get-token'),
]
