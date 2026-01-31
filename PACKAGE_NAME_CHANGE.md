# Cambio de Package Name - Pendiente

## Estado Actual

He comenzado a cambiar el package name de:
- ❌ `com.example.mycarwashapp` (nombre genérico, no disponible en Google Play)
- ✅ `com.rodfree.carwashpro` (nombre único sugerido)

## Archivos Ya Modificados

- [x] `capacitor.config.ts` - appId cambiado
- [x] `android/app/build.gradle` - namespace y applicationId cambiados
- [x] `MainActivity.java` - package declaration cambiado
- [x] `WebViewBridge.java` - package declaration cambiado
- [x] `strings.xml` - package_name y custom_url_scheme cambiados

## Archivos Pendientes

- [ ] `google-services.json` - Necesita regenerarse desde Firebase Console
- [ ] Mover carpeta Java de `com/example/mycarwashapp` a `com/rodfree/carwashpro`

## ⚠️ IMPORTANTE

El usuario mencionó que **ya tiene una app subida** con credenciales configuradas pero las notificaciones no funcionaban.

**Esperando que el usuario proporcione:**
1. El package name correcto que ya está usando en Google Play
2. Verificar credenciales de Firebase/FCM

## Opciones

### Opción 1: Usar el package name que ya tienes
Si ya tienes `com.tudominio.tuapp` configurado en Google Play, usaremos ese.

### Opción 2: Usar el nuevo package name
Si quieres empezar de cero con `com.rodfree.carwashpro`, necesitaremos:
1. Crear nueva app en Google Play Console
2. Regenerar `google-services.json` con el nuevo package name
3. Configurar FCM para el nuevo package

## Próximos Pasos

1. **Usuario proporciona el package name correcto**
2. Actualizar todos los archivos con ese nombre
3. Regenerar `google-services.json` desde Firebase Console
4. Verificar configuración de FCM
5. Compilar y probar notificaciones
