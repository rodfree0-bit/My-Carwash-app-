package com.carwash.app.model

import java.io.Serializable

/**
 * Per-vehicle service configuration
 * Matches VehicleServiceConfig from web (types.ts)
 */
data class VehicleServiceConfig(
    val vehicleId: String = "",
    val vehicleModel: String = "", // for display
    val vehicleType: String = "", // Added for pricing context
    val packageId: String = "",
    val packageName: String = "", // Snapshot
    val packagePrice: Double = 0.0, // Snapshot
    val addonIds: List<String> = emptyList(),
    val addonNames: List<String> = emptyList(), // Snapshot
    val addonsPrice: Double = 0.0 // Snapshot
) : Serializable
