from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('users.urls')),
    path('api/v1/', include('attractions.urls')),
    path('api/v1/', include('question_answering.urls')),
    path('api/v1/', include('map.urls')),
]