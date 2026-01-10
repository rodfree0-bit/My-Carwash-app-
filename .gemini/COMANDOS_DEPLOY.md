# 🚀 COMANDOS PARA COMPLETAR LA CONFIGURACIÓN

## ⚠️ PROBLEMA: PowerShell tiene restricciones de ejecución

### SOLUCIÓN RÁPIDA:

Abre PowerShell como **Administrador** y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego ejecuta estos comandos **UNO POR UNO**:

---

## 📋 PASO 1: Instalar dependencias de Functions

```powershell
cd "c:\Users\rodrigo\Documents\my carwash app ia studio\functions"
npm install
cd ..
```

---

## 📋 PASO 2: Desplegar Firebase Functions

```powershell
firebase deploy --only functions
```

**Nota:** Si te pide login, ejecuta primero:
```powershell
firebase login
```

---

## 📋 PASO 3: Rebuild de la aplicación

```powershell
npm run build
```

---

## 📋 PASO 4: Deploy a Firebase Hosting

```powershell
firebase deploy --only hosting
```

---

## ✅ VERIFICACIÓN

Después de ejecutar todos los comandos, deberías ver:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/my-carwashapp-e6aba/overview
Hosting URL: https://my-carwashapp-e6aba.web.app
```

---

## 🧪 PROBAR NOTIFICACIONES

1. Abre: https://my-carwashapp-e6aba.web.app
2. Abre la consola del navegador (F12)
3. Deberías ver:
   ```
   ✅ Service Worker registered successfully
   📱 FCM Token obtained: ...
   ✅ FCM Token saved to Firestore
   ```
4. Permite las notificaciones cuando el navegador pregunte
5. Crea una orden y cambia su estado desde admin
6. ¡Deberías recibir notificación! 🎉

---

## 🆘 SI TIENES PROBLEMAS

### Error: "firebase: command not found"
```powershell
npm install -g firebase-tools
```

### Error: "Not authorized"
```powershell
firebase login
```

### Error al hacer build
```powershell
# Limpiar y reinstalar
rm -r node_modules
rm package-lock.json
npm install
npm run build
```

---

**IMPORTANTE:** Ejecuta los comandos UNO POR UNO y verifica que cada uno termine correctamente antes de ejecutar el siguiente.
