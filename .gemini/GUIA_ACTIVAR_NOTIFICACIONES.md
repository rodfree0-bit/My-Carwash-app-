# 🔔 GUÍA COMPLETA: ACTIVAR NOTIFICACIONES PUSH

## 📋 PASO 1: OBTENER VAPID KEY DE FIREBASE

### **Instrucciones:**

1. **Ir a Firebase Console:**
   - Abre: https://console.firebase.google.com/
   - Selecciona tu proyecto: `my-carwashapp-e6aba`

2. **Navegar a Cloud Messaging:**
   - Click en el ícono de ⚙️ (Settings) arriba a la izquierda
   - Click en "Project settings"
   - Click en la pestaña "Cloud Messaging"

3. **Generar Web Push Certificate (si no existe):**
   - Scroll down hasta "Web Push certificates"
   - Si NO hay ninguna key, click en "Generate key pair"
   - Si YA existe una key, cópiala

4. **Copiar la VAPID Key:**
   - Verás algo como: `BNxxx...xxxxx` (una cadena larga)
   - Copia TODA la cadena

5. **Agregar a `.env`:**
   ```env
   VITE_FIREBASE_VAPID_KEY=TU_CLAVE_VAPID_AQUI
   ```

---

## 📋 PASO 2: VERIFICAR CONFIGURACIÓN DE FIREBASE FUNCTIONS

### **A. Verificar que Firebase CLI está instalado:**

```bash
firebase --version
```

Si NO está instalado:
```bash
npm install -g firebase-tools
```

### **B. Login a Firebase:**

```bash
firebase login
```

### **C. Verificar proyecto:**

```bash
firebase projects:list
```

Debe aparecer: `my-carwashapp-e6aba`

---

## 📋 PASO 3: DESPLEGAR FIREBASE FUNCTIONS

### **A. Instalar dependencias:**

```bash
cd functions
npm install
cd ..
```

### **B. Desplegar functions:**

```bash
firebase deploy --only functions
```

Esto desplegará la función `onOrderUpdateV3` que envía notificaciones automáticamente cuando cambia el estado de una orden.

---

## 📋 PASO 4: REBUILD Y REDEPLOY LA APP

### **A. Build de la aplicación:**

```bash
npm run build
```

### **B. Deploy a Firebase Hosting:**

```bash
firebase deploy --only hosting
```

---

## 📋 PASO 5: PROBAR NOTIFICACIONES

### **Test 1: Notificaciones Web (Browser)**

1. **Abrir la app en el navegador:**
   - https://my-carwashapp-e6aba.web.app

2. **Permitir notificaciones:**
   - El navegador debe pedir permiso
   - Click en "Permitir" / "Allow"

3. **Verificar en Console:**
   ```
   ✅ Service Worker registered successfully
   📱 FCM Token obtained: ...
   ✅ FCM Token saved to Firestore
   ```

4. **Crear una orden de prueba:**
   - Login como cliente
   - Crear una nueva orden
   - Login como admin (otra pestaña)
   - Asignar un washer a la orden
   - **Deberías recibir notificación en la pestaña del cliente**

### **Test 2: Notificaciones en Background**

1. **Minimizar/cambiar de pestaña**
2. **Cambiar estado de orden desde admin**
3. **Deberías ver notificación del sistema operativo**

### **Test 3: Notificaciones Nativas (Android)**

1. **Build Android:**
   ```bash
   npx cap sync android
   npx cap open android
   ```

2. **Ejecutar en dispositivo/emulador**

3. **Permitir notificaciones cuando la app lo pida**

4. **Crear orden y cambiar estados**

5. **Verificar notificaciones push nativas**

---

## 🔍 TROUBLESHOOTING

### **Problema: "Service Worker registration failed"**

**Solución:**
- Verificar que el archivo existe: `public/firebase-messaging-sw.js`
- Verificar que la app se sirve con HTTPS (o localhost)
- Limpiar caché del navegador: Ctrl+Shift+Delete

### **Problema: "FCM Token is null"**

**Solución:**
- Verificar que VAPID key está en `.env`
- Verificar que el usuario dio permiso de notificaciones
- Revisar console para errores específicos

### **Problema: "No se guardan los tokens en Firestore"**

**Solución:**
- Verificar Firestore Rules permiten escritura en `users/{userId}`
- Verificar que `updateUserProfile` funciona correctamente
- Revisar console para errores de permisos

### **Problema: "Functions no se despliegan"**

**Solución:**
```bash
# Verificar que estás en el proyecto correcto
firebase use my-carwashapp-e6aba

# Verificar billing (Functions requiere plan Blaze)
# Ir a: https://console.firebase.google.com/project/my-carwashapp-e6aba/usage

# Si necesitas cambiar de plan:
# Firebase Console > Upgrade to Blaze plan
```

### **Problema: "Notificaciones no llegan"**

**Checklist:**
- [ ] VAPID key configurada en `.env`
- [ ] Service Worker registrado (ver console)
- [ ] FCM Token guardado en Firestore (verificar en Firebase Console)
- [ ] Firebase Functions desplegadas (verificar en Firebase Console > Functions)
- [ ] Permisos de notificaciones otorgados
- [ ] Usuario tiene `fcmToken` en su documento de Firestore

---

## 📊 VERIFICACIÓN EN FIREBASE CONSOLE

### **1. Verificar FCM Tokens:**

1. Ir a Firestore Database
2. Navegar a `users/{userId}`
3. Verificar que existe el campo `fcmToken`
4. Debe ser una cadena larga como: `eXxx...xxxxx`

### **2. Verificar Functions:**

1. Ir a Functions en Firebase Console
2. Debe aparecer: `onOrderUpdateV3`
3. Estado: Deployed ✅
4. Revisar logs si hay errores

### **3. Verificar Mensajes Enviados:**

1. Ir a Cloud Messaging en Firebase Console
2. Ver estadísticas de mensajes enviados
3. Si hay errores, revisar detalles

---

## 🎯 CHECKLIST FINAL

### **Configuración:**
- [ ] VAPID key agregada a `.env`
- [ ] Service Worker registrado en App.tsx
- [ ] FCM tokens se guardan en Firestore
- [ ] Firebase Functions desplegadas
- [ ] App rebuildeada y redeployada

### **Testing:**
- [ ] Notificaciones web en foreground funcionan
- [ ] Notificaciones web en background funcionan
- [ ] Notificaciones nativas Android funcionan
- [ ] Tokens se guardan correctamente en Firestore
- [ ] Functions se ejecutan al cambiar estado de orden

---

## 📝 NOTAS IMPORTANTES

### **Sobre el Plan de Firebase:**

Las Firebase Cloud Functions requieren el **plan Blaze (Pay as you go)**.

**Costos estimados:**
- Primeras 2M invocaciones/mes: GRATIS
- Después: $0.40 por millón de invocaciones
- Para una app pequeña/mediana: ~$0-5/mes

### **Sobre Service Workers:**

- Solo funcionan en HTTPS (o localhost)
- No funcionan en modo incógnito de algunos navegadores
- Requieren que el usuario dé permiso explícito

### **Sobre Notificaciones Nativas:**

- Android: Usa Firebase Cloud Messaging (FCM)
- iOS: Usa Apple Push Notification Service (APNS)
- Requiere configuración adicional en Firebase Console para iOS

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DE ACTIVAR NOTIFICACIONES

1. **Personalizar mensajes de notificación**
   - Editar templates en `functions/index.js`
   - Agregar imágenes, acciones, etc.

2. **Agregar notificaciones para más eventos:**
   - Nuevo mensaje en chat
   - Nuevo issue reportado
   - Pago recibido
   - etc.

3. **Implementar notificaciones programadas:**
   - Recordatorios de citas
   - Promociones
   - etc.

---

**Fecha:** 2025-12-11  
**Versión:** 1.0  
**Autor:** Antigravity AI
