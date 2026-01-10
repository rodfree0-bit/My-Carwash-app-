package com.carwash.app

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityRegisterBinding
import com.carwash.app.ui.client.ClientMainActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

        // Setup phone formatting
        setupPhoneFormatting()

        binding.btnLogin.setOnClickListener {
            finish() // Return to Login
        }

        binding.btnWasherRegister.setOnClickListener {
            startActivity(Intent(this, com.carwash.app.ui.washer.WasherRegistrationActivity::class.java))
        }

        binding.btnRegister.setOnClickListener {
            val firstName = binding.inputFirstName.text.toString().trim()
            val lastName = binding.inputLastName.text.toString().trim()
            val email = binding.inputEmail.text.toString().trim()
            val phoneInput = binding.inputPhone.text.toString().trim()
            val phone = phoneInput.replace(Regex("\\D"), "") // Extract only digits
            val street = binding.inputStreet.text.toString().trim()
            val city = binding.inputCity.text.toString().trim()
            val state = binding.inputState.text.toString().trim().uppercase()
            val zipCode = binding.inputZipCode.text.toString().trim()
            val password = binding.inputPassword.text.toString()

            // Validation
            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || phone.isEmpty() || 
                street.isEmpty() || city.isEmpty() || state.isEmpty() || zipCode.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (phone.length < 10) {
                Toast.makeText(this, "Phone number must be 10 digits", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password.length < 6) {
                Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            setLoading(true)

            // Combine data
            val fullName = "$firstName $lastName"
            val fullAddress = "$street, $city, $state $zipCode"
            val phoneWithCode = "+1$phone"

            auth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val user = task.result?.user
                        val uid = user?.uid
                        if (uid != null) {
                            // Send Verification Email
                            user.sendEmailVerification()
                                .addOnCompleteListener { verificationTask ->
                                    if (verificationTask.isSuccessful) {
                                        Toast.makeText(this, "Verification email sent to ${user.email}", Toast.LENGTH_SHORT).show()
                                    }
                                }

                            // Determine role (super admin check)
                            val role = if (email.lowercase() == "rodfree0@gmail.com") "admin" else "client"
                            
                            val userMap = hashMapOf(
                                "name" to fullName,
                                "email" to email,
                                "phone" to phoneWithCode,
                                "address" to fullAddress,
                                "role" to role,
                                "createdAt" to FieldValue.serverTimestamp(),
                                "savedVehicles" to emptyList<Map<String, Any>>()
                            )

                            db.collection("users").document(uid).set(userMap)
                                .addOnSuccessListener {
                                    setLoading(false)
                                    Toast.makeText(this, "Account created successfully!", Toast.LENGTH_SHORT).show()
                                    
                                    // Navigate based on role
                                    val intent = if (role == "admin") {
                                        Intent(this, AdminDashboardActivity::class.java)
                                    } else {
                                        Intent(this, ClientMainActivity::class.java)
                                    }
                                    startActivity(intent)
                                    finishAffinity()
                                }
                                .addOnFailureListener { e ->
                                    setLoading(false)
                                    Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                                }
                        }
                    } else {
                        setLoading(false)
                        val errorMsg = task.exception?.message ?: "Registration failed"
                        Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
                    }
                }
        }
    }

    private fun setupPhoneFormatting() {
        binding.inputPhone.addTextChangedListener(object : TextWatcher {
            private var isFormatting = false

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

            override fun afterTextChanged(s: Editable?) {
                if (isFormatting || s == null) return
                
                isFormatting = true

                // Remove all formatting
                val digits = s.toString().replace(Regex("\\D"), "")
                
                // Build formatted string: (555) 123-4567
                val formatted = when {
                    digits.isEmpty() -> ""
                    digits.length <= 3 -> "($digits"
                    digits.length <= 6 -> "(${digits.take(3)}) ${digits.substring(3)}"
                    else -> "(${digits.take(3)}) ${digits.substring(3, 6)}-${digits.substring(6, minOf(10, digits.length))}"
                }

                s.replace(0, s.length, formatted)
                
                isFormatting = false
            }
        })
    }

    private fun setLoading(loading: Boolean) {
        binding.progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        binding.btnRegister.isEnabled = !loading
    }
}
