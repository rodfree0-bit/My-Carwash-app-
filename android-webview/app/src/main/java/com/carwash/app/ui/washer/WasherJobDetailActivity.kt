package com.carwash.app.ui.washer

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityWasherJobDetailBinding
import com.carwash.app.model.Order
import com.google.firebase.firestore.FirebaseFirestore

class WasherJobDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityWasherJobDetailBinding
    private val db = FirebaseFirestore.getInstance()
    
    private lateinit var orderId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWasherJobDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId") ?: run {
            Toast.makeText(this, "Order ID not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        loadOrderDetails()
    }

    private fun loadOrderDetails() {
        db.collection("orders").document(orderId)
            .get()
            .addOnSuccessListener { snapshot ->
                val order = snapshot.toObject(Order::class.java)?.copy(id = snapshot.id)
                if (order != null) {
                    Toast.makeText(this, "Order loaded: ${order.clientName}", Toast.LENGTH_SHORT).show()
                }
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error loading order", Toast.LENGTH_SHORT).show()
                finish()
            }
    }
}
