[CmdletBinding()]
param(
    [switch]$InstallBackend,
    [switch]$InstallFrontend
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ((Split-Path -Leaf $repoRoot) -ne "sentinel-intelligence-platform") {
    throw "Refusing to run outside sentinel-intelligence-platform: $repoRoot"
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $false)][string[]]$Arguments = @()
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$FilePath failed with exit code $LASTEXITCODE"
    }
}

$python = Get-Command python -ErrorAction SilentlyContinue
$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $python) { throw "Python was not found on PATH." }
if (-not $node) { Write-Warning "Node.js was not found; frontend setup is unavailable." }
if (-not $npm) { Write-Warning "npm.cmd was not found; frontend setup is unavailable." }

Write-Output "Repository: $repoRoot"
Write-Output "Python: $(& $python.Source --version 2>&1)"
if ($node) { Write-Output "Node.js: $(& $node.Source --version 2>&1)" }
if ($npm) { Write-Output "npm: $(& $npm.Source --version 2>&1)" }

$venvPython = Join-Path $repoRoot ".venv\Scripts\python.exe"
if ($InstallBackend) {
    if (-not (Test-Path $venvPython)) {
        Write-Output "Creating isolated backend environment."
        Invoke-Checked -FilePath $python.Source -Arguments @("-m", "venv", (Join-Path $repoRoot ".venv"))
    }
    Invoke-Checked -FilePath $venvPython -Arguments @("-m", "pip", "install", "-r", (Join-Path $repoRoot "apps\api\requirements.txt"))
    Write-Output "Backend dependencies installed in .venv."
} elseif (Test-Path $venvPython) {
    Write-Output "Backend environment: present (use -InstallBackend to update dependencies)."
} else {
    Write-Output "Backend environment: missing (use -InstallBackend to create it)."
}

if ($InstallFrontend) {
    if (-not $npm) { throw "Cannot install frontend dependencies because npm.cmd was not found." }
    Push-Location (Join-Path $repoRoot "apps\web")
    try {
        Invoke-Checked -FilePath $npm.Source -Arguments @("install", "--no-audit", "--no-fund")
    } finally {
        Pop-Location
    }
    Write-Output "Frontend dependencies installed in apps/web/node_modules."
} elseif (Test-Path (Join-Path $repoRoot "apps\web\node_modules")) {
    Write-Output "Frontend dependencies: present."
} else {
    Write-Output "Frontend dependencies: missing (use -InstallFrontend to install them)."
}

Write-Output "Setup inspection complete. Credentials are never requested or written by this script."
