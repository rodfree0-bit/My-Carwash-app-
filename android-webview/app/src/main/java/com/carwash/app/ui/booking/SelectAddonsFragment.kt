package com.carwash.app.ui.booking

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.carwash.app.databinding.FragmentSelectAddonsBinding
import com.carwash.app.model.ServiceAddon
import com.google.firebase.firestore.FirebaseFirestore

class SelectAddonsFragment : Fragment() {

    private var _binding: FragmentSelectAddonsBinding? = null
    private val binding get() = _binding!!

    private val bookingViewModel: BookingViewModel by activityViewModels()
    private val db = FirebaseFirestore.getInstance()
    
    private var currentVehicleId: String = ""
    private var currentVehicleType: String = "sedan"
    private val selectedAddons = mutableListOf<ServiceAddon>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSelectAddonsBinding.inflate(inflater, container, false)

        currentVehicleId = arguments?.getString("vehicleId") ?: ""
        currentVehicleType = arguments?.getString("vehicleType") ?: "sedan"

        fetchAddons()
        setupButtons()

        return binding.root
    }

    private fun setupButtons() {
        binding.btnNext.setOnClickListener {
            // Update vehicle config with selected addons
            val currentConfig = bookingViewModel.vehicleConfigs.value?.get(currentVehicleId)
            if (currentConfig != null) {
                val updatedConfig = currentConfig.copy(
                    addonIds = selectedAddons.map { it.id },
                    addonNames = selectedAddons.map { it.name },
                    addonsPrice = selectedAddons.sumOf { it.price[currentVehicleType] ?: 0.0 }
                )
                bookingViewModel.setVehicleConfig(currentVehicleId, updatedConfig)
            }
            
            // Navigate to next screen
            Toast.makeText(context, "Addons saved successfully", Toast.LENGTH_SHORT).show()
        }
        
        binding.btnSkip.setOnClickListener {
            // Skip addons, just navigate to next screen
            Toast.makeText(context, "Skipped addons", Toast.LENGTH_SHORT).show()
        }
    }

    private fun fetchAddons() {
        db.collection("addons").get()
            .addOnSuccessListener { result ->
                if (!result.isEmpty) {
                    val addons = result.documents.mapNotNull { doc ->
                        doc.toObject(ServiceAddon::class.java)?.copy(id = doc.id)
                    }
                    displayAddons(addons)
                } else {
                    Toast.makeText(context, "No addons available", Toast.LENGTH_SHORT).show()
                }
            }
            .addOnFailureListener {
                Toast.makeText(context, "Error loading addons", Toast.LENGTH_SHORT).show()
            }
    }
    
    private fun displayAddons(addons: List<ServiceAddon>) {
        // TODO: Implement RecyclerView adapter for addons
        Toast.makeText(context, "Loaded ${addons.size} addons", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
