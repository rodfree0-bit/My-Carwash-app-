package com.carwash.app.ui.washer

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.carwash.app.databinding.ActivityPhotoCaptureBinding
import com.google.firebase.storage.FirebaseStorage
import java.io.File

class PhotoCaptureActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPhotoCaptureBinding
    private val storage = FirebaseStorage.getInstance()
    
    private var orderId: String = ""
    private var photoType: String = "" // "before" or "after"
    
    private val photoNames = listOf("front", "leftSide", "rightSide", "back", "interiorFront", "interiorBack")
    private val photoUris = mutableMapOf<String, Uri>()
    private var currentPhotoIndex = 0
    private var currentPhotoFile: File? = null

    private val cameraPermission = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) {
            takePhoto()
        } else {
            Toast.makeText(this, "Camera permission required", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private val takePicture = registerForActivityResult(ActivityResultContracts.TakePicture()) { success ->
        if (success && currentPhotoFile != null) {
            val photoName = photoNames[currentPhotoIndex]
            photoUris[photoName] = Uri.fromFile(currentPhotoFile)
            
            currentPhotoIndex++
            updateProgress()
            
            if (currentPhotoIndex < photoNames.size) {
                takePhoto()
            } else {
                uploadPhotos()
            }
        } else {
            Toast.makeText(this, "Photo capture failed", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPhotoCaptureBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId") ?: run {
            Toast.makeText(this, "Order ID not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        photoType = intent.getStringExtra("photoType") ?: "before"

        binding.tvTitle.text = if (photoType == "before") "BEFORE Photos" else "AFTER Photos"
        binding.tvInstructions.text = "Take 6 photos: Front, Left, Right, Back, Interior Front, Interior Back"

        updateProgress()

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            takePhoto()
        } else {
            cameraPermission.launch(Manifest.permission.CAMERA)
        }
    }

    private fun updateProgress() {
        binding.tvProgress.text = "${currentPhotoIndex + 1} / ${photoNames.size}"
        binding.progressBar.progress = ((currentPhotoIndex.toFloat() / photoNames.size) * 100).toInt()
        
        if (currentPhotoIndex < photoNames.size) {
            binding.tvCurrentPhoto.text = "Taking: ${photoNames[currentPhotoIndex].replace(Regex("([A-Z])"), " $1").trim()}"
        } else {
            binding.tvCurrentPhoto.text = "All photos captured! Uploading..."
        }
    }

    private fun takePhoto() {
        val photoFile = File(externalCacheDir, "photo_${System.currentTimeMillis()}.jpg")
        currentPhotoFile = photoFile
        
        val photoUri = FileProvider.getUriForFile(
            this,
            "${packageName}.fileprovider",
            photoFile
        )
        
        takePicture.launch(photoUri)
    }

    private fun uploadPhotos() {
        binding.tvCurrentPhoto.text = "Uploading photos..."
        var uploadedCount = 0
        val totalPhotos = photoUris.size

        photoUris.forEach { (name, uri) ->
            val storageRef = storage.reference
                .child("orders/$orderId/$photoType/$name.jpg")

            storageRef.putFile(uri)
                .addOnSuccessListener {
                    storageRef.downloadUrl.addOnSuccessListener { downloadUri ->
                        uploadedCount++
                        
                        if (uploadedCount == totalPhotos) {
                            // All photos uploaded
                            setResult(RESULT_OK)
                            Toast.makeText(this, "All photos uploaded successfully!", Toast.LENGTH_SHORT).show()
                            finish()
                        }
                    }
                }
                .addOnFailureListener {
                    Toast.makeText(this, "Upload failed: ${it.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
