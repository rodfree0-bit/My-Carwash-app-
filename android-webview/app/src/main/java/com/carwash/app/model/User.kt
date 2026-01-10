package com.carwash.app.model

import com.google.firebase.Timestamp

/**
 * User model - 100% parity with Web
 * Unified interface for all user roles (client, washer, admin)
 */
data class User(
    val id: String = "",
    val email: String = "",
    val name: String = "",
    val role: String = "client", // client, washer, admin
    val avatar: String = "",
    val fcmToken: String = "",
    
    // Client specific
    val phone: String = "",
    val address: String = "",
    val savedVehicles: List<SavedVehicle> = emptyList(),
    val savedAddresses: List<SavedAddress> = emptyList(),
    val savedCards: List<SavedCard> = emptyList(),
    
    // Washer specific (visible to client)
    val profileImageUrl: String = "",
    val vehiclePhotoUrl: String = "",
    val vehicleMake: String = "",
    val vehicleModel: String = "",
    val vehicleYear: Int = 0,
    val vehicleColor: String = "",
    val vehiclePlate: String = "",
    
    // Washer specific (admin only)
    val licenseNumber: String = "",
    val insuranceNumber: String = "",
    val driverLicense: String = "",
    val vehicleRegistration: String = "",
    val bankName: String = "",
    val accountLast4: String = "",
    
    // Team member fields
    val status: String = "Active", // Active, Blocked, Offline, On Job, Applicant
    val completedJobs: Int = 0,
    val rating: Double = 0.0,
    val joinedDate: String = "",
    
    // Stats
    val totalOrders: Int = 0,
    val totalSpent: Double = 0.0,
    val averageRating: Double = 0.0,
    
    // Status
    val isActive: Boolean = true,
    val isApproved: Boolean = false, // For washers
    
    // Timestamps
    val createdAt: Timestamp? = null,
    val lastLoginAt: Timestamp? = null
)

/**
 * Saved Vehicle structure
 */
data class SavedVehicle(
    val id: String = "",
    val type: String = "",
    val make: String = "",
    val model: String = "",
    val color: String = "",
    val plate: String = "",
    val isDefault: Boolean = false
)

/**
 * Saved Address structure
 */
data class SavedAddress(
    val id: String = "",
    val label: String = "", // Home, Work, etc.
    val address: String = "",
    val icon: String = "",
    val isDefault: Boolean = false
)

/**
 * Saved Card structure
 */
data class SavedCard(
    val id: String = "",
    val brand: String = "", // visa, mastercard
    val last4: String = "",
    val expiry: String = "",
    val isDefault: Boolean = false,
    val stripePaymentMethodId: String = ""
)

/**
 * User Role constants
 */
object UserRole {
    const val CLIENT = "client"
    const val WASHER = "washer"
    const val ADMIN = "admin"
}

/**
 * User Status constants
 */
object UserStatus {
    const val ACTIVE = "Active"
    const val BLOCKED = "Blocked"
    const val OFFLINE = "Offline"
    const val ON_JOB = "On Job"
    const val APPLICANT = "Applicant"
}
