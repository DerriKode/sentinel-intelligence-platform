[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [switch]$StopMySql,
    [switch]$StopRedis,
    [string]$MySqlServiceName = "MySQL80",
    [string]$RedisServiceName = "Redis"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ((Split-Path -Leaf $repoRoot) -ne "sentinel-intelligence-platform") {
    throw "Refusing to run outside sentinel-intelligence-platform: $repoRoot"
}

if (-not ($StopMySql -or $StopRedis)) {
    Write-Output "No service stop requested. Use -StopMySql and/or -StopRedis explicitly."
    exit 0
}

$requests = @(
    @{ Enabled = $StopMySql; Name = $MySqlServiceName },
    @{ Enabled = $StopRedis; Name = $RedisServiceName }
)
$failed = $false
foreach ($request in $requests) {
    if (-not $request.Enabled) { continue }
    $service = Get-Service -Name $request.Name -ErrorAction SilentlyContinue
    if (-not $service) {
        Write-Warning "Service '$($request.Name)' was not found; nothing was changed."
        continue
    }
    if ($service.Status -eq "Stopped") {
        Write-Output "$($request.Name): already stopped"
        continue
    }
    if ($PSCmdlet.ShouldProcess($request.Name, "Stop service")) {
        Stop-Service -Name $request.Name
        $service = Get-Service -Name $request.Name
        if ($service.Status -ne "Stopped") {
            Write-Warning "$($request.Name): did not reach Stopped state."
            $failed = $true
        } else {
            Write-Output "$($request.Name): stopped"
        }
    }
}

if ($failed) { exit 1 }
