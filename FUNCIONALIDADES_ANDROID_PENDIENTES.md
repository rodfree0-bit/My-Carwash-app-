# 📱 FUNCIONALIDADES ANDROID QUE NECESITAMOS EN WEB

Basándome en las conversaciones anteriores y el código Android, estas son las funcionalidades que se implementaron en Android y que ahora debemos agregar a la Web App:

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS EN ANDROID

### 1. ✅ SISTEMA DE FOTOS (6 ANTES + 6 DESPUÉS)
**Android:** `PhotoCaptureActivity.kt`

**Qué hace:**
- Washer toma 6 fotos ANTES de empezar el trabajo
- Washer toma 6 fotos DESPUÉS de terminar
- Fotos obligatorias: Frente, Lados, Atrás, Interior

**Estado en Web:** ❌ NO IMPLEMENTADO

**Necesitamos:**
- Componente de captura de fotos
- Validación de 6 fotos obligatorias
- Subida a Firebase Storage
- Galería para Admin ver fotos

---

### 2. ✅ GPS TRACKING EN TIEMPO REAL
**Android:** `WasherLocationService.kt`, `OrderTrackingActivity.kt`

**Qué hace:**
- Washer comparte ubicación en tiempo real
- Cliente ve en mapa dónde está el washer
- Actualización cada 5 segundos

**Estado en Web:** ⚠️ PARCIAL (existe LocationService.ts pero no está integrado)

**Necesitamos:**
- Activar tracking cuando washer va "En Route"
- Mostrar mapa en tiempo real para cliente
- Detener tracking cuando llega

---

### 3. ✅ CHAT EN TIEMPO REAL
**Android:** `ChatActivity.kt`, `ChatAdapter.kt`

**Qué hace:**
- Cliente ↔ Washer chat durante servicio
- Mensajes en tiempo real
- Notificaciones de mensajes nuevos

**Estado en Web:** ✅ IMPLEMENTADO (ChatModal.tsx existe)

**Verificar:**
- Que funcione correctamente
- Notificaciones de mensajes

---

### 4. ✅ SISTEMA DE PAGOS
**Android:** `PaymentActivity.kt`

**Qué hace:**
- Guardar tarjetas
- Seleccionar método de pago
- Aplicar cupones
- Procesar pago

**Estado en Web:** ✅ IMPLEMENTADO (en booking flow)

**Verificar:**
- Integración con Stripe
- Guardar tarjetas

---

### 5. ✅ NOTIFICACIONES PUSH
**Android:** Firebase Cloud Messaging configurado

**Qué hace:**
- Nueva orden (Washer)
- Orden asignada (Washer)
- Washer en camino (Cliente)
- Orden completada (Cliente)

**Estado en Web:** ❌ NO IMPLEMENTADO

**Necesitamos:**
- Configurar FCM para web
- Pedir permiso de notificaciones
- Enviar notificaciones desde backend

---

### 6. ✅ REPORTAR ISSUES
**Android:** Botón en settings

**Qué hace:**
- Usuario reporta problema
- Admin ve todos los issues
- Admin puede responder

**Estado en Web:** ✅ IMPLEMENTADO HOY
- ReportIssue.tsx ✅
- IssuesList.tsx ✅
- issueService.ts ✅

---

### 7. ✅ WASHER REGISTRATION
**Android:** `WasherRegistrationActivity.kt`

**Qué hace:**
- Formulario completo de registro
- Subir documentos (licencia, seguro, etc)
- Admin aprueba/rechaza

**Estado en Web:** ⚠️ PARCIAL (existe pantalla pero falta subida de docs)

**Necesitamos:**
- Subida de documentos
- Validación de documentos
- Panel de aprobación para Admin

---

### 8. ✅ GARAGE (VEHÍCULOS GUARDADOS)
**Android:** Gestión de vehículos

**Qué hace:**
- Cliente guarda sus vehículos
- Selecciona vehículo al hacer orden
- Edita/elimina vehículos

**Estado en Web:** ✅ IMPLEMENTADO

---

### 9. ✅ EARNINGS/PAYROLL
**Android:** `WasherEarningsFragment.kt`

**Qué hace:**
- Washer ve sus ganancias
- Desglose por trabajo
- Historial de pagos

**Estado en Web:** ✅ IMPLEMENTADO (Washer Earnings)

---

### 10. ✅ ADMIN TEAM MANAGEMENT
**Android:** `AdminTeamActivity.kt`

**Qué hace:**
- Ver todos los washers
- Aprobar aplicantes
- Bloquear/desbloquear
- Ver documentos

**Estado en Web:** ✅ IMPLEMENTADO (Admin Team)

---

## 🔨 PRIORIDADES PARA IMPLEMENTAR EN WEB

### 🔴 ALTA PRIORIDAD (Críticas)

1. **Sistema de Fotos** ⭐⭐⭐
   - Sin esto, no hay evidencia del trabajo
   - Protege a cliente y washer

2. **GPS Tracking** ⭐⭐⭐
   - Cliente necesita ver dónde está el washer
   - Experiencia tipo Uber

3. **Notificaciones Push** ⭐⭐⭐
   - Usuarios necesitan saber estado de orden
   - Sin esto, tienen que estar revisando la app

### 🟡 MEDIA PRIORIDAD

4. **Washer Registration Completo**
   - Subida de documentos
   - Aprobación de Admin

5. **Chat mejorado**
   - Verificar que funcione bien
   - Agregar indicadores de "escribiendo..."

### 🟢 BAJA PRIORIDAD

6. **Mejoras UI/UX**
   - Animaciones
   - Transiciones
   - Feedback visual

---

## 📊 RESUMEN

| Funcionalidad | Android | Web | Prioridad |
|---------------|---------|-----|-----------|
| Sistema de Fotos | ✅ | ❌ | 🔴 Alta |
| GPS Tracking | ✅ | ⚠️ | 🔴 Alta |
| Notificaciones Push | ✅ | ❌ | 🔴 Alta |
| Chat | ✅ | ✅ | 🟢 Baja |
| Pagos | ✅ | ✅ | 🟢 Baja |
| Report Issues | ✅ | ✅ | 🟢 Baja |
| Washer Registration | ✅ | ⚠️ | 🟡 Media |
| Garage | ✅ | ✅ | 🟢 Baja |
| Earnings | ✅ | ✅ | 🟢 Baja |
| Admin Team | ✅ | ✅ | 🟢 Baja |

---

## 🚀 PLAN DE ACCIÓN

**Para lograr paridad completa Web ↔ Android:**

### Fase 1: Críticas (Hoy/Mañana)
1. ✅ Sistema de Fotos
2. ✅ GPS Tracking completo
3. ✅ Notificaciones Push

### Fase 2: Importantes (Esta semana)
4. ✅ Washer Registration con docs
5. ✅ Verificar Chat funcional

### Fase 3: Pulido (Próxima semana)
6. ✅ Mejoras UI/UX
7. ✅ Testing completo
8. ✅ Deploy

---

## ❓ ¿QUÉ IMPLEMENTAMOS AHORA?

**Opciones:**

**A) Sistema de Fotos** (2-3 horas)
- Componente de captura
- Validación 6+6
- Subida a Storage
- Galería Admin

**B) GPS Tracking** (1-2 horas)
- Activar LocationService
- Mapa en tiempo real
- Integrar en orden

**C) Notificaciones Push** (2-3 horas)
- FCM para web
- Service Worker
- Permisos
- Envío de notificaciones

**D) Todo en orden** (6-8 horas)
- Fotos → GPS → Notificaciones

**¿Qué prefieres que implemente primero?**
