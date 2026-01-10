package com.carwash.app.model

data class Addon(
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val duration: String = "",
    val price: Map<String, Double> = emptyMap(),
    val washerCommission: Int = 80,
    val appCommission: Int = 20,
    val fees: List<ServiceFee> = emptyList()
) {
    fun getPriceForType(vehicleType: String): Double {
        return price[vehicleType] ?: price["Sedan"] ?: 0.0
    }
}
