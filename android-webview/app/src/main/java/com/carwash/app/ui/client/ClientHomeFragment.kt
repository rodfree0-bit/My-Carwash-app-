package com.carwash.app.ui.client

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.carwash.app.R
import com.carwash.app.databinding.FragmentClientHomeBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.carwash.app.ui.booking.BookOrderActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.toObject

class ClientHomeFragment : Fragment() {

    private var _binding: FragmentClientHomeBinding? = null
    private val binding get() = _binding!!

    private val db = FirebaseFirestore.getInstance()
    private val userId = FirebaseAuth.getInstance().currentUser?.uid
    private var activeOrderId: String? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentClientHomeBinding.inflate(inflater, container, false)

        binding.cardBookWash.setOnClickListener {
            startActivity(Intent(context, BookOrderActivity::class.java))
        }

        binding.cardActiveOrder.setOnClickListener {
            openTracking()
        }

        binding.btnTrackOrder.setOnClickListener {
            openTracking()
        }

        // Restore missing listeners
        binding.btnChat.setOnClickListener {
             try {
                startActivity(Intent(context, com.carwash.app.ui.support.SupportChatActivity::class.java))
             } catch (e: Exception) {
                // Prevent crash if activity missing
                e.printStackTrace()
             }
        }

        binding.btnNotifications.setOnClickListener {
            startActivity(Intent(context, ClientNotificationListActivity::class.java))
        }

        binding.imgProfile.setOnClickListener {
            (activity as? ClientMainActivity)?.navigateToProfile()
        }

        binding.cardMyGarage.setOnClickListener {
            (activity as? ClientMainActivity)?.navigateToGarage()
        }

        // Removed redundant duplicate listener for cardBookWash
        // binding.cardBookWash.setOnClickListener ...

        checkActiveOrder()

        return binding.root
    }

    private fun checkActiveOrder() {
        if (userId == null) return

        val activeStates = listOf(OrderStatus.NEW, OrderStatus.ASSIGNED, OrderStatus.EN_ROUTE, OrderStatus.ARRIVED, OrderStatus.WASHING)

        db.collection("orders")
            .whereEqualTo("clientId", userId)
            .whereIn("status", activeStates)
            .limit(1)
            .addSnapshotListener { snapshots, e ->
                if (e != null || snapshots == null) {
                    binding.cardActiveOrder.visibility = View.GONE
                    return@addSnapshotListener
                }
                
                if (!snapshots.isEmpty) {
                    val order = snapshots.documents[0].toObject<Order>()
                    if (order != null) {
                        activeOrderId = order.id
                        binding.cardActiveOrder.visibility = View.VISIBLE
                        // Make sure txtActiveStatus exists in XML
                        binding.txtActiveStatus.text = getString(R.string.client_home_active_order_status_text, order.status)
                    }
                } else {
                    binding.cardActiveOrder.visibility = View.GONE
                }
            }
    }

    private fun openTracking() {
        if (activeOrderId != null) {
            val intent = Intent(context, ClientInProgressActivity::class.java)
            intent.putExtra("ORDER_ID", activeOrderId)
            startActivity(intent)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
