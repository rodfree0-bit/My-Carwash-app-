package com.carwash.app.ui.washer.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus

class WasherOrderAdapter(
    private val onClick: (Order) -> Unit
) : ListAdapter<Order, WasherOrderAdapter.ViewHolder>(OrderDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_washer_queue_order, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position), onClick)
    }

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvTime: TextView = itemView.findViewById(R.id.tvTime)
        private val tvClient: TextView = itemView.findViewById(R.id.tvClient)
        private val tvAddress: TextView = itemView.findViewById(R.id.tvAddress)
        private val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)

        fun bind(order: Order, onClick: (Order) -> Unit) {
            tvTime.text = order.time
            tvClient.text = order.clientName
            tvAddress.text = order.address
            tvStatus.text = order.status.replace("_", " ")

            itemView.setOnClickListener { onClick(order) }
        }
    }

    class OrderDiffCallback : DiffUtil.ItemCallback<Order>() {
        override fun areItemsTheSame(oldItem: Order, newItem: Order) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Order, newItem: Order) = oldItem == newItem
    }
}
