package com.carwash.app.model

/**
 * Service Package model - 100% parity with Web
 */
data class ServicePackage(
    val id: String = "",
    val name: String = "",
    val price: Map<String, Double> = emptyMap(), // Price mapping per vehicle type
    val description: String = "",
    val duration: String = "", // e.g. "1h 30m"
    val image: String = "",
    val features: List<String> = emptyList(),
    val washerCommission: Double = 0.0, // Legacy: Percentage that goes to washer
    val appCommission: Double = 0.0, // Dedicated App Commission %
    val fees: List<ServiceFee> = emptyList() // New: List of fees to deduct
)

/**
 * Service Addon model - 100% parity with Web
 */
data class ServiceAddon(
    val id: String = "",
    val name: String = "",
    val price: Map<String, Double> = emptyMap(), // Price mapping per vehicle type
    val description: String = "",
    val duration: String = "", // Mandatory
    val washerCommission: Double = 0.0, // Legacy/Target Payout
    val appCommission: Double = 0.0, // Dedicated App Commission %
    val fees: List<ServiceFee> = emptyList() // List of additional fees
)
