from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Attraction
from .serializers import AttractionSerializer

class AttractionViewSet(viewsets.ModelViewSet):
    queryset = Attraction.objects.all()
    serializer_class = AttractionSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

class BestAttractionsRatingAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get user keywords
        user_keywords = request.user.keywords.split(",") if request.user.keywords else []

        # Get all attractions
        attractions = Attraction.objects.all()

        # Combine attraction keywords into a single string for each attraction
        attraction_keywords = [" ".join(attraction.keywords.split(",")) for attraction in attractions]

        # Tokenize and vectorize user keywords and attraction keywords using TF-IDF
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(user_keywords + attraction_keywords)

        # Calculate cosine similarity between user keywords vector and each attraction keywords vector
        similarity_scores = cosine_similarity(X[0:len(user_keywords)], X[len(user_keywords):]).flatten()

        # Combine attraction IDs with their similarity scores
        attraction_scores = list(zip(attractions, similarity_scores))

        # Sort attractions based on similarity scores in descending order
        sorted_attractions = sorted(attraction_scores, key=lambda x: x[1], reverse=True)

        # Prepare the response data with attraction names and their similarity scores
        best_attractions_rating = [{"attraction_name": attraction.name, "similarity_score": score} for attraction, score in sorted_attractions]

        return Response(best_attractions_rating, status=status.HTTP_200_OK)

