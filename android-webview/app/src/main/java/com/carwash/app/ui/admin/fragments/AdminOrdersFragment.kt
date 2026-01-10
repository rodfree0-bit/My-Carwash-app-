package com.carwash.app.ui.admin.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.carwash.app.databinding.FragmentAdminOrdersBinding
import com.carwash.app.model.Order
import com.google.firebase.firestore.FirebaseFirestore

class AdminOrdersFragment : Fragment() {

    private var _binding: FragmentAdminOrdersBinding? = null
    private val binding get() = _binding!!
    private val db = FirebaseFirestore.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdminOrdersBinding.inflate(inflater, container, false)
        
        loadOrders()
        
        return binding.root
    }

    private fun loadOrders() {
        db.collection("orders")
            .addSnapshotListener { snapshots, e ->
                if (e != null) {
                    Toast.makeText(context, "Error loading orders", Toast.LENGTH_SHORT).show()
                    return@addSnapshotListener
                }

                val orders = snapshots?.documents?.mapNotNull { doc ->
                    doc.toObject(Order::class.java)?.copy(id = doc.id)
                } ?: emptyList()

                Toast.makeText(context, "Loaded ${orders.size} orders", Toast.LENGTH_SHORT).show()
            }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
