package com.carwash.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.ValueCallback
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebChromeClient
import android.webkit.JavascriptInterface
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import com.google.firebase.auth.FirebaseAuth
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val auth = FirebaseAuth.getInstance()

    // Variable to hold the callback for file uploads
    private var fileUploadCallback: ValueCallback<Array<android.net.Uri>>? = null

    // Permissions Launcher
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { _ ->
        // Permissions handled
    }

    // Activity Result Launcher for file choosing
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (fileUploadCallback != null) {
            val intent = result.data
            var uris: Array<android.net.Uri>? = null
            if (result.resultCode == android.app.Activity.RESULT_OK) {
                intent?.data?.let { uri ->
                    uris = arrayOf(uri)
                }
                // If intent data is null but we have clip data (multi-selection)
                if (uris == null) {
                    intent?.clipData?.let { clipData ->
                        uris = Array(clipData.itemCount) { i ->
                            clipData.getItemAt(i).uri
                        }
                    }
                }
            }
            fileUploadCallback?.onReceiveValue(uris)
            fileUploadCallback = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Ask Permissions First
        checkAndRequestPermissions()

        // Initialize WebView immediately (Web-First Login)
        webView = WebView(this)
        setContentView(webView)
        setupWebView()
        loadWebApp()
    }

    private fun checkAndRequestPermissions() {
        val permissions = mutableListOf(
            Manifest.permission.CAMERA,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        if (Build.VERSION.SDK_INT >= 33) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val toRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (toRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(toRequest.toTypedArray())
        }
    }

    private fun setupWebView() {
        // Handle Back Button
        onBackPressedDispatcher.addCallback(this, object : androidx.activity.OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    moveTaskToBack(true)
                }
            }
        })

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            setSupportZoom(true)
            builtInZoomControls = false
            displayZoomControls = false
            loadWithOverviewMode = true
            useWideViewPort = true
            mediaPlaybackRequiresUserGesture = false
        }

        webView.webViewClient = WebViewClient()
        
        // Custom WebChromeClient to handle file uploads
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<android.net.Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                // Cancel any existing callback
                if (fileUploadCallback != null) {
                    fileUploadCallback?.onReceiveValue(null)
                }
                fileUploadCallback = filePathCallback
                
                try {
                    val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "*/*"
                    }
                    
                    // Allow multiple if supported
                    if (fileChooserParams?.mode == FileChooserParams.MODE_OPEN_MULTIPLE) {
                         intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                    }
                    fileChooserLauncher.launch(intent)
                } catch (e: Exception) {
                    fileUploadCallback = null
                    return false
                }
                return true
            }

            override fun onJsAlert(
                view: WebView?,
                url: String?,
                message: String?,
                result: android.webkit.JsResult?
            ): Boolean {
                androidx.appcompat.app.AlertDialog.Builder(this@MainActivity)
                    .setTitle("My Carwash App")
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok) { _, _ ->
                        result?.confirm()
                    }
                    .setCancelable(false)
                    .show()
                return true
            }

            override fun onJsConfirm(
                view: WebView?,
                url: String?,
                message: String?,
                result: android.webkit.JsResult?
            ): Boolean {
                androidx.appcompat.app.AlertDialog.Builder(this@MainActivity)
                    .setTitle("Confirmation")
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok) { _, _ ->
                        result?.confirm()
                    }
                    .setNegativeButton(android.R.string.cancel) { _, _ ->
                        result?.cancel()
                    }
                    .setCancelable(false)
                    .show()
                return true
            }
        }
        
        // Add JavaScript interface for native communication
        webView.addJavascriptInterface(WebAppInterface(), "Android")
        
        // Set WebViewClient to send FCM token when page loads AND handle external URLs
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Send FCM token automatically when page loads
                sendFCMTokenToWebView()
            }
            
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                url?.let {
                    // Intercept Google Maps URLs and open in external browser/app
                    if (it.contains("google.com/maps") || it.contains("maps.google.com") || it.contains("maps.apple.com")) {
                        try {
                            val intent = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(it))
                            startActivity(intent)
                            return true
                        } catch (e: Exception) {
                            android.util.Log.e("MainActivity", "Error opening external URL: ${e.message}")
                        }
                    }
                }
                return false
            }
        }
    }
    
    private fun sendFCMTokenToWebView() {
        com.google.firebase.messaging.FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val token = task.result
                android.util.Log.d("FCM", "📱 Token FCM obtenido: $token")
                
                // Send token to WebView
                runOnUiThread {
                    webView.evaluateJavascript(
                        "if (window.onFCMTokenReceived) { window.onFCMTokenReceived('$token'); }",
                        null
                    )
                }
            } else {
                android.util.Log.e("FCM", "❌ Error obteniendo token FCM", task.exception)
            }
        }
    }

    private fun loadWebApp() {
        // Load Web App directly for Web-First Login
        var webAppUrl = "https://my-carwashapp-e6aba.web.app?native=true"
        
        // Check for notification intent data on cold start
        intent?.extras?.let { bundle ->
            if (bundle.containsKey("screen")) {
                val screen = bundle.getString("screen")
                val orderId = bundle.getString("orderId") ?: ""
                webAppUrl += "&screen=$screen&orderId=$orderId"
                android.util.Log.d("MainActivity", "🚀 Cold Start Deep Link: $screen ($orderId)")
            }
        }
        
        webView.loadUrl(webAppUrl)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        
        intent.extras?.let { bundle ->
            if (bundle.containsKey("screen")) {
                val screen = bundle.getString("screen")
                val orderId = bundle.getString("orderId") ?: ""
                
                android.util.Log.d("MainActivity", "🔔 New Intent Deep Link: $screen ($orderId)")
                
                // Navigate via JS bridge if app is already running
                val script = "if (window.handleDeepLink) { window.handleDeepLink('$screen', '$orderId'); }"
                runOnUiThread {
                    webView.evaluateJavascript(script, null)
                }
            }
        }
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun logout() {
            // Web handles logout
            auth.signOut()
            val sharedPrefs = getSharedPreferences("AppPrefs", android.content.Context.MODE_PRIVATE)
            sharedPrefs.edit().remove("current_uid").apply()
        }
        
        @JavascriptInterface
        fun setUserId(uid: String) {
            android.util.Log.d("MainActivity", "🔑 setUserId llamado para: $uid")
            val sharedPrefs = getSharedPreferences("AppPrefs", android.content.Context.MODE_PRIVATE)
            sharedPrefs.edit().putString("current_uid", uid).apply()
            
            // Check for pending FCM token first
            val pendingToken = sharedPrefs.getString("pending_fcm_token", null)
            
            if (pendingToken != null) {
                android.util.Log.d("MainActivity", "📱 Token FCM pendiente encontrado, guardando...")
                saveFCMTokenForUser(uid, pendingToken)
                sharedPrefs.edit().remove("pending_fcm_token").apply()
            } else {
                // Get current FCM token and register
                android.util.Log.d("MainActivity", "📲 Solicitando token FCM actual...")
                com.google.firebase.messaging.FirebaseMessaging.getInstance().token.addOnSuccessListener { token ->
                    android.util.Log.d("MainActivity", "✅ Token FCM obtenido: $token")
                    saveFCMTokenForUser(uid, token)
                }.addOnFailureListener { e ->
                    android.util.Log.e("MainActivity", "❌ Error obteniendo token FCM", e)
                }
            }
        }
        
        private fun saveFCMTokenForUser(uid: String, token: String) {
            android.util.Log.d("MainActivity", "✅ Token FCM obtenido nativamente: $token")
            // Delegate saving to the Web App (which is authenticated)
            // This prevents PERMISSION_DENIED errors in native code
            runOnUiThread {
                webView.evaluateJavascript(
                    "if (window.onFCMTokenReceived) { window.onFCMTokenReceived('$token'); }",
                    null
                )
            }
        }

        @JavascriptInterface
        fun getUserToken(unused: String) {
            // Not used in Web-First as much, but kept for compat
        }

        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                android.widget.Toast.makeText(this@MainActivity, message, android.widget.Toast.LENGTH_SHORT).show()
            }
        }
        
        @JavascriptInterface
        fun requestFCMToken() {
            android.util.Log.d("FCM", "📲 Token FCM solicitado desde WebView")
            sendFCMTokenToWebView()
        }
    }


}
