# Stage 1 Backend Foundation

**Status:** S1-03 implementation recorded
**Scope:** Modular Django and Django REST Framework foundation under `apps/api/`

## Implemented boundary

- Separated settings modules exist for shared defaults, local development, and tests.
- The backend uses a modular `core` app with `Organization` and `Unit` as the initial authorization-scope entities.
- Organization and unit identifiers are UUIDs. Unit slugs are unique within an organization, and `PROTECT` prevents deleting an organization that still owns units.
- `/api/v1/health/` provides a minimal public liveness response without exposing configuration or sensitive data. Readiness checks for MySQL, Redis, and storage remain deferred to their service setup prompts.
- DRF defaults to authenticated access; the health endpoint explicitly opts into anonymous access. Future endpoints must add endpoint and object-level permissions.
- The initial migration is reversible in principle through Django migration operations and contains no production data.

## Verification commands

Run from `apps/api/` after installing `requirements.txt`:

```text
python -m pip install -r requirements.txt
python manage.py check --settings=sentinel_api.settings.test
python manage.py makemigrations --check --dry-run --settings=sentinel_api.settings.test
python manage.py migrate --plan --settings=sentinel_api.settings.test
python manage.py test core.tests --settings=sentinel_api.settings.test
```

The model tests cover organization ownership, scoped uniqueness, cross-organization slug reuse, and protected deletion. The health test covers the liveness contract.

## Data and recovery notes

The model is intentionally limited to authorization scope. Retention, legal hold, audit event storage, cases, evidence, biometric data, and workflow transitions require their own approved work packages. No real records or sensitive fixtures are included.
