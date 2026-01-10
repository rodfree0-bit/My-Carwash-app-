# 🎯 PLAN DE IMPLEMENTACIÓN - ANDROID APP

## ✅ ESTADO ACTUAL
- ✅ App compila sin errores
- ✅ Estructura base completa
- ✅ Modelos de datos correctos
- ✅ Firebase configurado

## 🔧 LO QUE VOY A IMPLEMENTAR AHORA

### 1. SISTEMA DE FOTOS COMPLETO (PRIORIDAD ALTA)
**Objetivo:** Washer debe tomar 6 fotos BEFORE y 6 AFTER durante el trabajo

**Archivos a crear/modificar:**
- ✅ `WasherLocationService.kt` - Ya existe
- 🔨 `WasherOrderDetailActivity.kt` - Agregar botones de fotos
- 🔨 `PhotoCaptureActivity.kt` - Nueva actividad para capturar fotos
- 🔨 `PhotoGalleryActivity.kt` - Nueva actividad para ver fotos (Admin)
- 🔨 `JobDetailViewModel.kt` - Implementar uploadPhoto()

**Funcionalidad:**
1. Botón "Take BEFORE Photos" (solo visible cuando status = ARRIVED)
2. Abrir PhotoCaptureActivity con 6 fotos requeridas
3. Guardar fotos en Firebase Storage
4. Actualizar orden con URLs de fotos
5. Botón "Take AFTER Photos" (solo visible cuando status = WASHING)
6. Admin puede ver galería de fotos

### 2. TRACKING GPS EN TIEMPO REAL (PRIORIDAD ALTA)
**Objetivo:** Cliente ve ubicación del washer en tiempo real

**Archivos a modificar:**
- 🔨 `WasherOrderDetailActivity.kt` - Iniciar servicio de ubicación
- 🔨 `OrderTrackingActivity.kt` - Mostrar mapa con ubicación
- ✅ `WasherLocationService.kt` - Ya existe y funciona

**Funcionalidad:**
1. Cuando washer acepta orden → iniciar WasherLocationService
2. Actualizar ubicación cada 5 segundos en Firestore
3. Cliente ve mapa con marcador del washer
4. Calcular distancia y ETA
5. Detener servicio cuando orden se completa

### 3. CHAT FUNCIONAL (PRIORIDAD MEDIA)
**Objetivo:** Cliente y Washer pueden chatear

**Archivos a modificar:**
- 🔨 `ChatActivity.kt` - Implementar envío/recepción
- 🔨 `ChatAdapter.kt` - Mostrar mensajes correctamente

**Funcionalidad:**
1. Cargar mensajes de Firestore en tiempo real
2. Enviar mensajes con texto
3. Notificar cuando llega mensaje nuevo
4. Mostrar quién envió cada mensaje

### 4. NOTIFICACIONES PUSH (PRIORIDAD MEDIA)
**Objetivo:** Notificar eventos importantes

**Archivos a modificar:**
- ✅ `MyFirebaseMessagingService.kt` - Ya existe
- 🔨 Configurar FCM en Firebase Console

**Funcionalidad:**
1. Nueva orden → notificar washers disponibles
2. Cambio de estado → notificar cliente
3. Mensaje nuevo → notificar destinatario
4. Washer cerca → notificar cliente

### 5. DISEÑOS IDÉNTICOS A WEB (PRIORIDAD BAJA)
**Objetivo:** Todas las pantallas se ven igual que Web

**Archivos a modificar:**
- 🔨 Todos los layouts XML
- 🔨 Colores, tipografías, espaciados

**Funcionalidad:**
1. Login screen idéntico a Web
2. Dashboards idénticos a Web
3. Formularios idénticos a Web
4. Botones y cards idénticos a Web

---

## 📋 ORDEN DE IMPLEMENTACIÓN

### FASE 1: FOTOS (2-3 horas)
1. Crear PhotoCaptureActivity
2. Implementar captura de 6 fotos
3. Subir a Firebase Storage
4. Integrar en WasherOrderDetailActivity
5. Crear PhotoGalleryActivity para admin

### FASE 2: GPS TRACKING (1-2 horas)
1. Activar WasherLocationService en WasherOrderDetailActivity
2. Implementar mapa en OrderTrackingActivity
3. Mostrar ubicación en tiempo real
4. Calcular distancia y ETA

### FASE 3: CHAT (1 hora)
1. Implementar carga de mensajes
2. Implementar envío de mensajes
3. Mejorar UI del chat

### FASE 4: NOTIFICACIONES (1 hora)
1. Configurar FCM
2. Implementar handlers de notificaciones
3. Probar notificaciones

### FASE 5: DISEÑOS (2-3 horas)
1. Actualizar colores y estilos
2. Actualizar layouts
3. Hacer que todo se vea igual a Web

---

## 🚀 EMPIEZO AHORA CON FASE 1: FOTOS

¿Quieres que empiece con las fotos o prefieres otro orden?
