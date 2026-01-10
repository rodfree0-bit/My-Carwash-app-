# Configuración de Notificaciones Automáticas

## Resumen

Este documento explica cómo configurar y desplegar el sistema de notificaciones automáticas que envía mensajes a clientes cuando:
1. ☀️ Hay buen clima para lavar
2. 🚗 Llevan 2-3 semanas sin agendar

## Paso 1: Obtener API Key de OpenWeatherMap

1. Ve a [OpenWeatherMap](https://openweathermap.org/api)
2. Crea una cuenta gratuita
3. Ve a "API keys" en tu perfil
4. Copia tu API key (gratis hasta 1,000 llamadas/día)

## Paso 2: Configurar Variables de Entorno

### Para Firebase Functions:

```bash
# Configurar API key de OpenWeather
firebase functions:config:set openweather.key="TU_API_KEY_AQUI"

# Verificar configuración
firebase functions:config:get
```

### Para el Frontend (.env):

Agrega esta línea a tu archivo `.env`:

```env
VITE_OPENWEATHER_API_KEY=TU_API_KEY_AQUI
```

## Paso 3: Instalar Dependencias

```bash
cd functions
npm install axios
```

## Paso 4: Desplegar Cloud Functions

```bash
# Desplegar todas las funciones
firebase deploy --only functions

# O desplegar solo las nuevas funciones
firebase deploy --only functions:sendWeatherNotifications,functions:sendInactivityReminders
```

## Paso 5: Verificar Deployment

```bash
# Ver logs en tiempo real
firebase functions:log --only sendWeatherNotifications

# Ver logs de inactividad
firebase functions:log --only sendInactivityReminders
```

## Programación de Ejecución

### Notificaciones de Clima
- **Frecuencia:** Diaria
- **Horario:** 8:00 AM (hora de Los Angeles)
- **Cron:** `0 8 * * *`

### Recordatorios de Inactividad
- **Frecuencia:** Semanal
- **Horario:** Lunes a las 9:00 AM
- **Cron:** `0 9 * * 1`

## Testing Manual

### Probar Función de Clima

```bash
# En Firebase Console > Functions
# O usando Firebase CLI:
firebase functions:shell

# Luego ejecutar:
> sendWeatherNotifications()
```

### Probar Función de Inactividad

```bash
firebase functions:shell
> sendInactivityReminders()
```

## Habilitar Preferencias por Defecto

Para que los usuarios existentes reciban notificaciones, puedes ejecutar este script en Firestore:

```javascript
// En Firebase Console > Firestore > Ejecutar query
const users = await db.collection('users')
  .where('role', '==', 'client')
  .get();

const batch = db.batch();
users.forEach(doc => {
  batch.update(doc.ref, {
    'notificationPreferences.weatherAlerts': true,
    'notificationPreferences.reminders': true,
    'notificationPreferences.orderUpdates': true
  });
});

await batch.commit();
```

## Monitoreo

### Ver Estadísticas

1. Ve a Firebase Console > Functions
2. Selecciona `sendWeatherNotifications` o `sendInactivityReminders`
3. Ve la pestaña "Logs" para ver:
   - Número de notificaciones enviadas
   - Tasa de éxito/fallo
   - Errores si los hay

### Métricas Importantes

- **Tasa de envío:** Cuántas notificaciones se enviaron exitosamente
- **Clima detectado:** Cuántas veces se detectó buen clima
- **Usuarios inactivos:** Cuántos usuarios recibieron recordatorios

## Costos Estimados

- **OpenWeatherMap:** Gratis (hasta 1,000 llamadas/día)
- **Firebase Cloud Functions:** ~$0.40 por millón de invocaciones
- **FCM (Push Notifications):** Gratis ilimitado

**Costo mensual estimado:** < $1 USD

## Troubleshooting

### No se envían notificaciones

1. Verificar que la función se está ejecutando:
   ```bash
   firebase functions:log
   ```

2. Verificar configuración de API key:
   ```bash
   firebase functions:config:get
   ```

3. Verificar que usuarios tienen `fcmToken`:
   ```bash
   # En Firestore, buscar usuarios sin token
   ```

### Errores de API de Clima

- Verificar que la API key es válida
- Verificar que no excediste el límite de llamadas
- Revisar logs para ver el error específico

## Próximos Pasos Opcionales

1. **Analytics:** Agregar tracking de conversión (notificación → reserva)
2. **A/B Testing:** Probar diferentes mensajes
3. **Personalización:** Usar ubicación del usuario para clima local
4. **Horarios Inteligentes:** Enviar en horario óptimo por usuario
