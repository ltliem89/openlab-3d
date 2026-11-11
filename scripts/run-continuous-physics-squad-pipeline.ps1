param(
    [switch]$SkipClaude,
    [switch]$SkipCodex,
    [switch]$SkipHermes
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputDir = "pipeline_output"
$promptsDir = "$outputDir/prompts"

if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force | Out-Null }

$claudePromptFile = "$promptsDir/1_claude_prompt.txt"
$codexPromptFile  = "$promptsDir/2_codex_prompt.txt"
$hermesPromptFile = "$promptsDir/3_hermes_prompt.txt"

$claudeOut = "$outputDir/1_claude_design_$timestamp.md"
$codexOut  = "$outputDir/2_codex_code_$timestamp.md"
$hermesOut = "$outputDir/3_hermes_audit_$timestamp.md"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " [OPENLAB 3D] KICH HOAT SQUAD PIPELINE CAI TIEN VAT LY TAN GOC" -ForegroundColor Yellow
Write-Host " Timestamp: $timestamp" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. PHA 1: CLAUDE (Kien truc khong gian, The tich SDF, Shader & Optical Ray-Marching)
if (-not $SkipClaude) {
    Write-Host "`n>>> [PHA 1] CLAUDE: Thiet ke Kien truc Da truong & Visual 3D PBR..." -ForegroundColor Green
    $p1 = Get-Content -Path $claudePromptFile -Raw -Encoding UTF8
    $p1 | claude -p - > $claudeOut 2>&1
    if (Test-Path $claudeOut) {
        Write-Host "[OK] Claude hoan tat: $claudeOut ($( (Get-Item $claudeOut).Length ) bytes)" -ForegroundColor Green
    }
}

# 2. PHA 2: CODEX (Toan Ly & Lap trinh 5 Solvers Da truong RK4)
if (-not $SkipCodex) {
    Write-Host "`n>>> [PHA 2] CODEX: Lap trinh Toan Ly & 5 Solvers Da truong RK4..." -ForegroundColor Green
    $p2Base = Get-Content -Path $codexPromptFile -Raw -Encoding UTF8
    $p2 = "$p2Base`n`n[THAM CHIEU KIEN TRUC TU CLAUDE]: Hay doc va bam sat ban thiet ke tai $claudeOut"
    $p2 | codex exec - > $codexOut 2>&1
    if (Test-Path $codexOut) {
        Write-Host "[OK] Codex hoan tat: $codexOut ($( (Get-Item $codexOut).Length ) bytes)" -ForegroundColor Green
    }
}

# 3. PHA 3: HERMES (Sat hach Red-Team Khac nghiet & San 10 Diem Gia tao)
if (-not $SkipHermes) {
    Write-Host "`n>>> [PHA 3] HERMES: Sat hach Red-Team Khac nghiet & San 10 Diem Gia tao..." -ForegroundColor Green
    $p3Base = Get-Content -Path $hermesPromptFile -Raw -Encoding UTF8
    $p3MergedFile = "$outputDir/tmp_hermes_query_$timestamp.txt"
    $p3Content = "$p3Base`n`n[THAM CHIEU HO SO CAN KIEM TOAN]:`n1. Ban thiet ke Claude: $claudeOut`n2. Ban code Codex: $codexOut`nHay kiem tra ky va xuat ban danh sach ban va (Patches)."
    Set-Content -Path $p3MergedFile -Value $p3Content -Encoding UTF8
    hermes chat --query-file $p3MergedFile --oneshot -Q > $hermesOut 2>&1
    Remove-Item $p3MergedFile -Force -ErrorAction SilentlyContinue
    if (Test-Path $hermesOut) {
        Write-Host "[OK] Hermes hoan tat: $hermesOut ($( (Get-Item $hermesOut).Length ) bytes)" -ForegroundColor Green
    }
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " [SQUAD PIPELINE HOAN TAT] CHUYEN GIAO CHO ANTIGRAVITY THI CONG" -ForegroundColor Yellow
Write-Host " 1. Claude Design: $claudeOut" -ForegroundColor White
Write-Host " 2. Codex Code:    $codexOut" -ForegroundColor White
Write-Host " 3. Hermes Audit:  $hermesOut" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
