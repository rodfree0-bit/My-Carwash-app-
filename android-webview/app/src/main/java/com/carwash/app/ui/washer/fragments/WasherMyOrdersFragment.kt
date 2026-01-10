package com.carwash.app.ui.washer.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.FragmentWasherMyOrdersBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.carwash.app.ui.washer.WasherOrderDetailActivity
import com.carwash.app.ui.washer.adapters.WasherMyOrderAdapter
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class WasherMyOrdersFragment : Fragment() {

    private var _binding: FragmentWasherMyOrdersBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: WasherMyOrderAdapter
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    private val washerId get() = auth.currentUser?.uid

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWasherMyOrdersBinding.inflate(inflater, container, false)

        setupRecyclerView()
        loadMyOrders()

        return binding.root
    }

    private fun setupRecyclerView() {
        adapter = WasherMyOrderAdapter { order ->
            val intent = Intent(context, WasherOrderDetailActivity::class.java)
            intent.putExtra("orderId", order.id)
            intent.putExtra("isAvailable", false)
            startActivity(intent)
        }

        binding.rvMyOrders.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@WasherMyOrdersFragment.adapter
        }
    }

    private fun loadMyOrders() {
        if (washerId == null) return

        db.collection("orders")
            .whereEqualTo("washerId", washerId)
            .whereIn("status", listOf(
                OrderStatus.ASSIGNED,
                OrderStatus.EN_ROUTE,
                OrderStatus.ARRIVED,
                OrderStatus.WASHING
            ))
            .addSnapshotListener { snapshots, e ->
                if (e != null || snapshots == null) {
                    showEmptyState()
                    return@addSnapshotListener
                }

                val orders = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(Order::class.java)?.copy(id = doc.id)
                }

                if (orders.isEmpty()) {
                    showEmptyState()
                } else {
                    showOrders()
                    adapter.submitList(orders)
                }
            }
    }

    private fun showEmptyState() {
        binding.rvMyOrders.visibility = View.GONE
        binding.emptyState.visibility = View.VISIBLE
    }

    private fun showOrders() {
        binding.rvMyOrders.visibility = View.VISIBLE
        binding.emptyState.visibility = View.GONE
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
