package com.carwash.app.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemAddonSelectionBinding
import com.carwash.app.model.ServiceAddon

class AddonAdapter(
    private val onSelectionChanged: (ServiceAddon, Boolean) -> Unit
) : ListAdapter<ServiceAddon, AddonAdapter.ViewHolder>(AddonDiffCallback()) {

    private val selectedIds = mutableSetOf<String>()
    private var vehicleType: String = "sedan"

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemAddonSelectionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val addon = getItem(position)
        holder.bind(addon, vehicleType, selectedIds.contains(addon.id)) { isSelected ->
            if (isSelected) {
                selectedIds.add(addon.id)
            } else {
                selectedIds.remove(addon.id)
            }
            onSelectionChanged(addon, isSelected)
        }
    }

    fun setVehicleType(type: String) {
        vehicleType = type
        notifyDataSetChanged()
    }

    fun clearSelections() {
        selectedIds.clear()
        notifyDataSetChanged()
    }

    class ViewHolder(private val binding: ItemAddonSelectionBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(addon: ServiceAddon, vehicleType: String, isSelected: Boolean, onSelectionChanged: (Boolean) -> Unit) {
            binding.addonName.text = addon.name
            // Description might be hidden in layout but set it anyway if visible
             binding.addonDescription.text = addon.description
            
            // Get price from map, default to sedan if specific type not found, or 0.0
            val price = addon.price[vehicleType] ?: addon.price["sedan"] ?: 0.0
            binding.addonPrice.text = "+${java.text.NumberFormat.getCurrencyInstance(java.util.Locale.US).format(price)}"
            
            // Visual State
            if (isSelected) {
                binding.selectionBorder.visibility = android.view.View.VISIBLE
                binding.addonCheckbox.isChecked = true
                binding.addonName.setTextColor(android.graphics.Color.parseColor("#60A5FA"))
            } else {
                binding.selectionBorder.visibility = android.view.View.GONE
                binding.addonCheckbox.isChecked = false
                binding.addonName.setTextColor(android.graphics.Color.WHITE)
            }

            binding.root.setOnClickListener {
                onSelectionChanged(!isSelected) // Toggle
            }
            
            binding.addonCheckbox.isClickable = false // Handle via root
        }
    }

    class AddonDiffCallback : DiffUtil.ItemCallback<ServiceAddon>() {
        override fun areItemsTheSame(oldItem: ServiceAddon, newItem: ServiceAddon) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: ServiceAddon, newItem: ServiceAddon) = oldItem == newItem
    }
}
