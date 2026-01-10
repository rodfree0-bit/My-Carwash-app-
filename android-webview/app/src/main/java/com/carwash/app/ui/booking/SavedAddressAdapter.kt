package com.carwash.app.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemSavedAddressBinding
import com.carwash.app.model.SavedAddress

class SavedAddressAdapter(
    private val onAddressSelected: (SavedAddress) -> Unit
) : ListAdapter<SavedAddress, SavedAddressAdapter.ViewHolder>(SavedAddressDiffCallback()) {

    private var selectedAddressId: String? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemSavedAddressBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val address = getItem(position)
        holder.bind(address, address.id == selectedAddressId) {
            selectedAddressId = address.id
            notifyDataSetChanged()
            onAddressSelected(address)
        }
    }
    
    class ViewHolder(private val binding: ItemSavedAddressBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(address: SavedAddress, isSelected: Boolean, onClick: () -> Unit) {
            binding.tvLabel.text = address.label.ifBlank { "Saved Address" }
            binding.tvAddress.text = address.address
            
            binding.rbSelected.isChecked = isSelected
            
            if (isSelected) {
                binding.tvLabel.setTextColor(android.graphics.Color.parseColor("#60A5FA"))
                binding.iconType.setColorFilter(android.graphics.Color.parseColor("#60A5FA"))
            } else {
                binding.tvLabel.setTextColor(android.graphics.Color.WHITE)
                binding.iconType.setColorFilter(android.graphics.Color.parseColor("#94A3B8"))
            }
            
            binding.root.setOnClickListener { onClick() }
        }
    }

    class SavedAddressDiffCallback : DiffUtil.ItemCallback<SavedAddress>() {
        override fun areItemsTheSame(oldItem: SavedAddress, newItem: SavedAddress) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: SavedAddress, newItem: SavedAddress) = oldItem == newItem
    }
}
