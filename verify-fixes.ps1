# Script de Verificacion - TalkMe v1 y v2
# Este script verifica que las correcciones esten aplicadas correctamente

Write-Host "Verificando correcciones en TalkMe v1 y v2..." -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0

function Check-Success {
    param($Message, $Condition)
    if ($Condition) {
        Write-Host "[OK] $Message" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $Message" -ForegroundColor Red
        $script:ErrorCount++
    }
}

Write-Host "Verificando TalkMe v1..." -ForegroundColor Yellow
Write-Host "----------------------------"

# Verificar import map en talkme v1
$talkme1Html = Get-Content "talkme/index.html" -Raw
Check-Success "Import map tiene @google/generative-ai" ($talkme1Html -match "@google/generative-ai")

# Verificar API key en .env
$talkme1Env = Get-Content "talkme/.env" -Raw
Check-Success "Variable VITE_GEMINI_API_KEY configurada" ($talkme1Env -match "VITE_GEMINI_API_KEY")

# Verificar que usa GoogleGenerativeAI
$talkme1Service = Get-Content "talkme/services/geminiService.ts" -Raw
Check-Success "Usa GoogleGenerativeAI en geminiService" ($talkme1Service -match "GoogleGenerativeAI")

Write-Host ""
Write-Host "Verificando TalkMe v2..." -ForegroundColor Yellow
Write-Host "----------------------------"

# Verificar import map en talkme2
$talkme2Html = Get-Content "talkme2/index.html" -Raw
Check-Success "Import map tiene @google/generative-ai" ($talkme2Html -match "@google/generative-ai")

# Verificar que NO usa @google/genai
if ($talkme2Html -match "@google/genai") {
    Write-Host "[FAIL] Todavia usa @google/genai (incorrecto)" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "[OK] No usa @google/genai (correcto)" -ForegroundColor Green
}

# Verificar API key en .env.local
$talkme2Env = Get-Content "talkme2/.env.local" -Raw
Check-Success "Variable VITE_API_KEY configurada" ($talkme2Env -match "VITE_API_KEY")

# Verificar que usa GoogleGenerativeAI
$talkme2Service = Get-Content "talkme2/services/geminiService.ts" -Raw
Check-Success "Usa GoogleGenerativeAI en geminiService" ($talkme2Service -match "GoogleGenerativeAI")

# Verificar que NO usa GoogleGenAI
if ($talkme2Service -match "GoogleGenAI") {
    Write-Host "[FAIL] Todavia usa GoogleGenAI (incorrecto)" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "[OK] No usa GoogleGenAI (correcto)" -ForegroundColor Green
}

# Verificar audioService
$talkme2Audio = Get-Content "talkme2/services/audioService.ts" -Raw
Check-Success "audioService maneja MP3" ($talkme2Audio -match "audio/mpeg")

Write-Host ""
Write-Host "Verificando Documentacion..." -ForegroundColor Yellow
Write-Host "----------------------------"

# Verificar archivos de documentacion
Check-Success "DEPLOYMENT.md existe en talkme" (Test-Path "talkme/DEPLOYMENT.md")
Check-Success "DEPLOYMENT.md existe en talkme2" (Test-Path "talkme2/DEPLOYMENT.md")
Check-Success "FIXES_SUMMARY.md existe" (Test-Path "FIXES_SUMMARY.md")

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan

if ($ErrorCount -eq 0) {
    Write-Host "TODAS LAS VERIFICACIONES PASARON" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "1. cd talkme; npm install; npm run dev"
    Write-Host "2. cd talkme2; npm install; npm run dev"
    Write-Host "3. Probar en el navegador"
    exit 0
} else {
    Write-Host "$ErrorCount ERRORES ENCONTRADOS" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor revisa los errores arriba"
    exit 1
}
