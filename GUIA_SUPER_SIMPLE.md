# ✅ GUÍA ULTRA SIMPLE - Desplegar Funciones (5 minutos por función)

## 🎯 Lo que vas a hacer

Vas a copiar y pegar código 6 veces. Eso es todo.

---

## 📝 PASO 1: Abre este link

https://console.cloud.google.com/functions/add?project=my-carwashapp-e6aba

---

## 📝 PASO 2: Configura la PRIMERA función

### 2.1 Configuración Básica:
- **Environment**: Selecciona "2nd gen"
- **Function name**: Escribe `onNewOrderCreated`
- **Region**: Selecciona `us-central1`

### 2.2 Haz clic en "NEXT"

### 2.3 Configuración del Trigger:
- **Trigger type**: Selecciona "Cloud Firestore"
- **Event type**: Selecciona "google.cloud.firestore.document.v1.created"
- **Document path**: Escribe `orders/{orderId}`

### 2.4 Haz clic en "NEXT"

### 2.5 Código:
- **Runtime**: Selecciona "Node.js 18"
- **Entry point**: Escribe `onNewOrderCreated`

### 2.6 En el editor de código:
1. Borra todo lo que está ahí
2. Abre el archivo: `functions/index.js` (está en tu proyecto)
3. Copia TODO el contenido
4. Pégalo en el editor

### 2.7 Haz clic en "package.json" (pestaña al lado de index.js)
1. Borra todo
2. Pega esto:
```json
{
  "dependencies": {
    "firebase-admin": "^13.6.0",
    "firebase-functions": "^7.0.1"
  }
}
```

### 2.8 Haz clic en "DEPLOY"

### 2.9 Espera 2-3 minutos

---

## 📝 PASO 3: Repite para las otras 5 funciones

Solo cambia estos valores:

### Función 2: onOrderStatusUpdated
- **Function name**: `onOrderStatusUpdated`
- **Event type**: `google.cloud.firestore.document.v1.updated` ⚠️ (UPDATED, no created)
- **Document path**: `orders/{orderId}`
- **Entry point**: `onOrderStatusUpdated`
- **Código**: El mismo `functions/index.js`

### Función 3: onNewIssueReported
- **Function name**: `onNewIssueReported`
- **Event type**: `google.cloud.firestore.document.v1.created`
- **Document path**: `issues/{issueId}`
- **Entry point**: `onNewIssueReported`
- **Código**: El mismo `functions/index.js`

### Función 4: onNewWasherApplication
- **Function name**: `onNewWasherApplication`
- **Event type**: `google.cloud.firestore.document.v1.created`
- **Document path**: `washer_applications/{applicationId}`
- **Entry point**: `onNewWasherApplication`
- **Código**: El mismo `functions/index.js`

### Función 5: onNewMessage
- **Function name**: `onNewMessage`
- **Event type**: `google.cloud.firestore.document.v1.created`
- **Document path**: `messages/{messageId}`
- **Entry point**: `onNewMessage`
- **Código**: El mismo `functions/index.js`

### Función 6: onWasherApproved
- **Function name**: `onWasherApproved`
- **Event type**: `google.cloud.firestore.document.v1.created`
- **Document path**: `approved_washers/{email}`
- **Entry point**: `onWasherApproved`
- **Código**: El mismo `functions/index.js`

---

## ✅ PASO 4: Verifica

Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/functions

Deberías ver las 6 funciones activas.

---

## ⏱️ Tiempo Total

- Primera función: 5-7 minutos (aprendiendo)
- Funciones 2-6: 3-4 minutos cada una
- **Total: 25-30 minutos**

---

## 💡 Consejos

1. **Usa el mismo código** (`functions/index.js`) para TODAS las funciones
2. **Solo cambia**: Function name, Event type (created vs updated), Document path, Entry point
3. **No modifiques el código** - ya está perfecto
4. **Espera** a que cada función termine de desplegarse antes de crear la siguiente

---

## 🆘 Si tienes dudas

Avísame en qué paso estás y te ayudo.

**¿Listo para empezar?** Abre el link y empieza con la Función 1.
