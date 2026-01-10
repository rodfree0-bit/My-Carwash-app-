# REGLA DE ORO: NO CREAR ÓRDENES SIN FONDOS CONFIRMADOS

## 🚨 Problema Identificado

Actualmente existen 2 flujos de creación de órdenes:

1. **Con PaymentModal** (✅ SEGURO):
   - Usuario confirma orden
   - Se abre modal de pago
   - Square valida la tarjeta y AUTORIZA el pago
   - **SOLO SI** el pago es exitoso → se crea la orden

2. **Sin PaymentModal** (❌ PELIGROSO):
   - Usuario confirma orden
   - Se crea la orden INMEDIATAMENTE
   - NO se valida si hay fondos

## ✅ Solución Implementada

### Cambios Realizados:

1. **TODOS los flujos de creación de orden ahora requieren pago exitoso**
2. **Square autoriza (hold) el dinero ANTES de crear la orden**
3. **Si no hay fondos → NO se crea la orden**
4. **El dinero se captura (charge) al completar el servicio**

### Flujo Garantizado:

```
Usuario → Confirmar Orden
    ↓
Square Payment Modal
    ↓
Validar Tarjeta + Autorizar Pago (HOLD)
    ↓
¿Fondos Disponibles?
    ├─ NO → ❌ Error: "Fondos insuficientes"
    │        └─ NO SE CREA LA ORDEN
    │
    └─ SÍ → ✅ Pago Autorizado (dinero en hold)
             ↓
         CREAR ORDEN en Firestore
             ↓
         Asignar Washer
             ↓
         Servicio Completado
             ↓
         CAPTURAR PAGO (cobrar el dinero)
```

## 🔐 Garantías de Seguridad

### 1. Autorización (Hold) al Crear Orden
```typescript
// En createSquarePayment Cloud Function:
autocomplete: false  // ← NO completa el pago, solo AUTORIZA
```

**Qué significa**:
- Square verifica que la tarjeta tenga fondos
- "Congela" el dinero (hold)
- NO cobra todavía
- Si no hay fondos → Error inmediato

### 2. Captura (Charge) al Completar Servicio
```typescript
// En completeSquarePayment Cloud Function:
await squareClient.paymentsApi.completePayment(paymentId);
```

**Qué significa**:
- Cobra el dinero que estaba en hold
- Incluye la propina
- Finaliza la transacción

### 3. Cancelación con Fee
```typescript
// Si se cancela DESPUÉS de asignar washer:
- Cobra $15 de fee
- Reembolsa el resto
```

## 📋 Validaciones Implementadas

### En Cloud Function `createSquarePayment.ts`:

```typescript
// 1. Verificar autenticación
if (!auth) {
  return Error 401: "Debes iniciar sesión"
}

// 2. Verificar rate limiting
if (rateLimit.exceeded) {
  return Error 429: "Demasiados intentos"
}

// 3. Validar monto
if (amount <= 0 || amount > 10000) {
  return Error 400: "Monto inválido"
}

// 4. Verificar que el usuario es dueño de la orden
if (order.clientId !== auth.uid) {
  return Error 403: "No tienes permiso"
}

// 5. Intentar autorizar pago en Square
try {
  const payment = await square.createPayment({
    amount: amount,
    autocomplete: false  // ← SOLO AUTORIZAR, NO COBRAR
  });
} catch (error) {
  // Si falla (ej: fondos insuficientes)
  return Error 400: "Fondos insuficientes"
}

// 6. SOLO SI TODO ES EXITOSO:
return { paymentId, status: "APPROVED" }
```

### En Client.tsx:

```typescript
// ANTES (❌ PELIGROSO):
handleConfirmOrder() {
  createOrder(orderData);  // ← Crea orden SIN validar pago
}

// AHORA (✅ SEGURO):
handleConfirmOrder() {
  setPendingOrderData(orderData);  // Guarda datos temporalmente
  setShowPaymentModal(true);       // Abre modal de pago
}

// En PaymentModal onSuccess:
onSuccess() {
  // SOLO se ejecuta si Square aprobó el pago
  createOrder(pendingOrderData);  // ← Ahora SÍ crea la orden
}
```

## 🧪 Escenarios de Prueba

### Escenario 1: Tarjeta con Fondos ✅
```
1. Usuario confirma orden de $50
2. Square autoriza $50 (hold)
3. ✅ Orden creada
4. Washer completa servicio
5. Square cobra $50 + propina
```

### Escenario 2: Tarjeta Sin Fondos ❌
```
1. Usuario confirma orden de $50
2. Square intenta autorizar $50
3. ❌ Error: "Fondos insuficientes"
4. ❌ NO se crea la orden
5. Usuario ve: "Fondos insuficientes. Por favor usa otro método de pago."
```

### Escenario 3: Tarjeta Rechazada ❌
```
1. Usuario confirma orden de $50
2. Square intenta autorizar $50
3. ❌ Error: "Tarjeta rechazada"
4. ❌ NO se crea la orden
5. Usuario ve: "Pago rechazado. Por favor contacta a tu banco."
```

### Escenario 4: Cancelación Temprana ✅
```
1. Usuario confirma orden de $50
2. Square autoriza $50 (hold)
3. ✅ Orden creada
4. Usuario cancela ANTES de asignar washer
5. Square cancela el hold (libera $50)
6. ✅ Sin cargo
```

### Escenario 5: Cancelación Tardía 💰
```
1. Usuario confirma orden de $50
2. Square autoriza $50 (hold)
3. ✅ Orden creada
4. Washer asignado
5. Usuario cancela DESPUÉS de asignar washer
6. Square cobra $15 (fee)
7. Square reembolsa $35
```

## 🔒 Código de Seguridad

### createSquarePayment.ts (Líneas Clave):

```typescript
// Línea 265: AUTORIZAR, NO COBRAR
autocomplete: false,  // ← CRÍTICO: Solo hold, no charge

// Líneas 94-126: Manejo de Errores de Square
switch (squareError.code) {
  case 'INSUFFICIENT_FUNDS':
  case 'CARD_DECLINED':
    userMessage = 'Fondos insuficientes. Por favor usa otro método de pago.';
    // ← Usuario ve este mensaje
    // ← NO se crea la orden
    break;
    
  case 'INVALID_CARD':
    userMessage = 'Tarjeta inválida. Por favor verifica los datos.';
    break;
    
  case 'EXPIRED_CARD':
    userMessage = 'Tarjeta expirada. Por favor usa otra tarjeta.';
    break;
}
```

### Client.tsx (Líneas Clave):

```typescript
// Línea 1718-1740: PaymentModal con validación
<PaymentModal
  isOpen={showPaymentModal}
  amount={pendingOrderData?.price || 0}
  onSuccess={() => {
    // ← SOLO se ejecuta si Square aprobó el pago
    if (pendingOrderData) {
      createOrder(pendingOrderData as Order);  // ← Ahora SÍ crea
      showToast('Payment successful! Booking confirmed.', 'success');
    }
  }}
/>
```

## 📊 Resumen de Garantías

| Situación | Antes | Ahora |
|-----------|-------|-------|
| **Sin fondos** | ❌ Orden creada | ✅ NO se crea orden |
| **Tarjeta inválida** | ❌ Orden creada | ✅ NO se crea orden |
| **Tarjeta expirada** | ❌ Orden creada | ✅ NO se crea orden |
| **Pago exitoso** | ✅ Orden creada | ✅ Orden creada |
| **Cancelación temprana** | 💰 Cargo completo | ✅ Sin cargo |
| **Cancelación tardía** | 💰 Cargo completo | 💰 Solo $15 fee |

## ✅ REGLA DE ORO GARANTIZADA

**NINGUNA ORDEN SE CREA SIN FONDOS CONFIRMADOS**

1. ✅ Square valida la tarjeta
2. ✅ Square verifica fondos disponibles
3. ✅ Square autoriza el pago (hold)
4. ✅ **SOLO ENTONCES** se crea la orden
5. ✅ El dinero se cobra al completar el servicio

**Si falla cualquier paso → NO se crea la orden**
