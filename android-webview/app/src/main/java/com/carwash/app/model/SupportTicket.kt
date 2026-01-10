package com.carwash.app.model

import com.google.firebase.Timestamp

/**
 * Support Ticket model for customer support chat
 */
data class SupportTicket(
    val id: String = "",
    val clientId: String = "",
    val clientName: String = "",
    val clientEmail: String = "",
    val orderId: String = "", // Related order
    val subject: String = "",
    val description: String = "",
    val status: String = "Open", // Open, In Progress, Resolved
    val priority: String = "medium", // low, medium, high
    val createdAt: Timestamp? = null,
    val resolvedAt: Timestamp? = null,
    val unreadByAdmin: Int = 0,
    val unreadByClient: Int = 0
)

/**
 * Support Message model
 */
data class SupportMessage(
    val id: String = "",
    val ticketId: String = "",
    val senderId: String = "",
    val senderName: String = "",
    val senderRole: String = "", // client, admin
    val message: String = "",
    val photoUrls: List<String> = emptyList(),
    val timestamp: Timestamp? = null,
    val read: Boolean = false
)

/**
 * Support Ticket Status constants
 */
object SupportTicketStatus {
    const val OPEN = "Open"
    const val IN_PROGRESS = "In Progress"
    const val RESOLVED = "Resolved"
}

/**
 * Support Ticket Priority constants
 */
object SupportTicketPriority {
    const val LOW = "low"
    const val MEDIUM = "medium"
    const val HIGH = "high"
}
