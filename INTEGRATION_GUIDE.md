# Guía de Integración Completa

Esta guía explica cómo integrar los recibos automáticos y Stripe en los flujos de la aplicación.

---

## 1. Integración de Stripe en Flujo de Reserva (Client.tsx)

### Paso 1: Importar componentes necesarios

```typescript
import { StripePaymentWrapper } from './Payment/StripePaymentWrapper';
import { StripeService } from '../services/StripeService';
```

### Paso 2: Agregar estado para pago

```typescript
const [showPayment, setShowPayment] = useState(false);
const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
```

### Paso 3: Modificar flujo de confirmación de orden

Antes de crear la orden, mostrar el formulario de pago:

```typescript
// En lugar de crear la orden directamente:
const handleConfirmOrder = () => {
    setShowPayment(true); // Mostrar formulario de pago
};

// Cuando el pago se autoriza exitosamente:
const handlePaymentSuccess = async (intentId: string) => {
    setPaymentIntentId(intentId);
    
    // AHORA SÍ crear la orden con el paymentIntentId
    const newOrder = {
        // ... datos de la orden
        stripePaymentIntentId: intentId,
        stripePaymentStatus: 'authorized',
        authorizedAmount: totalPrice,
        paymentStatus: 'Pending',
    };
    
    await createOrder(newOrder);
    setShowPayment(false);
    navigate(Screen.CLIENT_TRACKING);
};
```

### Paso 4: Renderizar componente de pago

```typescript
{showPayment && (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-background-dark rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <StripePaymentWrapper
                amount={totalPrice}
                orderId={tempOrderId} // Generar ID temporal
                clientEmail={currentUser.email}
                clientName={currentUser.name}
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                    showToast(error, 'error');
                    setShowPayment(false);
                }}
                onCancel={() => setShowPayment(false)}
            />
        </div>
    </div>
)}
```

---

## 2. Integración de Captura de Pago en Cliente (Client.tsx)

### Cuando el cliente agrega propina y califica:

```typescript
const handleSubmitRating = async (rating: number, tip: number, review?: string) => {
    try {
        // 1. Capturar el pago con la propina
        if (currentOrder.stripePaymentIntentId) {
            await StripeService.capturePayment(
                currentOrder.stripePaymentIntentId,
                currentOrder.id,
                currentOrder.price,
                tip
            );
        }

        // 2. Actualizar la orden con rating y tip
        await updateOrder(currentOrder.id, {
            clientRating: rating,
            clientReview: review,
            tip: tip,
            stripePaymentStatus: 'captured',
            paymentStatus: 'Paid',
        });

        showToast('¡Gracias por tu calificación!', 'success');
    } catch (error: any) {
        showToast(error.message || 'Error al procesar el pago', 'error');
    }
};
```

---

## 3. Integración de Recibos en Washer.tsx

### Cuando el Washer completa el servicio:

```typescript
import { ReceiptGenerator } from '../services/ReceiptGenerator';
import { COMPANY_INFO } from '../services/stripe-config';

const handleCompleteService = async (order: Order) => {
    try {
        // 1. Marcar orden como completada
        await updateOrder(order.id, {
            status: 'Completed',
            completedAt: Date.now(),
        });

        // 2. Generar y enviar recibo automáticamente
        const receiptSent = await ReceiptGenerator.sendReceiptEmail(order, COMPANY_INFO);
        
        if (receiptSent) {
            await updateOrder(order.id, {
                receiptSentAt: Date.now(),
            });
            showToast('Servicio completado y recibo enviado', 'success');
        } else {
            showToast('Servicio completado (recibo no enviado)', 'warning');
        }

    } catch (error: any) {
        showToast(error.message || 'Error al completar servicio', 'error');
    }
};
```

---

## 4. Integración de Cancelación con Fee

### En la función de cancelar orden:

```typescript
const handleCancelOrder = async (order: Order) => {
    try {
        const washerAssigned = !!order.washerId;
        
        if (order.stripePaymentIntentId) {
            // Cancelar con Stripe
            const result = await StripeService.cancelOrderWithFee(
                order.stripePaymentIntentId,
                order.id,
                washerAssigned,
                order.price
            );

            showToast(result.message, washerAssigned ? 'warning' : 'success');
        } else {
            // Cancelar sin Stripe (orden antigua)
            await updateOrder(order.id, {
                status: 'Cancelled',
            });
            showToast('Orden cancelada', 'success');
        }

    } catch (error: any) {
        showToast(error.message || 'Error al cancelar orden', 'error');
    }
};
```

---

## 5. Actualizar package.json

Agregar dependencias de Stripe:

```json
{
  "dependencies": {
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0"
  }
}
```

Instalar:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## 6. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

---

## 7. Actualizar URLs de Firebase Functions

En `services/StripeService.ts`, reemplazar:
```typescript
const FIREBASE_FUNCTIONS_URL = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net';
```

Con tu ID de proyecto Firebase.

---

## Resumen del Flujo Completo

### Cliente Reserva:
1. Cliente selecciona servicio, vehículo, fecha, etc.
2. **Antes de confirmar**: Mostrar `StripePaymentWrapper`
3. Stripe autoriza el pago (hold en tarjeta)
4. Crear orden con `paymentIntentId`

### Servicio Completado:
1. Washer marca como completado
2. **Automático**: Generar y enviar recibo por email
3. Cliente agrega propina y califica
4. **Automático**: Capturar pago (monto base + propina)

### Cancelación:
1. Cliente/Admin cancela orden
2. **Si NO hay washer**: Cancelar sin cargo
3. **Si HAY washer**: Cobrar $15 de fee

---

## Testing

1. **Reservar con pago**:
   - Usar tarjeta `4242 4242 4242 4242`
   - Verificar autorización en Stripe Dashboard

2. **Completar servicio**:
   - Agregar propina
   - Verificar captura en Stripe Dashboard
   - Verificar recibo en email

3. **Cancelar**:
   - Sin washer: Verificar cancelación sin cargo
   - Con washer: Verificar cargo de $15

---

¡Todo listo para producción! 🚀
