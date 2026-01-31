# WebView con Firebase Hosting - Guía de Uso

## 🚀 Cómo Funciona

Tu app Android ahora es un **WebView container** que carga la aplicación desde Firebase Hosting. Esto significa:

✅ **Actualizaciones instantáneas** - Solo ejecuta `npm run deploy`
✅ **Sin recompilar APK** - Los cambios se ven inmediatamente
✅ **Todas las funcionalidades nativas funcionan** - Notificaciones, GPS, Cámara
✅ **Mismo código para web y móvil**

---

## 📱 Funcionalidades Nativas Disponibles

### 1. Notificaciones Push (FCM)
```javascript
// El bridge Android está disponible globalmente
if (window.Android) {
  // Obtener token FCM
  window.Android.getFCMToken();
  
  // Recibir el token
  window.onFCMTokenReceived = (token) => {
    console.log('FCM Token:', token);
    // Guardar en Firestore
  };
  
  // Solicitar permiso de notificaciones (Android 13+)
  window.Android.requestNotificationPermission();
}
```

### 2. Ubicación GPS (Tracking)
```javascript
if (window.Android) {
  // Solicitar ubicación
  window.Android.requestLocation();
  
  // Recibir ubicación
  window.onLocationReceived = (lat, lng) => {
    console.log('Location:', lat, lng);
    // Actualizar mapa, tracking, etc.
  };
}
```

### 3. Cámara y Fotos
```javascript
// La cámara funciona automáticamente con input file
<input 
  type="file" 
  accept="image/*" 
  capture="environment"  // Abre cámara directamente
/>

// O solicitar permiso explícitamente
if (window.Android) {
  window.Android.requestCameraPermission();
  
  window.onPermissionResult = (permission, granted) => {
    if (permission === 'camera' && granted) {
      console.log('Camera permission granted');
    }
  };
}
```

### 4. Vibración
```javascript
if (window.Android) {
  // Vibrar por 200ms
  window.Android.vibrate(200);
}
```

### 5. Compartir
```javascript
if (window.Android) {
  window.Android.shareText(
    'Check out this car wash app!',
    'My Carwash App'
  );
}
```

### 6. Toast Messages
```javascript
if (window.Android) {
  window.Android.showToast('Order created successfully!');
}
```

---

## 🔧 Comandos de Desarrollo

### Desarrollo Local
```bash
npm run dev
# Abre http://localhost:5173
# Prueba en el navegador primero
```

### Build de Producción
```bash
npm run build
# Genera archivos en /dist
```

### Deploy a Firebase Hosting
```bash
npm run deploy
# Build + Deploy en un solo comando
# Los usuarios de Android verán los cambios INMEDIATAMENTE
```

### Deploy Preview (Testing)
```bash
npm run deploy:preview
# Crea un canal de preview para testing
```

### Deploy Functions
```bash
npm run deploy:functions
# Solo actualiza Cloud Functions
```

### Deploy Todo
```bash
npm run deploy:all
# Deploy hosting + functions + rules
```

---

## 📲 Compilar App Android (Solo Primera Vez)

### 1. Build del Proyecto
```bash
cd android
./gradlew assembleDebug
```

### 2. Instalar en Dispositivo
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 3. ¡Listo!
Después de instalar la app una vez, **nunca más necesitas recompilarla** para cambios en la UI, lógica, o funcionalidades web.

---

## 🔄 Flujo de Actualización

### Hacer Cambios en el Código
1. Edita cualquier archivo (componentes, estilos, lógica)
2. Prueba localmente con `npm run dev`
3. Cuando esté listo: `npm run deploy`
4. ¡Los usuarios ven los cambios al instante!

### Cuándo SÍ Necesitas Recompilar el APK
Solo recompila si cambias:
- Permisos en AndroidManifest.xml
- Código nativo en MainActivity.java o WebViewBridge.java
- Configuración de notificaciones push
- Iconos o splash screen

---

## 🔒 Seguridad

### HTTPS Obligatorio
Firebase Hosting sirve todo por HTTPS automáticamente.

### Stripe y Pagos
Stripe funciona perfectamente en WebView con HTTPS. No hay diferencia con una app nativa.

### Datos Sensibles
- Tokens FCM se manejan en el lado nativo
- LocalStorage y cookies funcionan normalmente
- Firebase Auth funciona sin cambios

---

## 🐛 Troubleshooting

### La app no carga
1. Verifica que Firebase Hosting esté activo: `firebase hosting:sites:list`
2. Verifica la URL en MainActivity.java (línea 33)
3. Asegúrate de haber hecho deploy: `npm run deploy`

### Notificaciones no funcionan
1. Verifica que FCM esté configurado en Firebase Console
2. Verifica permisos en AndroidManifest.xml
3. Prueba obtener token: `window.Android.getFCMToken()`

### Cámara no funciona
1. Verifica permisos en AndroidManifest.xml
2. Solicita permiso: `window.Android.requestCameraPermission()`
3. Usa `<input type="file" accept="image/*" capture>`

### GPS no funciona
1. Verifica permisos de ubicación en AndroidManifest.xml
2. Solicita permiso: `window.Android.requestLocation()`
3. Verifica que el dispositivo tenga GPS activado

---

## 📊 Ventajas vs Desventajas

### ✅ Ventajas
- Actualizaciones instantáneas sin Google Play
- Un solo código para web y móvil
- Desarrollo más rápido
- Fácil debugging en navegador
- Menor tamaño de APK

### ⚠️ Consideraciones
- Requiere conexión a internet
- Primer arranque puede ser más lento
- Algunas APIs nativas requieren bridge

---

## 🎯 Próximos Pasos

1. **Hacer tu primer deploy**
   ```bash
   npm run deploy
   ```

2. **Compilar e instalar la app**
   ```bash
   cd android
   ./gradlew assembleDebug
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Hacer un cambio y ver la magia**
   - Cambia un texto en cualquier componente
   - `npm run deploy`
   - Cierra y abre la app
   - ¡El cambio está ahí!

---

## 📞 Soporte

Si algo no funciona:
1. Revisa la consola del navegador (Chrome DevTools)
2. Revisa los logs de Android: `adb logcat`
3. Verifica que Firebase Hosting esté activo
4. Asegúrate de que la URL en MainActivity.java sea correcta

---

**¡Disfruta de las actualizaciones instantáneas! 🚀**
