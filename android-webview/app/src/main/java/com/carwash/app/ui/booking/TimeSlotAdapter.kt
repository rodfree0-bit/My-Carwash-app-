package com.carwash.app.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemTimeSlotBinding

class TimeSlotAdapter(
    private val onTimeSelected: (String) -> Unit
) : ListAdapter<String, TimeSlotAdapter.ViewHolder>(TimeDiffCallback()) {

    private var selectedPosition = -1

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemTimeSlotBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val time = getItem(position)
        holder.bind(time, position == selectedPosition) {
            val oldPosition = selectedPosition
            selectedPosition = position
            notifyItemChanged(oldPosition)
            notifyItemChanged(selectedPosition)
            onTimeSelected(time)
        }
    }

    class ViewHolder(private val binding: ItemTimeSlotBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(time: String, isSelected: Boolean, onClick: () -> Unit) {
            binding.txtTime.text = time
            
            if (isSelected) {
                binding.cardContainer.setCardBackgroundColor(android.graphics.Color.parseColor("#3B82F6")) // Blue 500
                binding.cardContainer.strokeColor = android.graphics.Color.parseColor("#3B82F6")
            } else {
                binding.cardContainer.setCardBackgroundColor(android.graphics.Color.parseColor("#1E293B")) // Slate 800
                binding.cardContainer.strokeColor = android.graphics.Color.parseColor("#334155") // Slate 700
            }

            binding.root.setOnClickListener { onClick() }
        }
    }

    class TimeDiffCallback : DiffUtil.ItemCallback<String>() {
        override fun areItemsTheSame(oldItem: String, newItem: String) = oldItem == newItem
        override fun areContentsTheSame(oldItem: String, newItem: String) = oldItem == newItem
    }
}
