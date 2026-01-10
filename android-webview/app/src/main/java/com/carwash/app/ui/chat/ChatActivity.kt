package com.carwash.app.ui.chat

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.ActivityChatBinding
import com.carwash.app.model.Message
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class ChatActivity : AppCompatActivity() {

    private lateinit var binding: ActivityChatBinding
    private lateinit var adapter: ChatAdapter
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    private lateinit var orderId: String
    private val currentUserId get() = auth.currentUser?.uid

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId") ?: return finish()

        setupToolbar()
        setupRecyclerView()
        setupSendButton()
        loadMessages()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener { finish() }
    }

    private fun setupRecyclerView() {
        adapter = ChatAdapter(currentUserId ?: "")
        
        binding.rvMessages.apply {
            layoutManager = LinearLayoutManager(this@ChatActivity).apply {
                stackFromEnd = true
            }
            adapter = this@ChatActivity.adapter
        }
    }

    private fun setupSendButton() {
        binding.btnSend.setOnClickListener {
            val messageText = binding.etMessage.text.toString().trim()
            if (messageText.isNotEmpty()) {
                sendMessage(messageText)
                binding.etMessage.text?.clear()
            }
        }
    }

    private fun loadMessages() {
        db.collection("orders").document(orderId)
            .collection("messages")
            .orderBy("timestamp", Query.Direction.ASCENDING)
            .addSnapshotListener { snapshots, e ->
                if (e != null || snapshots == null) return@addSnapshotListener

                val messages = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(Message::class.java)?.copy(id = doc.id)
                }

                adapter.submitList(messages)
                
                // Scroll to bottom
                if (messages.isNotEmpty()) {
                    binding.rvMessages.scrollToPosition(messages.size - 1)
                }
            }
    }

    private fun sendMessage(messageText: String) {
        val message = Message(
            orderId = orderId,
            senderId = currentUserId ?: "",
            receiverId = "", // Will be set by backend
            content = messageText,
            timestamp = Timestamp.now(),
            read = false,
            type = "text"
        )

        db.collection("orders").document(orderId)
            .collection("messages")
            .add(message)
            .addOnFailureListener {
                Toast.makeText(this, "Error sending message", Toast.LENGTH_SHORT).show()
            }
    }
}
