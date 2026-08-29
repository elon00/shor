$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SHOR MASTER CHECK ===" -ForegroundColor Cyan

if (!(Test-Path ".\package.json")) {
    Write-Host "ERROR: package.json not found." -ForegroundColor Red
    exit 1
}

Write-Host "PROJECT=PASS" -ForegroundColor Green

Write-Host ""
Write-Host "=== LINT ===" -ForegroundColor Cyan
npm run lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "LINT=FAIL" -ForegroundColor Red
    exit 1
}

Write-Host "LINT=PASS" -ForegroundColor Green

Write-Host ""
Write-Host "=== PQC ===" -ForegroundColor Cyan
npm run test:pqc

if ($LASTEXITCODE -ne 0) {
    Write-Host "PQC=FAIL" -ForegroundColor Red
    exit 1
}

Write-Host "PQC=PASS" -ForegroundColor Green

Write-Host ""
Write-Host "=== CONTRACTS ===" -ForegroundColor Cyan
npm run compile:contracts

if ($LASTEXITCODE -ne 0) {
    Write-Host "CONTRACT_COMPILE=FAIL" -ForegroundColor Red
    exit 1
}

Write-Host "CONTRACT_COMPILE=PASS" -ForegroundColor Green

Write-Host ""
Write-Host "=== BUILD ===" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD=FAIL" -ForegroundColor Red
    exit 1
}

Write-Host "BUILD=PASS" -ForegroundColor Green

Write-Host ""
Write-Host "==============================" -ForegroundColor Green
Write-Host "SHOR MASTER CHECK COMPLETE" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green