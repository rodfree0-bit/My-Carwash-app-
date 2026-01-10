package com.carwash.app.ui.washer

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.carwash.app.model.Order
import com.google.firebase.firestore.FirebaseFirestore

class JobDetailViewModel : ViewModel() {
    
    private val db = FirebaseFirestore.getInstance()
    private var orderId: String = ""
    
    private val _order = MutableLiveData<Order>()
    val order: LiveData<Order> = _order
    
    private val _beforePhotos = MutableLiveData<List<String>>(emptyList())
    val beforePhotos: LiveData<List<String>> = _beforePhotos
    
    private val _afterPhotos = MutableLiveData<List<String>>(emptyList())
    val afterPhotos: LiveData<List<String>> = _afterPhotos
    
    fun loadOrder(id: String) {
        orderId = id
        db.collection("orders").document(id).get()
            .addOnSuccessListener { document ->
                document.toObject(Order::class.java)?.let { loadedOrder ->
                    _order.value = loadedOrder
                    // Photos will be loaded separately if needed
                }
            }
    }
    
    fun updateStatus(newStatus: String) {
        db.collection("orders").document(orderId).update("status", newStatus)
            .addOnSuccessListener {
                _order.value?.let { currentOrder ->
                    _order.value = currentOrder.copy(status = newStatus)
                }
            }
    }
    
    fun uploadPhoto(photoUrl: String, isBeforePhoto: Boolean) {
        // TODO: Implement photo upload
    }
}
