package com.carwash.app.ui.client

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.ActivityClientAddressesBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class ClientAddressesActivity : AppCompatActivity() {

    private lateinit var binding: ActivityClientAddressesBinding
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityClientAddressesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnBack.setOnClickListener { finish() }

        // Setup RecyclerView
        binding.rvAddresses.layoutManager = LinearLayoutManager(this)
        
        // Load user's saved address
        loadUserAddress()

        binding.btnAddAddress.setOnClickListener {
            Toast.makeText(this, "Address editing coming in next update", Toast.LENGTH_SHORT).show()
            // TODO: Open dialog or new activity to edit address
        }
    }

    private fun loadUserAddress() {
        val userId = auth.currentUser?.uid ?: return
        
        db.collection("users").document(userId).get()
            .addOnSuccessListener { document ->
                val address = document.getString("address")
                if (address != null) {
                    // For now, just show in toast - proper adapter implementation would go here
                    Toast.makeText(this, "Current address: $address", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(this, "No address saved yet", Toast.LENGTH_SHORT).show()
                }
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Error loading address: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }
}
