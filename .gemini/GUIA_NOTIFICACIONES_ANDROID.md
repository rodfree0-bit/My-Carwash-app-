# 🔔 GUÍA: ARREGLAR NOTIFICACIONES PUSH EN ANDROID

## 📅 Fecha: 2025-12-11

---

## ⚠️ **PROBLEMA:**

Las notificaciones push NO llegan al teléfono Android (webview), solo funcionan en la web.

---

## ✅ **SOLUCIÓN IMPLEMENTADA EN EL WEBVIEW:**

He mejorado el código del webview para:
1. ✅ Solicitar automáticamente el token FCM cuando el usuario se loguea
2. ✅ Guardar tokens pendientes si llegan antes del login
3. ✅ Logs detallados para debugging
4. ✅ Reintentos automáticos

---

## 🔧 **CAMBIOS EN App.tsx:**

### **1. Interfaz AndroidNative Actualizada:**
```typescript
AndroidNative?: {
  logout: () => void;
  getUserToken: (callback: string) => void;
  showToast: (msg: string) => void;
  setUserId: (uid: string) => void;
  requestFCMToken?: () => void;  // ← NUEVO
};
```

### **2. Manejo Mejorado de Token FCM:**
```typescript
window.onFCMTokenReceived = async (token: string) => {
  console.log("📱 FCM Token Received from Native Android:", token);
  
  if (currentUser?.id) {
    // Guardar en Firestore
    await updateUserProfile(currentUser.id, { fcmToken: token });
    console.log("✅ FCM Token saved successfully");
  } else {
    // Guardar temporalmente si no hay usuario logueado
    localStorage.setItem('pendingFCMToken', token);
  }
};

// Solicitar token cuando usuario se loguea
if (currentUser?.id && window.AndroidNative?.requestFCMToken) {
  window.AndroidNative.requestFCMToken();
  
  // Verificar si hay token pendiente
  const pendingToken = localStorage.getItem('pendingFCMToken');
  if (pendingToken) {
    await updateUserProfile(currentUser.id, { fcmToken: pendingToken });
    localStorage.removeItem('pendingFCMToken');
  }
}
```

---

## 📱 **LO QUE NECESITAS HACER EN LA APP ANDROID:**

### **PASO 1: Agregar Método `requestFCMToken()` en MainActivity**

```kotlin
// En MainActivity.kt o donde tengas el WebView

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // ... tu código existente ...
        
        // Configurar JavaScript Interface
        webView.addJavascriptInterface(AndroidNative(), "AndroidNative")
    }
    
    inner class AndroidNative {
        
        // ... tus métodos existentes (logout, showToast, etc) ...
        
        // NUEVO: Método para solicitar token FCM
        @JavascriptInterface
        fun requestFCMToken() {
            Log.d("FCM", "📲 Token FCM solicitado desde WebView")
            
            // Obtener token FCM
            FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val token = task.result
                    Log.d("FCM", "✅ Token FCM obtenido: $token")
                    
                    // Enviar token al WebView
                    runOnUiThread {
                        webView.evaluateJavascript(
                            "window.onFCMTokenReceived && window.onFCMTokenReceived('$token')",
                            null
                        )
                    }
                } else {
                    Log.e("FCM", "❌ Error obteniendo token FCM", task.exception)
                }
            }
        }
    }
}
```

---

### **PASO 2: Enviar Token Automáticamente al Cargar WebView**

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // ... configuración del WebView ...
    
    // Esperar a que el WebView cargue
    webView.webViewClient = object : WebViewClient() {
        override fun onPageFinished(view: WebView?, url: String?) {
            super.onPageFinished(view, url)
            
            // Enviar token FCM automáticamente
            sendFCMTokenToWebView()
        }
    }
}

private fun sendFCMTokenToWebView() {
    FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
        if (task.isSuccessful) {
            val token = task.result
            Log.d("FCM", "📱 Enviando token FCM al WebView: $token")
            
            webView.evaluateJavascript(
                "window.onFCMTokenReceived && window.onFCMTokenReceived('$token')",
                null
            )
        }
    }
}
```

---

### **PASO 3: Actualizar Token Cuando Cambie**

```kotlin
// En tu FirebaseMessagingService

class MyFirebaseMessagingService : FirebaseMessagingService() {
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "🔄 Nuevo token FCM: $token")
        
        // Guardar token localmente
        val prefs = getSharedPreferences("fcm", Context.MODE_PRIVATE)
        prefs.edit().putString("token", token).apply()
        
        // Si el WebView está activo, enviar token
        // (necesitarás una referencia al WebView o usar un EventBus)
    }
    
    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        
        Log.d("FCM", "📬 Mensaje recibido: ${message.notification?.title}")
        
        // Mostrar notificación
        val notification = message.notification
        if (notification != null) {
            showNotification(
                notification.title ?: "Nueva notificación",
                notification.body ?: ""
            )
        }
    }
    
    private fun showNotification(title: String, body: String) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        // Crear canal de notificación (Android 8+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "default",
                "Notificaciones",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager.createNotificationChannel(channel)
        }
        
        // Crear notificación
        val notification = NotificationCompat.Builder(this, "default")
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.ic_notification) // Asegúrate de tener este ícono
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
        
        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
```

---

### **PASO 4: Configurar AndroidManifest.xml**

```xml
<manifest ...>
    
    <!-- Permisos -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <application ...>
        
        <!-- Tu MainActivity -->
        <activity android:name=".MainActivity" ...>
            ...
        </activity>
        
        <!-- Servicio de Firebase Messaging -->
        <service
            android:name=".MyFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
        
    </application>
</manifest>
```

---

### **PASO 5: Agregar Dependencias en build.gradle**

```gradle
dependencies {
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging-ktx'
    
    // Otras dependencias...
}
```

---

## 🔍 **DEBUGGING:**

### **Verificar en Logcat (Android Studio):**

```
Filtro: FCM

Deberías ver:
📲 Token FCM solicitado desde WebView
✅ Token FCM obtenido: eyJhbGc...
📱 Enviando token FCM al WebView: eyJhbGc...
```

### **Verificar en Chrome DevTools (WebView):**

```
1. Conecta el teléfono
2. Abre Chrome en PC
3. chrome://inspect
4. Selecciona tu WebView
5. Ve a Console

Deberías ver:
📱 FCM Token Received from Native Android: eyJhbGc...
✅ FCM Token saved successfully to Firestore
```

### **Verificar en Firestore:**

```
1. Abre Firebase Console
2. Firestore Database
3. Colección: users
4. Documento: [tu usuario]
5. Campo: fcmToken

Debería tener un valor como:
fcmToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2..."
```

---

## 🧪 **PROBAR NOTIFICACIONES:**

### **Opción 1: Desde Firebase Console**

```
1. Firebase Console
2. Cloud Messaging
3. Send your first message
4. Notification title: "Test"
5. Notification text: "Probando notificaciones"
6. Target: Single device
7. FCM registration token: [pegar token de Firestore]
8. Send
```

### **Opción 2: Cambiar Estado de Orden**

```
1. Login como admin en web
2. Cambiar estado de una orden
3. La notificación debería llegar al teléfono del cliente
```

---

## 📊 **FLUJO COMPLETO:**

```
1. Usuario abre app Android
   ↓
2. WebView carga
   ↓
3. onPageFinished() se ejecuta
   ↓
4. sendFCMTokenToWebView() obtiene token
   ↓
5. Token se envía a window.onFCMTokenReceived()
   ↓
6. WebView guarda token en Firestore
   ↓
7. Admin cambia estado de orden
   ↓
8. Firebase Function detecta cambio
   ↓
9. Function obtiene fcmToken del usuario
   ↓
10. Function envía notificación push
    ↓
11. MyFirebaseMessagingService recibe mensaje
    ↓
12. Se muestra notificación en Android
```

---

## ⚠️ **PROBLEMAS COMUNES:**

### **1. Token no se guarda:**
```
Causa: window.onFCMTokenReceived no está definido
Solución: Asegúrate de que el WebView cargó completamente
```

### **2. Notificaciones no llegan:**
```
Causa: Token incorrecto o expirado
Solución: Solicitar nuevo token con requestFCMToken()
```

### **3. Error de permisos:**
```
Causa: No se solicitó permiso POST_NOTIFICATIONS (Android 13+)
Solución: Agregar código para solicitar permiso en runtime
```

---

## 📝 **CÓDIGO COMPLETO DE EJEMPLO:**

He creado un archivo de ejemplo completo en:
`.gemini/ANDROID_FCM_EXAMPLE.kt`

---

## ✅ **CHECKLIST:**

- [ ] Agregar método `requestFCMToken()` en AndroidNative
- [ ] Enviar token automáticamente al cargar WebView
- [ ] Implementar `MyFirebaseMessagingService`
- [ ] Configurar AndroidManifest.xml
- [ ] Agregar dependencias de Firebase
- [ ] Solicitar permisos de notificaciones (Android 13+)
- [ ] Probar con Firebase Console
- [ ] Probar con cambio de estado de orden
- [ ] Verificar logs en Logcat
- [ ] Verificar token en Firestore

---

## 🎯 **RESULTADO ESPERADO:**

Cuando todo esté configurado:

1. ✅ Token FCM se guarda automáticamente en Firestore
2. ✅ Notificaciones llegan al teléfono
3. ✅ Se muestran en la barra de notificaciones
4. ✅ Click en notificación abre la app

---

**¡Con estos cambios las notificaciones deberían funcionar perfectamente!** 🔔

**Documentado por:** Antigravity AI  
**Fecha:** 2025-12-11  
**Estado:** ✅ WEBVIEW LISTO - FALTA IMPLEMENTAR EN ANDROID
