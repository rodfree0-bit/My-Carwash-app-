package com.carwash.app

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.carwash.app.databinding.ActivityAdminDashboardNewBinding
import com.carwash.app.ui.admin.fragments.*
import com.google.android.material.navigation.NavigationBarView
import com.google.firebase.auth.FirebaseAuth

class AdminDashboardActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityAdminDashboardNewBinding
    private lateinit var auth: FirebaseAuth
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminDashboardNewBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        auth = FirebaseAuth.getInstance()
        
        // Setup toolbar
        setSupportActionBar(binding.toolbar)
        
        // Setup bottom navigation
        binding.bottomNavigation.setOnItemSelectedListener(navigationItemSelectedListener)
        
        // Load default fragment
        if (savedInstanceState == null) {
            loadFragment(com.carwash.app.ui.admin.fragments.AdminOrdersFragment())
            binding.toolbar.title = "Orders"
        }
    }
    
    private val navigationItemSelectedListener = NavigationBarView.OnItemSelectedListener { item ->
        val fragment: Fragment
        val title: String
        
        when (item.itemId) {
            R.id.nav_orders -> {
                fragment = com.carwash.app.ui.admin.fragments.AdminOrdersFragment()
                title = "Orders"
            }
            R.id.nav_team -> {
                fragment = AdminTeamFragment()
                title = "Team"
            }
            R.id.nav_clients -> {
                fragment = AdminClientsFragment()
                title = "Clients"
            }
            R.id.nav_services -> {
                fragment = AdminServicesFragment()
                title = "Services"
            }
            R.id.nav_metrics -> {
                fragment = AdminMetricsFragment()
                title = "Metrics"
            }
            else -> return@OnItemSelectedListener false
        }
        
        loadFragment(fragment)
        binding.toolbar.title = title
        true
    }
    
    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.nav_host_fragment, fragment)
            .commit()
    }
    
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.admin_toolbar_menu, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> {
                // Navigate to settings
                startActivity(Intent(this, com.carwash.app.ui.admin.AdminSettingsActivity::class.java))
                true
            }
            R.id.action_logout -> {
                auth.signOut()
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}
