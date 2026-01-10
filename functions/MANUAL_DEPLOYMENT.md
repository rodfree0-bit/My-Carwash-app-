# Solución Alternativa: Despliegue Manual de notifyWaitingTime

## Problema
El despliegue de Cloud Functions vía Firebase CLI falla con un error de carga de módulo persistente.

## Solución Temporal
Desplegar la función `notifyWaitingTime` manualmente desde Firebase Console.

## Pasos para Despliegue Manual

### Opción 1: Usar Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **my-carwashapp-e6aba**
3. Ve a **Functions** en el menú lateral
4. Haz clic en **Create Function**
5. Configura la función:
   - **Name**: `notifyWaitingTime`
   - **Trigger**: Cloud Pub/Sub
   - **Topic**: Crea un nuevo topic llamado `waiting-time-check`
   - **Runtime**: Node.js 20
   - **Memory**: 256 MB
   - **Timeout**: 60 seconds
   - **Region**: us-central1

6. Copia y pega el siguiente código en el editor:

\`\`\`javascript
const admin = require('firebase-admin');
admin.initializeApp();

exports.notifyWaitingTime = async (message, context) => {
    const db = admin.firestore();
    const now = Date.now();

    try {
        const ordersSnapshot = await db.collection('orders')
            .where('status', '==', 'Arrived')
            .where('waitingForClient', '==', true)
            .where('clientAuthorized', '==', false)
            .get();

        console.log(\`Found \${ordersSnapshot.size} orders with waiting washers\`);

        for (const orderDoc of ordersSnapshot.docs) {
            const order = orderDoc.data();
            const waitingStartTime = order.waitingStartTime || order.arrivedAt || now;
            const waitingMinutes = Math.floor((now - waitingStartTime) / 60000);
            const currentBlock = Math.floor(waitingMinutes / 10);
            const previousBlock = order.waitingTimeBlocks || 0;

            const waitingNotificationsSent = order.waitingNotificationsSent || [];
            const lastNotification = waitingNotificationsSent.length > 0 ? waitingNotificationsSent[waitingNotificationsSent.length - 1] : 0;
            const minutesSinceLastNotification = Math.floor((now - lastNotification) / 60000);

            if (minutesSinceLastNotification >= 1 || waitingNotificationsSent.length === 0) {
                let notificationMessage = '';
                let notificationTitle = 'Washer Waiting';

                if (waitingMinutes < 10) {
                    notificationMessage = \`Your washer is waiting (\${waitingMinutes} min). Please authorize the service. After 10 minutes, you will be charged $10 for every additional 10 minutes.\`;
                } else {
                    const blocksCharged = currentBlock;
                    const currentCharge = blocksCharged * 10;
                    notificationMessage = \`Your washer has been waiting \${waitingMinutes} minutes. Current waiting charge: $\${currentCharge}. Please authorize the service now.\`;
                    notificationTitle = '⚠️ Waiting Charges Apply';
                }

                if (order.clientId) {
                    try {
                        const clientDoc = await db.collection('users').doc(order.clientId).get();
                        const clientData = clientDoc.data();
                        const fcmToken = clientData ? clientData.fcmToken : null;

                        if (fcmToken) {
                            await admin.messaging().send({
                                token: fcmToken,
                                notification: {
                                    title: notificationTitle,
                                    body: notificationMessage
                                },
                                data: {
                                    orderId: orderDoc.id,
                                    type: 'waiting_time',
                                    waitingMinutes: waitingMinutes.toString(),
                                    currentCharge: (currentBlock * 10).toString()
                                },
                                android: {
                                    priority: 'high',
                                    notification: {
                                        channelId: 'waiting_alerts',
                                        priority: 'high',
                                        sound: 'default'
                                    }
                                }
                            });

                            console.log(\`Sent notification to client \${order.clientId} for order \${orderDoc.id}\`);
                        }
                    } catch (error) {
                        console.error(\`Error sending notification for order \${orderDoc.id}:\`, error);
                    }
                }

                await orderDoc.ref.update({
                    waitingNotificationsSent: admin.firestore.FieldValue.arrayUnion(now)
                });
            }

            if (currentBlock > previousBlock) {
                const chargePerBlock = order.waitingChargePerBlock || 10;
                const totalCharge = currentBlock * chargePerBlock;

                await orderDoc.ref.update({
                    waitingTimeBlocks: currentBlock,
                    waitingCharge: totalCharge
                });

                console.log(\`Updated order \${orderDoc.id}: Block \${currentBlock}, Charge $\${totalCharge}\`);
            }
        }

        return null;
    } catch (error) {
        console.error('Error in notifyWaitingTime function:', error);
        return null;
    }
};
\`\`\`

7. Haz clic en **Deploy**

### Opción 2: Configurar Cloud Scheduler

Después de desplegar la función, necesitas configurar Cloud Scheduler para ejecutarla cada minuto:

1. Ve a [Cloud Scheduler](https://console.cloud.google.com/cloudscheduler)
2. Haz clic en **Create Job**
3. Configura:
   - **Name**: `trigger-waiting-time-check`
   - **Region**: us-central1
   - **Frequency**: `* * * * *` (cada minuto)
   - **Timezone**: America/Los_Angeles
   - **Target**: Pub/Sub
   - **Topic**: `waiting-time-check`
   - **Payload**: `{}`

4. Haz clic en **Create**

## Verificación

Para verificar que la función está funcionando:

1. Ve a Firebase Console → Functions
2. Busca `notifyWaitingTime` en la lista
3. Haz clic en ella para ver los logs
4. Deberías ver logs cada minuto indicando cuántas órdenes están esperando

## Notas

- La función se ejecutará cada minuto automáticamente
- Los primeros 10 minutos de espera son gratuitos
- Después de 10 minutos, se cobra $10 por cada bloque de 10 minutos
- Los clientes recibirán notificaciones push cada minuto mientras el washer espera
