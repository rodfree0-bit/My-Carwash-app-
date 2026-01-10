package com.carwash.app.ui.client

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.R
import com.carwash.app.databinding.ActivityEditProfileBinding
import com.carwash.app.model.User
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserProfileChangeRequest
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.toObject

class EditProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditProfileBinding
    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()
    private val currentUser = auth.currentUser

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Setup toolbar
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }

        loadUserProfile()

        binding.btnSaveProfile.setOnClickListener {
            saveUserProfile()
        }
    }

    private fun loadUserProfile() {
        binding.editName.setText(currentUser?.displayName)
        
        if (currentUser != null) {
            db.collection("users").document(currentUser.uid).get()
                .addOnSuccessListener { doc ->
                    if (doc.exists()) {
                        val user = doc.toObject<User>()
                        binding.editPhone.setText(user?.phone)
                    }
                }
        }
    }

    private fun saveUserProfile() {
        val newName = binding.editName.text.toString()
        val newPhone = binding.editPhone.text.toString()
        val newPassword = binding.editPassword.text.toString()

        if (currentUser != null) {
            // 1. Update Display Name
            val profileUpdates = UserProfileChangeRequest.Builder()
                .setDisplayName(newName)
                .build()

            currentUser.updateProfile(profileUpdates)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        // 2. Update Firestore Data
                        val userData = mapOf(
                            "name" to newName,
                            "phone" to newPhone
                        )
                        db.collection("users").document(currentUser.uid).update(userData)
                            .addOnSuccessListener {
                                // 3. Update Password if provided
                                if (newPassword.isNotEmpty()) {
                                    currentUser.updatePassword(newPassword)
                                        .addOnCompleteListener { passwordTask ->
                                            if (passwordTask.isSuccessful) {
                                                Toast.makeText(this, "Profile and password updated successfully", Toast.LENGTH_SHORT).show()
                                                finish()
                                            } else {
                                                Toast.makeText(this, "Profile updated but password failed: ${passwordTask.exception?.message}", Toast.LENGTH_LONG).show()
                                            }
                                        }
                                } else {
                                    Toast.makeText(this, "Profile updated successfully", Toast.LENGTH_SHORT).show()
                                    finish()
                                }
                            }
                            .addOnFailureListener {
                                Toast.makeText(this, "Error updating user data", Toast.LENGTH_SHORT).show()
                            }
                    } else {
                        Toast.makeText(this, "Error updating profile", Toast.LENGTH_SHORT).show()
                    }
                }
        }
    }
}
