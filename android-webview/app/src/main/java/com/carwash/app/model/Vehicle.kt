package com.carwash.app.model

data class Vehicle(
    val id: String = "",
    val make: String = "",
    val model: String = "",
    val type: String = "sedan",
    val typeIcon: String? = null,
    val plate: String = "",
    val year: Int = 0,
    val color: String = "",
    val isDefault: Boolean? = false
)
