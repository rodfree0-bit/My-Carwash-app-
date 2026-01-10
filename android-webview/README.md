# 🌐 Android WebView App

## 📱 Descripción

Esta es la versión **WebView** de la app Android que carga la aplicación web dentro de un contenedor nativo.

## ✨ Características

### ✅ Login Nativo
- Autenticación con Firebase nativa (no usa Clerk)
- Pantalla de login nativa en Android
- Token de Firebase se inyecta en la Web App

### ✅ WebView Optimizado
- JavaScript habilitado
- DOM Storage habilitado
- Soporte para cámara y ubicación
- Manejo del botón "Atrás"

### ✅ Comunicación Nativa ↔ Web
- `AndroidNative.login(email, password)` - Login desde web
- `AndroidNative.logout()` - Logout desde web
- `AndroidNative.getUserToken(callback)` - Obtener token

## 🚀 Cómo Usar

### 1. Configurar URL de la Web App

Edita `MainActivity.kt` línea 54:
```kotlin
val webAppUrl = "https://your-app.web.app" // Cambia por tu URL
```

### 2. Compilar

```bash
cd android-webview
./gradlew assembleDebug
```

### 3. Instalar

```bash
./gradlew installDebug
```

## 🔧 Configuración de la Web App

La web app debe detectar si está corriendo en Android WebView y usar el login nativo:

```javascript
// En tu Web App
if (window.AndroidNative) {
    // Usar login nativo
    window.AndroidNative.login(email, password);
} else {
    // Usar Clerk (navegador web)
    clerk.signIn(email, password);
}
```

## 📊 Ventajas vs App Nativa

| Característica | WebView | Nativa |
|---------------|---------|--------|
| Desarrollo | ⚡ Rápido | 🐌 Lento |
| Mantenimiento | ✅ Fácil | ❌ Difícil |
| Paridad con Web | ✅ 100% | ⚠️ Manual |
| Tamaño APK | 📦 Pequeño | 📦 Grande |
| Performance | ⚡ Bueno | ⚡ Excelente |

## 🎯 Próximos Pasos

1. ✅ Implementar pantalla de login nativa
2. ✅ Configurar permisos (cámara, ubicación)
3. ✅ Probar comunicación nativa ↔ web
4. ✅ Publicar en Play Store
