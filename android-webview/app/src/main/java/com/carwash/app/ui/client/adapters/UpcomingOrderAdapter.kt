package com.carwash.app.ui.client.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemUpcomingOrderBinding
import com.carwash.app.model.Order

class UpcomingOrderAdapter(
    private val onOrderClick: (Order) -> Unit
) : ListAdapter<Order, UpcomingOrderAdapter.ViewHolder>(OrderDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemUpcomingOrderBinding.inflate(
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
        private val binding: ItemUpcomingOrderBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(order: Order) {
            binding.tvOrderDate.text = order.date
            binding.tvOrderTime.text = order.time
            
            val vehiclesCount = order.vehicleConfigs.size
            binding.tvVehicleCount.text = "$vehiclesCount vehicle${if (vehiclesCount != 1) "s" else ""}"
            
            // Get first package name
            val firstPackage = order.vehicleConfigs.firstOrNull()?.packageName
            binding.tvPackageName.text = firstPackage ?: "Service"
            
            binding.tvOrderStatus.text = order.status
            
            binding.root.setOnClickListener {
                onOrderClick(order)
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
