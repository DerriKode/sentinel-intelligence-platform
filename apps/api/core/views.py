from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """Minimal liveness response; dependency readiness is added with service setup."""

    return Response({"status": "ok", "service": "sentinel-api", "version": "v1"})
