package com.carwash.app.ui.washer.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.FragmentWasherAvailableOrdersBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.carwash.app.ui.washer.WasherOrderDetailActivity
import com.carwash.app.ui.washer.adapters.WasherAvailableOrderAdapter
import com.google.firebase.firestore.FirebaseFirestore

class WasherAvailableOrdersFragment : Fragment() {

    private var _binding: FragmentWasherAvailableOrdersBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: WasherAvailableOrderAdapter
    private val db = FirebaseFirestore.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWasherAvailableOrdersBinding.inflate(inflater, container, false)

        setupRecyclerView()
        loadAvailableOrders()

        return binding.root
    }

    private fun setupRecyclerView() {
        adapter = WasherAvailableOrderAdapter { order ->
            val intent = Intent(context, WasherOrderDetailActivity::class.java)
            intent.putExtra("orderId", order.id)
            intent.putExtra("isAvailable", true)
            startActivity(intent)
        }

        binding.rvAvailableOrders.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@WasherAvailableOrdersFragment.adapter
        }
    }

    private fun loadAvailableOrders() {
        db.collection("orders")
            .whereEqualTo("status", OrderStatus.NEW)
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
        binding.rvAvailableOrders.visibility = View.GONE
        binding.emptyState.visibility = View.VISIBLE
    }

    private fun showOrders() {
        binding.rvAvailableOrders.visibility = View.VISIBLE
        binding.emptyState.visibility = View.GONE
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
