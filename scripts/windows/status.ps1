[CmdletBinding()]
param(
    [string]$MySqlServiceName = "MySQL80",
    [string]$RedisServiceName = "Redis",
    [int]$RedisPort = 6379
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ((Split-Path -Leaf $repoRoot) -ne "sentinel-intelligence-platform") {
    throw "Refusing to run outside sentinel-intelligence-platform: $repoRoot"
}

function Get-ServiceState {
    param([string]$Name)
    $service = Get-Service -Name $Name -ErrorAction SilentlyContinue
    if ($service) { return [string]$service.Status }
    return "Not installed"
}

$redisListening = @(Get-NetTCPConnection -LocalPort $RedisPort -State Listen -ErrorAction SilentlyContinue).Count -gt 0
$pythonPath = Join-Path $repoRoot ".venv\Scripts\python.exe"
$nodeModulesPath = Join-Path $repoRoot "apps\web\node_modules"

Write-Output "Repository: $repoRoot"
Write-Output "MySQL service ($MySqlServiceName): $(Get-ServiceState $MySqlServiceName)"
Write-Output "Redis service ($RedisServiceName): $(Get-ServiceState $RedisServiceName)"
Write-Output "Redis TCP 127.0.0.1:${RedisPort}: $(if ($redisListening) { 'Listening' } else { 'Unavailable' })"
Write-Output "Backend venv: $(if (Test-Path $pythonPath) { 'Present' } else { 'Missing' })"
Write-Output "Frontend dependencies: $(if (Test-Path $nodeModulesPath) { 'Present' } else { 'Missing' })"
