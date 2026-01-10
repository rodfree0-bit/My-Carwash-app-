package com.carwash.app.ui.client.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemOrderHistoryBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import java.text.NumberFormat
import java.util.*

class OrderHistoryAdapter(
    private val onViewDetails: (Order) -> Unit,
    private val onReorder: (Order) -> Unit
) : ListAdapter<Order, OrderHistoryAdapter.ViewHolder>(OrderDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemOrderHistoryBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(
        private val binding: ItemOrderHistoryBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(order: Order) {
            // Order number (last 6 characters)
            binding.tvOrderNumber.text = "#${order.id.takeLast(6).uppercase()}"
            
            // Status with color
            binding.tvOrderStatus.text = order.status
            binding.tvOrderStatus.setTextColor(getStatusColor(order.status))
            
            // Date and time
            val dateTimeText = "${order.date} at ${order.time}"
            binding.tvOrderDate.text = dateTimeText
            
            // Address
            binding.tvOrderAddress.text = order.address
            
            // Total
            val formatter = NumberFormat.getCurrencyInstance(Locale.US)
            binding.tvOrderTotal.text = formatter.format(order.price)
            
            // Show reorder button only for completed orders
            binding.btnReorder.visibility = if (order.status == OrderStatus.COMPLETED) {
                View.VISIBLE
            } else {
                View.GONE
            }
            
            // Click handlers
            binding.btnViewDetails.setOnClickListener {
                onViewDetails(order)
            }
            
            binding.btnReorder.setOnClickListener {
                onReorder(order)
            }
        }
        
        private fun getStatusColor(status: String): Int {
            return when (status) {
                OrderStatus.COMPLETED -> 0xFF10B981.toInt() // Green
                OrderStatus.CANCELLED -> 0xFFEF4444.toInt() // Red
                OrderStatus.NEW, OrderStatus.ASSIGNED -> 0xFF3B82F6.toInt() // Blue
                OrderStatus.EN_ROUTE, OrderStatus.ARRIVED, OrderStatus.IN_PROGRESS, OrderStatus.WASHING -> 0xFFF59E0B.toInt() // Amber
                else -> 0xFF94A3B8.toInt() // Gray
            }
        }
    }

    private class OrderDiffCallback : DiffUtil.ItemCallback<Order>() {
        override fun areItemsTheSame(oldItem: Order, newItem: Order): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Order, newItem: Order): Boolean {
            return oldItem == newItem
        }
    }
}
