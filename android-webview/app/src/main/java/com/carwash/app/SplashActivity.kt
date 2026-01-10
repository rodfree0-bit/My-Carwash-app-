package com.carwash.app

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivitySplashBinding
import com.carwash.app.ui.client.ClientMainActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class SplashActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySplashBinding

    companion object {
        private const val SPLASH_ANIMATION_DURATION = 1000L
        private const val SPLASH_DELAY = 2000L
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Animate Logo
        binding.splashLogo.alpha = 0f
        binding.splashLogo.animate().alpha(1f).duration = SPLASH_ANIMATION_DURATION

        // Mock Loading & Routing (Replace with Firebase Auth check later)
        Handler(Looper.getMainLooper()).postDelayed({
            checkUserStatusAndRoute()
        }, SPLASH_DELAY)
    }

    private fun checkUserStatusAndRoute() {
        val currentUser = FirebaseAuth.getInstance().currentUser
        if (currentUser != null) {
            // User logged in, fetch role and redirect
            val db = FirebaseFirestore.getInstance()
            db.collection("users").document(currentUser.uid).get()
                .addOnSuccessListener { document ->
                    val role = document?.getString("role") ?: "client"
                    val targetIntent = when (role) {
                        "admin" -> Intent(this, AdminDashboardActivity::class.java)
                        "washer" -> Intent(this, com.carwash.app.ui.washer.WasherMainActivity::class.java)
                        else -> Intent(this, ClientMainActivity::class.java)
                    }
                    startActivity(targetIntent)
                    finish()
                }
                .addOnFailureListener {
                    goToLogin() // Fallback if error
                }
        } else {
            goToLogin()
        }
    }

    private fun goToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
