package com.carwash.app.model

data class Washer(
    val id: String = "",
    val name: String = "",
    val email: String = "",
    val phone: String = "",
    val rating: Double = 5.0,
    val completedJobs: Int = 0,
    val totalEarnings: Double = 0.0,
    
    // Professional Details
    val ssn: String? = null,
    val dob: String? = null,
    val address: String? = null,
    
    // Vehicle Details
    val vehicleMake: String? = null,
    val vehicleModel: String? = null,
    val vehicleYear: String? = null,
    val vehicleColor: String? = null,
    val vehiclePlate: String? = null,
    
    // Photos (URLs)
    val profilePhotoUrl: String? = null,
    val licensePhotoUrl: String? = null,
    val vehiclePhotoUrl: String? = null,
    val insurancePhotoUrl: String? = null,
    val registrationPhotoUrl: String? = null,
    val ssnPhotoUrl: String? = null,

    // Admin Status
    val status: String = "Active",
    val isActive: Boolean = true
)
