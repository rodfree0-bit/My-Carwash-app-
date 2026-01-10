package com.carwash.app.ui.orders

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.model.Order

class OrdersAdapter(private val orders: List<Order>) :
    RecyclerView.Adapter<OrdersAdapter.OrderViewHolder>() {

    class OrderViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val vehicleText: TextView = view.findViewById(R.id.vehicleText)
        val priceText: TextView = view.findViewById(R.id.priceText)
        val statusBadge: TextView = view.findViewById(R.id.statusBadge)
        val dateText: TextView = view.findViewById(R.id.dateText)
        val addressText: TextView = view.findViewById(R.id.addressText)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_order, parent, false)
        return OrderViewHolder(view)
    }

    override fun onBindViewHolder(holder: OrderViewHolder, position: Int) {
        val order = orders[position]
        val firstVehicle = order.vehicleConfigs.firstOrNull()
        holder.vehicleText.text = firstVehicle?.vehicleModel ?: ""
        holder.priceText.text = "$${order.price}"
        holder.statusBadge.text = order.status
        holder.dateText.text = "${order.date} ${order.time}"
        holder.addressText.text = order.address
    }

    override fun getItemCount() = orders.size
}
