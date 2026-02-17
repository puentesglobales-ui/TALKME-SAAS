# 🔑 CONFIGURAR NUEVA API KEY EN RENDER

## ✅ Nueva API Key Creada
```
AIzaSyDI5o4PAqLpKMGg2A6e25_EXNHz7BOWB8Y
```

---

## 📋 **PASOS PARA CONFIGURAR EN RENDER**

### 1. **Ir a Render Dashboard**
URL: https://dashboard.render.com

### 2. **Configurar mvp-idiomas-server** ⭐ PRIORITARIO

Este es el servicio principal que usa el micrófono.

1. Click en el servicio `mvp-idiomas-server`
2. Ve a la pestaña **"Environment"**
3. Busca la variable `GEMINI_API_KEY`
4. Click en **"Edit"** o **"Add Environment Variable"**
5. Pega la nueva API key:
   ```
   AIzaSyDI5o4PAqLpKMGg2A6e25_EXNHz7BOWB8Y
   ```
6. Click en **"Save Changes"**
7. Render redesplegará automáticamente (3-5 min)

---

### 3. **Configurar talkme-vision** (Opcional)

Solo si usas TalkMe v1 standalone.

1. Click en el servicio `talkme-vision`
2. Ve a **"Environment"**
3. Busca `VITE_GEMINI_API_KEY`
4. Edita y pega:
   ```
   AIzaSyDI5o4PAqLpKMGg2A6e25_EXNHz7BOWB8Y
   ```
5. Guarda

---

### 4. **Configurar talkme2-vision** (Opcional)

Solo si usas TalkMe v2 standalone.

1. Click en el servicio `talkme2-vision`
2. Ve a **"Environment"**
3. Busca `VITE_API_KEY`
4. Edita y pega:
   ```
   AIzaSyDI5o4PAqLpKMGg2A6e25_EXNHz7BOWB8Y
   ```
5. Guarda

---

## ⏱️ **Tiempo de Deploy**

Después de guardar las variables:
- Render redesplegará automáticamente
- Tiempo estimado: **3-5 minutos**
- Verás el status en el dashboard

---

## 🧪 **Verificar que Funciona**

### 1. Esperar el Deploy
En Render Dashboard, verifica que el servicio muestre:
- Status: **"Live"** (verde)
- No debe haber errores en los logs

### 2. Probar la Aplicación
Abre: https://mvp-idiomas-client.onrender.com

1. Inicia sesión
2. Click en el **micrófono** (botón verde)
3. Habla algo en inglés
4. Verifica que:
   - ✅ NO aparece el error "API key not valid"
   - ✅ El audio se transcribe
   - ✅ La IA responde
   - ✅ El audio TTS se reproduce

---

## 🐛 **Troubleshooting**

### Si el error persiste:

#### 1. Verificar que la variable está configurada
```bash
# En Render Dashboard > Environment
GEMINI_API_KEY=AIzaSyDI5o4PAqLpKMGg2A6e25_EXNHz7BOWB8Y
```

#### 2. Verificar los logs
- Ve a Render Dashboard
- Click en el servicio `mvp-idiomas-server`
- Ve a la pestaña **"Logs"**
- Busca errores relacionados con "API key"

#### 3. Hacer Manual Deploy
Si no redesplegó automáticamente:
- Click en **"Manual Deploy"**
- Selecciona **"Clear build cache & deploy"**

#### 4. Verificar que la API key es válida
- Ve a https://aistudio.google.com/app/apikey
- Verifica que la key esté activa (no bloqueada)

---

## 📊 **Checklist**

- [ ] Abrí Render Dashboard
- [ ] Configuré `GEMINI_API_KEY` en `mvp-idiomas-server`
- [ ] Esperé 3-5 minutos para el deploy
- [ ] Verifiqué que el status es "Live"
- [ ] Probé el micrófono en la aplicación
- [ ] Confirmé que NO hay error de API key

---

## 🎯 **Resultado Esperado**

Después de configurar la API key en Render:

✅ El error **"API key not valid"** desaparecerá  
✅ El micrófono funcionará correctamente  
✅ La transcripción (STT) funcionará  
✅ La IA responderá  
✅ El audio (TTS) se reproducirá  

---

## 📝 **Notas Importantes**

⚠️ **Seguridad**:
- La API key está configurada en Render (servidor)
- NO está en el código de GitHub
- Los archivos `.env` locales NO se suben a GitHub (están en `.gitignore`)

⚠️ **Desarrollo Local**:
- Para desarrollo local, usa los archivos `.env` que creamos
- Estos archivos están en `.gitignore` y NO se subirán a GitHub

---

**Fecha**: 2026-02-13 08:25 AM  
**Nueva API Key**: AIzaSyDI5o4PAqLpKMGg2A6e25_EXNHz7BOWB8Y  
**Próximo Paso**: Configurar en Render Dashboard
