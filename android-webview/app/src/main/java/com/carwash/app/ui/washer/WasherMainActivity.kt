package com.carwash.app.ui.washer

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.carwash.app.R
import com.carwash.app.databinding.ActivityWasherMainBinding
import com.carwash.app.ui.washer.fragments.WasherAvailableOrdersFragment
import com.carwash.app.ui.washer.fragments.WasherHistoryFragment
import com.carwash.app.ui.washer.fragments.WasherMyOrdersFragment

class WasherMainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityWasherMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWasherMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupBottomNavigation()
        
        // Load default fragment
        if (savedInstanceState == null) {
            loadFragment(WasherAvailableOrdersFragment())
        }
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_available -> {
                    loadFragment(WasherAvailableOrdersFragment())
                    true
                }
                R.id.nav_my_orders -> {
                    loadFragment(WasherMyOrdersFragment())
                    true
                }
                R.id.nav_history -> {
                    loadFragment(WasherHistoryFragment())
                    true
                }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
