package com.carwash.app.services

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.carwash.app.MainActivity
import com.carwash.app.R
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "FCMService"
        private const val CHANNEL_ID = "carwash_notifications"
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        
        Log.d(TAG, "📬 Mensaje FCM recibido")
        Log.d(TAG, "   From: ${message.from}")
        Log.d(TAG, "   Data: ${message.data}")
        Log.d(TAG, "   Notification: ${message.notification}")

        // Handle both notification and data payloads
        val title = message.notification?.title ?: message.data["title"] ?: "My Carwash App"
        val body = message.notification?.body ?: message.data["body"] ?: ""
        
        if (title.isNotEmpty() || body.isNotEmpty()) {
            showNotification(title, body, message.data)
            Log.d(TAG, "✅ Notificación mostrada: $title - $body")
        } else {
            Log.w(TAG, "⚠️ Mensaje recibido pero sin contenido para mostrar")
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "🔄 Nuevo token FCM generado: $token")
        saveTokenToFirestore(token)
    }

    private fun saveTokenToFirestore(token: String) {
        val uid = com.google.firebase.auth.FirebaseAuth.getInstance().currentUser?.uid
        
        if (uid == null) {
            Log.w(TAG, "⚠️ No hay usuario autenticado, guardando token en SharedPreferences")
            // Save to SharedPreferences for later
            getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                .edit()
                .putString("pending_fcm_token", token)
                .apply()
            return
        }

        Log.d(TAG, "💾 Guardando token FCM para usuario: $uid")
        com.google.firebase.firestore.FirebaseFirestore.getInstance()
            .collection("users")
            .document(uid)
            .update("fcmToken", token)
            .addOnSuccessListener {
                Log.d(TAG, "✅ Token FCM guardado exitosamente en Firestore")
                // Clear pending token if exists
                getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                    .edit()
                    .remove("pending_fcm_token")
                    .apply()
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "❌ Error guardando token FCM: ${e.message}", e)
                // Try to set the document if update failed (user doc might not exist yet)
                com.google.firebase.firestore.FirebaseFirestore.getInstance()
                    .collection("users")
                    .document(uid)
                    .set(mapOf("fcmToken" to token), com.google.firebase.firestore.SetOptions.merge())
                    .addOnSuccessListener {
                        Log.d(TAG, "✅ Token FCM guardado con merge")
                    }
                    .addOnFailureListener { e2 ->
                        Log.e(TAG, "❌ Error en merge: ${e2.message}", e2)
                    }
            }
    }

    private fun showNotification(title: String, body: String, data: Map<String, String>) {
        createNotificationChannel()
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Create intent to open the app
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            // Add any extra data from the notification
            data.forEach { (key, value) ->
                putExtra(key, value)
            }
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            System.currentTimeMillis().toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setSound(android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_NOTIFICATION))
            .setVibrate(longArrayOf(0, 500, 200, 500))
            .build()

        val notificationId = System.currentTimeMillis().toInt()
        notificationManager.notify(notificationId, notification)
        
        Log.d(TAG, "🔔 Notificación ID $notificationId mostrada")
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Order Updates",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for order status updates and important alerts"
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 200, 500)
                setSound(android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_NOTIFICATION), android.media.AudioAttributes.Builder()
                    .setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build())
            }
            
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
            
            Log.d(TAG, "📢 Canal de notificaciones creado")
        }
    }
}
