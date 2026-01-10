package com.carwash.app.ui.booking

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.R
import com.carwash.app.databinding.FragmentSelectServiceBinding
import com.carwash.app.model.ServicePackage
import com.carwash.app.model.VehicleServiceConfig
import com.google.firebase.firestore.FirebaseFirestore

class SelectServiceFragment : Fragment() {

    private var _binding: FragmentSelectServiceBinding? = null
    private val binding get() = _binding!!

    private val bookingViewModel: BookingViewModel by activityViewModels()
    private val db = FirebaseFirestore.getInstance()
    
    private var currentVehicleId: String = ""
    private var currentVehicleType: String = "sedan"
    private var selectedPackage: ServicePackage? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSelectServiceBinding.inflate(inflater, container, false)

        // Get current vehicle from arguments or ViewModel
        currentVehicleId = arguments?.getString("vehicleId") ?: ""
        currentVehicleType = arguments?.getString("vehicleType") ?: "sedan"

        fetchPackages()
        setupButtons()

        return binding.root
    }

    private fun setupButtons() {
        binding.btnNext.setOnClickListener {
            if (selectedPackage == null) {
                Toast.makeText(context, "Please select a package", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            
            // Save configuration to ViewModel
            val config = VehicleServiceConfig(
                vehicleId = currentVehicleId,
                vehicleModel = arguments?.getString("vehicleModel") ?: "",
                vehicleType = currentVehicleType,
                packageId = selectedPackage!!.id,
                packageName = selectedPackage!!.name,
                packagePrice = selectedPackage!!.price[currentVehicleType] ?: 0.0,
                addonIds = emptyList(),
                addonNames = emptyList(),
                addonsPrice = 0.0
            )
            
            bookingViewModel.setVehicleConfig(currentVehicleId, config)
            
            // Navigate to next screen (addons or next vehicle)
            // TODO: Implement navigation
            Toast.makeText(context, "Package selected successfully", Toast.LENGTH_SHORT).show()
        }
    }

    private fun fetchPackages() {
        db.collection("packages").get()
            .addOnSuccessListener { result ->
                if (!result.isEmpty) {
                    val packages = result.documents.mapNotNull { doc ->
                        doc.toObject(ServicePackage::class.java)?.copy(id = doc.id)
                    }
                    displayPackages(packages)
                } else {
                    Toast.makeText(context, "No packages available", Toast.LENGTH_SHORT).show()
                }
            }
            .addOnFailureListener {
                Toast.makeText(context, "Error loading packages", Toast.LENGTH_SHORT).show()
            }
    }
    
    private fun displayPackages(packages: List<ServicePackage>) {
        // TODO: Implement RecyclerView adapter for packages
        // For now, just show count
        Toast.makeText(context, "Loaded ${packages.size} packages", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
