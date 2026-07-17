# Stage 1 MySQL Configuration

**Status:** S1-04 implementation recorded
**Scope:** Environment-driven Django development and test database selection

## Safe configuration contract

The backend selects MySQL only when `DJANGO_DB_ENGINE=mysql` for development or `DJANGO_TEST_DB_ENGINE=mysql` for tests. Credentials are read from environment variables and are never stored in source files, `HANDOFF.md`, migrations, logs, or command output.

`/api/v1/health/` is a dependency-free liveness response. `/api/v1/ready/` performs a minimal database query and returns `ready` only when the configured database is reachable; connection failures return a safe 503 response without driver or credential details.

Required variables are `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD`. `MYSQL_HOST` defaults to `127.0.0.1`, `MYSQL_PORT` defaults to `3306`, and `MYSQL_TEST_DATABASE` defaults to `sentinel_intelligence_test`. The test settings pass the dedicated test database name to Django so test data is isolated from the development database.

Example PowerShell setup uses session-only values; replace the password interactively or through a protected secret store:

```powershell
$env:DJANGO_DB_ENGINE = "mysql"
$env:DJANGO_TEST_DB_ENGINE = "mysql"
$env:MYSQL_DATABASE = "sentinel_intelligence"
$env:MYSQL_TEST_DATABASE = "sentinel_intelligence_test"
$env:MYSQL_USER = "root"
$env:MYSQL_HOST = "127.0.0.1"
$env:MYSQL_PORT = "3306"
```

Do not put the password in this document or any tracked file. The existing root `.env.example` remains names-only.

## Verification and recovery

Run from `apps/api/` after setting the session variables:

```text
python manage.py check --settings=sentinel_api.settings.development
python manage.py check --settings=sentinel_api.settings.test
python manage.py makemigrations --check --dry-run --settings=sentinel_api.settings.test
python manage.py migrate --plan --settings=sentinel_api.settings.test
python manage.py migrate --settings=sentinel_api.settings.test
python manage.py test core.tests --settings=sentinel_api.settings.test
```

Recovery is to unset the session variables and return to SQLite settings; no migration files or production data are deleted. Dropping a database is outside this work package and requires explicit approval.
