#!/bin/bash

# 🧪 Script de Verificación - TalkMe v1 y v2
# Este script verifica que las correcciones estén aplicadas correctamente

echo "🔍 Verificando correcciones en TalkMe v1 y v2..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        ((ERRORS++))
    fi
}

echo "📦 Verificando TalkMe v1..."
echo "----------------------------"

# Verificar import map en talkme v1
grep -q "@google/generative-ai" talkme/index.html
check "Import map tiene @google/generative-ai"

# Verificar API key en .env
grep -q "VITE_GEMINI_API_KEY" talkme/.env
check "Variable VITE_GEMINI_API_KEY configurada"

# Verificar que usa GoogleGenerativeAI
grep -q "GoogleGenerativeAI" talkme/services/geminiService.ts
check "Usa GoogleGenerativeAI en geminiService"

echo ""
echo "📦 Verificando TalkMe v2..."
echo "----------------------------"

# Verificar import map en talkme2
grep -q "@google/generative-ai" talkme2/index.html
check "Import map tiene @google/generative-ai"

# Verificar que NO usa @google/genai
if grep -q "@google/genai" talkme2/index.html; then
    echo -e "${RED}❌ Todavía usa @google/genai (incorrecto)${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ No usa @google/genai (correcto)${NC}"
fi

# Verificar API key en .env.local
grep -q "VITE_API_KEY" talkme2/.env.local
check "Variable VITE_API_KEY configurada"

# Verificar que usa GoogleGenerativeAI
grep -q "GoogleGenerativeAI" talkme2/services/geminiService.ts
check "Usa GoogleGenerativeAI en geminiService"

# Verificar que NO usa GoogleGenAI
if grep -q "GoogleGenAI" talkme2/services/geminiService.ts; then
    echo -e "${RED}❌ Todavía usa GoogleGenAI (incorrecto)${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ No usa GoogleGenAI (correcto)${NC}"
fi

# Verificar audioService
grep -q "audio/mpeg" talkme2/services/audioService.ts
check "audioService maneja MP3"

echo ""
echo "📄 Verificando Documentación..."
echo "----------------------------"

# Verificar archivos de documentación
[ -f "talkme/DEPLOYMENT.md" ]
check "DEPLOYMENT.md existe en talkme"

[ -f "talkme2/DEPLOYMENT.md" ]
check "DEPLOYMENT.md existe en talkme2"

[ -f "FIXES_SUMMARY.md" ]
check "FIXES_SUMMARY.md existe"

echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TODAS LAS VERIFICACIONES PASARON${NC}"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "1. cd talkme && npm install && npm run dev"
    echo "2. cd talkme2 && npm install && npm run dev"
    echo "3. Probar en el navegador"
    exit 0
else
    echo -e "${RED}❌ $ERRORS ERRORES ENCONTRADOS${NC}"
    echo ""
    echo "Por favor revisa los errores arriba"
    exit 1
fi
