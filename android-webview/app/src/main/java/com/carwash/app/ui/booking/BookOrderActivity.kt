package com.carwash.app.ui.booking

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.carwash.app.R
import com.carwash.app.databinding.ActivityBookOrderBinding

class BookOrderActivity : AppCompatActivity() {

    private lateinit var binding: ActivityBookOrderBinding
    private val bookingViewModel: BookingViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBookOrderBinding.inflate(layoutInflater)
        setContentView(binding.root)

        onBackPressedDispatcher.addCallback(this, object : androidx.activity.OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (supportFragmentManager.backStackEntryCount > 1) {
                    supportFragmentManager.popBackStack()
                } else {
                    finish()
                }
            }
        })

        if (savedInstanceState == null) {
            loadFragment(SelectVehicleFragment())
        }
    }

    fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.contentContainer, fragment)
            .addToBackStack(null)
            .commit()
    }
}
