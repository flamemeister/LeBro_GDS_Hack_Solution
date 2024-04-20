from django.urls import path
from .views import BestAttractionAnswerAPIView

urlpatterns = [
    path('best_attraction_answer/', BestAttractionAnswerAPIView.as_view(), name='best_attraction_answer'),
]
