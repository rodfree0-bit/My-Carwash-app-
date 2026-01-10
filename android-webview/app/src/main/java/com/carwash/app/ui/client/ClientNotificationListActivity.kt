package com.carwash.app.ui.client

import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R

class ClientNotificationListActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_client_notification_list)

        findViewById<ImageView>(R.id.btnBack).setOnClickListener { finish() }

        val recycler = findViewById<RecyclerView>(R.id.recyclerNotifications)
        recycler.layoutManager = LinearLayoutManager(this)
        // TODO: Create NotificationAdapter and fetch real notifications from Firestore
    }
}
