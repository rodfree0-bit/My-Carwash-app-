package com.carwash.app.ui.washer

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.carwash.app.R
import com.carwash.app.databinding.FragmentWasherDashboardBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.toObject

class WasherDashboardFragment : Fragment() {

    private var _binding: FragmentWasherDashboardBinding? = null
    private val binding get() = _binding!!

    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWasherDashboardBinding.inflate(inflater, container, false)

        setupDashboard()

        return binding.root
    }

    private fun setupDashboard() {
        val user = auth.currentUser ?: return
        
        // Show placeholder stats
        binding.txtTotalEarnings.text = getString(R.string.washer_dashboard_earnings_format, 0.0)
        binding.txtJobsCompleted.text = "0"
        binding.txtRating.text = "5.0"

        // Setup RecyclerView for Queue
        val queueAdapter = com.carwash.app.ui.washer.adapters.WasherOrderAdapter { order ->
             // On Click of queue item -> Show details (maybe just view?)
             val intent = Intent(context, WasherJobDetailActivity::class.java)
             intent.putExtra("ORDER_ID", order.id)
             startActivity(intent)
        }
        binding.rvUpcomingJobs.layoutManager = androidx.recyclerview.widget.LinearLayoutManager(context)
        binding.rvUpcomingJobs.adapter = queueAdapter

        // Listen for ALL relevant orders
        db.collection("orders")
            .whereEqualTo("washerId", user.uid)
            .whereIn("status", listOf(OrderStatus.ASSIGNED, OrderStatus.EN_ROUTE, OrderStatus.ARRIVED, OrderStatus.WASHING))
            .addSnapshotListener { snapshots, e ->
                if (e != null || snapshots == null || snapshots.isEmpty) {
                    showNoActiveJob()
                    queueAdapter.submitList(emptyList())
                    return@addSnapshotListener
                }
                
                val allOrders = snapshots.documents.mapNotNull { it.toObject<Order>() }
                
                // 1. Find ACTIVE Job (En Route, Arrived, Washing)
                val activeJob = allOrders.find { it.status == OrderStatus.EN_ROUTE || it.status == OrderStatus.ARRIVED || it.status == OrderStatus.WASHING }
                
                if (activeJob != null) {
                    showActiveJob(activeJob)
                    // Queue is everything else (ASSIGNED)
                    val queue = allOrders.filter { it.status == OrderStatus.ASSIGNED }
                    queueAdapter.submitList(queue)
                } else {
                    // No active job in progress.
                    // Check if we have Assigned jobs.
                    val queue = allOrders.filter { it.status == OrderStatus.ASSIGNED }
                    
                    if (queue.isNotEmpty()) {
                        // Promote the FIRST assigned job to the "Active Card" (Waiting to Start)
                        val nextJob = queue.first()
                        showActiveJob(nextJob)
                        
                        // Show the rest in the queue
                        queueAdapter.submitList(queue.drop(1))
                    } else {
                        showNoActiveJob()
                        queueAdapter.submitList(emptyList())
                    }
                }
            }
    }
    
    private fun showActiveJob(job: Order) {
        binding.cardCurrentJob.visibility = View.VISIBLE
        binding.txtJobStatus.text = job.status.replace("_", " ")
        binding.txtJobTime.text = job.time
        
        val statusColor = when(job.status) {
            OrderStatus.ASSIGNED -> android.graphics.Color.parseColor("#F59E0B") // Amber
            OrderStatus.EN_ROUTE -> android.graphics.Color.parseColor("#3B82F6") // Blue
            OrderStatus.ARRIVED -> android.graphics.Color.parseColor("#10B981") // Green
            OrderStatus.WASHING -> android.graphics.Color.parseColor("#3b82f6") // Blue
            else -> android.graphics.Color.WHITE
        }
        binding.txtJobStatus.setTextColor(statusColor)

        val firstVehicle = job.vehicleConfigs.firstOrNull()
        val vehicleModel = firstVehicle?.vehicleModel ?: ""
        binding.txtJobAddress.text = "${job.address}\n$vehicleModel"
        binding.btnViewJob.visibility = View.VISIBLE

        binding.btnViewJob.text = if (job.status == OrderStatus.ASSIGNED) "Start Job" else "View Details"
        
        binding.btnViewJob.setOnClickListener {
             val intent = Intent(context, WasherJobDetailActivity::class.java)
             intent.putExtra("ORDER_ID", job.id)
             startActivity(intent)
        }
    }
    
    private fun showNoActiveJob() {
        binding.cardCurrentJob.visibility = View.VISIBLE
        binding.txtJobStatus.text = "ONLINE"
        binding.txtJobStatus.setTextColor(android.graphics.Color.GREEN)
        binding.txtJobTime.text = ""
        binding.txtJobAddress.text = getString(R.string.washer_dashboard_waiting_for_jobs)
        binding.btnViewJob.visibility = View.GONE
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
