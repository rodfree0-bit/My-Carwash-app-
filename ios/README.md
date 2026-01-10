# 🍎 Guía Rápida - App iOS

## ✅ TODO ESTÁ LISTO

Tu app iOS ya está configurada con Capacitor. Solo necesitas 3 pasos:

---

## 📋 Paso 1: Build Web App

```bash
npm run build
```

Esto compila tu app web React a la carpeta `dist/`

---

## 📋 Paso 2: Sincronizar a iOS

```bash
npx cap sync ios
```

Esto copia el código web a la carpeta iOS y actualiza plugins nativos.

---

## 📋 Paso 3: Abrir en Xcode (requiere macOS)

```bash
npx cap open ios
```

Esto abre el proyecto en Xcode.

---

## 🔥 Configurar Firebase (IMPORTANTE)

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Project Settings → iOS App
4. Descarga `GoogleService-Info.plist`
5. En Xcode, arrastra el archivo a la carpeta `App`
6. Marca "Copy items if needed"

---

## ▶️ Ejecutar en Simulador

En Xcode:
1. Selecciona simulador (iPhone 15 Pro)
2. Click en Play (▶️) o presiona ⌘R
3. ¡La app se abrirá en el simulador!

---

## 📱 Ejecutar en Dispositivo Real

1. Conecta tu iPhone
2. Xcode → Signing & Capabilities
3. Selecciona tu Team (Apple Developer)
4. Selecciona tu iPhone en la lista
5. Click Play (▶️)

---

## ✅ Funcionalidades Incluidas

- ✅ Login/Register
- ✅ Booking Flow completo
- ✅ Home Dashboard
- ✅ Historial
- ✅ Garaje
- ✅ Order Tracking
- ✅ Washer Workflow
- ✅ Chat en tiempo real
- ✅ Fotos (cámara iOS)
- ✅ Notificaciones push
- ✅ Soporte técnico

**¡100% paridad con Android!**

---

## 🚀 Publicar en App Store

1. Xcode → Product → Archive
2. Distribute App → App Store Connect
3. Upload
4. Ve a App Store Connect
5. Submit for Review

---

**¿Problemas?** Revisa `TROUBLESHOOTING.md`
