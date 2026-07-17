from django.test import TestCase


class HealthEndpointTests(TestCase):
    def test_health_endpoint_is_public_and_returns_liveness_payload(self):
        response = self.client.get("/api/v1/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "sentinel-api", "version": "v1"})

    def test_readiness_endpoint_confirms_database_access(self):
        response = self.client.get("/api/v1/ready/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"status": "ready", "service": "sentinel-api", "database": "ok", "version": "v1"},
        )
