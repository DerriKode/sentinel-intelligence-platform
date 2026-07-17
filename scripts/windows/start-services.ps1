[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [switch]$StartMySql,
    [switch]$StartRedis,
    [string]$MySqlServiceName = "MySQL80",
    [string]$RedisServiceName = "Redis"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ((Split-Path -Leaf $repoRoot) -ne "sentinel-intelligence-platform") {
    throw "Refusing to run outside sentinel-intelligence-platform: $repoRoot"
}

if (-not ($StartMySql -or $StartRedis)) {
    Write-Output "No service start requested. Use -StartMySql and/or -StartRedis explicitly."
    exit 0
}

$requests = @(
    @{ Enabled = $StartMySql; Name = $MySqlServiceName },
    @{ Enabled = $StartRedis; Name = $RedisServiceName }
)
$failed = $false
foreach ($request in $requests) {
    if (-not $request.Enabled) { continue }
    $service = Get-Service -Name $request.Name -ErrorAction SilentlyContinue
    if (-not $service) {
        Write-Warning "Service '$($request.Name)' was not found; install/configure it before starting local services."
        $failed = $true
        continue
    }
    if ($service.Status -eq "Running") {
        Write-Output "$($request.Name): already running"
        continue
    }
    if ($PSCmdlet.ShouldProcess($request.Name, "Start service")) {
        Start-Service -Name $request.Name
        $service = Get-Service -Name $request.Name
        if ($service.Status -ne "Running") {
            Write-Warning "$($request.Name): did not reach Running state."
            $failed = $true
        } else {
            Write-Output "$($request.Name): started"
        }
    }
}

if ($failed) { exit 1 }
