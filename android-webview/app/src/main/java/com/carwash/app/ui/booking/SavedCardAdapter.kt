package com.carwash.app.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemSavedCardBinding
import com.carwash.app.model.SavedCard

class SavedCardAdapter(
    private val onCardSelected: (SavedCard) -> Unit
) : ListAdapter<SavedCard, SavedCardAdapter.ViewHolder>(SavedCardDiffCallback()) {

    private var selectedCardId: String? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemSavedCardBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val card = getItem(position)
        holder.bind(card, card.id == selectedCardId) {
            selectedCardId = card.id
            notifyDataSetChanged()
            onCardSelected(card)
        }
    }
    
    class ViewHolder(private val binding: ItemSavedCardBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(card: SavedCard, isSelected: Boolean, onClick: () -> Unit) {
            binding.tvCardNumber.text = "•••• •••• •••• ${card.last4}"
            binding.tvExpiry.text = "${card.expiry.split("/")[0]}/${card.expiry.split("/")[1]}"
            binding.tvBrandName.text = card.brand.uppercase()
            
            binding.rbSelected.isChecked = isSelected
            
            if (isSelected) {
                binding.selectionBorder.visibility = android.view.View.VISIBLE
            } else {
                binding.selectionBorder.visibility = android.view.View.GONE
            }
            
            binding.root.setOnClickListener { onClick() }
        }
    }

    class SavedCardDiffCallback : DiffUtil.ItemCallback<SavedCard>() {
        override fun areItemsTheSame(oldItem: SavedCard, newItem: SavedCard) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: SavedCard, newItem: SavedCard) = oldItem == newItem
    }
}
