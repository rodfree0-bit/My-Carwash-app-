package com.carwash.app.ui.client

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.ActivityOrderChatBinding
import com.carwash.app.ui.client.adapters.ChatAdapter
import com.carwash.app.ui.client.adapters.ChatMessage
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class OrderChatActivity : AppCompatActivity() {

    private lateinit var binding: ActivityOrderChatBinding
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    private lateinit var orderId: String
    private val messages = mutableListOf<ChatMessage>()
    private lateinit var adapter: ChatAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOrderChatBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId") ?: return finish()

        setupToolbar()
        setupRecyclerView()
        setupMessageInput()
        listenForMessages()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener { finish() }
    }

    private fun setupRecyclerView() {
        adapter = ChatAdapter(messages, auth.currentUser?.uid ?: "")
        binding.messagesRecyclerView.layoutManager = LinearLayoutManager(this)
        binding.messagesRecyclerView.adapter = adapter
    }

    private fun setupMessageInput() {
        binding.btnSend.setOnClickListener {
            val text = binding.inputMessage.text.toString().trim()
            if (text.isNotEmpty()) {
                sendMessage(text)
                binding.inputMessage.text?.clear()
            }
        }
    }

    private fun listenForMessages() {
        db.collection("orders").document(orderId)
            .collection("messages")
            .orderBy("timestamp", Query.Direction.ASCENDING)
            .addSnapshotListener { snapshots, e ->
                if (e != null) return@addSnapshotListener
                
                messages.clear()
                snapshots?.documents?.forEach { doc ->
                    messages.add(ChatMessage(
                        id = doc.id,
                        senderId = doc.getString("senderId") ?: "",
                        text = doc.getString("text") ?: "",
                        timestamp = doc.getTimestamp("timestamp")?.toDate()?.time ?: 0L
                    ))
                }
                adapter.notifyDataSetChanged()
                binding.messagesRecyclerView.scrollToPosition(messages.size - 1)
            }
    }

    private fun sendMessage(text: String) {
        val uid = auth.currentUser?.uid ?: return
        
        val messageData = hashMapOf(
            "senderId" to uid,
            "text" to text,
            "timestamp" to FieldValue.serverTimestamp()
        )

        db.collection("orders").document(orderId)
            .collection("messages")
            .add(messageData)
    }
}
