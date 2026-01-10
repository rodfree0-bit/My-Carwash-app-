package com.carwash.app.ui.admin

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.firebase.firestore.QueryDocumentSnapshot

class ManageItemsAdapter(
    private var items: List<QueryDocumentSnapshot>,
    private val onItemClick: (QueryDocumentSnapshot) -> Unit
) : RecyclerView.Adapter<ManageItemsAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val text1: TextView = view.findViewById(android.R.id.text1)
        val text2: TextView = view.findViewById(android.R.id.text2)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_2, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        val name = item.getString("name") ?: "Unknown"
        val price = item.getDouble("price") ?: item.getDouble("surcharge") ?: 0.0
        
        holder.text1.text = name
        holder.text2.text = "$${price}"
        
        holder.itemView.setOnClickListener { onItemClick(item) }
    }

    override fun getItemCount() = items.size

    fun updateList(newItems: List<QueryDocumentSnapshot>) {
        items = newItems
        notifyDataSetChanged()
    }
}
