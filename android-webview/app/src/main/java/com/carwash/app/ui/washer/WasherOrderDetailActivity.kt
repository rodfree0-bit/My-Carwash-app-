package com.carwash.app.ui.washer

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityWasherOrderDetailBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class WasherOrderDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityWasherOrderDetailBinding
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    
    private lateinit var orderId: String
    private var currentOrder: Order? = null
    private var isAvailable: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWasherOrderDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId") ?: run {
            Toast.makeText(this, "Order ID not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        isAvailable = intent.getBooleanExtra("isAvailable", false)

        setupButtons()
        loadOrderDetails()
    }

    private fun setupButtons() {
        binding.btnAcceptOrder.setOnClickListener {
            acceptOrder()
        }

        binding.btnStartRoute.setOnClickListener {
            updateOrderStatus(OrderStatus.EN_ROUTE)
        }

        binding.btnArrived.setOnClickListener {
            updateOrderStatus(OrderStatus.ARRIVED)
        }

        binding.btnStartWashing.setOnClickListener {
            updateOrderStatus(OrderStatus.WASHING)
        }

        binding.btnComplete.setOnClickListener {
            updateOrderStatus(OrderStatus.COMPLETED)
        }

        binding.btnNoShow.setOnClickListener {
            updateOrderStatus(OrderStatus.CANCELLED)
        }
    }

    private fun loadOrderDetails() {
        db.collection("orders").document(orderId)
            .addSnapshotListener { snapshot, e ->
                if (e != null || snapshot == null || !snapshot.exists()) {
                    Toast.makeText(this, "Error loading order", Toast.LENGTH_SHORT).show()
                    return@addSnapshotListener
                }

                val order = snapshot.toObject(Order::class.java)?.copy(id = snapshot.id)
                if (order != null) {
                    currentOrder = order
                    displayOrderDetails(order)
                    updateButtonsVisibility(order.status)
                }
            }
    }

    private fun displayOrderDetails(order: Order) {
        binding.tvOrderNumber.text = "#${order.id.takeLast(6).uppercase()}"
        binding.tvStatus.text = order.status.replace("_", " ")
        binding.tvClientName.text = order.clientName
        binding.tvDateTime.text = "${order.date} • ${order.time}"
        binding.tvAddress.text = order.address
        binding.tvVehiclesServices.text = "${order.vehicleConfigs.size} vehicle(s)"
    }

    private fun updateButtonsVisibility(status: String) {
        binding.btnAcceptOrder.visibility = if (status == OrderStatus.NEW && isAvailable) View.VISIBLE else View.GONE
        binding.btnStartRoute.visibility = if (status == OrderStatus.ASSIGNED) View.VISIBLE else View.GONE
        binding.btnArrived.visibility = if (status == OrderStatus.EN_ROUTE) View.VISIBLE else View.GONE
        binding.btnStartWashing.visibility = if (status == OrderStatus.ARRIVED) View.VISIBLE else View.GONE
        binding.btnComplete.visibility = if (status == OrderStatus.WASHING) View.VISIBLE else View.GONE
        binding.btnNoShow.visibility = if (status in listOf(OrderStatus.ASSIGNED, OrderStatus.EN_ROUTE, OrderStatus.ARRIVED)) View.VISIBLE else View.GONE
    }

    private fun acceptOrder() {
        val washerId = auth.currentUser?.uid ?: return

        db.collection("orders").document(orderId)
            .update(mapOf(
                "washerId" to washerId,
                "status" to OrderStatus.ASSIGNED
            ))
            .addOnSuccessListener {
                Toast.makeText(this, "Order accepted", Toast.LENGTH_SHORT).show()
                isAvailable = false
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error accepting order", Toast.LENGTH_SHORT).show()
            }
    }

    private fun updateOrderStatus(newStatus: String) {
        db.collection("orders").document(orderId)
            .update("status", newStatus)
            .addOnSuccessListener {
                Toast.makeText(this, "Status updated", Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error updating status", Toast.LENGTH_SHORT).show()
            }
    }
}
