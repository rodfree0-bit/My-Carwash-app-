package com.carwash.app.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemPackageSelectionBinding
import com.carwash.app.model.ServicePackage

class PackageAdapter(
    private var vehicleType: String = "sedan",
    private val onClick: (ServicePackage) -> Unit
) : ListAdapter<ServicePackage, PackageAdapter.ViewHolder>(PackageDiffCallback()) {

    private var selectedPackageId: String? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemPackageSelectionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val pkg = getItem(position)
        holder.bind(pkg, vehicleType, pkg.id == selectedPackageId) {
            selectedPackageId = pkg.id
            notifyDataSetChanged()
            onClick(pkg)
        }
    }
    
    fun setVehicleType(type: String) {
        vehicleType = type
        notifyDataSetChanged()
    }

    fun setSelectedPackage(packageId: String?) {
        selectedPackageId = packageId
        notifyDataSetChanged()
    }

    class ViewHolder(private val binding: ItemPackageSelectionBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(pkg: ServicePackage, vehicleType: String, isSelected: Boolean, onClick: () -> Unit) {
            binding.txtName.text = pkg.name
            binding.txtDescription.text = pkg.description
            binding.txtDescription.maxLines = 10 // Show full description
            
            // Get price from map, default to sedan if specific type not found, or 0.0
            val price = pkg.price[vehicleType] ?: pkg.price["sedan"] ?: 0.0
            binding.txtPrice.text = java.text.NumberFormat.getCurrencyInstance(java.util.Locale.US).format(price)
            binding.txtDuration.text = pkg.duration // Assumes format "1h 30m" or generic string

            // Visual State
            if (isSelected) {
                binding.selectionBorder.visibility = android.view.View.VISIBLE
                binding.cardContainer.setCardBackgroundColor(android.graphics.Color.parseColor("#1E293B")) // Keep dark
                binding.txtName.setTextColor(android.graphics.Color.parseColor("#60A5FA")) // Blue title
                binding.txtPrice.setTextColor(android.graphics.Color.parseColor("#10B981")) // Green price
            } else {
                binding.selectionBorder.visibility = android.view.View.GONE
                binding.cardContainer.setCardBackgroundColor(android.graphics.Color.parseColor("#1E293B"))
                binding.txtName.setTextColor(android.graphics.Color.WHITE)
                binding.txtPrice.setTextColor(android.graphics.Color.parseColor("#60A5FA")) // Blue price default
            }

            binding.root.setOnClickListener { onClick() }
        }
    }

    class PackageDiffCallback : DiffUtil.ItemCallback<ServicePackage>() {
        override fun areItemsTheSame(oldItem: ServicePackage, newItem: ServicePackage) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: ServicePackage, newItem: ServicePackage) = oldItem == newItem
    }
}

