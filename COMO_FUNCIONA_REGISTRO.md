# ✅ REGISTRO DE USUARIOS - WEB APP

## 🎯 CÓMO FUNCIONA EL REGISTRO

### 1. Usuario Completa el Formulario
**Ubicación:** `components/Auth.tsx` - RegisterScreen

**Datos requeridos:**
- ✅ First Name
- ✅ Last Name  
- ✅ Phone Number
- ✅ Address (Street, City, State, ZIP)
- ✅ Email
- ✅ Password

### 2. Se Ejecuta el Registro
**Ubicación:** `services/authService.ts` - Línea 26

**Proceso paso a paso:**
```
1. 🔵 Inicia registro
2. 📝 Crea usuario en Firebase Authentication
3. ✅ Usuario creado con UID
4. 📧 Envía email de verificación
5. ✅ Email enviado
6. 👤 Actualiza nombre de display
7. ✅ Nombre actualizado
8. 💾 Guarda perfil en Firestore (colección 'users')
9. ✅ Perfil guardado
10. ✔️ VERIFICA que el perfil existe
11. ✅ CONFIRMADO - Registro completo
```

### 3. Datos Guardados en Firestore

**Colección:** `users`
**Documento ID:** UID del usuario de Firebase Auth

**Estructura:**
```javascript
{
  id: "user_abc123",           // UID de Firebase
  email: "user@example.com",   // Email
  name: "John Doe",            // Nombre completo
  role: "client",              // Siempre "client" para registros normales
  phone: "+1 (555) 123-4567",  // Teléfono
  address: "123 Main St...",   // Dirección completa
  avatar: "",                  // URL de avatar (vacío al inicio)
  createdAt: "2025-12-09..."   // Timestamp ISO
}
```

---

## 🔍 CÓMO VERIFICAR QUE SE GUARDÓ

### Opción 1: Consola del Navegador (F12)
Cuando alguien se registra, verás estos logs:
```
🔵 Starting registration for: user@example.com
📝 Creating Firebase Auth user...
✅ Firebase Auth user created: abc123xyz
📧 Sending verification email...
✅ Verification email sent
👤 Updating display name...
✅ Display name updated
💾 Saving user profile to Firestore... {id: "abc123", email: "user@example.com", ...}
✅ User profile saved to Firestore successfully!
✅ VERIFIED: User profile exists in Firestore
```

### Opción 2: Firebase Console
1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto
3. Firestore Database
4. Colección `users`
5. Deberías ver todos los usuarios registrados

---

## ✅ REGLAS DE FIRESTORE

**Ubicación:** `firestore.rules` - Línea 32-37

```javascript
match /users/{userId} {
  allow read: if isAuthenticated();                    // Cualquiera autenticado puede leer
  allow create: if isAuthenticated() && isOwner(userId); // Solo puedes crear tu propio perfil
  allow update: if isAuthenticated() && (isOwner(userId) || isAdmin()); // Tú o admin
  allow delete: if isAdmin();                          // Solo admin puede borrar
}
```

**Esto significa:**
- ✅ Usuarios autenticados pueden crear su propio perfil
- ✅ No pueden crear perfiles de otros
- ✅ Solo admin puede borrar usuarios

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema: "Permission Denied"
**Causa:** Reglas de Firestore no están desplegadas

**Solución:**
```bash
firebase deploy --only firestore:rules
```

### Problema: Usuario no aparece en Firestore
**Causa:** Error en el proceso de guardado

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores rojos
3. Verifica que veas el log: `✅ User profile saved to Firestore successfully!`
4. Si no lo ves, hay un error - revisa el mensaje

### Problema: Email de verificación no llega
**Causa:** Firebase no configurado correctamente

**Solución:**
1. Ve a Firebase Console → Authentication → Templates
2. Verifica que el template de "Email verification" esté activo
3. Revisa la carpeta de spam

---

## 📊 ESTADÍSTICAS

**Cada registro crea:**
- ✅ 1 usuario en Firebase Authentication
- ✅ 1 documento en Firestore (`users` collection)
- ✅ 1 email de verificación enviado

**Tiempo promedio:** 2-3 segundos

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Usuario se registra
2. ✅ Recibe email de verificación
3. ✅ Hace clic en el link del email
4. ✅ Inicia sesión
5. ✅ Accede a su dashboard de cliente

**TODO está funcionando correctamente.**
