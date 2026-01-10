package com.carwash.app.ui.washer.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import android.widget.TextView
import com.carwash.app.R
import com.carwash.app.databinding.FragmentWasherEarningsBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.toObject
import java.text.NumberFormat
import java.util.Locale

class WasherEarningsFragment : Fragment() {

    private var _binding: FragmentWasherEarningsBinding? = null
    private val binding get() = _binding!!
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWasherEarningsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupRecyclerView()
        loadEarnings()
    }

    private fun setupRecyclerView() {
        binding.rvEarnings.layoutManager = LinearLayoutManager(context)
        // Adapter logic here or separate file. Using inner simple adapter for speed.
    }

    private fun loadEarnings() {
        val userId = auth.currentUser?.uid ?: return

        db.collection("orders")
            .whereEqualTo("washerId", userId)
            .whereEqualTo("status", OrderStatus.COMPLETED)
            .get()
            .addOnSuccessListener { result ->
                val orders = result.mapNotNull { it.toObject<Order>() }
                calculateAndShow(orders)
            }
    }

    private fun calculateAndShow(orders: List<Order>) {
        var total = 0.0
        orders.forEach { 
             // Logic: washerTotal = servicePrice - commission + tip
             // Assuming Order model has these calculated, or we calc on the fly
             // For now, let's assume order.price is mostly washer's or logic is pre-calc
             // Let's use order.price as placeholder if specific fields empty
             total += it.price 
        }

        binding.tvTotalEarnings.text = NumberFormat.getCurrencyInstance(Locale.US).format(total)
        
        binding.rvEarnings.adapter = EarningsAdapter(orders)
    }

    inner class EarningsAdapter(private val orders: List<Order>) : RecyclerView.Adapter<EarningsAdapter.ViewHolder>() {
        
        inner class ViewHolder(val view: View) : RecyclerView.ViewHolder(view) {
             val tvId: TextView = view.findViewById(android.R.id.text1)
             val tvAmount: TextView = view.findViewById(android.R.id.text2)
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            // Using standard simple list item for MVP speed, or create custom item later
            val view = LayoutInflater.from(parent.context).inflate(android.R.layout.simple_list_item_2, parent, false)
            view.setBackgroundColor(android.graphics.Color.parseColor("#1E293B"))
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val order = orders[position]
            holder.tvId.text = "Order #${order.id.takeLast(6)}"
            holder.tvId.setTextColor(android.graphics.Color.WHITE)
            
            val amount = NumberFormat.getCurrencyInstance(Locale.US).format(order.price)
            holder.tvAmount.text = amount
            holder.tvAmount.setTextColor(android.graphics.Color.GREEN)
        }

        override fun getItemCount() = orders.size
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
