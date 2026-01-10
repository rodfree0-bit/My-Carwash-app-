package com.carwash.app.ui.washer

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.LoginActivity
import com.carwash.app.databinding.ActivityWasherRegistrationBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore

class WasherRegistrationActivity : AppCompatActivity() {

    private lateinit var binding: ActivityWasherRegistrationBinding
    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    private var profileUri: android.net.Uri? = null
    private var licenseUri: android.net.Uri? = null
    private var vehicleUri: android.net.Uri? = null
    private var insuranceUri: android.net.Uri? = null
    private var registrationUri: android.net.Uri? = null
    private var ssnCardUri: android.net.Uri? = null

    private val pickProfileImage = registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.GetContent()) { uri ->
        uri?.let { profileUri = it; binding.imgProfile.setImageURI(it) }
    }

    private val pickLicenseImage = registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.GetContent()) { uri ->
        uri?.let { licenseUri = it; binding.imgLicense.setImageURI(it) }
    }

    private val pickVehicleImage = registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.GetContent()) { uri ->
        uri?.let { vehicleUri = it; binding.imgVehicle.setImageURI(it) }
    }

    private val pickInsuranceImage = registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.GetContent()) { uri ->
        uri?.let { insuranceUri = it; binding.imgInsurance.setImageURI(it) }
    }

    private val pickRegistrationImage = registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.GetContent()) { uri ->
        uri?.let { registrationUri = it; binding.imgRegistration.setImageURI(it) }
    }

    private val pickSSNImage = registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.GetContent()) { uri ->
        uri?.let { ssnCardUri = it; binding.imgSSNCard.setImageURI(it) }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWasherRegistrationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.toolbar.setNavigationOnClickListener { finish() }

        binding.imgProfile.setOnClickListener { pickProfileImage.launch("image/*") }
        binding.imgLicense.setOnClickListener { pickLicenseImage.launch("image/*") }
        binding.imgVehicle.setOnClickListener { pickVehicleImage.launch("image/*") }
        binding.imgInsurance.setOnClickListener { pickInsuranceImage.launch("image/*") }
        binding.imgRegistration.setOnClickListener { pickRegistrationImage.launch("image/*") }
        binding.imgSSNCard.setOnClickListener { pickSSNImage.launch("image/*") }

        binding.btnSubmitApplication.setOnClickListener {
            validateAndSubmit()
        }
    }

    private fun validateAndSubmit() {
        val name = binding.inputName.text.toString().trim()
        val email = binding.inputEmail.text.toString().trim()
        val phone = binding.inputPhone.text.toString().trim()
        val password = binding.inputPassword.text.toString().trim()
        
        val ssn = binding.inputSSN.text.toString().trim()
        val dob = binding.inputDOB.text.toString().trim()
        val address = binding.inputAddress.text.toString().trim()
        
        val vehicleMake = binding.inputMake.text.toString().trim()
        val vehicleModel = binding.inputModel.text.toString().trim()
        val vehicleYear = binding.inputYear.text.toString().trim()
        val vehicleColor = binding.inputColor.text.toString().trim()
        val vehiclePlate = binding.inputPlate.text.toString().trim()

        if (name.isEmpty() || email.isEmpty() || password.isEmpty() || 
            vehicleMake.isEmpty() || vehicleModel.isEmpty() || vehiclePlate.isEmpty() ||
            ssn.isEmpty() || dob.isEmpty() || address.isEmpty() || vehicleYear.isEmpty() || vehicleColor.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return
        }
        
        if (profileUri == null || licenseUri == null || vehicleUri == null || insuranceUri == null || registrationUri == null || ssnCardUri == null) {
            Toast.makeText(this, "Please upload all 6 photos (Profile, License, Vehicle, Insurance, Registration, SSN Card)", Toast.LENGTH_SHORT).show()
            return
        }

        setLoading(true)

        auth.createUserWithEmailAndPassword(email, password)
            .addOnSuccessListener { authResult ->
                val uid = authResult.user?.uid ?: return@addOnSuccessListener
                uploadImagesAndSaveData(uid, name, email, phone, ssn, dob, address, vehicleMake, vehicleModel, vehicleYear, vehicleColor, vehiclePlate)
            }
            .addOnFailureListener { e ->
                setLoading(false)
                Toast.makeText(this, "Registration failed: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun uploadImagesAndSaveData(
        uid: String, name: String, email: String, phone: String, 
        ssn: String, dob: String, address: String, 
        vehicleMake: String, vehicleModel: String, vehicleYear: String, vehicleColor: String, vehiclePlate: String
    ) {
        val storageRef = com.google.firebase.storage.FirebaseStorage.getInstance().reference
        val profileRef = storageRef.child("washers/$uid/profile.jpg")
        val licenseRef = storageRef.child("washers/$uid/license.jpg")
        val vehicleRef = storageRef.child("washers/$uid/vehicle.jpg")
        val insuranceRef = storageRef.child("washers/$uid/insurance.jpg")
        val registrationRef = storageRef.child("washers/$uid/registration.jpg")
        val ssnRef = storageRef.child("washers/$uid/ssn_card.jpg")

        val uploadTasks = listOf(
            profileRef.putFile(profileUri!!).continueWithTask { profileRef.downloadUrl },
            licenseRef.putFile(licenseUri!!).continueWithTask { licenseRef.downloadUrl },
            vehicleRef.putFile(vehicleUri!!).continueWithTask { vehicleRef.downloadUrl },
            insuranceRef.putFile(insuranceUri!!).continueWithTask { insuranceRef.downloadUrl },
            registrationRef.putFile(registrationUri!!).continueWithTask { registrationRef.downloadUrl },
            ssnRef.putFile(ssnCardUri!!).continueWithTask { ssnRef.downloadUrl }
        )

        com.google.android.gms.tasks.Tasks.whenAllSuccess<android.net.Uri>(uploadTasks)
            .addOnSuccessListener { uris ->
                val washerData = hashMapOf(
                    "name" to name,
                    "email" to email,
                    "phone" to phone,
                    "role" to "washer",
                    "status" to "Applicant",
                    "isActive" to false,
                    "ssn" to ssn,
                    "dob" to dob,
                    "address" to address,
                    "vehicleMake" to vehicleMake,
                    "vehicleModel" to vehicleModel,
                    "vehicleYear" to vehicleYear,
                    "vehicleColor" to vehicleColor,
                    "vehiclePlate" to vehiclePlate,
                    "profilePhotoUrl" to uris[0].toString(),
                    "licensePhotoUrl" to uris[1].toString(),
                    "vehiclePhotoUrl" to uris[2].toString(),
                    "insurancePhotoUrl" to uris[3].toString(),
                    "registrationPhotoUrl" to uris[4].toString(),
                    "ssnPhotoUrl" to uris[5].toString(),
                    "createdAt" to FieldValue.serverTimestamp(),
                    "rating" to 5.0,
                    "ratingCount" to 0
                )

                db.collection("users").document(uid).set(washerData)
                    .addOnSuccessListener {
                        setLoading(false)
                        showSuccessDialog()
                    }
                    .addOnFailureListener { e ->
                        setLoading(false)
                        Toast.makeText(this, "Error saving data: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
            }
            .addOnFailureListener { e ->
                setLoading(false)
                Toast.makeText(this, "Error uploading images: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun showSuccessDialog() {
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Application Received")
            .setMessage("Your application and documents have been submitted. An admin will review them shortly.")
            .setPositiveButton("OK") { _, _ ->
                auth.signOut()
                startActivity(Intent(this, LoginActivity::class.java))
                finishAffinity()
            }
            .setCancelable(false)
            .show()
    }

    private fun setLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnSubmitApplication.isEnabled = !isLoading
    }
}
