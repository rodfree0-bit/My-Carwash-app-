package com.carwash.app.ui.client.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.model.Vehicle

class GarageVehicleAdapter(
    private val onEdit: (Vehicle) -> Unit,
    private val onDelete: (Vehicle) -> Unit,
    private val onSetDefault: (Vehicle) -> Unit
) : ListAdapter<Vehicle, GarageVehicleAdapter.VehicleViewHolder>(VehicleDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VehicleViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_vehicle_card, parent, false)
        return VehicleViewHolder(view)
    }

    override fun onBindViewHolder(holder: VehicleViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class VehicleViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvVehicleName: TextView = itemView.findViewById(R.id.tvVehicleName)
        private val tvVehicleDetails: TextView = itemView.findViewById(R.id.tvVehicleDetails)
        private val btnEdit: ImageButton = itemView.findViewById(R.id.btnEdit)
        private val btnDelete: ImageButton = itemView.findViewById(R.id.btnDelete)

        fun bind(vehicle: Vehicle) {
            tvVehicleName.text = "${vehicle.make} ${vehicle.model}"
            tvVehicleDetails.text = "${vehicle.type} • ${vehicle.color}"
            
            if (vehicle.plate.isNotEmpty()) {
                tvVehicleDetails.text = "${tvVehicleDetails.text} • ${vehicle.plate}"
            }

            btnEdit.setOnClickListener { onEdit(vehicle) }
            btnDelete.setOnClickListener { onDelete(vehicle) }
            
            itemView.setOnLongClickListener {
                onSetDefault(vehicle)
                true
            }
        }
    }

    class VehicleDiffCallback : DiffUtil.ItemCallback<Vehicle>() {
        override fun areItemsTheSame(oldItem: Vehicle, newItem: Vehicle): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Vehicle, newItem: Vehicle): Boolean {
            return oldItem == newItem
        }
    }
}
