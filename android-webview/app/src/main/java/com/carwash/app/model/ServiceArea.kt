package com.carwash.app.model

/**
 * Service Area Configuration - 100% parity with Web
 */
data class ServiceArea(
    val centerLat: Double = 0.0,
    val centerLng: Double = 0.0,
    val radiusMiles: Double = 0.0,
    val cityName: String = ""
)
