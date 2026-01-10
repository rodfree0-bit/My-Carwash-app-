# 🔔 Solución Completa: Notificaciones Push

## ✅ Estado Actual

### Firebase Functions
- ✅ **onOrderUpdateV3** está DESPLEGADA y ACTIVA
- ✅ Envía notificaciones cuando cambia el estado de una orden

### Código Actualizado
- ✅ **MyFirebaseMessagingService.kt** - Mejorado con logs y manejo robusto
- ✅ **MainActivity.kt** - Guarda tokens FCM automáticamente
- ✅ **AndroidManifest.xml** - Configurado correctamente

## 🎯 Solución en 5 Pasos

### Paso 1: Instalar la App Actualizada

El APK compilado estará en:
```
android-webview/app/build/outputs/apk/debug/app-debug.apk
```

**Cómo instalarlo:**
1. Transfiere el archivo a tu teléfono (por USB, email, etc.)
2. Abre el archivo en tu teléfono
3. Permite "Instalar desde fuentes desconocidas" si te lo pide
4. Instala la app (reemplazará la versión anterior)

### Paso 2: Iniciar Sesión

1. Abre la app
2. Inicia sesión con tu cuenta
3. **Importante**: Cuando te pida permisos de notificaciones, acepta

### Paso 3: Verificar Token en Firestore

1. Ve a Firestore Console:
   https://console.firebase.google.com/project/my-carwashapp-e6aba/firestore/data

2. Navega a: `users` → `[tu-user-id]`

3. **Verifica que exista el campo `fcmToken`**

**Si el token existe**: ✅ Todo está configurado correctamente

**Si NO existe el token**: 
- Verifica los logs en Android Studio (Logcat)
- Busca errores en los logs con filtro "FCM"

### Paso 4: Prueba Manual

**Opción A: Desde Firebase Console**

1. Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/notification

2. Haz clic en "Send your first message"

3. Completa:
   - **Title**: Prueba
   - **Text**: Esta es una prueba

4. En Target, selecciona "Single device" y pega tu token FCM

5. Envía la notificación

**Deberías recibirla inmediatamente en tu teléfono**

**Opción B: Cambiar Estado de Orden**

1. Desde la web o desde otro dispositivo
2. Abre una orden existente
3. Cambia el estado de "New" a "Assigned"
4. Deberías recibir: "Washer Assigned! 🚗"

### Paso 5: Verificar Funcionamiento

**Notificaciones que deberías recibir:**

| Estado de Orden | Notificación |
|----------------|--------------|
| New → Assigned | "Washer Assigned! 🚗" |
| Assigned → En Route | "Washer En Route! 📍" |
| En Route → Arrived | "Washer Arrived! 👋" |
| Arrived → Washing | "Washing Started 🧼" |
| Washing → Completed | "All Done! ✨" |

## 🔍 Debugging

### Ver Logs en Android Studio

1. Conecta tu teléfono por USB
2. Abre Android Studio
3. Ve a: View → Tool Windows → Logcat
4. Filtra por: `FCMService` o `MainActivity`

**Logs que deberías ver:**

```
FCMService: 🔄 Nuevo token FCM generado: eXaMpLe...
FCMService: ✅ Token FCM guardado exitosamente en Firestore
MainActivity: 🔑 setUserId llamado para: [uid]
MainActivity: ✅ Token FCM guardado en Firestore para [uid]
```

**Cuando llegue una notificación:**

```
FCMService: 📬 Mensaje FCM recibido
FCMService:    From: gcm.googleapis.com
FCMService:    Notification: {title=Washer Assigned! 🚗, body=...}
FCMService: ✅ Notificación mostrada: Washer Assigned! 🚗 - ...
FCMService: 🔔 Notificación ID 123456 mostrada
```

### Verificar Permisos

En tu teléfono:
1. Configuración → Apps → My Carwash App
2. Notificaciones → Deben estar HABILITADAS
3. "Order Updates" → Debe estar HABILITADO

### Ver Logs de Firebase Functions

1. Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/functions/logs

2. Busca logs de `onOrderUpdateV3`

3. Deberías ver:
   ```
   Order [id] status changed from New to Assigned
   Successfully sent message: projects/...
   ```

## ❌ Solución de Problemas

### Problema: No veo el token en Firestore

**Solución:**
1. Verifica los logs en Logcat
2. Busca errores con "FCM" o "Error"
3. Asegúrate de que el usuario esté autenticado
4. Reinstala la app

### Problema: Token existe pero no llegan notificaciones

**Posibles causas:**

1. **Permisos deshabilitados**
   - Solución: Habilita notificaciones en Configuración

2. **App en segundo plano con ahorro de batería**
   - Solución: Desactiva optimización de batería para la app

3. **Token expirado**
   - Solución: Desinstala y reinstala la app

4. **Firebase Function no se dispara**
   - Solución: Verifica logs de Functions en Firebase Console

### Problema: Notificación manual funciona, automática no

**Causa:** La función Firebase no se está disparando

**Solución:**
1. Ve a Functions → Logs
2. Verifica que haya logs cuando cambias el estado
3. Si no hay logs, la función no se está disparando
4. Verifica que el cambio de estado se guarde en Firestore

## 📊 Checklist Final

- [ ] App actualizada instalada en el teléfono
- [ ] Usuario ha iniciado sesión
- [ ] Token FCM visible en Firestore
- [ ] Permisos de notificaciones habilitados
- [ ] Notificación de prueba manual recibida ✅
- [ ] Notificación automática (cambio de estado) recibida ✅

## 🎉 ¡Listo!

Si completaste todos los pasos y marcaste todos los items del checklist, las notificaciones deberían estar funcionando perfectamente.

**Cualquier cambio de estado de orden ahora enviará una notificación push a tu teléfono automáticamente.**

---

**Última actualización**: 2025-12-11
**Versión de la app**: Con mejoras de FCM
