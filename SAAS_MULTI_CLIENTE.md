# 🎓 SAAS MULTI-CLIENTE - IDIOMAS AI
## Documentación del Sistema

---

## 📋 Resumen

Este documento describe la arquitectura del sistema SaaS multi-cliente que permite a hasta **40 academias de idiomas** usar la plataforma simultáneamente, cada una con su propia configuración, estudiantes y personalización.

---

## 🗄️ Base de Datos

### Esquema Creado: `server/sql/saas_multi_cliente.sql`

#### Tablas Principales:

| Tabla | Descripción |
|-------|-------------|
| `subscription_planes` | Planes de suscripción (Free, Basic, Pro, Enterprise) |
| `clients` | Academias/clientes del SaaS |
| `languages` | Catálogo de 40 idiomas disponibles |
| `client_students` | Estudiantes de cada academia |
| `chat_sessions` | Sesiones de chat por estudiante |
| `chat_messages` | Mensajes de cada sesión |
| `subscriptions` | Registro de pagos |
| `client_metrics` | Métricas diarias por cliente |
| `client_ai_personas` | Personalidades AI customizadas |
| `cefr_levels` | Niveles CEFR (A1-C2) |

---

## 💰 Planes de Suscripción

| Plan | Precio | Estudiantes | Sesiones | Características |
|------|--------|-------------|----------|-----------------|
| **Free** | $0 | 5 | 2 | AI Tutor básico |
| **Basic** | $29/mes | 25 | 10 | Analytics básico, Voice |
| **Pro** | $79/mes | 100 | 30 | Analytics completo, WhatsApp |
| **Enterprise** | $199/mes | 500 | 100 | API, Soporte dedicado |

---

## 🌍 40 Idiomas Soportados

| Código | Español | Inglés | Nativo |
|--------|---------|--------|--------|
| en | Inglés | English | English |
| es | Español | Spanish | Español |
| fr | Francés | French | Français |
| de | Alemán | German | Deutsch |
| it | Italiano | Italian | Italiano |
| pt | Portugués | Portuguese | Português |
| ru | Ruso | Russian | Русский |
| zh | Chino | Chinese | 中文 |
| ja | Japonés | Japanese | 日本語 |
| ko | Coreano | Korean | 한국어 |
| ar | Árabe | Arabic | العربية |
| hi | Hindi | Hindi | हिन्दी |
| tr | Turco | Turkish | Türkçe |
| nl | Holandés | Dutch | Nederlands |
| pl | Polaco | Polish | Polski |
| sv | Sueco | Swedish | Svenska |
| da | Danés | Danish | Dansk |
| no | Noruego | Norwegian | Norsk |
| fi | Finlandés | Finnish | Suomi |
| el | Griego | Greek | Ελληνικά |
| he | Hebreo | Hebrew | עברית |
| th | Tailandés | Thai | ไทย |
| vi | Vietnamita | Vietnamese | Tiếng Việt |
| id | Indonesio | Indonesian | Bahasa Indonesia |
| ms | Malayo | Malay | Bahasa Melayu |
| cs | Checo | Czech | Čeština |
| sk | Eslovaco | Slovak | Slovenčina |
| hu | Húngaro | Hungarian | Magyar |
| ro | Rumano | Romanian | Română |
| uk | Ucraniano | Ukrainian | Українська |
| bg | Búlgaro | Bulgarian | Български |
| hr | Croata | Croatian | Hrvatski |
| sr | Serbio | Serbian | Српски |
| ca | Catalán | Catalan | Català |
| eu | Euskera | Basque | Euskara |
| gl | Gallego | Galician | Galego |
| ta | Tamil | Tamil | தமிழ் |
| bn | Bengalí | Bengali | বাংলা |
| pa | Punjabi | Punjabi | ਪੰਜਾਬੀ |
| fa | Persa | Persian | فارسی |
| ur | Urdu | Urdu | اردو |

---

## 🔌 API Endpoints

### Planos de Suscripción
```
GET /api/saas/plans
```

### Idiomas
```
GET /api/saas/languages
```

### Clientes (Admin)
```
GET    /api/saas/clients              - Listar clientes
POST   /api/saas/clients              - Crear cliente
GET    /api/saas/clients/:id          - Obtener cliente
PUT    /api/saas/clients/:id          - Actualizar cliente
GET    /api/saas/clients/:id/languages - Idiomas del cliente
GET    /api/saas/clients/:id/student-limit - Verificar límite
```

### Estudiantes
```
GET    /api/saas/clients/:id/students - Listar estudiantes
POST   /api/saas/clients/:id/students - Crear estudiante
PUT    /api/saas/students/:id         - Actualizar estudiante
```

### Chat
```
POST   /api/saas/chat/start           - Iniciar sesión
POST   /api/saas/chat/message         - Guardar mensaje
```

### Analytics
```
GET    /api/saas/clients/:id/analytics - Métricas del cliente
```

### Widget Público
```
GET    /api/widget/:slug/config        - Configuración del widget
```

---

## ⚙️ Configuración por Cliente

Cada academia puede configurar:

```javascript
{
  company_name: "Academia de Inglés Pro",
  slug: "academia-ingles-pro",  // URL: idiomsai.com/widget/academia-ingles-pro
  supported_languages: ['en', 'es', 'fr', 'de'],
  default_language: 'en',
  brand_color: '#6366f1',
  custom_welcome_message: "¡Bienvenido a tu clase de inglés!",
  ai_personality: 'friendly',  // friendly, formal, casual
  whatsapp_enabled: true,
  whatsapp_instance_id: "...",
  ai_level_preset: 'adaptive'  // adaptive, beginner_focused, advanced_only
}
```

---

## 🚀 Despliegue

### 1. Ejecutar Schema SQL
```bash
# En Supabase SQL Editor
psql -h your-db-host -U postgres -d postgres -f server/sql/saas_multi_cliente.sql
```

### 2. Configurar Variables de Entorno
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

### 3. Iniciar Servidor
```bash
cd server
npm start
```

---

## 📊 Flujo de Uso

```
1. Admin crea academia → POST /api/saas/clients
2. Academia configura idiomas y personalización
3. Academia registra estudiantes → POST /api/saas/clients/:id/students
4. Estudiante inicia chat → POST /api/saas/chat/start
5. Sistema guarda mensajes → POST /api/saas/chat/message
6. Academia consulta analytics → GET /api/saas/clients/:id/analytics
```

---

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de acceso por cliente
- Service Role solo para operaciones administrativas
- API Keys configuradas en servidor, nunca en cliente

---

## 📁 Archivos Modificados/Creados

| Archivo | Acción |
|---------|--------|
| `server/sql/saas_multi_cliente.sql` | ✅ CREADO |
| `server/services/multiTenantService.js` | ✅ CREADO |
| `server/index.js` | ✅ ACTUALIZADO |
| `vercel.json` | ✅ CORREGIDO |
| `.gitignore` | ✅ ACTUALIZADO |
| `CAMBIOS_REALIZADOS.md` | ✅ CREADO |
