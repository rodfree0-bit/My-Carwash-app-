package com.carwash.app.ui.client.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R

class ChatAdapter(
    private val messages: List<ChatMessage>,
    private val currentUserId: String
) : RecyclerView.Adapter<ChatAdapter.ViewHolder>() {

    class ViewHolder(val binding: com.carwash.app.databinding.ItemChatMessageBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = com.carwash.app.databinding.ItemChatMessageBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val message = messages[position]

        // Check if message is from current user
        val isMe = message.senderId == currentUserId

        if (isMe) {
            holder.binding.layoutSent.visibility = View.VISIBLE
            holder.binding.layoutReceived.visibility = View.GONE
            holder.binding.tvSent.text = message.text
            // Optional: Format time
             holder.binding.tvSentTime.text = java.text.SimpleDateFormat("hh:mm a", java.util.Locale.getDefault()).format(java.util.Date(message.timestamp))
        } else {
            holder.binding.layoutSent.visibility = View.GONE
            holder.binding.layoutReceived.visibility = View.VISIBLE
            holder.binding.tvReceived.text = message.text
             holder.binding.tvReceivedTime.text = java.text.SimpleDateFormat("hh:mm a", java.util.Locale.getDefault()).format(java.util.Date(message.timestamp))
        }
    }

    override fun getItemCount() = messages.size
}
