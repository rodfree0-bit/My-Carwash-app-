package com.carwash.app.ui.orders

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.carwash.app.model.Order
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class OrdersViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    private val _orders = MutableLiveData<List<Order>>()
    val orders: LiveData<List<Order>> = _orders

    fun fetchUserOrders() {
        val userId = auth.currentUser?.uid ?: return

        db.collection("orders")
            .whereEqualTo("clientId", userId)
            .orderBy("date", Query.Direction.DESCENDING)
            .get()
            .addOnSuccessListener { documents ->
                _orders.value = documents.toObjects(Order::class.java)
            }
            .addOnFailureListener {
                // Handle error
            }
    }
}
