package com.carwash.app.ui.admin.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.FragmentAdminSupportBinding
import com.carwash.app.model.SupportTicket
import com.carwash.app.ui.admin.adapters.SupportTicketAdapter
import com.carwash.app.ui.support.SupportChatActivity
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class AdminSupportFragment : Fragment() {

    private var _binding: FragmentAdminSupportBinding? = null
    private val binding get() = _binding!!
    private val db = FirebaseFirestore.getInstance()
    private lateinit var adapter: SupportTicketAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdminSupportBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupRecyclerView()
        loadTickets()
    }

    private fun setupRecyclerView() {
        adapter = SupportTicketAdapter { ticket ->
            openTicketChat(ticket)
        }

        binding.rvSupportTickets.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = this@AdminSupportFragment.adapter
        }
    }

    private fun loadTickets() {
        db.collection("supportTickets")
            .orderBy("lastMessageAt", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshots, e ->
                if (e != null || snapshots == null) return@addSnapshotListener

                val tickets = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(SupportTicket::class.java)?.copy(id = doc.id)
                }

                if (tickets.isEmpty()) {
                    binding.emptyState.visibility = View.VISIBLE
                    binding.rvSupportTickets.visibility = View.GONE
                } else {
                    binding.emptyState.visibility = View.GONE
                    binding.rvSupportTickets.visibility = View.VISIBLE
                    adapter.submitList(tickets)
                }
            }
    }

    private fun openTicketChat(ticket: SupportTicket) {
        val intent = Intent(requireContext(), SupportChatActivity::class.java)
        intent.putExtra("ticketId", ticket.id)
        intent.putExtra("isAdmin", true)
        startActivity(intent)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
