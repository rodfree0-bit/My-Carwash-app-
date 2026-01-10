/* TEMPORARILY COMMENTED OUT - Needs refactoring to use ServicePackage model instead of Package
package com.carwash.app.ui.admin

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.R
import com.carwash.app.databinding.ActivityAdminOrderDetailsBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.google.firebase.firestore.FirebaseFirestore
import java.text.NumberFormat
import java.util.Locale

class AdminOrderDetailsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminOrderDetailsBinding
    private val db = FirebaseFirestore.getInstance()
    private var orderId: String? = null
    private var currentOrder: Order? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminOrderDetailsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId")

        if (orderId == null) {
            Toast.makeText(this, "Error: Order ID not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        setupToolbar()
        loadOrderDetails()
        setupButtons()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun loadOrderDetails() {
        db.collection("orders").document(orderId!!)
            .get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    currentOrder = document.toObject(Order::class.java)
                    currentOrder?.let { order ->
                        updateUI(order)
                    }
                } else {
                    Toast.makeText(this, "Order not found", Toast.LENGTH_SHORT).show()
                    finish()
                }
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error loading order: ${it.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun updateUI(order: Order) {
        // Status
        binding.tvStatus.text = order.status
        // Update status color based on status (Generic approach)
        val statusColor = when (order.status) {
            OrderStatus.COMPLETED -> "#10B981" // Green
            OrderStatus.CANCELLED -> "#EF4444" // Red
            OrderStatus.EN_ROUTE, OrderStatus.ARRIVED, OrderStatus.WASHING -> "#3B82F6" // Blue
            else -> "#F59E0B" // Amber (NEW, ASSIGNED)
        }
        binding.tvStatus.setTextColor(android.graphics.Color.parseColor(statusColor))

        // Client Info
        binding.tvClientName.text = order.clientName
        // binding.tvClientEmail.text = order.clientEmail // clientEmail not in Order model

        // Schedule
        binding.tvScheduledDate.text = "${order.date} - ${order.time}"
        binding.tvAddress.text = order.address

        // Price
        binding.tvTotalPrice.text = NumberFormat.getCurrencyInstance(Locale.US).format(order.price)
        // Tip Amount
        val tip = order.tip
        if (tip > 0) {
            binding.tvTipAmount.text = "Includes ${NumberFormat.getCurrencyInstance(Locale.US).format(tip)} Tip"
            binding.tvTipAmount.visibility = android.view.View.VISIBLE
        } else {
             binding.tvTipAmount.visibility = android.view.View.GONE
        }
        
        // Washer Assignment UI
        if (order.washerId.isNotEmpty()) {
            binding.btnAssignWasher.text = "Assigned: ${order.washerName}"
            binding.btnAssignWasher.setBackgroundColor(android.graphics.Color.parseColor("#10B981")) // Green
            binding.btnAssignWasher.icon = ContextCompat.getDrawable(this, R.drawable.ic_check)
        } else {
            binding.btnAssignWasher.text = "Assign Team Member"
            binding.btnAssignWasher.setBackgroundColor(android.graphics.Color.parseColor("#8B5CF6")) // Purple
            binding.btnAssignWasher.icon = ContextCompat.getDrawable(this, R.drawable.ic_person)
        }

        setupVehicleList(order.vehicleConfigs)
    }
    
    private fun setupVehicleList(vehicleConfigs: List<com.carwash.app.model.VehicleServiceConfig>?) {
        if (vehicleConfigs == null) return
        
        binding.rvOrderVehicles.layoutManager = LinearLayoutManager(this)
        // Note: AdminOrderVehiclesAdapter needs to be updated to accept VehicleServiceConfig list
        // For now, we'll comment this out to allow compilation
        // binding.rvOrderVehicles.adapter = AdminOrderVehiclesAdapter(vehicleConfigs)
    }

    private fun setupButtons() {
        binding.btnChangeStatus.setOnClickListener {
            showChangeStatusDialog()
        }

        binding.btnAssignWasher.setOnClickListener {
             showAssignWasherDialog()
        }
    }

    private fun showAssignWasherDialog() {
        db.collection("users")
            .whereEqualTo("role", "washer")
            .get()
            .addOnSuccessListener { result ->
                val washers = result.mapNotNull { it.toObject(com.carwash.app.model.User::class.java) }
                
                if (washers.isEmpty()) {
                    Toast.makeText(this, "No washers available", Toast.LENGTH_SHORT).show()
                    return@addOnSuccessListener
                }

                val options = washers.map { "${it.name} (${if (it.status == "Online" || it.status == "Active") "Online" else "Offline"})" }.toTypedArray()

                AlertDialog.Builder(this)
                    .setTitle("Assign Washer")
                    .setItems(options) { _, which ->
                        val selectedWasher = washers[which]
                        confirmAssignment(selectedWasher)
                    }
                    .setNegativeButton("Cancel", null)
                    .show()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error fetching washers", Toast.LENGTH_SHORT).show()
            }
    }

    private fun confirmAssignment(washer: com.carwash.app.model.User) {
        val updates = mapOf(
            "washerId" to washer.id,
            "washerName" to washer.name,
            "status" to OrderStatus.ASSIGNED,
            "assignedAt" to com.google.firebase.Timestamp.now()
        )

        db.collection("orders").document(orderId!!)
            .update(updates)
            .addOnSuccessListener {
                Toast.makeText(this, "Assigned to ${washer.name}", Toast.LENGTH_SHORT).show()
                loadOrderDetails() // Refresh UI
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Error assigning: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        
        binding.btnViewProfile.setOnClickListener {
             Toast.makeText(this, "Client Profile View coming soon", Toast.LENGTH_SHORT).show()
             // Logic to open Client Profile Activity (Generic)
        }
    }

    private fun showChangeStatusDialog() {
        val statuses = OrderStatus.values().map { it.name }.toTypedArray()
        
        AlertDialog.Builder(this)
            .setTitle("Change Order Status")
            .setItems(statuses) { _, which ->
                val newStatus = OrderStatus.values()[which]
                updateOrderStatus(newStatus)
            }
            .show()
    }

    private fun updateOrderStatus(status: OrderStatus) {
        db.collection("orders").document(orderId!!)
            .update("status", status)
            .addOnSuccessListener {
                Toast.makeText(this, "Status updated to ${status.name}", Toast.LENGTH_SHORT).show()
                loadOrderDetails() // Refresh UI
            }
            .addOnFailureListener {
                Toast.makeText(this, "Failed to update status", Toast.LENGTH_SHORT).show()
            }
    }
    
    // Simple Inner Adapter class for Vehicles
    inner class AdminOrderVehiclesAdapter(private val vehicles: List<Map<String, Any>>) : 
        androidx.recyclerview.widget.RecyclerView.Adapter<AdminOrderVehiclesAdapter.ViewHolder>() {
            
        inner class ViewHolder(val view: android.view.View) : androidx.recyclerview.widget.RecyclerView.ViewHolder(view) {
             val tvModel: android.widget.TextView = view.findViewById(R.id.tvVehicleModel)
             val tvPackage: android.widget.TextView = view.findViewById(R.id.tvPackageName)
             val tvPrice: android.widget.TextView = view.findViewById(R.id.tvPrice)
        }

        override fun onCreateViewHolder(parent: android.view.ViewGroup, viewType: Int): ViewHolder {
            val view = android.view.LayoutInflater.from(parent.context)
                .inflate(R.layout.item_admin_order_vehicle, parent, false)
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val vehicle = vehicles[position]
            val model = vehicle["vehicleModel"] as? String ?: "Unknown Vehicle"
            val packageName = vehicle["packageName"] as? String ?: "No Package"
            val price = vehicle["packagePrice"] as? Double ?: 0.0
            val addonsPrice = vehicle["addonsPrice"] as? Double ?: 0.0
            val totalVehiclePrice = price + addonsPrice

            holder.tvModel.text = model
            holder.tvPackage.text = packageName
            holder.tvPrice.text = NumberFormat.getCurrencyInstance(Locale.US).format(totalVehiclePrice)
        }

        override fun getItemCount() = vehicles.size
    }
}

*/