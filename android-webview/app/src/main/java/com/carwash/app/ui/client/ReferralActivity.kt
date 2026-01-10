package com.carwash.app.ui.client

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityReferralBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.util.*

class ReferralActivity : AppCompatActivity() {

    private lateinit var binding: ActivityReferralBinding
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    private var referralCode = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityReferralBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnBack.setOnClickListener { finish() }

        loadReferralData()

        binding.btnCopyCode.setOnClickListener {
            copyToClipboard()
        }

        binding.btnShareWhatsApp.setOnClickListener {
            shareViaWhatsApp()
        }

        binding.btnShareSMS.setOnClickListener {
            shareViaSMS()
        }

        binding.btnShareEmail.setOnClickListener {
            shareViaEmail()
        }
    }

    private fun loadReferralData() {
        val userId = auth.currentUser?.uid ?: return

        db.collection("users").document(userId).get()
            .addOnSuccessListener { document ->
                // Get or generate referral code
                referralCode = document.getString("referralCode") ?: generateReferralCode()
                
                if (document.getString("referralCode") == null) {
                    // Save new code
                    db.collection("users").document(userId)
                        .update("referralCode", referralCode)
                }

                binding.referralCodeText.text = referralCode

                // Load referral stats
                val referrals = document.get("referrals") as? List<String> ?: emptyList()
                binding.totalReferrals.text = referrals.size.toString()
                
                val rewards = referrals.size * 10 // $10 per referral
                binding.totalRewards.text = "$$rewards"
            }
    }

    private fun generateReferralCode(): String {
        val userName = auth.currentUser?.displayName ?: "USER"
        val random = UUID.randomUUID().toString().substring(0, 6).uppercase()
        return "${userName.take(3).uppercase()}$random"
    }

    private fun copyToClipboard() {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Referral Code", referralCode)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(this, "Code copied!", Toast.LENGTH_SHORT).show()
    }

    private fun shareViaWhatsApp() {
        val message = "Hey! Use my code *$referralCode* to get \$10 off your first car wash with My Carwash app! 🚗✨"
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, message)
            setPackage("com.whatsapp")
        }
        try {
            startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(this, "WhatsApp not installed", Toast.LENGTH_SHORT).show()
        }
    }

    private fun shareViaSMS() {
        val message = "Hey! Use my code $referralCode to get \$10 off your first car wash with My Carwash app!"
        val intent = Intent(Intent.ACTION_SENDTO).apply {
            data = android.net.Uri.parse("smsto:")
            putExtra("sms_body", message)
        }
        startActivity(intent)
    }

    private fun shareViaEmail() {
        val subject = "Get \$10 off your first car wash!"
        val body = """
            Hi there!
            
            I'm using My Carwash app and I love it! Use my referral code to get $10 off your first wash:
            
            Code: $referralCode
            
            Download the app and enjoy premium car detailing at your doorstep!
            
            Cheers!
        """.trimIndent()

        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "message/rfc822"
            putExtra(Intent.EXTRA_SUBJECT, subject)
            putExtra(Intent.EXTRA_TEXT, body)
        }
        startActivity(Intent.createChooser(intent, "Share via Email"))
    }
}
