# Firebase Functions Setup Guide

## Configuración de Recibos Automáticos

Este directorio contiene la Firebase Function para enviar recibos por email usando SendGrid.

### Pasos de Configuración:

1. **Instalar Firebase CLI** (si no está instalado):
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Inicializar Firebase Functions** (si no está inicializado):
   ```bash
   firebase init functions
   ```

3. **Instalar dependencias**:
   ```bash
   cd functions
   npm install
   ```

4. **Configurar SendGrid**:
   - Crear cuenta en SendGrid (https://sendgrid.com/)
   - Obtener API Key
   - Configurar en Firebase:
     ```bash
     firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
     ```
   - Verificar dominio de envío en SendGrid

5. **Actualizar email de envío**:
   - Editar `sendReceipt.ts`
   - Cambiar `from: 'noreply@premiumcarwash.com'` por tu email verificado

6. **Desplegar la función**:
   ```bash
   firebase deploy --only functions:sendReceipt
   ```

7. **Actualizar URL en ReceiptGenerator.ts**:
   - Copiar la URL de la función desplegada
   - Reemplazar en `ReceiptGenerator.ts`:
     ```typescript
     const response = await fetch('https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendReceipt', {
     ```

### Estructura de Archivos:

```
functions/
├── package.json          # Dependencias de Node.js
├── tsconfig.json         # Configuración de TypeScript
├── sendReceipt.ts        # Cloud Function para enviar emails
└── README.md            # Este archivo
```

### Testing Local:

```bash
cd functions
npm run serve
```

Esto iniciará el emulador local en http://localhost:5001

### Logs:

Ver logs de la función:
```bash
firebase functions:log
```

### Costos:

- SendGrid: Gratis hasta 100 emails/día
- Firebase Functions: Gratis hasta 2M invocaciones/mes
