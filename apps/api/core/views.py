from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """Minimal liveness response; dependency readiness is added with service setup."""

    return Response({"status": "ok", "service": "sentinel-api", "version": "v1"})


@api_view(["GET"])
@permission_classes([AllowAny])
def readiness(request):
    """Check database reachability without exposing driver or credential details."""

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception:
        return Response(
            {"status": "not_ready", "service": "sentinel-api", "database": "unavailable"},
            status=503,
        )

    return Response(
        {"status": "ready", "service": "sentinel-api", "database": "ok", "version": "v1"}
    )
