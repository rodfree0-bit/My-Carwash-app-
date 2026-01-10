package com.carwash.app.ui.client

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityOrderTrackingBinding
import com.carwash.app.model.Order
import com.google.firebase.firestore.FirebaseFirestore

class OrderTrackingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityOrderTrackingBinding
    private val db = FirebaseFirestore.getInstance()
    
    private lateinit var orderId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOrderTrackingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId") ?: run {
            Toast.makeText(this, "Order ID not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        loadOrder()
    }

    private fun loadOrder() {
        db.collection("orders").document(orderId)
            .addSnapshotListener { snapshot, e ->
                if (e != null || snapshot == null || !snapshot.exists()) {
                    Toast.makeText(this, "Error loading order", Toast.LENGTH_SHORT).show()
                    return@addSnapshotListener
                }

                val order = snapshot.toObject(Order::class.java)?.copy(id = snapshot.id)
                if (order != null) {
                    Toast.makeText(this, "Order status: ${order.status}", Toast.LENGTH_SHORT).show()
                }
            }
    }
}
