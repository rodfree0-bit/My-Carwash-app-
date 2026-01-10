package com.carwash.app.ui.client

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.R
import com.carwash.app.databinding.FragmentClientHistoryBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.carwash.app.ui.booking.VehicleSelectionActivity
import com.carwash.app.ui.client.adapters.OrderHistoryAdapter
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class ClientHistoryFragment : Fragment() {

    private var _binding: FragmentClientHistoryBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: OrderHistoryAdapter
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    private val userId get() = auth.currentUser?.uid

    private var allOrders = listOf<Order>()
    private var filteredOrders = listOf<Order>()
    private var selectedFilter = "ALL"
    private var searchQuery = ""

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentClientHistoryBinding.inflate(inflater, container, false)

        setupUI()
        loadOrders()

        return binding.root
    }

    private fun setupUI() {
        // Setup RecyclerView
        adapter = OrderHistoryAdapter(
            onViewDetails = { order ->
                val intent = Intent(context, OrderTrackingActivity::class.java)
                intent.putExtra("orderId", order.id)
                startActivity(intent)
            },
            onReorder = { order ->
                // Navigate to booking flow with pre-filled data
                // Toast.makeText(context, "Reordering logic initialized...", Toast.LENGTH_SHORT).show()
                val intent = Intent(context, VehicleSelectionActivity::class.java)
                intent.putExtra("REORDER_FROM_ORDER_ID", order.id)
                startActivity(intent)
            }
        )

        binding.recyclerHistory.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@ClientHistoryFragment.adapter
        }

        // Setup search
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                searchQuery = s.toString()
                applyFilters()
            }
        })

        // Setup filter chips
        binding.chipGroupFilters.setOnCheckedStateChangeListener { _, checkedIds ->
            selectedFilter = when (checkedIds.firstOrNull()) {
                R.id.chipCompleted -> "COMPLETED"
                R.id.chipCancelled -> "CANCELLED"
                R.id.chipInProgress -> "IN_PROGRESS"
                else -> "ALL"
            }
            applyFilters()
        }
    }

    private fun loadOrders() {
        if (userId == null) return

        db.collection("orders")
            .whereEqualTo("clientId", userId)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshots, e ->
                if (e != null || snapshots == null) {
                    showEmptyState()
                    return@addSnapshotListener
                }

                allOrders = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(Order::class.java)?.copy(id = doc.id)
                }

                applyFilters()
            }
    }

    private fun applyFilters() {
        var filtered = allOrders

        // Apply status filter
        if (selectedFilter != "ALL") {
            filtered = when (selectedFilter) {
                "COMPLETED" -> filtered.filter { it.status == OrderStatus.COMPLETED }
                "CANCELLED" -> filtered.filter { it.status == OrderStatus.CANCELLED }
                "IN_PROGRESS" -> filtered.filter {
                    it.status in listOf(
                        OrderStatus.NEW,
                        OrderStatus.ASSIGNED,
                        OrderStatus.EN_ROUTE,
                        OrderStatus.ARRIVED,
                        OrderStatus.WASHING
                    )
                }
                else -> filtered
            }
        }

        // Apply search filter
        if (searchQuery.isNotEmpty()) {
            filtered = filtered.filter { order ->
                order.id.contains(searchQuery, ignoreCase = true) ||
                order.address.contains(searchQuery, ignoreCase = true)
            }
        }

        filteredOrders = filtered

        if (filteredOrders.isEmpty()) {
            showEmptyState()
        } else {
            showOrders()
            adapter.submitList(filteredOrders)
        }
    }

    private fun showEmptyState() {
        binding.recyclerHistory.visibility = View.GONE
        binding.emptyState.visibility = View.VISIBLE
        binding.txtEmptyHistory.text = if (searchQuery.isNotEmpty()) {
            "No se encontraron órdenes"
        } else {
            "No hay órdenes"
        }
    }

    private fun showOrders() {
        binding.recyclerHistory.visibility = View.VISIBLE
        binding.emptyState.visibility = View.GONE
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
