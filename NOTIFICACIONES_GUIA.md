# 🔔 Guía para Arreglar las Notificaciones Push

## Problema Identificado
Las notificaciones push no llegan al teléfono Android porque:
1. ❌ Las Firebase Cloud Functions no están desplegadas
2. ⚠️ Posiblemente Cloud Functions no está habilitado en tu proyecto Firebase

## ✅ Solución Implementada

### Cambios en el Código

#### 1. MyFirebaseMessagingService.kt
- ✅ Agregados logs detallados para debugging
- ✅ Manejo robusto de tokens FCM (guarda en SharedPreferences si no hay usuario autenticado)
- ✅ Notificaciones con vibración, sonido y luces
- ✅ Manejo de ambos tipos de payload (notification y data)
- ✅ Creación automática del canal de notificaciones

#### 2. MainActivity.kt
- ✅ Verifica y envía tokens FCM pendientes cuando el usuario inicia sesión
- ✅ Logs detallados para debugging
- ✅ Manejo robusto de errores con fallback a merge en Firestore

## 📋 Pasos para Completar la Configuración

### Paso 1: Habilitar Cloud Functions en Firebase

1. Ve a la consola de Firebase:
   https://console.firebase.google.com/project/my-carwashapp-e6aba/functions

2. Haz clic en "Get Started" o "Upgrade Project"

3. Selecciona el plan Blaze (Pay as you go)
   - ⚠️ No te preocupes, tiene un nivel gratuito muy generoso
   - Las primeras 2 millones de invocaciones al mes son GRATIS
   - Solo pagas si excedes ese límite

4. Acepta los términos y configura la facturación

### Paso 2: Desplegar las Firebase Functions

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
firebase deploy --only functions
```

Deberías ver algo como:
```
✔  Deploy complete!

Functions:
  onOrderUpdateV3(us-central1)
```

### Paso 3: Compilar la App Android

```bash
cd android-webview
./gradlew assembleDebug
```

O si usas Windows:
```bash
cd android-webview
gradlew.bat assembleDebug
```

### Paso 4: Instalar la App en tu Teléfono

El APK estará en:
```
android-webview/app/build/outputs/apk/debug/app-debug.apk
```

Transfiere este archivo a tu teléfono e instálalo.

### Paso 5: Verificar que Funciona

1. **Abre la app en tu teléfono**
2. **Inicia sesión** con tu cuenta
3. **Verifica los logs** en Android Studio (Logcat):
   - Busca: `FCMService` - Deberías ver el token FCM
   - Busca: `MainActivity` - Deberías ver "Token FCM guardado"

4. **Crea una orden de prueba** desde otro dispositivo:
   - Cambia el estado de la orden a "Assigned"
   - Deberías recibir una notificación en tu teléfono

## 🧪 Prueba Manual de Notificaciones

Si quieres probar las notificaciones sin esperar a que cambie el estado de una orden:

### Opción 1: Usar el Script de Prueba

1. Descarga tu Service Account Key de Firebase:
   - Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/settings/serviceaccounts/adminsdk
   - Haz clic en "Generate new private key"
   - Guarda el archivo como `serviceAccountKey.json` en la raíz del proyecto

2. Instala las dependencias:
```bash
npm install firebase-admin
```

3. Ejecuta el script de prueba:
```bash
node test-notification.js <TU_USER_ID>
```

Reemplaza `<TU_USER_ID>` con tu ID de usuario de Firestore.

### Opción 2: Usar la Consola de Firebase

1. Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/notification

2. Haz clic en "New notification"

3. Completa:
   - **Notification title**: Prueba
   - **Notification text**: Esta es una prueba
   - **Target**: Selecciona tu app Android
   - **Additional options** → **Custom data**:
     - Key: `type`, Value: `test`

4. Haz clic en "Review" y luego "Publish"

## 🔍 Debugging

### Ver Logs en Android

Conecta tu teléfono por USB y abre Android Studio:

1. Ve a: View → Tool Windows → Logcat
2. Filtra por: `FCMService` o `MainActivity`
3. Deberías ver logs como:
   ```
   📱 Token FCM obtenido: eXaMpLeToKeN...
   ✅ Token FCM guardado en Firestore
   📬 Mensaje FCM recibido
   ✅ Notificación mostrada: Título - Mensaje
   ```

### Verificar Token en Firestore

1. Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/firestore/data

2. Navega a: `users` → `<tu-user-id>`

3. Verifica que exista el campo `fcmToken` con un valor largo

### Problemas Comunes

#### ❌ "No FCM Token found for user"
- **Causa**: El usuario no tiene un token FCM guardado
- **Solución**: Asegúrate de que el usuario haya iniciado sesión en la app Android

#### ❌ "Notification permission denied"
- **Causa**: El usuario no ha dado permiso para notificaciones
- **Solución**: Ve a Configuración → Apps → My Carwash App → Notificaciones → Habilitar

#### ❌ "Error sending notification: Requested entity was not found"
- **Causa**: El token FCM es inválido o expiró
- **Solución**: Desinstala y reinstala la app para generar un nuevo token

#### ❌ Functions deploy fails
- **Causa**: Cloud Functions no está habilitado o hay un error de autenticación
- **Solución**: 
  1. Verifica que estés autenticado: `firebase login`
  2. Habilita Cloud Functions en la consola
  3. Intenta de nuevo: `firebase deploy --only functions`

## 📊 Cómo Funcionan las Notificaciones

### Flujo Completo:

1. **Usuario abre la app Android** → Se genera un token FCM
2. **Token se guarda en Firestore** → Campo `fcmToken` en el documento del usuario
3. **Se actualiza una orden** → Firebase Function `onOrderUpdateV3` se dispara
4. **Function lee el token** → Del documento del usuario en Firestore
5. **Function envía notificación** → Usando Firebase Cloud Messaging
6. **Android recibe la notificación** → `MyFirebaseMessagingService.onMessageReceived()`
7. **Se muestra la notificación** → En la barra de notificaciones del teléfono

## ✅ Checklist Final

- [ ] Cloud Functions habilitado en Firebase Console
- [ ] Firebase Functions desplegadas (`firebase deploy --only functions`)
- [ ] App Android compilada y instalada en el teléfono
- [ ] Usuario ha iniciado sesión en la app
- [ ] Token FCM visible en Firestore (campo `fcmToken`)
- [ ] Permisos de notificaciones habilitados en Android
- [ ] Notificación de prueba enviada y recibida

## 🆘 ¿Necesitas Ayuda?

Si después de seguir todos estos pasos las notificaciones aún no funcionan:

1. **Revisa los logs** en Logcat (Android Studio)
2. **Verifica Firestore** que el token esté guardado
3. **Prueba con el script** de prueba manual
4. **Revisa los logs de Functions** en Firebase Console

---

**Última actualización**: 2025-12-11
