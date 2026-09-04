from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import EligibilityRule
from .serializers import EligibilityCheckInputSerializer
from .logic import check_eligibility

class CheckEligibilityView(APIView):
    def post(self, request):
        input_serializer = EligibilityCheckInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        try:
            rule = EligibilityRule.objects.get(exam_id=data['exam_id'])
        except EligibilityRule.DoesNotExist:
            return Response({"error": "No eligibility rule found for this exam."}, status=status.HTTP_404_NOT_FOUND)

        is_eligible, reasons = check_eligibility(data['qualification'], data['age'], rule)

        return Response({
            "eligible": is_eligible,
            "reasons": reasons
        })