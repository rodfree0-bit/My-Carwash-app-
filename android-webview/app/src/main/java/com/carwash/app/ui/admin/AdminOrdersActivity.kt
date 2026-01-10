package com.carwash.app.ui.admin

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.databinding.ActivityAdminOrdersBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.carwash.app.model.Washer
import com.google.firebase.firestore.FirebaseFirestore

class AdminOrdersActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminOrdersBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var adapter: UnassignedOrdersAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminOrdersBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()
        
        binding.btnBack.setOnClickListener { finish() }

        adapter = UnassignedOrdersAdapter { order ->
            showAssignDialog(order)
        }
        binding.recyclerUnassignedOrders.layoutManager = LinearLayoutManager(this)
        binding.recyclerUnassignedOrders.adapter = adapter

        fetchUnassignedOrders()
    }

    private fun fetchUnassignedOrders() {
        db.collection("orders")
            .whereEqualTo("status", OrderStatus.NEW)
            .addSnapshotListener { snapshots, e ->
                if (e != null) {
                    Toast.makeText(this, getString(R.string.admin_orders_fetching_error), Toast.LENGTH_SHORT).show()
                    return@addSnapshotListener
                }

                if (snapshots != null) {
                    val orders = snapshots.toObjects(Order::class.java)
                    adapter.submitList(orders)
                }
            }
    }

    private fun showAssignDialog(order: Order) {
        db.collection("users")
            .whereEqualTo("role", "washer")
            .get()
            .addOnSuccessListener { result ->
                val washers = result.toObjects(Washer::class.java)
                val washerNames = washers.map { it.name.ifEmpty { it.id } }.toTypedArray()
                
                AlertDialog.Builder(this)
                    .setTitle(getString(R.string.admin_orders_assign_dialog_title))
                    .setItems(washerNames) { _, which ->
                        val selectedWasherId = washers[which].id
                        assignWasher(order, selectedWasherId)
                    }
                    .show()
            }
    }

    private fun assignWasher(order: Order, washerId: String) {
        db.collection("orders").document(order.id)
            .update(mapOf(
                "washerId" to washerId,
                "status" to OrderStatus.ASSIGNED
            ))
            .addOnSuccessListener {
                Toast.makeText(this, getString(R.string.admin_orders_assign_success), Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener {
                Toast.makeText(this, getString(R.string.admin_orders_assign_failure), Toast.LENGTH_SHORT).show()
            }
    }
}

class UnassignedOrdersAdapter(
    private val onAssignClick: (Order) -> Unit
) : ListAdapter<Order, UnassignedOrdersAdapter.ViewHolder>(OrderDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_2, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val order = getItem(position)
        holder.bind(order, onAssignClick)
    }

    class ViewHolder(itemView: android.view.View) : RecyclerView.ViewHolder(itemView) {
        private val text1: TextView = itemView.findViewById(android.R.id.text1)
        private val text2: TextView = itemView.findViewById(android.R.id.text2)

        fun bind(order: Order, onAssignClick: (Order) -> Unit) {
            text1.text = order.clientName
            val firstVehicle = order.vehicleConfigs.firstOrNull()
            val vehicleModel = firstVehicle?.vehicleModel ?: ""
            val packageName = firstVehicle?.packageName ?: ""
            text2.text = itemView.context.getString(R.string.admin_orders_unassigned_order_details, vehicleModel, packageName)
            
            text1.setTextColor(ContextCompat.getColor(itemView.context, R.color.white))
            text2.setTextColor(ContextCompat.getColor(itemView.context, R.color.text_secondary))
            
            itemView.setOnClickListener { onAssignClick(order) }
        }
    }
}

class OrderDiffCallback : DiffUtil.ItemCallback<Order>() {
    override fun areItemsTheSame(oldItem: Order, newItem: Order): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: Order, newItem: Order): Boolean {
        return oldItem == newItem
    }
}
