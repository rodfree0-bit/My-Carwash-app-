package com.carwash.app.ui.booking

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import com.carwash.app.databinding.ActivityDateTimeSelectionBinding
import com.carwash.app.model.VehicleServiceConfig
import com.google.android.material.datepicker.MaterialDatePicker
import java.text.SimpleDateFormat
import java.util.*

class DateTimeSelectionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDateTimeSelectionBinding
    private lateinit var vehicleConfigs: ArrayList<VehicleServiceConfig>
    
    private val timeSlotAdapter = TimeSlotAdapter { timeSlot ->
        onTimeSlotSelected(timeSlot)
    }
    
    private val calendarAdapter = CalendarAdapter { date ->
        onDateSelected(date)
    }
    
    private var selectedDate: Date? = null
    private var selectedTimeSlot: String? = null
    private var isAsap = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDateTimeSelectionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Receive Serializable list
        val extras = intent.getSerializableExtra("vehicleConfigs")
        if (extras is ArrayList<*>) {
            @Suppress("UNCHECKED_CAST")
            vehicleConfigs = extras as ArrayList<VehicleServiceConfig>
        } else {
            vehicleConfigs = arrayListOf()
        }
        
        if (vehicleConfigs.isEmpty()) {
            Toast.makeText(this, "No vehicle configurations found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        setupToolbar()
        setupRecyclerViews()
        setupChipListener()
        setupButtons()
        loadData()
    }
    
    private fun setupChipListener() {
         binding.chipAsap.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                isAsap = true
                selectedDate = Date()
                selectedTimeSlot = "ASAP"
                calendarAdapter.selectDate(null) // Deselect calendar
                binding.rvTimeSlots.visibility = android.view.View.GONE
                updateUI()
            } else {
                isAsap = false
                selectedTimeSlot = null
                // Reselect today or first date? For now require reselect
                binding.rvTimeSlots.visibility = android.view.View.VISIBLE
                updateUI()
            }
        }
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun setupRecyclerViews() {
        // Calendar
        binding.rvDates.apply {
            layoutManager = androidx.recyclerview.widget.LinearLayoutManager(this@DateTimeSelectionActivity, androidx.recyclerview.widget.LinearLayoutManager.HORIZONTAL, false)
            adapter = calendarAdapter
        }

        // Time Slots
        binding.rvTimeSlots.apply {
            layoutManager = GridLayoutManager(this@DateTimeSelectionActivity, 3)
            adapter = timeSlotAdapter
        }
    }
    
    private fun loadData() {
        generateDates()
        
        // Select today by default if not ASAP
        if (!isAsap) {
            val today = Date()
            onDateSelected(today)
        }
    }

    private fun generateDates() {
        val dates = mutableListOf<Date>()
        val calendar = Calendar.getInstance()
        
        // Add next 14 days
        for (i in 0 until 14) {
            dates.add(calendar.time)
            calendar.add(Calendar.DAY_OF_YEAR, 1)
        }
        
        calendarAdapter.submitList(dates)
    }

    private fun onDateSelected(date: Date) {
        selectedDate = date
        calendarAdapter.selectDate(date)
        isAsap = false
        binding.chipAsap.isChecked = false
        
        // Update Month/Year Header
        val monthFormat = SimpleDateFormat("MMMM yyyy", Locale.US)
        binding.tvMonthYear.text = monthFormat.format(date)
        
        generateTimeSlots()
        binding.rvTimeSlots.visibility = android.view.View.VISIBLE
        updateUI()
    }

    private fun generateTimeSlots() {
        val timeSlots = mutableListOf<String>()
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 8)
        calendar.set(Calendar.MINUTE, 0)

        // Generate slots from 8:00 AM to 6:00 PM (every 30 minutes)
        while (calendar.get(Calendar.HOUR_OF_DAY) < 18) {
            val timeFormat = SimpleDateFormat("h:mm a", Locale.US)
            timeSlots.add(timeFormat.format(calendar.time))
            calendar.add(Calendar.MINUTE, 30)
        }

        timeSlotAdapter.submitList(timeSlots)
    }

    private fun onTimeSlotSelected(timeSlot: String) {
        selectedTimeSlot = timeSlot
        isAsap = false
        binding.chipAsap.isChecked = false
        updateUI()
    }

    private fun setupButtons() {
        binding.btnContinue.setOnClickListener {
            if (selectedDate == null) {
                Toast.makeText(this, "Please select a date", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (selectedTimeSlot == null && !isAsap) {
                Toast.makeText(this, "Please select a time slot", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Move to address selection
            val intent = Intent(this, AddressActivity::class.java)
            // Pass the Serializable list
            intent.putExtra("vehicleConfigs", vehicleConfigs)
            intent.putExtra("selectedDate", selectedDate?.time)
            intent.putExtra("selectedTimeSlot", selectedTimeSlot)
            intent.putExtra("isAsap", isAsap)
            startActivity(intent)
        }
    }

    private fun updateUI() {
        binding.btnContinue.isEnabled = selectedDate != null && (selectedTimeSlot != null || isAsap)
    }
}
