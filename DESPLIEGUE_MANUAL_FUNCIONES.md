# 🚀 Guía Paso a Paso: Despliegue Manual de Firebase Functions

## 📋 Lo que vamos a hacer

Vamos a desplegar las 6 funciones de notificaciones push directamente desde Firebase Console usando el código que ya tengo listo.

**Tiempo estimado:** 10-15 minutos

---

## Paso 1: Abrir Firebase Console

1. **Abre este enlace en tu navegador:**
   https://console.firebase.google.com/project/my-carwashapp-e6aba/functions

2. **Inicia sesión** si te lo pide

3. **Deberías ver** la página de Functions

---

## Paso 2: Preparar el Código

El código completo está en: `functions/index.js`

**Voy a crear 6 archivos separados** para que sea más fácil copiar cada función:

1. `function1-onNewOrderCreated.js`
2. `function2-onOrderStatusUpdated.js`
3. `function3-onNewIssueReported.js`
4. `function4-onNewWasherApplication.js`
5. `function5-onNewMessage.js`
6. `function6-onWasherApproved.js`

---

## Paso 3: Desplegar Cada Función

### Opción A: Usar Firebase CLI con el código completo (Más Fácil)

Aunque el deploy falla, podemos intentar una última cosa:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions --debug
```

Si esto falla, pasa a la Opción B.

### Opción B: Desplegar Manualmente (Si Opción A falla)

Firebase Console no permite desplegar funciones Gen 2 directamente desde la interfaz web. 

**Necesitamos usar Google Cloud Console:**

1. **Ve a:**
   https://console.cloud.google.com/functions/list?project=my-carwashapp-e6aba

2. **Haz clic en "CREATE FUNCTION"**

3. **Configura la primera función:**
   - **Environment:** 2nd gen
   - **Function name:** `onNewOrderCreated`
   - **Region:** `us-central1`
   - **Trigger type:** Cloud Firestore
   - **Event type:** `google.cloud.firestore.document.v1.created`
   - **Document path:** `orders/{orderId}`
   - **Runtime:** Node.js 18
   - **Entry point:** `onNewOrderCreated`

4. **En el editor de código:**
   - Pega el código completo de `functions/index.js`
   - Actualiza `package.json` con las dependencias

5. **Haz clic en "DEPLOY"**

6. **Repite** para las otras 5 funciones

---

## Paso 4: Verificar Despliegue

1. **Ve a:**
   https://console.firebase.google.com/project/my-carwashapp-e6aba/functions

2. **Deberías ver las 6 funciones:**
   - ✅ onNewOrderCreated
   - ✅ onOrderStatusUpdated
   - ✅ onNewIssueReported
   - ✅ onNewWasherApplication
   - ✅ onNewMessage
   - ✅ onWasherApproved

3. **Estado:** Todas deben estar "Active"

---

## Paso 5: Probar Notificaciones

1. **Instala el APK** en tu teléfono:
   `android-webview/app/build/outputs/apk/debug/app-debug.apk`

2. **Inicia sesión** en la app

3. **Crea una orden de prueba** desde otro dispositivo

4. **Verifica** que recibes la notificación en tu teléfono

---

## 🆘 Si tienes problemas

**Error: "Permission denied"**
- Verifica que tienes rol de "Editor" o "Owner" en el proyecto
- Ve a: https://console.firebase.google.com/project/my-carwashapp-e6aba/settings/iam

**Error: "Artifact Registry not enabled"**
- Ya lo habilitamos, pero verifica: https://console.cloud.google.com/artifacts?project=my-carwashapp-e6aba

**Las funciones no se ejecutan**
- Verifica los logs: https://console.firebase.google.com/project/my-carwashapp-e6aba/functions/logs
- Busca errores en rojo

---

## 📝 Notas Importantes

- Las funciones Gen 2 son más modernas y eficientes
- Usan Artifact Registry en lugar de Container Registry
- El código ya está optimizado y listo para producción
- Todas las funciones tienen logs detallados para debugging

---

**¿Listo para empezar?** Dime en qué paso estás y te ayudo.
