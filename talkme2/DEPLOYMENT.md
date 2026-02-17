# 🚀 TalkMe v2 - Deployment Guide

## 📋 Descripción
TalkMe v2 es una versión simplificada del tutor de idiomas con IA, usando **Google Generative AI** con feedback estructurado en JSON.

## ✅ Características
- ✨ Conversación con IA usando Gemini 1.5 Flash
- 📊 Feedback estructurado (correcciones, tips de gramática, vocabulario)
- 🔊 Text-to-Speech usando Google Translate TTS
- 🎯 Sistema de niveles CEFR
- 🌍 Múltiples idiomas

## 🔧 Configuración

### 1. Variables de Entorno
Crea o edita el archivo `.env.local`:

```bash
VITE_API_KEY=tu_api_key_aqui
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
2. Agrega la variable de entorno `VITE_API_KEY`
3. Deploy automático

### Opción B: Netlify
1. Conecta tu repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Agrega la variable de entorno `VITE_API_KEY`

### Opción C: Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🔑 Obtener API Key de Gemini
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Cópiala al archivo `.env.local`

## 🐛 Troubleshooting

### Error: "GoogleGenerativeAI is not defined"
- ✅ **SOLUCIONADO**: El import map ahora usa `@google/generative-ai` correctamente
- ✅ El servicio de Gemini fue actualizado para usar el SDK oficial
- Verifica que la API key esté configurada en `.env.local`

### Error: "VITE_API_KEY not found"
- Asegúrate de que el archivo `.env.local` existe
- Verifica que la variable se llame `VITE_API_KEY`
- Reinicia el servidor de desarrollo

### El audio no se reproduce
- ✅ **SOLUCIONADO**: Ahora usa Google Translate TTS (MP3) en lugar de Gemini TTS (PCM)
- Verifica que el navegador permita reproducción de audio
- Algunos navegadores requieren interacción del usuario antes de reproducir audio

## 📦 Estructura del Proyecto
```
talkme2/
├── components/          # Componentes React
│   ├── Sidebar.tsx     # Panel de configuración
│   └── ChatWindow.tsx  # Ventana de chat
├── services/           # Servicios de IA y audio
│   ├── geminiService.ts  # Integración con Gemini
│   └── audioService.ts   # Reproducción de audio
├── constants.ts        # Prompts del sistema
├── types.ts           # Tipos TypeScript
├── App.tsx            # Componente principal
└── index.html         # HTML con import map
```

## 🔄 Diferencias con TalkMe v1
- ✅ Feedback más estructurado (JSON schema)
- ✅ UI más simple y enfocada
- ✅ Sin sistema de rutas (single page)
- ✅ TTS usando Google Translate en lugar de Gemini TTS

## 🎯 Próximos Pasos
- [ ] Agregar transcripción de voz (STT)
- [ ] Implementar sistema de progreso
- [ ] Agregar más idiomas
- [ ] Integrar con backend para persistencia
