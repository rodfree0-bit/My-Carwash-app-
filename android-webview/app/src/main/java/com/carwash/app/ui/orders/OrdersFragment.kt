package com.carwash.app.ui.orders

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.model.Order

class OrdersFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_orders, container, false)

        val recyclerView = root.findViewById<RecyclerView>(R.id.ordersRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(context)

        // Load real orders from Firestore
        recyclerView.adapter = OrdersAdapter(emptyList())

        return root
    }
}
