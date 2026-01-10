# 🔄 Flujo de Órdenes - Sistema Completo

## 📋 Flujo Paso a Paso

### 1️⃣ Cliente Crea Orden
**Acción:** Cliente completa el formulario y crea una orden
**Estado:** `New`
**Notificaciones:**
- ✅ **ADMIN recibe:** "🆕 New Order Received! - [Cliente] ordered [servicio] at [dirección]"
- ❌ **Washer NO recibe nada** (no saben que existe la orden)

---

### 2️⃣ Admin Asigna Washer
**Acción:** Admin selecciona un washer y lo asigna a la orden
**Estado:** `Assigned` (pero pendiente de aceptación)
**Notificaciones:**
- ✅ **WASHER recibe:** "🚗 New Order Assigned to You! - You've been assigned to [cliente]'s order at [dirección]"
- ✅ **CLIENTE recibe:** "Washer Assigned! 🚗 - [Washer] has been assigned to your order"

**Importante:** La orden está asignada pero el washer aún no la ha aceptado.

---

### 3️⃣ Washer Acepta o Rechaza

#### Opción A: Washer ACEPTA ✅
**Acción:** Washer presiona "Accept Order"
**Estado:** Permanece en `Assigned` (confirmado)
**Campo nuevo:** `washerAccepted: true`
**Notificaciones:**
- ✅ **CLIENTE recibe:** "Washer Confirmed! ✅ - [Washer] accepted your order and will arrive soon"
- ✅ **ADMIN recibe:** "Order Confirmed - [Washer] accepted order #[id]"

**Ahora el washer puede cambiar los estados:**
- En Route
- Arrived
- Washing
- Completed

#### Opción B: Washer RECHAZA ❌
**Acción:** Washer presiona "Decline Order"
**Estado:** Vuelve a `New`
**Campo nuevo:** `washerRejected: true`, `rejectionReason: "..."`
**Notificaciones:**
- ✅ **ADMIN recibe:** "Order Declined ❌ - [Washer] declined order #[id]. Reason: [razón]"
- ❌ **CLIENTE NO recibe nada** (para evitar confusión)

**Admin debe asignar otro washer.**

---

### 4️⃣ Washer Trabaja la Orden

Una vez aceptada, el washer puede cambiar los estados:

| Estado | Acción del Washer | Notificación al Cliente |
|--------|-------------------|-------------------------|
| En Route | "I'm on my way" | "Washer En Route! 📍 - [Washer] is on the way" |
| Arrived | "I've arrived" | "Washer Arrived! 👋 - [Washer] has arrived at your location" |
| Washing | "Start washing" | "Washing Started 🧼 - Your vehicle is being washed now" |
| Completed | "Job done" | "All Done! ✨ - Your car wash is complete. Please rate your service" |

---

## 🔔 Resumen de Notificaciones

### 👨‍💼 ADMIN recibe notificaciones cuando:
1. ✅ Se crea una nueva orden (New)
2. ✅ Un washer acepta una orden
3. ✅ Un washer rechaza una orden
4. ✅ Se reporta un issue
5. ✅ Alguien aplica para ser washer

### 🧼 WASHER recibe notificaciones cuando:
1. ✅ Admin le asigna una orden (puede aceptar/rechazar)
2. ✅ Una orden asignada a él es cancelada
3. ✅ Recibe un mensaje nuevo

### 👤 CLIENTE recibe notificaciones cuando:
1. ✅ Admin asigna un washer a su orden
2. ✅ Washer acepta la orden (confirmación)
3. ✅ Washer cambia estado (En Route, Arrived, Washing, Completed)
4. ✅ Orden es cancelada
5. ✅ Recibe un mensaje nuevo

---

## 🛠️ Implementación Necesaria

### Campos Nuevos en la Orden:

```typescript
interface Order {
  // ... campos existentes
  washerAccepted?: boolean;      // true si el washer aceptó
  washerRejected?: boolean;      // true si el washer rechazó
  rejectionReason?: string;      // razón del rechazo
  assignedAt?: string;           // timestamp cuando se asignó
  acceptedAt?: string;           // timestamp cuando se aceptó
  rejectedAt?: string;           // timestamp cuando se rechazó
}
```

### Botones en la App del Washer:

Cuando el washer ve una orden con estado `Assigned` y `washerAccepted !== true`:

```
┌─────────────────────────────────────┐
│  Order #ABC123                      │
│  Client: John Doe                   │
│  Service: Ultimate Shine            │
│  Address: 123 Main St               │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │ ✅ Accept │  │ ❌ Decline│       │
│  └──────────┘  └──────────┘       │
└─────────────────────────────────────┘
```

Una vez aceptada, muestra los botones de cambio de estado:

```
┌─────────────────────────────────────┐
│  Order #ABC123 - ACCEPTED           │
│  Client: John Doe                   │
│  Service: Ultimate Shine            │
│  Address: 123 Main St               │
│                                     │
│  ┌──────────────────────┐          │
│  │ 🚗 I'm On My Way     │          │
│  └──────────────────────┘          │
└─────────────────────────────────────┘
```

---

## 📊 Estados de la Orden

```
New (Cliente crea)
  ↓
Assigned (Admin asigna, washer NO ha aceptado)
  ↓
  ├─→ Washer ACEPTA → Assigned (confirmado, washerAccepted: true)
  │     ↓
  │   En Route (Washer en camino)
  │     ↓
  │   Arrived (Washer llegó)
  │     ↓
  │   Washing (Lavando)
  │     ↓
  │   Completed (Terminado)
  │
  └─→ Washer RECHAZA → New (vuelve a estar disponible)
        Admin debe asignar otro washer
```

---

## 🔧 Funciones Firebase Necesarias

### Ya Implementadas ✅:
1. `onNewOrderCreated` - Notifica a admins
2. `onOrderStatusUpdated` - Notifica cambios de estado
3. `onNewIssueReported` - Notifica issues
4. `onNewWasherApplication` - Notifica aplicaciones
5. `onNewMessage` - Notifica mensajes
6. `onWasherApproved` - Notifica aprobaciones

### Por Implementar 🔨:
Ninguna adicional - La lógica de aceptar/rechazar se maneja en `onOrderStatusUpdated` detectando cambios en los campos `washerAccepted` y `washerRejected`.

---

## 💡 Ventajas de Este Flujo

1. ✅ **Control total del admin** - Solo el admin asigna órdenes
2. ✅ **Washer puede rechazar** - Si no puede hacer el trabajo
3. ✅ **Cliente informado** - Sabe cuando el washer acepta
4. ✅ **Transparencia** - Admin sabe si un washer rechaza y por qué
5. ✅ **Flexibilidad** - Admin puede reasignar si el washer rechaza

---

**Última actualización:** 2025-12-12
**Estado:** Listo para implementar
