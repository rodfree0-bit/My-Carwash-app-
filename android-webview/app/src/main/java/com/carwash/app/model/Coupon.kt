package com.carwash.app.model

import com.google.firebase.firestore.DocumentId

data class Coupon(
    @DocumentId
    val id: String = "",
    val code: String = "",
    val discount: Double = 0.0,
    val active: Boolean = true
)
