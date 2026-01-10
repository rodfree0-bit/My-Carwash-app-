package com.carwash.app.ui.admin.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemSupportTicketBinding
import com.carwash.app.model.SupportTicket
import java.text.SimpleDateFormat
import java.util.*

class SupportTicketAdapter(
    private val onTicketClick: (SupportTicket) -> Unit
) : ListAdapter<SupportTicket, SupportTicketAdapter.ViewHolder>(TicketDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemSupportTicketBinding.inflate(
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
        private val binding: ItemSupportTicketBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(ticket: SupportTicket) {
            binding.tvUserName.text = ticket.clientName
            binding.tvSubject.text = ticket.subject
            binding.tvEmail.text = ticket.clientEmail
            binding.tvStatus.text = ticket.status
            
            // Format time
            val timeAgo = ticket.createdAt?.toDate()?.time?.let { getTimeAgo(it) } ?: "Unknown"
            binding.tvTime.text = timeAgo

            binding.root.setOnClickListener {
                onTicketClick(ticket)
            }
        }

        private fun getTimeAgo(timestamp: Long): String {
            val now = System.currentTimeMillis()
            val diff = now - timestamp
            
            return when {
                diff < 60000 -> "Hace un momento"
                diff < 3600000 -> "Hace ${diff / 60000} minutos"
                diff < 86400000 -> "Hace ${diff / 3600000} horas"
                else -> {
                    val sdf = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                    sdf.format(Date(timestamp))
                }
            }
        }
    }

    private class TicketDiffCallback : DiffUtil.ItemCallback<SupportTicket>() {
        override fun areItemsTheSame(oldItem: SupportTicket, newItem: SupportTicket): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: SupportTicket, newItem: SupportTicket): Boolean {
            return oldItem == newItem
        }
    }
}
