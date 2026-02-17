
# TalkMe: Guía de Implementación Paso a Paso

Sigue estos pasos para subir tu tutor de idiomas a la nube de Google.

### 1. Obtener la API Key
- Ve a [Google AI Studio](https://aistudio.google.com/).
- Crea una nueva API Key.
- Guárdala, la necesitarás para el despliegue.

### 2. Configuración del Proyecto
Esta aplicación usa **React** con **Tailwind CSS** y el SDK de **Gemini 2.5/3**.
- Asegúrate de tener `Node.js` instalado.
- Los archivos proporcionados en este bloque XML contienen toda la lógica necesaria.

### 3. Despliegue en Google Cloud (Firebase Hosting)
Firebase es la forma más rápida de vivir en la nube de Google:
1. Instala Firebase CLI: `npm install -g firebase-tools`.
2. Inicia sesión: `firebase login`.
3. Inicializa el proyecto: `firebase init hosting`.
4. Elige tu proyecto de Google Cloud.
5. Selecciona la carpeta `dist` o `build` como tu directorio público.
6. Configura como una SPA (Single Page App).
7. Para la API Key, lo ideal es usar **Firebase Functions** como proxy o inyectarla en el build process mediante `secrets` si usas CI/CD.

### 4. Alternativa: Cloud Run
Si prefieres un backend persistente en Node.js:
1. Dockeriza la aplicación.
2. Súbela a **Artifact Registry**.
3. Despliégala en **Cloud Run** habilitando la variable de entorno `API_KEY`.

### 5. Configuración de Gemini
La app ya está configurada para usar:
- `gemini-3-flash-preview`: Para la lógica de tutoría rápida y estructurada en JSON.
- `gemini-2.5-flash-preview-tts`: Para la generación de voz nativa ultra-realista.

**Nota:** La inyección del "Syllabus" se hace dinámicamente en el `geminiService.ts` extrayendo reglas de `constants.ts`, lo que garantiza que la IA respete el nivel del usuario.
