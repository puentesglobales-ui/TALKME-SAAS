# 📊 INFORME TÉCNICO - Análisis de Problemas y Soluciones

**Fecha**: 2026-02-13  
**Proyecto**: MVP Idiomas AI - TalkMe  
**Problema**: Error en funcionalidad de Speech-to-Text (STT)  
**Estado**: EN ANÁLISIS - Requiere solución definitiva

---

## 🔍 PROBLEMA ACTUAL

### Error Reportado:
```
Error [STT (Whisper)] 400 Unrecognized file format. 
Supported formats: ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']
```

### Contexto:
- **Ubicación**: Endpoint `/api/speak` en `server/index.js`
- **Servicio**: mvp-idiomas-server (Render)
- **Cliente**: Navegador móvil (Android Chrome)
- **Función**: Transcripción de audio grabado por el usuario

---

## 📚 INVESTIGACIÓN TÉCNICA

### 1. **OpenAI Whisper API - Formatos Soportados**

**Documentación Oficial**:
- ✅ **Formatos soportados**: MP3, MP4, MPEG, MPGA, M4A, WAV, WebM
- ⚠️ **Límite de tamaño**: 25 MB máximo
- ✅ **WebM está soportado** según la documentación oficial

**Fuentes**:
- OpenAI Official Docs: https://platform.openai.com/docs/guides/speech-to-text
- DataCamp Guide: Confirma soporte para WebM
- Medium Articles: Múltiples implementaciones exitosas con WebM

### 2. **MediaRecorder API - Formato de Salida del Navegador**

**Documentación Oficial**:
- ✅ **Formato por defecto**: `audio/webm; codecs=opus`
- ✅ **Soporte en navegadores**: Chrome, Firefox, Safari (modernos)
- ⚠️ **Problema potencial**: El archivo puede NO tener extensión `.webm`

**Verificación**:
```javascript
MediaRecorder.isTypeSupported('audio/webm; codecs=opus') // true en Chrome
```

### 3. **Google Generative AI SDK - Gemini Models**

**Documentación Oficial**:
- ✅ **gemini-1.5-flash**: Disponible desde Mayo 2024
- ✅ **Versión estable**: `gemini-1.5-flash-002` (Sept 2024)
- ❌ **Problema**: Requiere SDK versión `v0.21.0` o superior
- ❌ **Nuestro problema**: Estamos usando API v1beta que NO soporta estos modelos

**Fuentes**:
- Google AI Blog: Anuncio oficial Mayo 2024
- Wikipedia: Timeline de releases
- Google Cloud Docs: Vertex AI availability

---

## 🐛 ANÁLISIS DE CAUSA RAÍZ

### Problema #1: Formato de Archivo No Reconocido

**Hipótesis**:
El navegador está enviando audio en formato WebM con codec Opus, pero:

1. **El archivo NO tiene extensión** `.webm`
2. **Multer** (middleware de upload) puede estar guardando el archivo sin extensión
3. **OpenAI Whisper** rechaza el archivo porque no puede detectar el formato

**Evidencia**:
```javascript
// En server/index.js
const upload = multer({ dest: uploadDir + '/' });
```
Multer guarda archivos SIN extensión por defecto.

**Solución Propuesta**:
Necesitamos especificar la extensión o el MIME type correctamente.

---

### Problema #2: Gemini STT No Disponible

**Causa Confirmada**:
```
Error: models/gemini-1.5-flash is not found for API version v1beta
```

El SDK `@google/generative-ai` que tenemos instalado usa API v1beta, pero:
- `gemini-1.5-flash` NO está disponible en v1beta
- `gemini-pro` NO está disponible en v1beta
- Necesitamos actualizar el SDK a una versión más reciente

**Documentación**:
- Gemini 1.5 Flash requiere SDK v0.21.0+
- Nuestro SDK probablemente es una versión anterior

---

## ✅ SOLUCIONES PROPUESTAS

### Solución A: Arreglar Whisper STT (RECOMENDADO)

#### Paso 1: Verificar el Formato del Archivo

```javascript
// Agregar logging para ver qué está recibiendo Whisper
console.log('📁 Archivo recibido:', {
  originalname: audioFile.originalname,
  mimetype: audioFile.mimetype,
  size: audioFile.size,
  path: audioFile.path
});
```

#### Paso 2: Renombrar el Archivo con Extensión Correcta

```javascript
// Antes de enviar a Whisper, renombrar el archivo
const fs = require('fs');
const path = require('path');

const originalPath = audioFile.path;
const newPath = originalPath + '.webm'; // Agregar extensión

fs.renameSync(originalPath, newPath);

// Ahora usar newPath para Whisper
const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream(newPath),
  model: 'whisper-1',
});
```

#### Paso 3: Especificar el MIME Type en el Cliente

```javascript
// En el cliente (AudioRecorder.jsx o similar)
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus'
});
```

---

### Solución B: Actualizar Gemini SDK (ALTERNATIVA)

#### Paso 1: Actualizar el SDK

```bash
npm install @google/generative-ai@latest
```

#### Paso 2: Usar el Modelo Correcto

```javascript
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest" 
});
```

#### Paso 3: Verificar Compatibilidad

Consultar la documentación oficial para ver qué modelos están disponibles:
https://ai.google.dev/gemini-api/docs/models/gemini

---

## 🎯 RECOMENDACIÓN FINAL

### Opción Recomendada: **Solución A (Whisper)**

**Razones**:
1. ✅ **Whisper es más estable** para STT
2. ✅ **Mejor precisión** en transcripción
3. ✅ **Documentación clara** y bien soportada
4. ✅ **Ya tenemos OpenAI API key** configurada
5. ✅ **Menos dependencias** de Google

**Pasos Inmediatos**:
1. Agregar logging para ver el formato exacto del archivo
2. Renombrar el archivo con extensión `.webm`
3. Probar y verificar que funciona

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Pre-implementación:
- [ ] Revisar logs actuales de Render
- [ ] Verificar qué MIME type está enviando el cliente
- [ ] Confirmar que OpenAI API key está configurada

### Implementación:
- [ ] Agregar logging detallado del archivo recibido
- [ ] Implementar renombrado de archivo con extensión
- [ ] Actualizar código del cliente si es necesario
- [ ] Hacer commit y push
- [ ] Esperar deploy en Render

### Post-implementación:
- [ ] Probar en celular
- [ ] Verificar logs en Render
- [ ] Confirmar que la transcripción funciona
- [ ] Documentar la solución final

---

## 🔬 DEBUGGING ADICIONAL NECESARIO

### Información que Necesitamos:

1. **Del Cliente (Navegador)**:
   ```javascript
   // ¿Qué MIME type está usando MediaRecorder?
   console.log(mediaRecorder.mimeType);
   ```

2. **Del Servidor (Render)**:
   ```javascript
   // ¿Qué está recibiendo Multer?
   console.log({
     originalname: audioFile.originalname,
     mimetype: audioFile.mimetype,
     encoding: audioFile.encoding,
     size: audioFile.size
   });
   ```

3. **Del Archivo en Disco**:
   ```bash
   # ¿Qué tipo de archivo es realmente?
   file /path/to/uploaded/file
   ```

---

## 📊 COMPARACIÓN DE SOLUCIONES

| Aspecto | Whisper (OpenAI) | Gemini (Google) |
|---------|------------------|-----------------|
| **Estabilidad** | ✅ Alta | ⚠️ Media (SDK en desarrollo) |
| **Precisión** | ✅ Excelente | ✅ Excelente |
| **Costo** | ⚠️ $0.006/min | ✅ Gratis (con límites) |
| **Formatos** | ✅ WebM soportado | ❌ Requiere conversión |
| **Documentación** | ✅ Completa | ⚠️ En evolución |
| **Complejidad** | ✅ Simple | ⚠️ Requiere actualización SDK |
| **Recomendación** | ✅ **USAR** | ❌ No usar por ahora |

---

## 🚀 PRÓXIMOS PASOS

### Inmediato (Hoy):
1. Implementar logging detallado
2. Agregar renombrado de archivo con extensión
3. Deploy y testing

### Corto Plazo (Esta Semana):
1. Verificar que funciona en múltiples dispositivos
2. Optimizar manejo de errores
3. Documentar la solución final

### Largo Plazo (Futuro):
1. Considerar migrar a Gemini cuando el SDK esté más maduro
2. Implementar caché de transcripciones
3. Agregar soporte multi-idioma

---

## 📝 NOTAS IMPORTANTES

### Seguridad:
- ⚠️ API keys están expuestas en el cliente (TalkMe v1 y v2)
- ✅ API keys están seguras en el servidor (mvp-idiomas-server)
- 🔒 **Recomendación**: Mantener todas las API keys en el servidor

### Performance:
- Whisper tiene un límite de 25MB por archivo
- Considerar comprimir audio antes de enviar
- Implementar timeout de 30 segundos máximo

### Costos:
- Whisper: $0.006 por minuto de audio
- Gemini: Gratis hasta cierto límite
- **Estimación**: ~$0.01 por conversación promedio

---

## 🔗 REFERENCIAS

### Documentación Oficial:
1. OpenAI Whisper API: https://platform.openai.com/docs/guides/speech-to-text
2. MediaRecorder API: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
3. Google Generative AI: https://ai.google.dev/gemini-api/docs
4. Multer Documentation: https://github.com/expressjs/multer

### Artículos Técnicos:
1. WebM Format Guide: https://www.media-codings.com/articles/webm-opus
2. Whisper Best Practices: https://www.datacamp.com/tutorial/whisper-api
3. Browser Audio Recording: https://addpipe.com/blog/mediarecorder-api/

---

**Preparado por**: Antigravity AI  
**Fecha**: 2026-02-13  
**Versión**: 1.0  
**Estado**: Pendiente de Implementación
