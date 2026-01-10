package com.carwash.app.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore

class HomeViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()

    private val _revenue = MutableLiveData<Double>()
    val revenue: LiveData<Double> = _revenue

    private val _clients = MutableLiveData<Int>()
    val clients: LiveData<Int> = _clients

    fun fetchData() {
        // Fetch total revenue
        db.collection("orders").whereEqualTo("status", "Completed").get()
            .addOnSuccessListener { result ->
                var totalRevenue = 0.0
                for (document in result) {
                    totalRevenue += document.getDouble("totalPrice") ?: 0.0
                }
                _revenue.value = totalRevenue
            }

        // Fetch total clients
        db.collection("users").whereEqualTo("role", "client").get()
            .addOnSuccessListener { result ->
                _clients.value = result.size()
            }
    }
}
