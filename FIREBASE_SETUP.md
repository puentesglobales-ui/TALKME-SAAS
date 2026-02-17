# ==========================================
# 🔥 CONFIGURACIÓN FIREBASE
# ==========================================

## 1. Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com
2. Crea un nuevo proyecto
3. Activa "Firestore Database" (Base de datos)
4. Activa "Authentication" (Autenticación)

## 2. Obtener Configuración

Ve a Configuración del proyecto > Tus apps > Web app

```javascript
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 3. Variables de Entorno para Firebase

```env
# Firebase
FIREBASE_API_KEY=tu-api-key
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# O usa la URL de Firestore directamente
FIRESTORE_EMULATOR_HOST=localhost:8080
```

## 4. Ejecutar SQL en Supabase/Firebase

El schema está en: `server/sql/saas_multi_cliente.sql`

Copia el contenido y ejecútalo en el SQL Editor de Supabase.

## 5. Recomendación: Usa Supabase (PostgreSQL)

Para este SaaS te recomiendo usar **Supabase** en lugar de Firestore porque:

| Característica | Supabase | Firestore |
|---------------|----------|-----------|
| SQL completo | ✅ | ❌ |
| Row Level Security | ✅ | ✅ |
| Tiempo real | ✅ | ✅ |
| Edge Functions | ✅ | ❌ |
| Base relacional | ✅ | ❌ |

### Configurar Supabase:

1. Crea proyecto en https://supabase.com
2. Ve a Settings > API
3. Copia URL y keys
4. Ejecuta los SQL en SQL Editor

```sql
-- Ejecuta: server/sql/saas_multi_cliente.sql
-- Ejecuta: server/sql/saas_startup_features.sql
```

## 6. Variables en Render

Copia estas en Render Dashboard:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

¡Listo! 🚀
