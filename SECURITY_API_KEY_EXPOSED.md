# 🚨 SEGURIDAD: API Key Expuesta - Guía de Recuperación

## ⚠️ **Problema Detectado**

Google detectó que la API key de Gemini fue expuesta públicamente en GitHub y la **deshabilitó automáticamente** por seguridad.

**API Key Comprometida**: `AIzaSyBmMz50s-MqC9UhEHnwXILWAAFR5tG0Cq4`

---

## ✅ **Pasos de Recuperación INMEDIATOS**

### 1. **Crear Nueva API Key** ⭐ URGENTE

1. Ve a https://aistudio.google.com/app/apikey
2. Click en **"Crear clave de API"**
3. Copia la nueva API key
4. **NO la pegues en ningún archivo .env que esté en Git**

### 2. **Configurar la Nueva API Key en Render**

#### Para `mvp-idiomas-server`:
1. Ve a https://dashboard.render.com
2. Busca el servicio `mvp-idiomas-server`
3. Ve a "Environment"
4. Edita `GEMINI_API_KEY` y pega la **nueva** API key
5. Guarda (esto redesplegará automáticamente)

#### Para `talkme-vision`:
1. Busca el servicio `talkme-vision`
2. Ve a "Environment"
3. Edita `VITE_GEMINI_API_KEY` y pega la **nueva** API key
4. Guarda

#### Para `talkme2-vision`:
1. Busca el servicio `talkme2-vision`
2. Ve a "Environment"
3. Edita `VITE_API_KEY` y pega la **nueva** API key
4. Guarda

### 3. **Eliminar Archivos .env del Repositorio** ✅ YA HECHO

Los siguientes archivos fueron eliminados del repositorio:
- ✅ `client/.env`
- ✅ `client/.env.production`
- ✅ `server/.env.bak`
- ✅ `talkme/.env`

**Commit**: "Security: Eliminar archivos .env del repositorio"  
**Push**: ✅ Exitoso

---

## 🔒 **Prevención Futura**

### 1. **Verificar .gitignore**

Asegúrate de que `.gitignore` incluya:

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development
.env.*.local
*.env

# API Keys
**/api-keys.txt
**/*_key.txt
```

### 2. **NUNCA Commitear API Keys**

❌ **NUNCA HAGAS ESTO**:
```bash
git add .env
git commit -m "Add config"
```

✅ **SIEMPRE USA VARIABLES DE ENTORNO DEL SERVIDOR**:
- Render: Dashboard > Environment
- Vercel: Settings > Environment Variables
- Netlify: Site settings > Environment variables

### 3. **Usar Archivos .env.example**

Crea archivos de ejemplo SIN las keys reales:

```bash
# .env.example
GEMINI_API_KEY=tu_api_key_aqui
OPENAI_API_KEY=tu_api_key_aqui
ELEVENLABS_API_KEY=tu_api_key_aqui
```

Commitea el `.env.example` pero NUNCA el `.env` real.

---

## 🔍 **Verificar que las Keys Fueron Eliminadas**

### Comando para verificar:
```bash
git log --all --full-history -- "*/.env"
```

Si ves commits con `.env`, significa que las keys están en el historial de Git.

### Para limpiar el historial (AVANZADO):
```bash
# ⚠️ PELIGROSO: Esto reescribe el historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch **/.env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**NOTA**: Solo hazlo si es absolutamente necesario, ya que reescribe el historial.

---

## 📋 **Checklist de Seguridad**

- [x] Archivos .env eliminados del repositorio
- [x] Commit y push realizados
- [ ] Nueva API key creada en Google AI Studio
- [ ] Nueva API key configurada en Render (mvp-idiomas-server)
- [ ] Nueva API key configurada en Render (talkme-vision)
- [ ] Nueva API key configurada en Render (talkme2-vision)
- [ ] Verificar que .gitignore incluye .env
- [ ] Probar que la aplicación funciona con la nueva key

---

## 🎯 **Próximos Pasos INMEDIATOS**

1. **AHORA**: Crea la nueva API key en Google AI Studio
2. **AHORA**: Configúrala en Render Dashboard para los 3 servicios
3. **Espera 3-5 min**: Render redesplegará automáticamente
4. **Prueba**: https://mvp-idiomas-client.onrender.com

---

## 🔐 **Mejores Prácticas**

### ✅ DO (Hacer):
- Usar variables de entorno del servidor
- Usar servicios como Render, Vercel, Netlify para manejar secrets
- Agregar `.env` al `.gitignore`
- Rotar API keys regularmente
- Usar diferentes API keys para dev/prod

### ❌ DON'T (No Hacer):
- Commitear archivos .env
- Hardcodear API keys en el código
- Compartir API keys en chat/email
- Usar la misma API key en múltiples proyectos
- Exponer API keys en el cliente (frontend)

---

## 📊 **Estado Actual**

| Servicio | API Key Requerida | Estado |
|----------|-------------------|--------|
| mvp-idiomas-server | GEMINI_API_KEY | ⚠️ Necesita nueva key |
| talkme-vision | VITE_GEMINI_API_KEY | ⚠️ Necesita nueva key |
| talkme2-vision | VITE_API_KEY | ⚠️ Necesita nueva key |

---

## 🆘 **Si Necesitas Ayuda**

1. **Google Cloud Console**: https://console.cloud.google.com
2. **Google AI Studio**: https://aistudio.google.com
3. **Render Dashboard**: https://dashboard.render.com

---

**Fecha**: 2026-02-13 08:20 AM  
**Acción Requerida**: CREAR NUEVA API KEY AHORA  
**Prioridad**: 🚨 CRÍTICA
