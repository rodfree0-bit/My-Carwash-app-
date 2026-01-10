# 🔍 Diagnóstico de Notificaciones Push

## ✅ Estado Actual

### Firebase Functions
- ✅ **onOrderUpdateV3** está DESPLEGADA y ACTIVA
- ✅ Cloud Functions está habilitado en tu proyecto
- ✅ El código de la función está correcto

### Código Android
- ✅ MyFirebaseMessagingService.kt mejorado con logs
- ✅ MainActivity.kt mejorado para manejar tokens
- ✅ AndroidManifest.xml configurado correctamente

## 🔍 Pasos de Diagnóstico

### 1. Verificar Token FCM en Firestore

1. Ve a Firestore Console:
   https://console.firebase.google.com/project/my-carwashapp-e6aba/firestore/data

2. Navega a la colección `users`

3. Busca tu documento de usuario (usa tu email o UID)

4. **Verifica que exista el campo `fcmToken`**
   - ✅ Si existe: Copia el token (lo necesitaremos)
   - ❌ Si NO existe: El problema está aquí

**Si NO existe el token:**
- La app no está guardando el token correctamente
- Necesitas reinstalar la app con el código actualizado

### 2. Compilar e Instalar la App Actualizada

La app necesita ser recompilada con los cambios que hice:

```bash
cd android-webview
./gradlew assembleDebug
```

O en Windows:
```bash
cd android-webview
gradlew.bat assembleDebug
```

El APK estará en:
```
android-webview/app/build/outputs/apk/debug/app-debug.apk
```

**Instala este APK en tu teléfono**

### 3. Verificar Logs en la App

Después de instalar la app actualizada:

1. Conecta tu teléfono por USB
2. Abre Android Studio → Logcat
3. Filtra por: `FCM` o `MainActivity`

**Busca estos logs:**
```
📱 Token FCM obtenido: eXaMpLe...
✅ Token FCM guardado en Firestore para <uid>
```

Si ves estos logs, el token se está guardando correctamente.

### 4. Probar Cambio de Estado de Orden

1. **Desde la web o desde otro dispositivo:**
   - Abre una orden existente
   - Cambia el estado de "New" a "Assigned"

2. **En tu teléfono deberías ver:**
   - Una notificación en la barra de notificaciones
   - En Logcat: `📬 Mensaje FCM recibido`

### 5. Verificar Permisos de Notificaciones

En tu teléfono Android:

1. Ve a: **Configuración** → **Apps** → **My Carwash App**
2. Toca en **Notificaciones**
3. Verifica que estén **HABILITADAS**
4. Verifica que el canal "Order Updates" esté habilitado

## 🧪 Prueba Manual con Firebase Console

Si quieres probar sin cambiar estados de órdenes:

1. Ve a Firebase Console → Cloud Messaging:
   https://console.firebase.google.com/project/my-carwashapp-e6aba/notification

2. Haz clic en "**Send your first message**" o "**New notification**"

3. Completa:
   - **Notification title**: Prueba
   - **Notification text**: Esta es una prueba de notificación
   
4. Haz clic en "**Next**"

5. En "**Target**":
   - Selecciona "**Single device**"
   - Pega el **FCM token** que copiaste de Firestore

6. Haz clic en "**Review**" → "**Publish**"

**Deberías recibir la notificación inmediatamente**

## 🐛 Problemas Comunes

### ❌ No veo el token en Firestore

**Causa**: La app no está guardando el token

**Solución**:
1. Recompila la app con el código actualizado
2. Desinstala la app vieja del teléfono
3. Instala la app nueva
4. Inicia sesión
5. Verifica los logs en Logcat

### ❌ El token existe pero no llegan notificaciones

**Causa**: Permisos de notificaciones deshabilitados

**Solución**:
1. Ve a Configuración → Apps → My Carwash App → Notificaciones
2. Habilita todas las notificaciones
3. Prueba de nuevo

### ❌ Error en Logcat: "Error guardando token FCM"

**Causa**: Problema de permisos en Firestore

**Solución**:
1. Verifica que las reglas de Firestore permitan escritura
2. El usuario debe estar autenticado

### ❌ Notificación de prueba manual funciona, pero no las automáticas

**Causa**: La función Firebase no se está disparando

**Solución**:
1. Ve a Firebase Console → Functions → Logs
2. Busca errores en `onOrderUpdateV3`
3. Verifica que el cambio de estado esté guardándose en Firestore

## 📊 Checklist de Verificación

Marca cada item cuando lo completes:

- [ ] Token FCM existe en Firestore para mi usuario
- [ ] App recompilada e instalada con código actualizado
- [ ] Logs muestran "Token FCM guardado en Firestore"
- [ ] Permisos de notificaciones habilitados en Android
- [ ] Notificación de prueba manual recibida exitosamente
- [ ] Cambio de estado de orden dispara notificación automática

## 🎯 Próximos Pasos

1. **PRIMERO**: Verifica si existe el token en Firestore
2. **SEGUNDO**: Si no existe, recompila e instala la app
3. **TERCERO**: Prueba con notificación manual desde Firebase Console
4. **CUARTO**: Prueba con cambio de estado de orden

---

**¿Qué verificamos primero?**
1. Ve a Firestore y busca tu usuario
2. Dime si existe el campo `fcmToken`
3. Si existe, cópialo y prueba enviar notificación manual
4. Si no existe, necesitamos recompilar la app
