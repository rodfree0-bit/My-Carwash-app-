package com.carwash.app.ui.booking

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityBookingConfirmationBinding
import com.carwash.app.model.Order
import com.carwash.app.ui.client.ClientMainActivity
import com.carwash.app.ui.client.OrderTrackingActivity
import com.google.firebase.firestore.FirebaseFirestore
import java.text.NumberFormat
import java.util.*

class BookingConfirmationActivity : AppCompatActivity() {

    private lateinit var binding: ActivityBookingConfirmationBinding
    private val db = FirebaseFirestore.getInstance()
    private var orderId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBookingConfirmationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId")

        if (orderId == null) {
            Toast.makeText(this, "Error: Order ID not found", Toast.LENGTH_SHORT).show()
            navigateToHome()
            return
        }

        setupBackPressHandler()
        setupButtons()
        loadOrderDetails()
    }

    private fun setupBackPressHandler() {
        onBackPressedDispatcher.addCallback(this, object : androidx.activity.OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                navigateToHome()
            }
        })
    }

    private fun setupButtons() {
        binding.btnTrackOrder.setOnClickListener {
            val intent = Intent(this, OrderTrackingActivity::class.java)
            intent.putExtra("orderId", orderId)
            startActivity(intent)
            finish()
        }

        binding.btnBackToHome.setOnClickListener {
            navigateToHome()
        }
    }

    private fun loadOrderDetails() {
        orderId?.let { id ->
            db.collection("orders").document(id)
                .get()
                .addOnSuccessListener { document ->
                    if (document.exists()) {
                        val order = document.toObject(Order::class.java)?.copy(id = document.id)
                        if (order != null) {
                            displayOrderDetails(order)
                        }
                    } else {
                        Toast.makeText(this, "Order not found", Toast.LENGTH_SHORT).show()
                        navigateToHome()
                    }
                }
                .addOnFailureListener { e ->
                    Toast.makeText(this, "Error loading order: ${e.message}", Toast.LENGTH_SHORT).show()
                    navigateToHome()
                }
        }
    }

    private fun displayOrderDetails(order: Order) {
        // Display order number (last 6 characters of ID)
        val orderNumber = "#${order.id.takeLast(6).uppercase()}"
        binding.tvOrderNumber.text = orderNumber

        // Display scheduled date and time
        val dateTimeText = "${order.date} at ${order.time}"
        binding.tvScheduledDateTime.text = dateTimeText

        // Display address
        binding.tvAddress.text = order.address

        // Display vehicles count
        val vehiclesCount = order.vehicleConfigs.size
        binding.tvVehiclesCount.text = "$vehiclesCount vehicle${if (vehiclesCount != 1) "s" else ""}"

        // Display total paid
        val formatter = NumberFormat.getCurrencyInstance(Locale.US)
        binding.tvTotalPaid.text = formatter.format(order.price)
    }

    private fun navigateToHome() {
        val intent = Intent(this, ClientMainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
        finish()
    }
}
