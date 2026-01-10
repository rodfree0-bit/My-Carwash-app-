package com.carwash.app.model

import com.google.firebase.Timestamp

/**
 * Issue Report model - 100% parity with Web
 */
data class IssueReport(
    val id: String = "",
    val clientId: String = "",
    val clientName: String = "",
    val clientEmail: String = "",
    val subject: String = "",
    val description: String = "",
    val status: String = "Open", // Open, Resolved
    val timestamp: Timestamp? = null,
    val orderId: String = "",
    val response: String = ""
)

/**
 * Issue Status constants
 */
object IssueStatus {
    const val OPEN = "Open"
    const val RESOLVED = "Resolved"
}
