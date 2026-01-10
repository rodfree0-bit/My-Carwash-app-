package com.carwash.app.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemVehicleSelectionBinding
import com.carwash.app.model.SavedVehicle

class VehicleSelectionAdapter(
    private val onSelectionChanged: (SavedVehicle, Boolean) -> Unit
) : ListAdapter<SavedVehicle, VehicleSelectionAdapter.ViewHolder>(VehicleDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemVehicleSelectionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    private var selectedIds: Set<String> = emptySet()

    fun updateSelection(newSelectedIds: Set<String>) {
        this.selectedIds = newSelectedIds
        notifyDataSetChanged()
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val vehicle = getItem(position)
        holder.bind(vehicle, selectedIds.contains(vehicle.id), onSelectionChanged)
    }

    class ViewHolder(private val binding: ItemVehicleSelectionBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(vehicle: SavedVehicle, isSelected: Boolean, onSelectionChanged: (SavedVehicle, Boolean) -> Unit) {
            // SavedVehicle has make and model separate. We join them for display.
            binding.vehicleModel.text = "${vehicle.make} ${vehicle.model}"
            binding.vehicleType.text = vehicle.type.replaceFirstChar { it.uppercase() }
            binding.vehiclePlate.text = vehicle.plate

            // Visual State
            if (isSelected) {
                binding.selectionBorder.visibility = android.view.View.VISIBLE
                binding.vehicleCheckbox.isChecked = true
                binding.vehicleModel.setTextColor(android.graphics.Color.parseColor("#60A5FA")) // Blue 400
                binding.iconVehicle.setColorFilter(android.graphics.Color.parseColor("#60A5FA"))
            } else {
                binding.selectionBorder.visibility = android.view.View.GONE
                binding.vehicleCheckbox.isChecked = false
                binding.vehicleModel.setTextColor(android.graphics.Color.WHITE)
                binding.iconVehicle.setColorFilter(android.graphics.Color.parseColor("#94A3B8")) // Slate 400
            }

            // Click Listener (Toggle)
            binding.root.setOnClickListener {
                onSelectionChanged(vehicle, !isSelected)
            }
            
            // Disable direct checkbox clicking to avoid conflicts, handle via root click
            binding.vehicleCheckbox.isClickable = false
        }
    }

    class VehicleDiffCallback : DiffUtil.ItemCallback<SavedVehicle>() {
        override fun areItemsTheSame(oldItem: SavedVehicle, newItem: SavedVehicle): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: SavedVehicle, newItem: SavedVehicle): Boolean {
            return oldItem == newItem
        }
    }
}
