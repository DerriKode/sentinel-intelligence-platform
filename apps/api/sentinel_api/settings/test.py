import os

from .base import *  # noqa: F403
from .base import mysql_database_from_environment

SECRET_KEY = "test-only-not-for-deployment"
ALLOWED_HOSTS = ["testserver", "localhost"]
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_BROKER_URL = "memory://"
CELERY_RESULT_BACKEND = "cache+memory://"

if os.environ.get("DJANGO_TEST_DB_ENGINE", "sqlite3").lower() in {
    "mysql",
    "django.db.backends.mysql",
}:
    DATABASES = {
        "default": mysql_database_from_environment(
            test_name=os.environ.get("MYSQL_TEST_DATABASE", "sentinel_intelligence_test")
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": ":memory:",
        }
    }
