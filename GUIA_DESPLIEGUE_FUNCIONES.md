# 🚀 GUÍA DEFINITIVA: Desplegar Funciones Manualmente

## ⚡ Opción Más Rápida (Recomendada)

Ya que el Firebase CLI no funciona, vamos a copiar el código directamente en Google Cloud Console.

---

## 📝 PASO 1: Preparar el Código

El código completo está en: `functions/index.js`

**YA ESTÁ LISTO** - No necesitas modificar nada.

---

## 🌐 PASO 2: Abrir Google Cloud Console

1. **Abre este enlace:**
   https://console.cloud.google.com/functions/list?project=my-carwashapp-e6aba

2. **Inicia sesión** con tu cuenta de Google

3. **Deberías ver** la lista de funciones (puede estar vacía)

---

## ➕ PASO 3: Crear la Primera Función

### 3.1 Hacer clic en "CREATE FUNCTION"

### 3.2 Configurar:
- **Environment:** `2nd gen`
- **Function name:** `onNewOrderCreated`
- **Region:** `us-central1`

### 3.3 Trigger:
- **Trigger type:** `Cloud Firestore`
- **Event type:** `google.cloud.firestore.document.v1.created`
- **Document path:** `orders/{orderId}`

### 3.4 Runtime:
- **Runtime:** `Node.js 18`
- **Entry point:** `onNewOrderCreated`

### 3.5 Código:
**Copia TODO el contenido de `functions/index.js`** y pégalo en el editor

### 3.6 package.json:
Reemplaza el contenido con:
```json
{
  "name": "carwash-notifications",
  "version": "1.0.0",
  "dependencies": {
    "firebase-admin": "^13.6.0",
    "firebase-functions": "^7.0.1"
  }
}
```

### 3.7 Hacer clic en "DEPLOY"

**Espera 2-3 minutos** a que se despliegue.

---

## 🔁 PASO 4: Repetir para las Otras 5 Funciones

### Función 2: onOrderStatusUpdated
- **Event type:** `google.cloud.firestore.document.v1.updated`
- **Document path:** `orders/{orderId}`
- **Entry point:** `onOrderStatusUpdated`
- **Código:** El mismo `functions/index.js`

### Función 3: onNewIssueReported
- **Event type:** `google.cloud.firestore.document.v1.created`
- **Document path:** `issues/{issueId}`
- **Entry point:** `onNewIssueReported`
- **Código:** El mismo `functions/index.js`

### Función 4: onNewWasherApplication
- **Event type:** `google.cloud.firestore.document.v1.created`
- **Document path:** `washer_applications/{applicationId}`
- **Entry point:** `onNewWasherApplication`
- **Código:** El mismo `functions/index.js`

### Función 5: onNewMessage
- **Event type:** `google.cloud.firestore.document.v1.created`
- **Document path:** `messages/{messageId}`
- **Entry point:** `onNewMessage`
- **Código:** El mismo `functions/index.js`

### Función 6: onWasherApproved
- **Event type:** `google.cloud.firestore.document.v1.created`
- **Document path:** `approved_washers/{email}`
- **Entry point:** `onWasherApproved`
- **Código:** El mismo `functions/index.js`

---

## ✅ PASO 5: Verificar

1. **Ve a Firebase Console:**
   https://console.firebase.google.com/project/my-carwashapp-e6aba/functions

2. **Deberías ver las 6 funciones activas:**
   - ✅ onNewOrderCreated
   - ✅ onOrderStatusUpdated
   - ✅ onNewIssueReported
   - ✅ onNewWasherApplication
   - ✅ onNewMessage
   - ✅ onWasherApproved

---

## 🧪 PASO 6: Probar

1. **Instala el APK** en tu teléfono
2. **Inicia sesión**
3. **Crea una orden** desde otro dispositivo
4. **Deberías recibir** la notificación "🆕 New Order Received!"

---

## ⏱️ Tiempo Estimado

- Crear cada función: 3-4 minutos
- Total: 20-25 minutos

---

## 💡 Consejos

1. **Usa el mismo código** para todas las funciones (el archivo completo `functions/index.js`)
2. **Solo cambia** el Entry Point y el Document Path
3. **Verifica** que el Event Type sea correcto (created vs updated)
4. **No modifiques** el código - ya está optimizado

---

## 🆘 Si algo falla

**Error: "Permission denied"**
- Ve a IAM: https://console.firebase.google.com/project/my-carwashapp-e6aba/settings/iam
- Verifica que tengas rol "Editor" o "Owner"

**Función no se ejecuta**
- Ve a Logs: https://console.firebase.google.com/project/my-carwashapp-e6aba/functions/logs
- Busca errores en rojo
- Verifica que el Entry Point coincida con el nombre de la función en el código

---

**¿Listo?** Empieza con la Función 1 y avísame cuando la hayas desplegado.
