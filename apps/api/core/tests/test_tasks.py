from django.test import TestCase

from core.tasks import worker_probe


class WorkerProbeTests(TestCase):
    def test_worker_probe_runs_in_test_eager_mode_without_external_data(self):
        result = worker_probe.delay()

        self.assertTrue(result.successful())
        self.assertEqual(result.result["status"], "ok")
        self.assertEqual(result.result["task"], "worker_probe")
        self.assertTrue(result.result["worker_request_id"])
