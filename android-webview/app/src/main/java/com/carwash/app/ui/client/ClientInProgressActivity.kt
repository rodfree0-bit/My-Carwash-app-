package com.carwash.app.ui.client

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.R
import com.carwash.app.databinding.ActivityClientInProgressBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.carwash.app.model.Washer
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration
import com.google.firebase.firestore.ktx.toObject

class ClientInProgressActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var binding: ActivityClientInProgressBinding
    private lateinit var db: FirebaseFirestore
    private var orderListener: ListenerRegistration? = null
    private var googleMap: GoogleMap? = null

    private companion object {
        private const val DEFAULT_LAT = 37.7749
        private const val DEFAULT_LNG = -122.4194
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityClientInProgressBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()

        // binding.lottieAnimation.setAnimation(R.raw.car_wash_anim)

        val mapFragment = supportFragmentManager.findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        findActiveOrder()
    }

    private fun findActiveOrder() {
        val userId = FirebaseAuth.getInstance().currentUser?.uid ?: return

        db.collection("orders")
            .whereEqualTo("clientId", userId)
            .whereIn("status", listOf(OrderStatus.NEW, OrderStatus.ASSIGNED, OrderStatus.EN_ROUTE, OrderStatus.ARRIVED, OrderStatus.WASHING))
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                if (!documents.isEmpty) {
                    val orderId = documents.documents[0].id
                    listenToOrder(orderId)
                } else {
                    Toast.makeText(this, getString(R.string.in_progress_no_active_order), Toast.LENGTH_SHORT).show()
                }
            }
    }

    private fun listenToOrder(orderId: String) {
        orderListener = db.collection("orders").document(orderId)
            .addSnapshotListener { snapshot, e ->
                if (e != null || snapshot == null || !snapshot.exists()) return@addSnapshotListener

                val order = snapshot.toObject<Order>()
                order?.let { updateUI(it) }
            }
    }

    private fun updateUI(order: Order) {
        when (order.status) {
            OrderStatus.NEW -> {
                binding.txtStatusTitle.text = getString(R.string.in_progress_status_new_title)
                binding.txtStatusSubtitle.text = getString(R.string.in_progress_status_new_subtitle)
                binding.stepProgress.progress = 10
            }
            OrderStatus.ASSIGNED, OrderStatus.EN_ROUTE -> {
                binding.txtStatusTitle.text = getString(R.string.in_progress_status_en_route_title)
                getWasherName(order.washerId) { washerName ->
                    binding.txtStatusSubtitle.text = getString(R.string.in_progress_status_en_route_subtitle, washerName)
                    binding.txtWasherName.text = washerName
                }
                binding.stepProgress.progress = 30
            }
            OrderStatus.ARRIVED -> {
                binding.txtStatusTitle.text = getString(R.string.in_progress_status_arrived_title)
                binding.txtStatusSubtitle.text = getString(R.string.in_progress_status_arrived_subtitle)
                binding.stepProgress.progress = 60
            }
            OrderStatus.WASHING -> {
                binding.txtStatusTitle.text = getString(R.string.in_progress_status_washing_title)
                binding.txtStatusSubtitle.text = getString(R.string.in_progress_status_washing_subtitle)
                binding.stepProgress.progress = 80
            }
            OrderStatus.COMPLETED -> {
                binding.txtStatusTitle.text = getString(R.string.in_progress_status_completed_title)
                binding.txtStatusSubtitle.text = getString(R.string.in_progress_status_completed_subtitle)
                binding.stepProgress.progress = 100
            }
            else -> {}
        }
    }

    private fun getWasherName(washerId: String?, callback: (String) -> Unit) {
        if (washerId == null) {
            callback(getString(R.string.admin_team_default_washer_name))
            return
        }
        db.collection("users").document(washerId).get()
            .addOnSuccessListener { doc ->
                val washer = doc.toObject<Washer>()
                callback(washer?.name ?: getString(R.string.admin_team_default_washer_name))
            }
            .addOnFailureListener {
                callback(getString(R.string.admin_team_default_washer_name))
            }
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map
        binding.imgBackground.animate().alpha(0f).duration = 1000

        val carLocation = LatLng(DEFAULT_LAT, DEFAULT_LNG)
        map.addMarker(MarkerOptions().position(carLocation).title(getString(R.string.in_progress_map_marker_title)))
        map.moveCamera(CameraUpdateFactory.newLatLngZoom(carLocation, 15f))
    }

    override fun onDestroy() {
        super.onDestroy()
        orderListener?.remove()
    }
}
