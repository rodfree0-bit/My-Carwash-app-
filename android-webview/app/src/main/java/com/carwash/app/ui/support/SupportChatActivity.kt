package com.carwash.app.ui.support

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.databinding.ActivitySupportChatBinding
import java.text.SimpleDateFormat
import java.util.*

class SupportChatActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySupportChatBinding
    private val messages = mutableListOf<ChatMessage>()
    private lateinit var chatAdapter: ChatAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySupportChatBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbar.setNavigationOnClickListener { finish() }

        // Setup Send Icon
        binding.btnSend.setImageResource(R.drawable.ic_send_blue)

        setupRecyclerView()
        
        binding.btnSend.setOnClickListener {
            val text = binding.etMessage.text.toString().trim()
            if (text.isNotEmpty()) {
                sendMessage(text)
                binding.etMessage.text.clear()
            }
        }

        // Add welcome message
        messages.add(ChatMessage("Hello! How can we help you today?", false, System.currentTimeMillis()))
        chatAdapter.notifyDataSetChanged()
    }

    private fun setupRecyclerView() {
        chatAdapter = ChatAdapter(messages)
        binding.chatRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@SupportChatActivity)
            adapter = chatAdapter
        }
    }

    private fun sendMessage(text: String) {
        messages.add(ChatMessage(text, true, System.currentTimeMillis()))
        chatAdapter.notifyItemInserted(messages.size - 1)
        binding.chatRecyclerView.smoothScrollToPosition(messages.size - 1)
        
        // Simulating reply
        binding.root.postDelayed({
            messages.add(ChatMessage("Thank you for your message. An agent will be with you shortly.", false, System.currentTimeMillis()))
            chatAdapter.notifyItemInserted(messages.size - 1)
            binding.chatRecyclerView.smoothScrollToPosition(messages.size - 1)
        }, 1500)
    }
}

data class ChatMessage(val text: String, val isMe: Boolean, val timestamp: Long)

class ChatAdapter(private val messages: List<ChatMessage>) : RecyclerView.Adapter<ChatAdapter.ViewHolder>() {

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
        val msg = messages[position]
        
        if (msg.isMe) {
            holder.binding.layoutReceived.visibility = View.GONE
            holder.binding.layoutSent.visibility = View.VISIBLE
            holder.binding.tvSent.text = msg.text
            holder.binding.tvSentTime.text = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date(msg.timestamp))
        } else {
            holder.binding.layoutSent.visibility = View.GONE
            holder.binding.layoutReceived.visibility = View.VISIBLE
            holder.binding.tvReceived.text = msg.text
            holder.binding.tvReceivedTime.text = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date(msg.timestamp))
        }
    }

    override fun getItemCount() = messages.size
}
