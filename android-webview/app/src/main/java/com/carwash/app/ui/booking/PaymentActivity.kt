package com.carwash.app.ui.booking

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.ActivityPaymentBinding
import com.carwash.app.model.Order
import com.carwash.app.model.OrderStatus
import com.carwash.app.model.SavedCard
import com.carwash.app.model.User
import com.carwash.app.model.VehicleServiceConfig
import com.carwash.app.ui.client.ClientMainActivity
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*
import java.io.Serializable

class PaymentActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPaymentBinding
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    
    private lateinit var vehicleConfigs: ArrayList<VehicleServiceConfig>
    private var selectedDate: Long = 0
    private var selectedTimeSlot: String? = null
    private var isAsap: Boolean = false
    private var address: String = ""
    
    private var subtotal: Double = 0.0
    private var discountAmount: Double = 0.0
    private var tipAmount: Double = 0.0
    private var tipPercentage: Int = 0
    private var appliedCouponCode: String? = null
    private var selectedPaymentMethod: SavedCard? = null

    private val savedCardAdapter = SavedCardAdapter { card ->
        selectedPaymentMethod = card
        binding.tvPaymentInfo.text = "Selected: ${card.brand.uppercase()} ending in ${card.last4}"
        binding.tvPaymentInfo.setTextColor(getColor(android.R.color.holo_blue_light))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPaymentBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val extras = intent.getSerializableExtra("vehicleConfigs")
        if (extras is ArrayList<*>) {
            @Suppress("UNCHECKED_CAST")
            vehicleConfigs = extras as ArrayList<VehicleServiceConfig>
        } else {
            vehicleConfigs = arrayListOf()
        }

        selectedDate = intent.getLongExtra("selectedDate", 0)
        selectedTimeSlot = intent.getStringExtra("selectedTimeSlot")
        isAsap = intent.getBooleanExtra("isAsap", false)
        address = intent.getStringExtra("address") ?: ""

        setupToolbar()
        setupSummary()
        setupCouponCode()
        setupTipSelection()
        setupSavedCards()
        setupButtons()
        calculateTotals()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun setupSummary() {
        // Display date and time
        val dateFormat = SimpleDateFormat("EEEE, MMMM d, yyyy", Locale.US)
        val date = Date(selectedDate)
        binding.tvScheduledDateTime.text = if (isAsap) "ASAP" else "${dateFormat.format(date)} at $selectedTimeSlot"
        
        // Display address
        binding.tvAddress.text = address
        
        // Display vehicles count
        binding.tvVehiclesCount.text = "${vehicleConfigs.size} vehicle${if (vehicleConfigs.size != 1) "s" else ""}"
        
        // Calculate subtotal from snapshots
        subtotal = vehicleConfigs.sumOf { config ->
            config.packagePrice + config.addonsPrice
        }
    }

    private fun setupSavedCards() {
        binding.rvSavedCards.apply {
            layoutManager = LinearLayoutManager(this@PaymentActivity, LinearLayoutManager.HORIZONTAL, false)
            adapter = savedCardAdapter
        }

        val userId = auth.currentUser?.uid ?: return
        db.collection("users").document(userId).get()
            .addOnSuccessListener { snapshot ->
                val user = snapshot.toObject(User::class.java)
                if (user != null && user.savedCards.isNotEmpty()) {
                    savedCardAdapter.submitList(user.savedCards)
                    binding.rvSavedCards.visibility = View.VISIBLE
                } else {
                    binding.rvSavedCards.visibility = View.GONE
                    binding.tvPaymentInfo.text = "No saved cards found. Pay after service."
                }
            }
    }

    private fun setupCouponCode() {
        binding.btnApplyCoupon.setOnClickListener {
            val couponCode = binding.etCouponCode.text.toString().trim()
            
            if (couponCode.isBlank()) {
                Toast.makeText(this, "Please enter a coupon code", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            validateCoupon(couponCode)
        }
    }

    private fun validateCoupon(code: String) {
        db.collection("coupons")
            .whereEqualTo("code", code.uppercase())
            .whereEqualTo("active", true)
            .get()
            .addOnSuccessListener { snapshots ->
                if (snapshots.isEmpty) {
                    Toast.makeText(this, "Invalid or expired coupon code", Toast.LENGTH_SHORT).show()
                    return@addOnSuccessListener
                }

                val coupon = snapshots.documents[0]
                val discountType = coupon.getString("discountType") ?: "percentage"
                val discountValue = coupon.getDouble("discountValue") ?: 0.0
                val minOrderAmount = coupon.getDouble("minOrderAmount") ?: 0.0

                if (subtotal < minOrderAmount) {
                    Toast.makeText(this, "Minimum order amount is ${formatCurrency(minOrderAmount)}", Toast.LENGTH_SHORT).show()
                    return@addOnSuccessListener
                }

                // Calculate discount
                discountAmount = when (discountType) {
                    "percentage" -> subtotal * (discountValue / 100.0)
                    "fixed" -> discountValue
                    else -> 0.0
                }

                appliedCouponCode = code.uppercase()
                binding.tvCouponApplied.text = "✅ Coupon applied: -${formatCurrency(discountAmount)}"
                binding.tvCouponApplied.visibility = View.VISIBLE
                binding.btnApplyCoupon.isEnabled = false
                binding.etCouponCode.isEnabled = false

                Toast.makeText(this, "Coupon applied successfully!", Toast.LENGTH_SHORT).show()
                calculateTotals()
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Error validating coupon: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun setupTipSelection() {
        binding.chipGroupTip.setOnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                binding.chip10Percent.id -> {
                    tipPercentage = 10
                    binding.etCustomTip.setText("")
                    calculateTotals()
                }
                binding.chip15Percent.id -> {
                    tipPercentage = 15
                    binding.etCustomTip.setText("")
                    calculateTotals()
                }
                binding.chip20Percent.id -> {
                    tipPercentage = 20
                    binding.etCustomTip.setText("")
                    calculateTotals()
                }
                else -> {
                    if (binding.etCustomTip.text.isNullOrBlank()) {
                         tipPercentage = 0
                         tipAmount = 0.0
                         calculateTotals()
                    }
                }
            }
        }

        binding.btnApplyCustomTip.setOnClickListener {
            val customTip = binding.etCustomTip.text.toString().toDoubleOrNull()
            
            if (customTip != null && customTip > 0) {
                tipAmount = customTip
                tipPercentage = 0
                binding.chipGroupTip.clearCheck()
                Toast.makeText(this, "Custom tip applied", Toast.LENGTH_SHORT).show()
                calculateTotals()
            } else {
                Toast.makeText(this, "Please enter a valid tip amount", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun setupButtons() {
        binding.btnConfirmBooking.setOnClickListener {
            createOrder()
        }
    }

    private fun calculateTotals() {
        // Calculate tip based on percentage
        if (tipPercentage > 0) {
            tipAmount = (subtotal - discountAmount) * (tipPercentage / 100.0)
        }

        val total = subtotal - discountAmount + tipAmount

        // Update UI
        binding.tvSubtotal.text = formatCurrency(subtotal)
        binding.tvDiscount.text = if (discountAmount > 0) "-${formatCurrency(discountAmount)}" else formatCurrency(0.0)
        binding.tvTip.text = formatCurrency(tipAmount)
        binding.tvTotal.text = formatCurrency(total)

        // Show tip message
        if (tipAmount > 0) {
            binding.tvTipMessage.text = "💚 100% of the tip goes to your washer"
            binding.tvTipMessage.visibility = View.VISIBLE
        } else {
            binding.tvTipMessage.visibility = View.GONE
        }
    }

    private fun createOrder() {
        val userId = auth.currentUser?.uid
        val userEmail = auth.currentUser?.email
        
        if (userId == null) {
            Toast.makeText(this, "User not authenticated", Toast.LENGTH_SHORT).show()
            return
        }

        binding.btnConfirmBooking.isEnabled = false
        binding.progressBar.visibility = View.VISIBLE

        // Get user name
        db.collection("users").document(userId)
            .get()
            .addOnSuccessListener { userDoc ->
                val userName = userDoc.getString("name") ?: "Client"
                
                val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                val scheduledDateStr = dateFormat.format(Date(selectedDate))

                // Using updated Order model with vehicleConfigs list
                val order = Order(
                    clientId = userId,
                    clientName = userName,
                    // clientEmail removed as it is not in Order model
                    status = OrderStatus.NEW,
                    date = scheduledDateStr,
                    time = selectedTimeSlot ?: "ASAP",
                    createdAt = Timestamp.now(),
                    price = subtotal - discountAmount + tipAmount,
                    vehicleConfigs = vehicleConfigs, // Use actual config list
                    address = address,
                    discountCode = appliedCouponCode ?: "",
                    discountAmount = discountAmount,
                    tip = tipAmount
                    // Payment details could be added here if Order model supports it
                )

                // Create order in Firestore
                db.collection("orders")
                    .add(order)
                    .addOnSuccessListener { documentReference ->
                        Toast.makeText(this, "Order created successfully!", Toast.LENGTH_LONG).show()
                        
                        // Navigate to confirmation screen
                        val intent = Intent(this, BookingConfirmationActivity::class.java)
                        intent.putExtra("orderId", documentReference.id)
                        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
                        startActivity(intent)
                        finish()
                    }
                    .addOnFailureListener { e ->
                        binding.btnConfirmBooking.isEnabled = true
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(this, "Error creating order: ${e.message}", Toast.LENGTH_LONG).show()
                    }
            }
            .addOnFailureListener { e ->
                binding.btnConfirmBooking.isEnabled = true
                binding.progressBar.visibility = View.GONE
                Toast.makeText(this, "Error fetching user data: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun formatCurrency(amount: Double): String {
        return NumberFormat.getCurrencyInstance(Locale.US).format(amount)
    }
}
