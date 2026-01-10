# 🔥 DESPLEGAR REGLAS DE FIRESTORE

## ⚠️ IMPORTANTE: Debes ejecutar este comando para que los clientes se guarden correctamente

### Opción 1: Usar Firebase Console (Recomendado - Más Fácil)

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto
3. En el menú lateral, click en **"Firestore Database"**
4. Click en la pestaña **"Rules"** (Reglas)
5. Copia y pega el contenido del archivo `firestore.rules` 
6. Click en **"Publish"** (Publicar)

### Opción 2: Usar Firebase CLI

Abre **Command Prompt (CMD)** (NO PowerShell) y ejecuta:

```cmd
cd "c:\Users\rodrigo\Documents\my carwash app ia studio"
firebase deploy --only firestore:rules
```

### Opción 3: Habilitar PowerShell (Si prefieres usar PowerShell)

1. Abre PowerShell como **Administrador**
2. Ejecuta:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
3. Luego ejecuta:
```powershell
cd "c:\Users\rodrigo\Documents\my carwash app ia studio"
firebase deploy --only firestore:rules
```

---

## ✅ Verificar que funcionó

Después de desplegar las reglas, prueba:

1. Registra una cuenta nueva
2. Abre la consola del navegador (F12)
3. Deberías ver:
   ```
   📝 Saving client to Firestore: user_xxx
   ✅ Client successfully saved to Firestore
   ```
4. Inicia sesión como Admin
5. Ve a "Clients"
6. Deberías ver TODOS los clientes

---

## 🐛 Si aún no funciona

Comparte los mensajes de la consola del navegador (F12) para diagnosticar.
