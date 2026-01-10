# ✅ GESTIÓN DE ROLES - ADMIN

## 🎯 NUEVA FUNCIONALIDAD

Ahora en la pantalla de **Clientes** (Admin), puedes cambiar el rol de cualquier usuario.

## 📍 DÓNDE ESTÁ

**Ruta:** Admin → Clients → Click en un cliente

**Ubicación en código:** `components/Admin.tsx` línea 739-805

## 🔧 CÓMO FUNCIONA

### 1. Ver Cliente
1. Inicia sesión como Admin
2. Ve a la pestaña "Clients"
3. Click en cualquier cliente

### 2. Cambiar Rol
Verás una nueva sección **"Role Management"** con:

#### Rol Actual
- Muestra el rol actual del usuario
- Badge de color:
  - 🟢 Verde = Client
  - 🔵 Azul = Washer
  - 🔴 Rojo = Admin

#### Botones Disponibles

**"Make Washer"** (Azul)
- Convierte al cliente en Washer
- Confirmación: "Promote [Name] to Washer?"
- Toast: "[Name] is now a Washer!"

**"Make Admin"** (Rojo)
- Convierte al cliente en Admin
- Confirmación: "⚠️ Promote [Name] to Admin? This gives full access to the system."
- Toast: "[Name] is now an Admin!"

**"Demote to Client"** (Gris - solo si no es cliente)
- Convierte Washer/Admin de vuelta a Client
- Confirmación: "Demote [Name] back to Client?"
- Toast: "[Name] is now a Client"

## 🎨 DISEÑO

```
┌─────────────────────────────────────┐
│ Role Management                     │
├─────────────────────────────────────┤
│ Current Role: client    [CLIENT]    │
├─────────────────────────────────────┤
│ [Make Washer]  [Make Admin]         │
│                                     │
│ [Demote to Client] (si aplica)      │
└─────────────────────────────────────┘
```

## ⚙️ QUÉ PASA AL CAMBIAR ROL

### Cliente → Washer
1. Se actualiza `role: 'washer'` en Firestore
2. Usuario ve dashboard de Washer al iniciar sesión
3. Puede aceptar trabajos
4. Aparece en lista de Team

### Cliente → Admin
1. Se actualiza `role: 'admin'` en Firestore
2. Usuario ve dashboard de Admin al iniciar sesión
3. Tiene acceso completo al sistema
4. Puede gestionar todo

### Washer/Admin → Cliente
1. Se actualiza `role: 'client'` en Firestore
2. Usuario ve dashboard de Cliente al iniciar sesión
3. Solo puede crear órdenes

## 🔒 SEGURIDAD

- ✅ Solo Admin puede cambiar roles
- ✅ Confirmación antes de cada cambio
- ✅ Toast de confirmación después del cambio
- ✅ Actualización inmediata en Firestore

## 📝 EJEMPLO DE USO

**Escenario:** Quieres que un cliente se convierta en Washer

1. Admin → Clients
2. Click en "John Doe"
3. Scroll a "Role Management"
4. Click "Make Washer"
5. Confirmar
6. ✅ John Doe ahora es Washer

**La próxima vez que John inicie sesión, verá el dashboard de Washer.**

## 🎯 CASOS DE USO

### Promover a Washer
- Cliente quiere trabajar como Washer
- Aplicante aprobado manualmente

### Promover a Admin
- Agregar administrador adicional
- Dar acceso completo a empleado de confianza

### Degradar a Cliente
- Washer ya no trabaja
- Admin ya no necesita acceso

## ✅ LISTO PARA USAR

**Todo está implementado y funcionando.**

Prueba:
1. Inicia sesión como Admin
2. Ve a Clients
3. Click en cualquier cliente
4. Verás la nueva sección "Role Management"
