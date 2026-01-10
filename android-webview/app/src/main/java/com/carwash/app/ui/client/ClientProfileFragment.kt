package com.carwash.app.ui.client

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.Toast
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.carwash.app.LoginActivity
import com.carwash.app.databinding.FragmentClientProfileBinding
import com.google.firebase.auth.FirebaseAuth

import android.net.Uri
import androidx.activity.result.contract.ActivityResultContracts
import com.google.firebase.storage.FirebaseStorage

class ClientProfileFragment : Fragment() {

    private var _binding: FragmentClientProfileBinding? = null
    private val binding get() = _binding!!
    
    private var imageUri: Uri? = null
    
    private val getContent = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        uri?.let { uploadImage(it) }
    }
    
    private val takePicture = registerForActivityResult(ActivityResultContracts.TakePicture()) { success: Boolean ->
        if (success && imageUri != null) {
            uploadImage(imageUri!!)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentClientProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        loadUserProfile()
        setupClickListeners()
    }

    private fun loadUserProfile() {
        val user = FirebaseAuth.getInstance().currentUser ?: return
        binding.txtProfileName.text = user.displayName ?: "User"
        binding.txtProfileEmail.text = user.email

        // Load profile image
        com.google.firebase.firestore.FirebaseFirestore.getInstance()
            .collection("users").document(user.uid)
            .get()
            .addOnSuccessListener { document ->
                val photoUrl = document.getString("photoUrl")
                if (!photoUrl.isNullOrEmpty()) {
                    loadBitmapFromUrl(photoUrl)
                }
            }
    }

    private fun loadBitmapFromUrl(url: String) {
        Thread {
            try {
                val inputStream = java.net.URL(url).openStream()
                val bitmap = android.graphics.BitmapFactory.decodeStream(inputStream)
                activity?.runOnUiThread {
                    binding.imgProfile.setImageBitmap(bitmap)
                    binding.imgProfile.scaleType = android.widget.ImageView.ScaleType.CENTER_CROP
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    private fun showImageSourceDialog() {
        val options = arrayOf("Take Photo", "Choose from Gallery")
        androidx.appcompat.app.AlertDialog.Builder(requireContext())
            .setTitle("Change Profile Photo")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> {
                        // Camera
                        val photoFile = java.io.File(requireContext().externalCacheDir, "profile_photo.jpg")
                        imageUri = androidx.core.content.FileProvider.getUriForFile(
                            requireContext(),
                            "${requireContext().packageName}.fileprovider",
                            photoFile
                        )
                        takePicture.launch(imageUri)
                    }
                    1 -> {
                        // Gallery
                        getContent.launch("image/*")
                    }
                }
            }
            .show()
    }

    private fun uploadImage(uri: Uri) {
        val user = FirebaseAuth.getInstance().currentUser ?: return
        // Show loading state (progressBar not in layout, using toast instead)
        Toast.makeText(requireContext(), "Uploading photo...", Toast.LENGTH_SHORT).show()

        val storageRef = FirebaseStorage.getInstance().reference
            .child("profile_images/${user.uid}.jpg")

        storageRef.putFile(uri)
            .addOnSuccessListener {
                storageRef.downloadUrl.addOnSuccessListener { downloadUrl ->
                    updateUserProfile(downloadUrl.toString())
                }
            }
            .addOnFailureListener { e ->
                // binding.progressBar.visibility = android.view.View.GONE
                com.google.android.material.snackbar.Snackbar.make(binding.root, "Upload failed: ${e.message}", com.google.android.material.snackbar.Snackbar.LENGTH_SHORT).show()
            }
    }

    private fun updateUserProfile(photoUrl: String) {
        val user = FirebaseAuth.getInstance().currentUser ?: return
        
        // Update Firebase Auth Profile
        val profileUpdates = com.google.firebase.auth.UserProfileChangeRequest.Builder()
            .setPhotoUri(Uri.parse(photoUrl))
            .build()
            
        user.updateProfile(profileUpdates)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    // Update Firestore
                    com.google.firebase.firestore.FirebaseFirestore.getInstance()
                        .collection("users").document(user.uid)
                        .update("photoUrl", photoUrl)
                        .addOnSuccessListener {
                             // progressDialog.dismiss()
                             loadBitmapFromUrl(photoUrl) // Refresh UI
                             com.google.android.material.snackbar.Snackbar.make(binding.root, "Profile photo updated!", com.google.android.material.snackbar.Snackbar.LENGTH_SHORT).show()
                        }
                } else {
                     // binding.progressBar.visibility = android.view.View.GONE
                }
            }
    }

    private fun setupClickListeners() {
        binding.btnChangePhoto.setOnClickListener {
            showImageSourceDialog()
        }
        
        binding.btnEditProfile.setOnClickListener {
            startActivity(Intent(context, EditProfileActivity::class.java))
        }

        binding.btnMyGarage.setOnClickListener {
            // Switch to Garage Tab in Main Activity instead of opening a new Activity
            (activity as? ClientMainActivity)?.switchToGarageTab()
        }

        binding.btnReferral.setOnClickListener {
            startActivity(Intent(context, ReferralActivity::class.java))
        }

        binding.btnPayments.setOnClickListener {
            com.google.android.material.snackbar.Snackbar.make(binding.root, "Payment Methods coming soon", com.google.android.material.snackbar.Snackbar.LENGTH_SHORT).show()
        }

        binding.btnAddresses.setOnClickListener {
             startActivity(Intent(requireContext(), ClientAddressesActivity::class.java))
        }
        
        binding.btnPayments.setOnClickListener {
            startActivity(Intent(requireContext(), ClientPaymentsActivity::class.java))
        }

        binding.btnLanguage.setOnClickListener {
            val languages = arrayOf("English", "Español")
            androidx.appcompat.app.AlertDialog.Builder(requireContext())
                .setTitle("Select Language")
                .setItems(languages) { _, which ->
                    val selected = languages[which]
                    binding.txtCurrentLanguage.text = selected
                    // Save to prefs (mock implementation for visual confirmation)
                    val prefs = requireContext().getSharedPreferences("app_prefs", android.content.Context.MODE_PRIVATE)
                    prefs.edit().putString("language", selected).apply()
                    com.google.android.material.snackbar.Snackbar.make(binding.root, "Language set to $selected (Requires restart)", com.google.android.material.snackbar.Snackbar.LENGTH_SHORT).show()
                }
                .show()
        }

        binding.btnNotifications.setOnClickListener {
             startActivity(Intent(requireContext(), ClientNotificationSettingsActivity::class.java))
        }

        binding.btnSupport.setOnClickListener {
            startActivity(Intent(context, com.carwash.app.ui.support.SupportChatActivity::class.java))
        }

        binding.btnJoinTeam.setOnClickListener {
             androidx.appcompat.app.AlertDialog.Builder(requireContext())
                .setTitle("Join our Team")
                .setMessage("Do you want to apply to become a Washer? Our team will review your profile.")
                .setPositiveButton("Apply") { _, _ ->
                    val user = FirebaseAuth.getInstance().currentUser
                    if (user != null) {
                        val updates = hashMapOf<String, Any>("appliedForWasher" to true)
                        com.google.firebase.firestore.FirebaseFirestore.getInstance()
                            .collection("users").document(user.uid)
                            .update(updates)
                            .addOnSuccessListener {
                                com.google.android.material.snackbar.Snackbar.make(binding.root, "Application sent! We will contact you.", com.google.android.material.snackbar.Snackbar.LENGTH_LONG).show()
                            }
                    }
                }
                .setNegativeButton("Cancel", null)
                .show()
        }

        binding.btnLogout.setOnClickListener {
            FirebaseAuth.getInstance().signOut()
            startActivity(Intent(context, LoginActivity::class.java))
            activity?.finish()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
