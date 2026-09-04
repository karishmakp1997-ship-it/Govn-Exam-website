from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .serializers import ChatMessageSerializer
from .groq_client import get_ai_reply


class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_message = serializer.validated_data['message']
        history = serializer.validated_data.get('history', [])

        reply = get_ai_reply(user_message, history)

        return Response({"reply": reply})