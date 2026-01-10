package com.carwash.app.model

import com.google.firebase.Timestamp

/**
 * Order model - 100% parity with Web (types.ts)
 * 
 * Represents a service order in the system
 */
data class Order(
    val id: String = "",
    val clientId: String = "",
    val clientName: String = "",
    
    // Multi-vehicle support (new)
    val vehicleConfigs: List<VehicleServiceConfig> = emptyList(),
    
    // Legacy single vehicle fields (for backward compatibility)
    val vehicle: String = "",
    val vehicleType: String = "",
    val service: String = "",
    val addons: List<String> = emptyList(),
    
    // Scheduling
    val date: String = "",
    val time: String = "",
    val address: String = "",
    
    // Pricing
    val price: Double = 0.0,
    val tip: Double = 0.0,
    
    // Status
    val status: String = "New", // New, Assigned, En Route, Arrived, In Progress, Completed, Cancelled
    val washerStatus: String = "", // En Route, Arrived, Working, Completed
    val clientNoShow: Boolean = false,
    val autoCloseTime: Long = 0,
    val paymentStatus: String = "Pending", // Pending, Paid, Failed
    val estimatedArrival: String = "",
    
    // Washer info
    val washerId: String = "",
    val washerName: String = "",
    val washerRating: Double = 0.0,
    
    // Timestamps
    val createdAt: Timestamp? = null,
    val acceptedAt: Timestamp? = null,
    val arrivedAt: Timestamp? = null,
    val approvedToStartAt: Timestamp? = null,
    val startedAt: Timestamp? = null,
    val completedAt: Timestamp? = null,
    
    // Approval system
    val clientApprovedStart: Boolean = false,
    val waitingForApprovalSince: Timestamp? = null,
    
    // Rating
    val rating: Double = 0.0,
    val clientRating: Double = 0.0,
    val clientReview: String = "",
    
    // Photos (admin only)
    val photos: OrderPhotos? = null,
    
    // Location tracking
    val location: Location? = null,
    
    // Claim/Issue
    val claim: Claim? = null,
    
    // Discount
    val discountCode: String = "",
    val discountAmount: Double = 0.0,
    
    // Review
    val review: String = ""
)

/**
 * Photos structure matching web
 */
data class OrderPhotos(
    val before: List<String> = emptyList(),
    val after: AfterPhotos? = null
)

data class AfterPhotos(
    val front: String = "",
    val leftSide: String = "",
    val rightSide: String = "",
    val back: String = "",
    val interiorFront: String = "",
    val interiorBack: String = ""
)

/**
 * Location for tracking
 */
data class Location(
    val lat: Double = 0.0,
    val lng: Double = 0.0,
    val address: String = ""
)

/**
 * Claim/Issue
 */
data class Claim(
    val description: String = "",
    val image: String = "",
    val status: String = "Open" // Open, Resolved
)

/**
 * Order Status constants matching web exactly
 */
object OrderStatus {
    const val NEW = "New"
    const val ASSIGNED = "Assigned"
    const val EN_ROUTE = "En Route"
    const val ARRIVED = "Arrived"
    const val IN_PROGRESS = "In Progress"
    const val WASHING = "Washing"  // Added missing status
    const val COMPLETED = "Completed"
    const val CANCELLED = "Cancelled"
}

/**
 * Washer Status constants
 */
object WasherStatus {
    const val EN_ROUTE = "En Route"
    const val ARRIVED = "Arrived"
    const val WORKING = "Working"
    const val COMPLETED = "Completed"
}
