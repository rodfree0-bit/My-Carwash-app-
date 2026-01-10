package com.carwash.app.model

import com.google.firebase.Timestamp

/**
 * Message model for chat - 100% parity with Web
 */
data class Message(
    val id: String = "",
    val senderId: String = "",
    val receiverId: String = "",
    val orderId: String = "", // Links chat to a specific order
    val content: String = "",
    val timestamp: Timestamp? = null,
    val read: Boolean = false,
    val type: String = "text" // text, image
)

/**
 * Conversation model
 */
data class Conversation(
    val orderId: String = "",
    val clientId: String = "",
    val clientName: String = "",
    val clientAvatar: String = "",
    val washerId: String = "",
    val washerName: String = "",
    val washerAvatar: String = "",
    val lastMessage: Message? = null,
    val unreadCount: Int = 0
)

/**
 * Message Type constants
 */
object MessageType {
    const val TEXT = "text"
    const val IMAGE = "image"
}
