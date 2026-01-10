# Square Integration Setup Guide

## Configuración de Pagos con Square

Square es más simple de configurar que Stripe y funciona perfectamente para Los Angeles.

### Ventajas de Square

✅ **Más fácil de configurar**  
✅ **Proceso de verificación más simple**  
✅ **Interfaz amigable**  
✅ **Perfecto para pequeños negocios en USA**  
✅ **Costos: 2.9% + $0.30** (igual que Stripe)

---

## Pasos de Configuración

### 1. Crear Cuenta en Square

1. Ve a [squareup.com/signup](https://squareup.com/signup)
2. Crea cuenta con tu email
3. Información básica:
   ```
   Business name: Premium Car Wash
   Business type: Services
   Location: Los Angeles, CA
   ```
4. **No necesitas verificación completa para modo Sandbox**

### 2. Obtener Credenciales

#### Modo Sandbox (Desarrollo):

1. Ve a [developer.squareup.com](https://developer.squareup.com)
2. Click en "Get Started" o "Sign In"
3. Crea una aplicación:
   - Name: "Car Wash App"
   - Description: "Mobile car wash booking"
4. Obtén credenciales:
   ```
   Sandbox Application ID: sandbox-sq0idb-xxxxx
   Sandbox Access Token: EAAAxxxxx
   Location ID: (se genera automáticamente)
   ```

#### Modo Production (Cuando estés listo):
- Mismo proceso pero usa las credenciales de "Production"
- Requiere verificación de negocio

### 3. Configurar Variables de Entorno

#### Frontend (.env):
```env
REACT_APP_SQUARE_APPLICATION_ID=sandbox-sq0idb-YOUR_APP_ID
REACT_APP_SQUARE_LOCATION_ID=YOUR_LOCATION_ID
```

#### Firebase Functions:
```bash
firebase functions:config:set square.access_token="YOUR_SANDBOX_ACCESS_TOKEN"
firebase functions:config:set square.location_id="YOUR_LOCATION_ID"
```

### 4. Instalar Dependencias

```bash
# Frontend - NO necesita dependencias adicionales
# Square se carga vía CDN

# Functions
cd functions
npm install square
```

### 5. Actualizar URLs

En `services/SquareService.ts`, reemplazar:
```typescript
const FIREBASE_FUNCTIONS_URL = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net';
```

### 6. Desplegar Firebase Functions

```bash
cd functions
npm install
firebase deploy --only functions:createSquarePayment,functions:completeSquarePayment,functions:cancelSquareOrder
```

---

## Testing

### Tarjetas de Prueba (Sandbox)

| Tarjeta | Número | CVV | ZIP | Resultado |
|---------|--------|-----|-----|-----------|
| Visa | `4111 1111 1111 1111` | 111 | 12345 | Éxito |
| Mastercard | `5105 1051 0510 5100` | 111 | 12345 | Éxito |
| Amex | `3782 822463 10005` | 1234 | 12345 | Éxito |
| Decline | `4000 0000 0000 0002` | 111 | 12345 | Rechazado |

**Fecha de expiración**: Cualquier fecha futura

### Flujo de Prueba

1. **Reservar Servicio**:
   - Usar tarjeta `4111 1111 1111 1111`
   - Verificar pago en Square Dashboard
   - Estado: `COMPLETED`

2. **Completar con Propina**:
   - Agregar propina
   - Verificar monto actualizado en Square

3. **Cancelar con Fee**:
   - Asignar washer
   - Cancelar orden
   - Verificar cargo de $15

---

## Diferencias vs Stripe

### Square:
- ✅ Más simple de configurar
- ✅ Mejor para pequeños negocios
- ✅ Sandbox más fácil de usar
- ⚠️ Menos opciones de personalización

### Stripe:
- ⚠️ Más complejo de configurar
- ✅ Más opciones avanzadas
- ✅ Mejor documentación
- ⚠️ Requiere más verificación

---

## Costos

- **Square**: 2.9% + $0.30 por transacción
- **Firebase Functions**: Gratis hasta 2M invocaciones/mes
- **Sin costos mensuales**

---

## Soporte

- Dashboard: https://squareup.com/dashboard
- Developer Portal: https://developer.squareup.com
- Documentación: https://developer.squareup.com/docs
- Logs de Functions: `firebase functions:log`

---

## Próximos Pasos

1. ✅ Crear cuenta Square
2. ✅ Obtener credenciales Sandbox
3. ✅ Configurar variables de entorno
4. ✅ Desplegar Functions
5. ✅ Probar con tarjetas de prueba
6. ⏳ Cuando estés listo: Activar modo Production

¡Listo para aceptar pagos! 🚀
