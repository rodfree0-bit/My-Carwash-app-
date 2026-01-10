package com.example.mycarwashapp // Cambiar por tu package name

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val NOTIFICATION_PERMISSION_CODE = 123

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Configurar WebView
        webView = findViewById(R.id.webView)
        setupWebView()

        // Solicitar permisos de notificaciones (Android 13+)
        requestNotificationPermission()

        // Cargar la app web
        webView.loadUrl("https://my-carwashapp-e6aba.web.app")
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
        }

        // Agregar interfaz JavaScript
        webView.addJavascriptInterface(AndroidNative(), "AndroidNative")

        // WebViewClient para detectar cuando carga la página
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                Log.d("WebView", "✅ Página cargada: $url")
                
                // Enviar token FCM automáticamente
                sendFCMTokenToWebView()
            }
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), NOTIFICATION_PERMISSION_CODE)
            }
        }
    }

    private fun sendFCMTokenToWebView() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val token = task.result
                Log.d("FCM", "📱 Token FCM obtenido: $token")
                
                // Enviar token al WebView
                runOnUiThread {
                    webView.evaluateJavascript(
                        "if (window.onFCMTokenReceived) { window.onFCMTokenReceived('$token'); }",
                        null
                    )
                }
            } else {
                Log.e("FCM", "❌ Error obteniendo token FCM", task.exception)
            }
        }
    }

    // Interfaz JavaScript para comunicación WebView <-> Android
    inner class AndroidNative {
        
        @JavascriptInterface
        fun requestFCMToken() {
            Log.d("FCM", "📲 Token FCM solicitado desde WebView")
            sendFCMTokenToWebView()
        }

        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                android.widget.Toast.makeText(this@MainActivity, message, android.widget.Toast.LENGTH_SHORT).show()
            }
        }

        @JavascriptInterface
        fun setUserId(uid: String) {
            Log.d("FCM", "👤 Usuario ID: $uid")
            // Aquí puedes guardar el UID si lo necesitas
        }

        @JavascriptInterface
        fun logout() {
            runOnUiThread {
                // Limpiar cookies y cache
                webView.clearCache(true)
                webView.clearHistory()
                android.webkit.CookieManager.getInstance().removeAllCookies(null)
                
                // Recargar página
                webView.loadUrl("https://my-carwashapp-e6aba.web.app")
            }
        }
    }

    // Manejar botón atrás
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
