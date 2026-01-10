package com.carwash.app.ui.client.adapters

data class ChatMessage(
    val id: String = "",
    val senderId: String = "",
    val senderName: String = "",
    val text: String = "",
    val timestamp: Long = System.currentTimeMillis(),
    val isFromClient: Boolean = true
)
