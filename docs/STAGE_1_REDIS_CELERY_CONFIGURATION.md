# Stage 1 Redis and Celery Configuration

**Status:** S1-05 implementation recorded
**Scope:** Minimum environment-driven background-job foundation under `apps/api/`

## Configuration boundary

- `sentinel_api.celery` creates the Celery application, loads Django settings with the `CELERY_` namespace, and autodiscovers app tasks.
- Development defaults use Redis database 0 for the broker and database 1 for results; deployments must provide protected `CELERY_BROKER_URL` and `CELERY_RESULT_BACKEND` values through the environment.
- JSON-only serialization, late acknowledgements, one-message prefetch, bounded task time limits, and worker-lost rejection reduce unsafe duplicate or unbounded work.
- `core.tasks.worker_probe` is a synthetic, non-mutating task used only to verify worker wiring. It does not access cases, evidence, identity, or external data.
- Test settings use Celery eager mode and in-memory transport/backend, so the test suite is deterministic and does not require a live Redis server.

## Verification and recovery

Run from `apps/api/` after installing `requirements.txt`:

```text
python manage.py check --settings=sentinel_api.settings.test
python manage.py test core.tests --settings=sentinel_api.settings.test
python -c "from sentinel_api.celery import app; print(app.conf.task_serializer, app.conf.task_time_limit)"
```

If Redis is unavailable, do not start business workers against an unreachable broker. Keep the eager-mode tests passing, correct the local service or environment URL in the next service prompt, and then run a real broker ping and worker probe. No task data is deleted by this configuration; rollback is to unset the Redis environment variables and use the prior application commit.

## Environment result

The Python `redis` client is configured as a dependency, but no Redis executable/service was present or listening on this Windows machine during S1-05. Local Redis installation and controlled service startup are deferred to S1-06.
