import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sentinel_api.settings.development")

app = Celery("sentinel_api")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
