# 🔧 Troubleshooting iOS

## Problema: "No se puede abrir Xcode"

**Solución:** Necesitas macOS con Xcode instalado.

Descarga Xcode desde App Store (gratis).

---

## Problema: "Command not found: npx"

**Solución:** Instala Node.js

```bash
# Descarga desde nodejs.org
# O usa Homebrew:
brew install node
```

---

## Problema: "Build failed en Xcode"

**Solución 1:** Limpia el build
```
Xcode → Product → Clean Build Folder (⇧⌘K)
```

**Solución 2:** Reinstala pods
```bash
cd ios/App
pod install
```

---

## Problema: "GoogleService-Info.plist no encontrado"

**Solución:**
1. Descarga de Firebase Console
2. Arrastra a Xcode (carpeta App)
3. Marca "Copy items if needed"
4. Rebuild

---

## Problema: "Signing error"

**Solución:**
1. Xcode → Signing & Capabilities
2. Automatically manage signing ✓
3. Selecciona tu Team
4. Cambia Bundle ID si es necesario

---

## Problema: "Cámara no funciona"

**Solución:** Agrega permisos en Info.plist

```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para tomar fotos del servicio</string>
```

---

## Problema: "Notificaciones no llegan"

**Solución:**
1. Xcode → Capabilities → Push Notifications ✓
2. Verifica GoogleService-Info.plist
3. Verifica certificados en Firebase Console

---

## Problema: "App se cierra al abrir"

**Solución:** Revisa logs en Xcode
```
View → Debug Area → Show Debug Area (⇧⌘Y)
```

Busca errores en rojo.

---

## Necesitas Ayuda?

1. Revisa logs en Xcode
2. Busca el error en Google
3. Revisa [Capacitor Docs](https://capacitorjs.com/docs/ios)
