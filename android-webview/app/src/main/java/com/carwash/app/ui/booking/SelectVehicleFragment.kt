package com.carwash.app.ui.booking

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.carwash.app.databinding.FragmentSelectVehicleBinding

class SelectVehicleFragment : Fragment() {

    private var _binding: FragmentSelectVehicleBinding? = null
    private val binding get() = _binding!!

    private val bookingViewModel: BookingViewModel by activityViewModels()
    private val selectedVehicleIds = mutableListOf<String>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSelectVehicleBinding.inflate(inflater, container, false)

        setupButtons()
        loadSavedVehicles()

        return binding.root
    }

    private fun setupButtons() {
        binding.btnNext.setOnClickListener {
            if (selectedVehicleIds.isEmpty()) {
                Toast.makeText(context, "Please select at least one vehicle", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            
            bookingViewModel.setSelectedVehicles(selectedVehicleIds)
            
            // Navigate to service selection
            Toast.makeText(context, "${selectedVehicleIds.size} vehicle(s) selected", Toast.LENGTH_SHORT).show()
        }
        
        binding.btnAddVehicle.setOnClickListener {
            // Show dialog to add new vehicle
            Toast.makeText(context, "Add vehicle dialog", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadSavedVehicles() {
        // TODO: Load user's saved vehicles from Firestore
        Toast.makeText(context, "Loading saved vehicles...", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
