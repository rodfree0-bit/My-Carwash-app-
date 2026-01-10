import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

/**
 * Cloud Function programada que se ejecuta semanalmente
 * Envía recordatorios a clientes que llevan 2-3 semanas sin agendar un lavado
 */
export const sendInactivityReminders = functions.scheduler.onSchedule({
    schedule: '0 9 * * 1',
    timeZone: 'America/Los_Angeles',
    timeoutSeconds: 540,
    memory: '256MiB'
}, async (event) => {
    console.log('🔔 Iniciando envío de recordatorios por inactividad...');

    try {
        const now = Date.now();

        // 1. Obtener todas las órdenes completadas
        const ordersSnapshot = await admin.firestore()
            .collection('orders')
            .where('status', '==', 'Completed')
            .orderBy('completedAt', 'desc')
            .get();

        console.log(`📦 Total de órdenes completadas: ${ordersSnapshot.size}`);

        // 2. Agrupar por cliente y encontrar última orden
        const clientLastOrder = new Map<string, { date: number; orderId: string }>();

        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            const clientId = order.clientId;
            const completedAt = order.completedAt || order.createdAt?.toMillis() || 0;

            if (clientId && completedAt) {
                const existing = clientLastOrder.get(clientId);
                if (!existing || completedAt > existing.date) {
                    clientLastOrder.set(clientId, { date: completedAt, orderId: doc.id });
                }
            }
        });

        console.log(`👥 Clientes únicos con órdenes: ${clientLastOrder.size}`);

        // 3. Identificar clientes inactivos
        const inactiveClients: Array<{
            userId: string;
            daysSince: number;
            fcmToken: string;
            lastOrderDate: number;
        }> = [];

        for (const [clientId, lastOrder] of clientLastOrder.entries()) {
            const daysSince = Math.floor((now - lastOrder.date) / (1000 * 60 * 60 * 24));

            // Solo notificar si llevan 14+ días sin lavar
            if (daysSince >= 14) {
                // Obtener datos del usuario
                const userDoc = await admin.firestore().collection('users').doc(clientId).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();

                    // Verificar preferencias y token
                    if (userData?.fcmToken && userData?.notificationPreferences?.reminders !== false) {
                        // Verificar que no se haya enviado recordatorio recientemente
                        const lastReminder = userData.lastInactivityReminder || 0;
                        const daysSinceLastReminder = Math.floor((now - lastReminder) / (1000 * 60 * 60 * 24));

                        // Solo enviar si no se envió en los últimos 7 días
                        if (daysSinceLastReminder >= 7 || !lastReminder) {
                            inactiveClients.push({
                                userId: clientId,
                                daysSince,
                                fcmToken: userData.fcmToken,
                                lastOrderDate: lastOrder.date
                            });
                        }
                    }
                }
            }
        }

        if (inactiveClients.length === 0) {
            console.log('✅ No hay clientes inactivos que requieran recordatorio');
            return;
        }

        console.log(`📱 Enviando recordatorios a ${inactiveClients.length} clientes inactivos`);

        // 4. Enviar notificaciones personalizadas
        let successCount = 0;
        let failureCount = 0;

        for (const client of inactiveClients) {
            const { userId, daysSince, fcmToken } = client;
            const weeksSince = Math.floor(daysSince / 7);

            // Personalizar mensaje según tiempo de inactividad
            let notification;

            if (daysSince >= 28) {
                // 4+ semanas - Amigable pero directo
                notification = {
                    title: '🚗 Your Car Misses You!',
                    body: `How about a wash today? Your car will thank you 😊`
                };
            } else if (daysSince >= 21) {
                // 3 semanas - Amigable
                notification = {
                    title: '✨ Time for a Wash?',
                    body: `Regular washes keep your car looking brand new. Ready to book?`
                };
            } else {
                // 2 semanas - Muy amigable
                notification = {
                    title: '🌟 Ready to Shine?',
                    body: `Remember to wash your car. Today's a great day for it!`
                };
            }

            try {
                await admin.messaging().send({
                    token: fcmToken,
                    notification,
                    data: {
                        type: 'inactivity_reminder',
                        action: 'book_wash',
                        daysSince: daysSince.toString(),
                        weeksSince: weeksSince.toString(),
                        screen: 'CLIENT_VEHICLE'
                    }
                });

                // Actualizar fecha de último recordatorio
                await admin.firestore().collection('users').doc(userId).update({
                    lastInactivityReminder: now
                });

                successCount++;
                console.log(`✅ Recordatorio enviado a usuario ${userId} (${daysSince} días inactivo)`);

            } catch (error: any) {
                failureCount++;
                console.error(`❌ Error enviando a ${userId}:`, error.message);
            }
        }

        console.log(`\n📊 Resumen de Recordatorios:`);
        console.log(`   ✅ Exitosos: ${successCount}`);
        console.log(`   ❌ Fallidos: ${failureCount}`);
        console.log(`   📱 Total: ${inactiveClients.length}`);


    } catch (error) {
        console.error('❌ Error en sendInactivityReminders:', error);
    }
});
