# 🔥 GUÍA COMPLETA: FIREBASE + TALKME SAAS

## PARTE 1: CREAR PROYECTO EN FIREBASE

### Paso 1: Crear cuenta y proyecto
1. Ve a https://console.firebase.google.com
2. Inicia sesión con tu cuenta Google
3. Click en **"Agregar proyecto"**
4. Nombre: `talkme-saas` o `tu-academia`
5. Desactiva Google Analytics (opcional)
6. Click **"Crear proyecto"** (espera ~1 min)

---

## PARTE 2: CONFIGURAR FIRESTORE (Base de datos)

### Paso 2: Crear Base de Datos
1. En el menú lateral: **Build** > **Firestore Database**
2. Click **"Crear base de datos"**
3. Ubicación: `us-central1` (recomendado)
4. Mode: **"Production mode"** (más seguro)
5. Click **"Crear"**

### Paso 3: Crear Colecciones (tablas)
Crea estas colecciones en Firestore:

```
clients/
  └─ {client_id}
      - company_name: string
      - owner_email: string
      - plan_id: string
      - supported_languages: array
      - subscription_status: string

subscription_plans/
  ├─ free
  │  - name: "Gratuito"
  │  - monthly_price_usd: 0
  │  - max_students: 5
  ├─ basic
  │  - name: "Básico"
  │  - monthly_price_usd: 29
  │  - max_students: 25
  ├─ pro
  │  - name: "Profesional"
  │  - monthly_price_usd: 79
  │  - max_students: 100
  └─ enterprise
      - name: "Empresarial"
      - monthly_price_usd: 199
      - max_students: 500

languages/
  ├─ en
  │  - name_es: "Inglés"
  │  - name_native: "English"
  │  - flag_emoji: "🇬🇧"
  ├─ es
  │  - name_es: "Español"
  │  - name_native: "Español"
  │  - flag_emoji: "🇪🇸"
  └─ ... (40 idiomas)

client_students/
  └─ {student_id}
      - client_id: string
      - name: string
      - email: string
      - target_language: string
      - level: string
      - xp: number
      - xp_level: number
      - streak_days: number

chat_sessions/
  └─ {session_id}
      - client_id: string
      - student_id: string
      - language: string
      - level: string
      - status: string

chat_messages/
  └─ {message_id}
      - session_id: string
      - student_id: string
      - role: string
      - content: string
```

---

## PARTE 3: CONFIGURAR AUTHENTICATION

### Paso 4: Habilitar Auth
1. En el menú: **Build** > **Authentication**
2. Click **"Comenzar"**
3. **Proveedores:**
   - **Email/Password**: Habilitar
   - **Google**: Habilitar (opcional)
4. Click **"Guardar"**

---

## PARTE 4: OBTENER CONFIGURACIÓN

### Paso 5: Obtener Keys
1. Click en el ícono de **⚙️** (configuración)
2. **"Configuración del proyecto"**
3. Pestaña **"General"**
4. Copia:
   - **Project ID**: `tu-proyecto-123`
   - **Web API Key**: `AIzaSy...`

### Paso 6: Obtener Credentials
1. Ve a **"Cuentas de servicio"**
2. Click **"Generar nueva clave privada"**
3. Descarga el archivo JSON
4. Guarda las variables:

```env
# Del archivo JSON
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
```

---

## PARTE 5: CONFIGURAR EN RENDER

### Paso 7: Variables de Entorno
En Render Dashboard agrega:

```
# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@xxx.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com

# O si usas Firestore REST:
FIRESTORE_EMULATOR_HOST=
```

---

## PARTE 6: ACTUALIZAR CÓDIGO

### Paso 8: Instalar Firebase SDK
```bash
cd server
npm install firebase-admin
```

### Paso 9: Crear archivo de conexión
Crea `server/services/firebaseService.js`:

```javascript
const admin = require('firebase-admin');

// Inicializar Firebase Admin
const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
  return admin;
};

// Funciones CRUD
const db = {
  // Clients
  async getClient(clientId) {
    const doc = await admin.firestore().collection('clients').doc(clientId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async getClientBySlug(slug) {
    const snapshot = await admin.firestore().collection('clients').where('slug', '==', slug).limit(1).get();
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  },

  async createClient(data) {
    const doc = await admin.firestore().collection('clients').add(data);
    return { id: doc.id, ...data };
  },

  async updateClient(clientId, data) {
    await admin.firestore().collection('clients').doc(clientId).update(data);
    return { id: clientId, ...data };
  },

  // Students
  async getStudents(clientId) {
    const snapshot = await admin.firestore().collection('client_students')
      .where('client_id', '==', clientId)
      .orderBy('created_at', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async createStudent(data) {
    const doc = await admin.firestore().collection('client_students').add({
      ...data,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      xp: 0,
      xp_level: 1,
      streak_days: 0,
      total_sessions: 0,
      total_messages: 0
    });
    return { id: doc.id, ...data };
  },

  // Chat
  async createSession(data) {
    const doc = await admin.firestore().collection('chat_sessions').add({
      ...data,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
      messages_count: 0
    });
    return { id: doc.id, ...data };
  },

  async saveMessage(data) {
    const doc = await admin.firestore().collection('chat_messages').add({
      ...data,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: doc.id, ...data };
  },

  // Languages
  async getLanguages() {
    const snapshot = await admin.firestore().collection('languages')
      .where('is_active', '==', true)
      .orderBy('name_es')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

module.exports = { initializeFirebase, db };
};
```

### Paso 10: Integrar en index.js
Al inicio de `server/index.js`:

```javascript
const { initializeFirebase } = require('./services/firebaseService');

// Inicializar Firebase
if (process.env.FIREBASE_PROJECT_ID) {
  initializeFirebase();
  console.log('🔥 Firebase inicializado');
}
```

---

## ✅ RESUMEN DE VARIABLES

| Variable | Dónde obtenerla |
|----------|-----------------|
| `FIREBASE_PROJECT_ID` | Firebase Console > Configuración |
| `FIREBASE_PRIVATE_KEY` | Firebase Console > Cuentas de servicio > Generar clave |
| `FIREBASE_CLIENT_EMAIL` | Firebase Console > Cuentas de servicio |
| `FIREBASE_DATABASE_URL` | Firebase Console > Configuración ( termina en `.firebaseio.com`) |

---

## 🚀 ¡LISTO!

1. ✅ Crear proyecto Firebase
2. ✅ Configurar Firestore
3. ✅ Habilitar Authentication
4. ✅ Obtener credenciales
5. ✅ Configurar en Render
6. ✅ Actualizar código

¿Te ayudo con algo más?
