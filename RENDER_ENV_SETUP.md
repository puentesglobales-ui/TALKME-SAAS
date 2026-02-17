# ==========================================
# 🚀 CONFIGURACIÓN DE RENDER - TALKME SAAS
# ==========================================
# Copia estas variables en Render Dashboard > Environment
# ==========================================

# ==========================================
# 🔐 BASE DE DATOS (Firebase/Supabase)
# ==========================================
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# ==========================================
# 🤖 APIs DE INTELIGENCIA ARTIFICIAL
# ==========================================
# OpenAI (Whisper STT + GPT)
OPENAI_API_KEY=sk-tu-openai-key

# ElevenLabs (TTS - Voz)
ELEVENLABS_API_KEY=tu-elevenlabs-key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Google Gemini (LLM)
GEMINI_API_KEY=tu-gemini-key-aqui

# DeepSeek (LLM alternativo)
DEEPSEEK_API_KEY=sk-tu-deepseek-key

# ==========================================
# 💳 STRIPE (Pagos)
# ==========================================
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_BASIC=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_ENTERPRISE=price_xxx

# ==========================================
# ⚙️ CONFIGURACIÓN DEL SERVIDOR
# ==========================================
PORT=3000
NODE_ENV=production
APP_URL=https://tu-dominio.com

# ==========================================
# 🔑 OTRAS CONFIGURACIONES
# ==========================================
# Códigos de acceso de estudiantes (separados por coma)
STUDENT_ACCESS_CODES=123456,789012

# Ratio de pruebas A/B
AB_TEST_RATIO=0.5
