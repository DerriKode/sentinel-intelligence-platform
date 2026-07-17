from celery import shared_task


@shared_task(bind=True, name="core.tasks.worker_probe", acks_late=True)
def worker_probe(self) -> dict[str, str]:
    """Return a non-sensitive worker liveness result without changing application data."""

    return {"status": "ok", "task": "worker_probe", "worker_request_id": self.request.id or "eager"}
