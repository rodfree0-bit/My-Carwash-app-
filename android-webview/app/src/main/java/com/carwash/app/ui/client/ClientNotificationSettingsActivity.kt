package com.carwash.app.ui.client

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityClientNotificationSettingsBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions

class ClientNotificationSettingsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityClientNotificationSettingsBinding
    private val db = FirebaseFirestore.getInstance()
    private val user = FirebaseAuth.getInstance().currentUser

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityClientNotificationSettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbar.setNavigationOnClickListener { finish() }

        loadSettings()

        binding.btnSave.setOnClickListener {
            saveSettings()
        }
    }

    private fun loadSettings() {
        if (user == null) return
        
        db.collection("users").document(user.uid).collection("settings").document("notifications")
            .get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    binding.switchPush.isChecked = document.getBoolean("pushEnabled") ?: true
                    binding.switchEmail.isChecked = document.getBoolean("emailEnabled") ?: true
                    binding.switchSMS.isChecked = document.getBoolean("smsEnabled") ?: false
                    binding.switchOrderStatus.isChecked = document.getBoolean("orderStatusEnabled") ?: true
                    binding.switchPromotions.isChecked = document.getBoolean("promoEnabled") ?: true
                } else {
                    // Defaults
                    binding.switchPush.isChecked = true
                    binding.switchEmail.isChecked = true
                    binding.switchOrderStatus.isChecked = true
                    binding.switchPromotions.isChecked = true
                }
            }
    }

    private fun saveSettings() {
        if (user == null) return

        val settings = hashMapOf(
            "pushEnabled" to binding.switchPush.isChecked,
            "emailEnabled" to binding.switchEmail.isChecked,
            "smsEnabled" to binding.switchSMS.isChecked,
            "orderStatusEnabled" to binding.switchOrderStatus.isChecked,
            "promoEnabled" to binding.switchPromotions.isChecked
        )

        db.collection("users").document(user.uid).collection("settings").document("notifications")
            .set(settings, SetOptions.merge())
            .addOnSuccessListener {
                Toast.makeText(this, "Settings saved!", Toast.LENGTH_SHORT).show()
                finish()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Failed to save settings", Toast.LENGTH_SHORT).show()
            }
    }
}
