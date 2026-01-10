package com.carwash.app.ui.client

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityRatingBinding
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore

class RatingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRatingBinding
    private val db = FirebaseFirestore.getInstance()
    private lateinit var orderId: String
    private var selectedRating = 0
    private var selectedTip = 0.0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRatingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        orderId = intent.getStringExtra("orderId") ?: return finish()

        setupRating()
        setupTipSelection()
        setupSubmit()
    }

    private fun setupRating() {
        binding.ratingBar.setOnRatingBarChangeListener { _, rating, _ ->
            selectedRating = rating.toInt()
        }
    }

    private fun setupTipSelection() {
        binding.btnTip10.setOnClickListener { selectTip(10.0) }
        binding.btnTip15.setOnClickListener { selectTip(15.0) }
        binding.btnTip20.setOnClickListener { selectTip(20.0) }
        binding.btnCustomTip.setOnClickListener {
            val custom = binding.inputCustomTip.text.toString().toDoubleOrNull() ?: 0.0
            selectTip(custom)
        }
    }

    private fun selectTip(amount: Double) {
        selectedTip = amount
        binding.txtSelectedTip.text = "Tip: $$amount"
    }

    private fun setupSubmit() {
        binding.btnSubmit.setOnClickListener {
            if (selectedRating == 0) {
                Toast.makeText(this, "Please select a rating", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val review = binding.inputReview.text.toString()

            val ratingData = hashMapOf(
                "clientRating" to selectedRating,
                "clientReview" to review,
                "tip" to selectedTip,
                "ratedAt" to FieldValue.serverTimestamp()
            )

            // Get referencing washerId to update stats
            db.collection("orders").document(orderId)
                .get()
                .addOnSuccessListener { orderSnapshot ->
                    val washerId = orderSnapshot.getString("washerId")
                    
                    if (washerId != null) {
                        updateOrderAndWasherStats(washerId, ratingData)
                    } else {
                        // Just update order if washerId missing (should not happen)
                         db.collection("orders").document(orderId).update(ratingData as Map<String, Any>)
                         finish()
                    }
                }
        }
    }

    private fun updateOrderAndWasherStats(washerId: String, ratingData: HashMap<String, Any>) {
        db.runTransaction { transaction ->
            val washerRef = db.collection("users").document(washerId)
            val washerSnapshot = transaction.get(washerRef)
            
            // Current stats
            val currentRating = washerSnapshot.getDouble("rating") ?: 5.0
            val currentCount = washerSnapshot.getLong("ratingCount") ?: 0 // Add this field to User model if missing, or specific stats field
            val totalRatingsSum = currentRating * currentCount
            
            // New stats
            val newCount = currentCount + 1
            val newRating = (totalRatingsSum + selectedRating) / newCount
            
            // Update Washer
            transaction.update(washerRef, "rating", newRating)
            transaction.update(washerRef, "ratingCount", newCount) // Ensure this field exists or created
            
            // Update Order
            val orderRef = db.collection("orders").document(orderId)
            transaction.update(orderRef, ratingData as Map<String, Any>)
            
        }.addOnSuccessListener {
            Toast.makeText(this, "Rating submitted! Thank you.", Toast.LENGTH_LONG).show()
            finish()
        }.addOnFailureListener { e ->
             Toast.makeText(this, "Error submitting rating: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }
}
