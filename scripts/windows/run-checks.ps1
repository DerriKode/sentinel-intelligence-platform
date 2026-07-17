[CmdletBinding()]
param([switch]$IncludeFrontend)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ((Split-Path -Leaf $repoRoot) -ne "sentinel-intelligence-platform") {
    throw "Refusing to run outside sentinel-intelligence-platform: $repoRoot"
}

$pythonPath = Join-Path $repoRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $pythonPath)) { throw "Backend venv is missing. Run setup.ps1 -InstallBackend." }

Push-Location (Join-Path $repoRoot "apps\api")
try {
    & $pythonPath manage.py check --settings=sentinel_api.settings.test
    if ($LASTEXITCODE -ne 0) { throw "Django check failed." }
    & $pythonPath manage.py makemigrations --check --dry-run --settings=sentinel_api.settings.test
    if ($LASTEXITCODE -ne 0) { throw "Migration drift check failed." }
    & $pythonPath manage.py test core.tests --settings=sentinel_api.settings.test
    if ($LASTEXITCODE -ne 0) { throw "Backend tests failed." }
} finally {
    Pop-Location
}

if ($IncludeFrontend) {
    $npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
    $nodeModules = Join-Path $repoRoot "apps\web\node_modules"
    if (-not $npm -or -not (Test-Path $nodeModules)) {
        throw "Frontend dependencies are unavailable. Run setup.ps1 -InstallFrontend."
    }
    Push-Location (Join-Path $repoRoot "apps\web")
    try {
        foreach ($script in @("typecheck", "lint", "test", "build")) {
            & $npm.Source run $script
            if ($LASTEXITCODE -ne 0) { throw "Frontend script '$script' failed." }
        }
    } finally {
        Pop-Location
    }
}

Write-Output "Checks completed successfully."
