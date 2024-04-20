from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from attractions.models import Attraction
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
import numpy as np

class BestAttractionAnswerAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    tokenizer = T5Tokenizer.from_pretrained("Kyrmasch/t5-kazakh-qa")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = T5ForConditionalGeneration.from_pretrained("Kyrmasch/t5-kazakh-qa").to(device)

    def post(self, request):
        question = request.data.get('question', '')

        # Get all attraction descriptions
        attraction_descriptions = list(Attraction.objects.values_list('description', flat=True))

        # Find the best attraction description based on cosine similarity
        best_attraction_description = self.find_best_attraction_description(question, attraction_descriptions)

        if not best_attraction_description:
            return Response({'error': 'No suitable attraction description found'}, status=status.HTTP_404_NOT_FOUND)

        # Use the logic from AnswerQuestionAPIView to generate an answer using the best context
        encoded = self.tokenizer.encode_plus(best_attraction_description, question, max_length=128, padding='max_length', truncation=True, return_tensors="pt")
        input_ids = encoded["input_ids"].to(self.device)
        attention_mask = encoded["attention_mask"].to(self.device)

        with torch.no_grad():
            output = self.model.generate(input_ids=input_ids, attention_mask=attention_mask, max_length=128)
            answer = self.tokenizer.decode(output[0], skip_special_tokens=True)

        return Response({'answer': answer}, status=status.HTTP_200_OK)

    def find_best_attraction_description(self, question, attraction_descriptions):
        # Tokenize and vectorize the question and attraction descriptions using TF-IDF
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform([question] + attraction_descriptions)

        # Calculate cosine similarity between the question vector and each attraction description vector
        similarity_scores = cosine_similarity(X[0:1], X[1:]).flatten()

        # Find the index of the attraction description with the highest similarity score
        best_description_index = np.argmax(similarity_scores)

        if similarity_scores[best_description_index] > 0:
            return attraction_descriptions[best_description_index]
        else:
            return None
