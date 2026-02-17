# 🚀 TalkMe v1 - Deployment Guide

## 📋 Descripción
TalkMe v1 es un tutor de idiomas con IA que usa **Google Generative AI** (SDK oficial) para conversaciones inteligentes y transcripción de voz.

## ✅ Características
- ✨ Conversación con IA usando Gemini 1.5 Flash
- 🎤 Transcripción de voz usando Gemini STT (Speech-to-Text)
- 🔊 Text-to-Speech usando Google Translate TTS
- 📚 Sistema de niveles CEFR (A1-C2)
- 🌍 Múltiples idiomas soportados

## 🔧 Configuración

### 1. Variables de Entorno
Crea o edita el archivo `.env`:

```bash
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Desarrollo Local
```bash
npm run dev
```

### 4. Build para Producción
```bash
npm run build
```

## 🌐 Deployment

### Opción A: Vercel
1. Conecta tu repositorio a Vercel
2. Agrega la variable de entorno `VITE_GEMINI_API_KEY`
3. Deploy automático

### Opción B: Netlify
1. Conecta tu repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Agrega la variable de entorno `VITE_GEMINI_API_KEY`

### Opción C: Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🔑 Obtener API Key de Gemini
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Cópiala al archivo `.env`

## 🐛 Troubleshooting

### Error: "GoogleGenerativeAI is not defined"
- ✅ **SOLUCIONADO**: El import map en `index.html` ahora carga correctamente `@google/generative-ai` desde CDN
- Verifica que la API key esté configurada en `.env`

### Error: "API Key no configurada"
- Asegúrate de que el archivo `.env` existe
- Verifica que la variable se llame `VITE_GEMINI_API_KEY`
- Reinicia el servidor de desarrollo

### El micrófono no funciona
- Verifica que el navegador tenga permisos de micrófono
- Usa HTTPS en producción (requerido para getUserMedia)

## 📦 Estructura del Proyecto
```
talkme/
├── components/          # Componentes React
├── services/           # Servicios de IA y audio
│   └── geminiService.ts  # Integración con Gemini
├── constants.tsx       # Configuración de idiomas y niveles
├── types.ts           # Tipos TypeScript
├── App.tsx            # Componente principal
└── index.html         # HTML con import map
```

## 🎯 Próximos Pasos
- [ ] Agregar más idiomas
- [ ] Implementar sistema de progreso
- [ ] Agregar gamificación
- [ ] Integrar pagos con Stripe
