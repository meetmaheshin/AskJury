# Backs up the Railway Postgres database to a local timestamped .sql file.
#
# WHY THIS EXISTS: Railway (free/hobby) does NOT manage automatic backups.
# On 2026-05-30 a deploy running `prisma db push --accept-data-loss` wiped the DB.
# Run this regularly (before every `git pull` and/or every 1-2 days).
#
# ONE-TIME SETUP (do NOT commit the password anywhere):
#   1. Set the connection string as an environment variable for your user:
#        setx RAILWAY_DATABASE_URL "postgresql://postgres:PASSWORD@caboose.proxy.rlwy.net:11667/railway"
#      (open a NEW terminal afterwards so it takes effect)
#   2. Railway runs Postgres 17, so you need a Postgres 17 `pg_dump`.
#      Point PG_DUMP at it if it isn't on your PATH:
#        setx PG_DUMP "C:\Path\to\pg17\bin\pg_dump.exe"
#
# USAGE:
#   powershell -File backend/scripts/backup-railway.ps1
#
# Output: <repo>/backups/railway-YYYYMMDD-HHMMSS.sql  (the backups/ folder is git-ignored)

param(
  [int]$KeepLast = 30  # how many recent backups to retain
)

$ErrorActionPreference = 'Stop'

$dbUrl = $env:RAILWAY_DATABASE_URL
if ([string]::IsNullOrWhiteSpace($dbUrl)) {
  Write-Error "RAILWAY_DATABASE_URL is not set. See the setup notes at the top of this script."
  exit 1
}

# Resolve a pg_dump binary (prefer an explicit PG17 one).
$pgDump = $env:PG_DUMP
if ([string]::IsNullOrWhiteSpace($pgDump)) {
  $onPath = (Get-Command pg_dump -ErrorAction SilentlyContinue).Source
  if ($onPath) {
    $pgDump = $onPath
  } else {
    $portable = Join-Path $PSScriptRoot '..\..\.localdb\pgsql\bin\pg_dump.exe'
    if (Test-Path $portable) { $pgDump = (Resolve-Path $portable).Path }
  }
}
if ([string]::IsNullOrWhiteSpace($pgDump) -or -not (Test-Path $pgDump)) {
  Write-Error "Could not find pg_dump. Set PG_DUMP to a Postgres 17 pg_dump.exe."
  exit 1
}

# Warn if the client is older than the server (pg_dump refuses to dump a newer server).
$verLine = & $pgDump --version
if ($verLine -match '(\d+)\.\d+') {
  $clientMajor = [int]$Matches[1]
  if ($clientMajor -lt 17) {
    Write-Warning "pg_dump is v$clientMajor but Railway runs Postgres 17. This will likely fail with a version mismatch. Install Postgres 17 client tools and set PG_DUMP."
  }
}

$backupDir = Join-Path $PSScriptRoot '..\..\backups'
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$backupDir = (Resolve-Path $backupDir).Path

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outFile = Join-Path $backupDir "railway-$stamp.sql"

Write-Host "Backing up Railway database -> $outFile"
& $pgDump --no-owner --no-privileges --clean --if-exists -f $outFile $dbUrl

if ($LASTEXITCODE -ne 0) {
  Write-Error "pg_dump failed (exit $LASTEXITCODE)."
  exit $LASTEXITCODE
}

$sizeKb = [math]::Round((Get-Item $outFile).Length / 1KB, 1)
Write-Host "Backup complete: $outFile ($sizeKb KB)"

# Rotation: keep only the most recent $KeepLast dumps.
$old = Get-ChildItem $backupDir -Filter 'railway-*.sql' | Sort-Object LastWriteTime -Descending | Select-Object -Skip $KeepLast
foreach ($f in $old) { Remove-Item $f.FullName -Force; Write-Host "Pruned old backup: $($f.Name)" }
