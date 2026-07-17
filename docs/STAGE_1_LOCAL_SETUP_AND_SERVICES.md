# Stage 1 Local Setup and Services

**Status:** S1-06 implementation recorded
**Scope:** Reproducible Windows setup, service lifecycle, status, and targeted checks

## Scripts

Run from the repository root in PowerShell:

```powershell
.\scripts\windows\setup.ps1
.\scripts\windows\setup.ps1 -InstallBackend
.\scripts\windows\status.ps1
.\scripts\windows\run-checks.ps1
```

Frontend installation is explicit because it requires registry access:

```powershell
.\scripts\windows\setup.ps1 -InstallFrontend
```

Service lifecycle changes require explicit switches. `-WhatIf` previews the requested action:

```powershell
.\scripts\windows\start-services.ps1 -StartMySql -WhatIf
.\scripts\windows\start-services.ps1 -StartMySql
.\scripts\windows\start-services.ps1 -StartRedis
.\scripts\windows\stop-services.ps1 -StopRedis -WhatIf
.\scripts\windows\stop-services.ps1 -StopMySql
```

The default service names are `MySQL80` and `Redis`; override them when a local installation uses different names. The scripts refuse to run outside the application repository and never request, print, or write credentials.

## Safety and recovery

- Setup is read-only unless an install switch is supplied; dependencies remain in the ignored root `.venv` or `apps/web/node_modules`.
- Start/stop scripts do nothing without an explicit service switch and support `-WhatIf` before mutation.
- Status is read-only and reports service state, Redis TCP availability, and dependency presence.
- Checks use Django test settings and do not start workers or modify production data.
- If a service start fails, inspect `status.ps1`, correct the local installation/service name, and retry. Do not delete databases or force-stop processes as recovery.

## Observed Windows state

On the verified machine, MySQL80 is running, Redis is not installed/listening, the backend virtual environment is present, and frontend dependencies are present. Redis installation/service startup remains the next local-services concern; no service was started or stopped by S1-06. PowerShell required the documented process-scoped `-ExecutionPolicy Bypass` invocation.
