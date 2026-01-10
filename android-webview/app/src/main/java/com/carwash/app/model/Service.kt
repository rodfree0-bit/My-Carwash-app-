package com.carwash.app.model

import com.google.firebase.firestore.DocumentId

data class Service(
    @DocumentId
    val id: String = "",
    val name: String = "",
    val price: Double = 0.0
)
