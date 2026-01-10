# 🔔 Sistema Completo de Notificaciones Push

## ✅ Notificaciones Configuradas

He configurado **6 funciones Firebase Cloud Functions** que envían notificaciones automáticamente:

### 1. 🆕 Nueva Orden Creada (`onNewOrderCreated`)
**Trigger:** Cuando se crea una nueva orden en Firestore
**Destinatarios:** Todos los washers activos
**Notificación:**
- **Título:** "🎉 New Order Available!"
- **Mensaje:** "New [servicio] order at [dirección]"
- **Data:** `{ type: "new_order", orderId, screen: "WASHER_JOBS" }`

**Ejemplo:**
```
🎉 New Order Available!
New Ultimate Shine order at 123 Main St, Springfield
```

---

### 2. 📝 Cambio de Estado de Orden (`onOrderStatusUpdated`)
**Trigger:** Cuando cambia el estado de una orden
**Destinatarios:** Cliente (y washer si se cancela)

**Notificaciones según estado:**

| Estado | Título | Mensaje |
|--------|--------|---------|
| New → Assigned | "Washer Assigned! 🚗" | "[Nombre] has been assigned to your order" |
| → En Route | "Washer En Route! 📍" | "[Nombre] is on the way" |
| → Arrived | "Washer Arrived! 👋" | "[Nombre] has arrived at your location" |
| → Washing | "Washing Started 🧼" | "Your vehicle is being washed now" |
| → Completed | "All Done! ✨" | "Your car wash is complete. Please rate your service" |
| → Cancelled | "Order Cancelled ❌" | "Your order has been cancelled" |

**Caso especial - Orden Cancelada:**
- Si la orden estaba asignada, también notifica al washer:
  - **Título:** "Order Cancelled ❌"
  - **Mensaje:** "Order #[id] has been cancelled"

---

### 3. 🐛 Nuevo Issue Reportado (`onNewIssueReported`)
**Trigger:** Cuando un usuario reporta un problema
**Destinatarios:** Todos los administradores
**Notificación:**
- **Título:** "🐛 New Issue Reported"
- **Mensaje:** "[Usuario] reported: [descripción]"
- **Data:** `{ type: "new_issue", issueId, screen: "ADMIN_DASHBOARD" }`

**Ejemplo:**
```
🐛 New Issue Reported
John Doe reported: App crashes when trying to book...
```

---

### 4. 👤 Nueva Aplicación de Washer (`onNewWasherApplication`)
**Trigger:** Cuando alguien aplica para ser washer
**Destinatarios:** Todos los administradores
**Notificación:**
- **Título:** "👤 New Washer Application"
- **Mensaje:** "[Nombre] applied to become a washer"
- **Data:** `{ type: "new_washer_application", applicationId, screen: "ADMIN_TEAM" }`

**Ejemplo:**
```
👤 New Washer Application
Mike Johnson applied to become a washer
```

---

### 5. 💬 Nuevo Mensaje (`onNewMessage`)
**Trigger:** Cuando se envía un mensaje en el chat
**Destinatarios:** El destinatario del mensaje
**Notificación:**
- **Título:** "💬 [Nombre del remitente]"
- **Mensaje:** [Texto del mensaje] (máx 100 caracteres)
- **Data:** `{ type: "new_message", orderId, senderId, screen: "CHAT" }`

**Ejemplo:**
```
💬 John Doe
I'm running 5 minutes late, sorry!
```

---

### 6. 🎉 Aplicación de Washer Aprobada (`onWasherApproved`)
**Trigger:** Cuando un admin aprueba una aplicación de washer
**Destinatarios:** El aplicante (si tiene cuenta)
**Notificación:**
- **Título:** "🎉 Application Approved!"
- **Mensaje:** "Congratulations! Your washer application has been approved. You can now start accepting jobs."
- **Data:** `{ type: "application_approved", screen: "WASHER_JOBS" }`

**Ejemplo:**
```
🎉 Application Approved!
Congratulations! Your washer application has been approved. You can now start accepting jobs.
```

---

## 📊 Resumen por Rol

### 👤 Cliente Recibe:
- ✅ Washer asignado a su orden
- ✅ Washer en camino
- ✅ Washer llegó
- ✅ Lavado iniciado
- ✅ Lavado completado
- ✅ Orden cancelada
- ✅ Nuevos mensajes

### 🧼 Washer Recibe:
- ✅ Nueva orden disponible
- ✅ Orden cancelada (si estaba asignada)
- ✅ Nuevos mensajes
- ✅ Aplicación aprobada

### 👨‍💼 Admin Recibe:
- ✅ Nuevo issue reportado
- ✅ Nueva aplicación de washer
- ✅ Nuevos mensajes

---

## 🔧 Implementación Técnica

### Función Helper: `sendNotification()`
Todas las funciones usan una función helper centralizada:

```javascript
async function sendNotification(userId, title, body, data = {}) {
    // 1. Busca el usuario en Firestore
    // 2. Obtiene su FCM token
    // 3. Envía la notificación usando Firebase Cloud Messaging
    // 4. Maneja errores automáticamente
}
```

### Características:
- ✅ **Manejo robusto de errores** - No falla si un usuario no tiene token
- ✅ **Logs detallados** - Cada notificación se registra en Firebase Functions logs
- ✅ **Notificaciones múltiples** - Puede enviar a múltiples usuarios (admins, washers)
- ✅ **Data payload** - Incluye información para deep linking y navegación

---

## 📱 Cómo Desplegar

### Opción 1: Desde la Terminal
```bash
firebase deploy --only functions
```

Esto desplegará las 6 funciones:
- `onNewOrderCreated`
- `onOrderStatusUpdated`
- `onNewIssueReported`
- `onNewWasherApplication`
- `onNewMessage`
- `onWasherApproved`

### Opción 2: Desde Firebase Console
1. Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/functions
2. Las funciones aparecerán automáticamente después del deploy

---

## 🧪 Cómo Probar

### Probar Nueva Orden:
1. Crea una orden desde la app cliente
2. Todos los washers activos deberían recibir notificación

### Probar Cambio de Estado:
1. Cambia el estado de una orden existente
2. El cliente debería recibir notificación

### Probar Nuevo Issue:
1. Reporta un problema desde la app
2. Todos los admins deberían recibir notificación

### Probar Nueva Aplicación:
1. Envía una aplicación para ser washer
2. Todos los admins deberían recibir notificación

### Probar Mensaje:
1. Envía un mensaje en el chat de una orden
2. El destinatario debería recibir notificación

### Probar Aprobación:
1. Aprueba una aplicación de washer desde el panel admin
2. El aplicante debería recibir notificación

---

## 🔍 Debugging

### Ver Logs de Functions:
1. Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/functions/logs
2. Busca los emojis en los logs:
   - 🆕 = Nueva orden
   - 📝 = Cambio de estado
   - 🐛 = Nuevo issue
   - 👤 = Nueva aplicación
   - 💬 = Nuevo mensaje
   - ✅ = Notificación enviada exitosamente
   - ❌ = Error

### Logs Esperados:
```
🆕 New order created: abc123
✅ Notified 5 washers about new order abc123

📝 Order abc123 status: New → Assigned
✅ Notification sent to user123: projects/...

🐛 New issue reported: issue456
✅ Notified 2 admins about new issue issue456
```

---

## ⚠️ Requisitos

Para que las notificaciones funcionen:

1. ✅ **Cloud Functions habilitado** en Firebase
2. ✅ **Functions desplegadas** (`firebase deploy --only functions`)
3. ✅ **Usuario tiene FCM token** guardado en Firestore
4. ✅ **Permisos de notificaciones** habilitados en el dispositivo
5. ✅ **App actualizada** instalada con el código mejorado

---

## 📈 Próximas Mejoras Posibles

- [ ] Notificación cuando un washer acepta una orden
- [ ] Notificación de recordatorio antes del servicio
- [ ] Notificación de promociones/descuentos
- [ ] Notificación de referidos exitosos
- [ ] Notificación de bonos ganados
- [ ] Notificación de pagos recibidos

---

**Última actualización:** 2025-12-12
**Total de funciones:** 6
**Estado:** Listo para desplegar
