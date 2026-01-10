package com.carwash.app.ui.washer.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemWasherAvailableOrderBinding
import com.carwash.app.model.Order
import java.text.NumberFormat
import java.util.*

class WasherAvailableOrderAdapter(
    private val onOrderClick: (Order) -> Unit
) : ListAdapter<Order, WasherAvailableOrderAdapter.ViewHolder>(OrderDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemWasherAvailableOrderBinding.inflate(
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
        private val binding: ItemWasherAvailableOrderBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(order: Order) {
            binding.tvOrderId.text = "#${order.id.takeLast(6).uppercase()}"
            binding.tvAddress.text = order.address
            binding.tvDateTime.text = "${order.date} • ${order.time}"
            binding.tvVehicleCount.text = "${order.vehicleConfigs.size} vehículo(s)"
            
            val formatter = NumberFormat.getCurrencyInstance(Locale.US)
            binding.tvTotal.text = formatter.format(order.price)

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
