package com.carwash.app.ui.client

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.FragmentClientGarageBinding
import com.carwash.app.model.Vehicle
import com.carwash.app.ui.client.adapters.GarageVehicleAdapter
import com.google.android.material.textfield.TextInputEditText
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore

class ClientGarageFragment : Fragment() {

    private var _binding: FragmentClientGarageBinding? = null
    private val binding get() = _binding!!
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    private lateinit var vehicleAdapter: GarageVehicleAdapter
    private val vehicles = mutableListOf<Vehicle>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentClientGarageBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        setupClickListeners()
        loadVehicles()
    }

    private fun setupRecyclerView() {
        vehicleAdapter = GarageVehicleAdapter(
            onEdit = { vehicle -> showEditVehicleDialog(vehicle) },
            onDelete = { vehicle -> deleteVehicle(vehicle) },
            onSetDefault = { vehicle -> setDefaultVehicle(vehicle) }
        )
        
        binding.rvVehicles.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = vehicleAdapter
        }
    }

    private fun setupClickListeners() {
        binding.fabAddVehicle.setOnClickListener {
            showAddVehicleDialog()
        }
    }

    private fun loadVehicles() {
        val userId = auth.currentUser?.uid ?: return
        
        db.collection("users").document(userId)
            .collection("vehicles")
            .addSnapshotListener { snapshots, e ->
                if (e != null || snapshots == null) {
                    showEmptyState()
                    return@addSnapshotListener
                }

                vehicles.clear()
                snapshots.documents.forEach { doc ->
                    doc.toObject(Vehicle::class.java)?.let { vehicle ->
                        vehicles.add(vehicle.copy(id = doc.id))
                    }
                }
                
                vehicleAdapter.submitList(vehicles.toList())
                updateEmptyState()
            }
    }

    private fun showAddVehicleDialog() {
        showVehicleDialog(null)
    }

    private fun showEditVehicleDialog(vehicle: Vehicle) {
        showVehicleDialog(vehicle)
    }

    private fun showVehicleDialog(vehicle: Vehicle?) {
        val layout = android.widget.LinearLayout(requireContext()).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(50, 40, 50, 40)
        }

        val inputType = TextInputEditText(requireContext()).apply {
            hint = "Vehicle Type (e.g., Sedan, SUV)"
            setText(vehicle?.type ?: "")
        }
        val inputMake = TextInputEditText(requireContext()).apply {
            hint = "Make (e.g., Toyota)"
            setText(vehicle?.make ?: "")
        }
        val inputModel = TextInputEditText(requireContext()).apply {
            hint = "Model (e.g., Camry)"
            setText(vehicle?.model ?: "")
        }
        val inputColor = TextInputEditText(requireContext()).apply {
            hint = "Color (e.g., Black)"
            setText(vehicle?.color ?: "")
        }
        val inputPlate = TextInputEditText(requireContext()).apply {
            hint = "License Plate"
            setText(vehicle?.plate ?: "")
        }

        layout.addView(inputType)
        layout.addView(inputMake)
        layout.addView(inputModel)
        layout.addView(inputColor)
        layout.addView(inputPlate)

        AlertDialog.Builder(requireContext())
            .setTitle(if (vehicle == null) "Add Vehicle" else "Edit Vehicle")
            .setView(layout)
            .setPositiveButton("Save") { _, _ ->
                val type = inputType.text.toString().trim()
                val make = inputMake.text.toString().trim()
                val model = inputModel.text.toString().trim()
                val color = inputColor.text.toString().trim()
                val plate = inputPlate.text.toString().trim()

                if (type.isEmpty() || make.isEmpty() || model.isEmpty()) {
                    Toast.makeText(requireContext(), "Please fill required fields", Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }

                val newVehicle = Vehicle(
                    id = vehicle?.id ?: "",
                    type = type,
                    make = make,
                    model = model,
                    color = color,
                    plate = plate,
                    isDefault = vehicle?.isDefault ?: false
                )

                saveVehicle(newVehicle)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun saveVehicle(vehicle: Vehicle) {
        val userId = auth.currentUser?.uid ?: return
        val vehiclesRef = db.collection("users").document(userId).collection("vehicles")

        if (vehicle.id.isEmpty()) {
            // Add new
            vehiclesRef.add(vehicle)
                .addOnSuccessListener {
                    Toast.makeText(requireContext(), "Vehicle added successfully!", Toast.LENGTH_SHORT).show()
                }
                .addOnFailureListener { e ->
                    Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
        } else {
            // Update existing
            vehiclesRef.document(vehicle.id).set(vehicle)
                .addOnSuccessListener {
                    Toast.makeText(requireContext(), "Vehicle updated!", Toast.LENGTH_SHORT).show()
                }
                .addOnFailureListener { e ->
                    Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }

    private fun deleteVehicle(vehicle: Vehicle) {
        AlertDialog.Builder(requireContext())
            .setTitle("Delete Vehicle")
            .setMessage("Are you sure you want to delete this vehicle?")
            .setPositiveButton("Delete") { _, _ ->
                val userId = auth.currentUser?.uid ?: return@setPositiveButton
                
                db.collection("users").document(userId)
                    .collection("vehicles")
                    .document(vehicle.id)
                    .delete()
                    .addOnSuccessListener {
                        Toast.makeText(requireContext(), "Vehicle deleted", Toast.LENGTH_SHORT).show()
                    }
                    .addOnFailureListener { e ->
                        Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun setDefaultVehicle(vehicle: Vehicle) {
        val userId = auth.currentUser?.uid ?: return
        val vehiclesRef = db.collection("users").document(userId).collection("vehicles")

        // Unset all defaults
        vehicles.forEach { v ->
            if (v.isDefault == true && v.id != vehicle.id) {
                vehiclesRef.document(v.id).update("isDefault", false)
            }
        }

        // Set this one as default
        vehiclesRef.document(vehicle.id).update("isDefault", true)
            .addOnSuccessListener {
                Toast.makeText(requireContext(), "Default vehicle updated", Toast.LENGTH_SHORT).show()
            }
    }

    private fun updateEmptyState() {
        if (vehicles.isEmpty()) {
            showEmptyState()
        } else {
            showVehicles()
        }
    }

    private fun showEmptyState() {
        binding.rvVehicles.visibility = View.GONE
        binding.emptyState.visibility = View.VISIBLE
    }

    private fun showVehicles() {
        binding.rvVehicles.visibility = View.VISIBLE
        binding.emptyState.visibility = View.GONE
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
