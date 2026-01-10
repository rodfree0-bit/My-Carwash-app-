package com.carwash.app.ui.client

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.R
import android.widget.ImageView
import android.widget.Toast
import com.google.android.material.button.MaterialButton

class ClientPaymentsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_client_payments)

        val btnBack = findViewById<ImageView>(R.id.btnBack)
        btnBack.setOnClickListener { finish() }

        val btnAddCard = findViewById<MaterialButton>(R.id.btnAddCard)
        btnAddCard.setOnClickListener {
            // Placeholder: Stripe integration or card form
            Toast.makeText(this, "Add Card feature ready for Stripe integration", Toast.LENGTH_SHORT).show()
        }
    }
}
