package com.carwash.app.model

import com.google.firebase.Timestamp

/**
 * Notification model - 100% parity with Web
 */
data class Notification(
    val id: String = "",
    val userId: String = "", // ID of the user who receives the notification
    val title: String = "",
    val message: String = "",
    val type: String = "info", // info, success, warning, error
    val read: Boolean = false,
    val timestamp: Timestamp? = null,
    val linkTo: String = "", // Screen to navigate to
    val relatedId: String = "" // Optional related ID (e.g., orderId)
)

/**
 * Notification Type constants
 */
object NotificationType {
    const val INFO = "info"
    const val SUCCESS = "success"
    const val WARNING = "warning"
    const val ERROR = "error"
}
