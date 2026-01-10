package com.carwash.app.ui.admin

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityAdminFeesBinding
import com.google.firebase.firestore.FirebaseFirestore

class AdminSettingsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminFeesBinding
    private val db = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminFeesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        loadSettings()
        setupSaveButton()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun loadSettings() {
        // Load Service Area
        db.collection("settings").document("serviceArea")
            .get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    binding.etRadius.setText(document.getDouble("radius")?.toString() ?: "25.0")
                    binding.etLat.setText(document.getDouble("centerLat")?.toString() ?: "")
                    binding.etLng.setText(document.getDouble("centerLng")?.toString() ?: "")
                }
            }

        // Load Fees (and Commission from 'global' or 'fees' depending on migration, sticking to 'fees' for consistency moving forward)
        // Check both locations for backwards compatibility or migrate now. I'll check 'fees' collection first.
        db.collection("settings").document("fees")
            .get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    binding.etTaxRate.setText(document.getDouble("taxRate")?.toString() ?: "0.0")
                    binding.etServiceFee.setText(document.getDouble("serviceFee")?.toString() ?: "0.0")
                    binding.etCommission.setText(document.getDouble("commissionRate")?.toString() ?: "70.0") // Default 70%
                } else {
                    // Fallback to old 'global' settings if 'fees' doesn't exist
                     db.collection("settings").document("global")
                        .get()
                        .addOnSuccessListener { globalDoc ->
                            if (globalDoc.exists()) {
                                binding.etTaxRate.setText(globalDoc.getDouble("taxRate")?.toString() ?: "0.0")
                                binding.etServiceFee.setText(globalDoc.getDouble("platformFee")?.toString() ?: "0.0")
                                binding.etCommission.setText(globalDoc.getDouble("commissionRate")?.toString() ?: "70.0")
                            }
                        }
                }
            }
    }

    private fun setupSaveButton() {
        binding.btnSave.setOnClickListener {
            val radius = binding.etRadius.text.toString().toDoubleOrNull() ?: 0.0
            val lat = binding.etLat.text.toString().toDoubleOrNull() ?: 0.0
            val lng = binding.etLng.text.toString().toDoubleOrNull() ?: 0.0
            val taxRate = binding.etTaxRate.text.toString().toDoubleOrNull() ?: 0.0
            val serviceFee = binding.etServiceFee.text.toString().toDoubleOrNull() ?: 0.0
            val commission = binding.etCommission.text.toString().toDoubleOrNull() ?: 0.0

            val serviceAreaUpdates = hashMapOf(
                "radius" to radius,
                "centerLat" to lat,
                "centerLng" to lng
            )

            val feesUpdates = hashMapOf(
                "taxRate" to taxRate,
                "serviceFee" to serviceFee,
                "commissionRate" to commission
            )

            val batch = db.batch()
            val serviceAreaRef = db.collection("settings").document("serviceArea")
            val feesRef = db.collection("settings").document("fees")
            
            // Also update 'global' for consistency with other parts of app that might still use it
            val globalRef = db.collection("settings").document("global")
            val globalUpdates = hashMapOf(
                "taxRate" to taxRate,
                "platformFee" to serviceFee,
                "commissionRate" to commission
            )

            batch.set(serviceAreaRef, serviceAreaUpdates)
            batch.set(feesRef, feesUpdates)
            batch.set(globalRef, globalUpdates)

            batch.commit()
                .addOnSuccessListener {
                    Toast.makeText(this, "Settings updated successfully!", Toast.LENGTH_SHORT).show()
                    finish()
                }
                .addOnFailureListener { e ->
                    Toast.makeText(this, "Error updating settings: ${e.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
