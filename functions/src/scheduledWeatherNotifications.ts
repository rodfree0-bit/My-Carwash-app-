import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import axios from 'axios';

interface WeatherResponse {
    main: { temp: number; humidity: number };
    weather: Array<{ main: string; description: string }>;
    rain?: { '1h'?: number };
}

/**
 * Cloud Function programada que se ejecuta diariamente a las 8 AM
 * Evalúa el clima y envía notificaciones a clientes cuando hay buen clima
 */
export const sendWeatherNotifications = functions.scheduler.onSchedule({
    schedule: '0 8 * * *',
    timeZone: 'America/Los_Angeles',
    timeoutSeconds: 540,
    memory: '256MiB'
}, async (event) => {
    console.log('🌤️ Iniciando evaluación de clima para notificaciones...');

    try {
        // 1. Obtener API key de configuración
        const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

        if (!OPENWEATHER_API_KEY) {
            console.error('❌ No se encontró API key de OpenWeather');
            return;
        }

        // Coordenadas de Los Angeles
        const LAT = 34.0522;
        const LON = -118.2437;

        // 2. Consultar clima actual
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const weatherRes = await axios.get<WeatherResponse>(weatherUrl);

        const { temp, humidity } = weatherRes.data.main;
        const condition = weatherRes.data.weather[0].main;
        const hasRain = weatherRes.data.rain?.['1h'] || 0;

        console.log(`📊 Clima actual: ${temp}°C, ${condition}, Humedad: ${humidity}%, Lluvia: ${hasRain}mm`);

        // 3. Evaluar si es buen clima para lavar
        const isGoodWeather =
            temp >= 18 && temp <= 32 &&
            (condition === 'Clear' || condition === 'Clouds') &&
            hasRain === 0 &&
            humidity < 70;

        if (!isGoodWeather) {
            console.log('❌ Clima no ideal para notificaciones de lavado');
            console.log(`   Razón: Temp=${temp}°C, Condición=${condition}, Lluvia=${hasRain}mm, Humedad=${humidity}%`);
            return;
        }

        console.log('✅ Buen clima detectado, preparando notificaciones...');

        // 4. Obtener usuarios elegibles
        const usersSnapshot = await admin.firestore()
            .collection('users')
            .where('role', '==', 'client')
            .where('notificationPreferences.weatherAlerts', '==', true)
            .where('fcmToken', '!=', null)
            .get();

        if (usersSnapshot.empty) {
            console.log('⚠️ No hay usuarios con notificaciones de clima habilitadas');
            return;
        }

        console.log(`👥 Encontrados ${usersSnapshot.size} usuarios con notificaciones habilitadas`);

        // 5. Filtrar usuarios que ya recibieron notificación hoy
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const tokens: string[] = [];

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const lastWeatherNotif = userData.lastWeatherNotification;

            // Solo enviar si no se envió hoy
            if (!lastWeatherNotif || lastWeatherNotif !== today) {
                if (userData.fcmToken) {
                    tokens.push(userData.fcmToken);

                    // Actualizar fecha de última notificación
                    await doc.ref.update({ lastWeatherNotification: today });
                }
            }
        }

        if (tokens.length === 0) {
            console.log('⚠️ Todos los usuarios ya recibieron notificación hoy');
            return;
        }

        console.log(`📱 Enviando notificaciones a ${tokens.length} usuarios...`);

        // 6. Crear mensaje de notificación
        const tempF = Math.round((temp * 9 / 5) + 32); // Convert to Fahrenheit
        const message = {
            notification: {
                title: '☀️ Perfect Weather Today!',
                body: `Great day to wash your car! It's ${tempF}°F and sunny 😊`
            },
            data: {
                type: 'weather_alert',
                action: 'book_wash',
                temperature: tempF.toString(),
                condition: condition,
                screen: 'CLIENT_VEHICLE' // Para deep linking
            }
        };

        // 7. Enviar notificaciones en lotes (FCM limit: 500)
        const batchSize = 500;
        let totalSuccess = 0;
        let totalFailure = 0;

        for (let i = 0; i < tokens.length; i += batchSize) {
            const batch = tokens.slice(i, i + batchSize);

            try {
                const response = await admin.messaging().sendEachForMulticast({
                    tokens: batch,
                    ...message
                });

                totalSuccess += response.successCount;
                totalFailure += response.failureCount;

                console.log(`✅ Lote ${Math.floor(i / batchSize) + 1}: ${response.successCount}/${batch.length} exitosas`);

                // Log de errores si los hay
                if (response.failureCount > 0) {
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            console.error(`❌ Error en token ${idx}:`, resp.error?.message);
                        }
                    });
                }
            } catch (error) {
                console.error('❌ Error enviando lote:', error);
                totalFailure += batch.length;
            }
        }

        console.log(`\n📊 Resumen:`);
        console.log(`   ✅ Exitosas: ${totalSuccess}`);
        console.log(`   ❌ Fallidas: ${totalFailure}`);
        console.log(`   📱 Total: ${tokens.length}`);


    } catch (error) {
        console.error('❌ Error en sendWeatherNotifications:', error);
    }
});
