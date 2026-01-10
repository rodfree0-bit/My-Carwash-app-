package com.carwash.app.ui.booking

import android.app.Dialog
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.carwash.app.databinding.ActivityVehicleSelectionBinding
import com.carwash.app.databinding.DialogAddVehicleBinding
import com.carwash.app.model.SavedVehicle
import com.carwash.app.model.User
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import java.util.UUID

class VehicleSelectionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityVehicleSelectionBinding
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    
    // Adapter now expects SavedVehicle
    private val vehicleAdapter = VehicleSelectionAdapter { vehicle, isSelected ->
        onVehicleSelectionChanged(vehicle, isSelected)
    }
    
    private val selectedVehicles = mutableListOf<SavedVehicle>()
    private val allVehicles = mutableListOf<SavedVehicle>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVehicleSelectionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupRecyclerView()
        setupButtons()
        loadVehicles()
    }

    private fun setupToolbar() {
        binding.btnClose.setOnClickListener {
            finish()
        }
    }

    private fun setupRecyclerView() {
        binding.recyclerSavedVehicles.apply {
            layoutManager = LinearLayoutManager(this@VehicleSelectionActivity)
            adapter = vehicleAdapter
        }
    }

    private fun setupButtons() {
        binding.btnAddNewVehicle.setOnClickListener {
            showAddVehicleDialog()
        }

        binding.btnContinue.setOnClickListener {
            if (selectedVehicles.isNotEmpty()) {
                // Pass selected vehicle IDs to next activity
                val intent = Intent(this, ServiceSelectionActivity::class.java)
                intent.putStringArrayListExtra("selectedVehicles", ArrayList(selectedVehicles.map { it.id }))
                startActivity(intent)
            } else {
                Toast.makeText(this, "Please select at least one vehicle", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadVehicles() {
        val userId = auth.currentUser?.uid ?: return
        
        // Listen to the user document directly (single source of truth for savedVehicles array)
        db.collection("users").document(userId)
            .addSnapshotListener { snapshot, e ->
                if (e != null) {
                    Toast.makeText(this, "Error loading vehicles: ${e.message}", Toast.LENGTH_SHORT).show()
                    return@addSnapshotListener
                }

                if (snapshot != null && snapshot.exists()) {
                    val user = snapshot.toObject(User::class.java)
                    if (user != null) {
                        allVehicles.clear()
                        allVehicles.addAll(user.savedVehicles)
                        
                        vehicleAdapter.submitList(ArrayList(allVehicles))
                        updateEmptyState()
                    }
                }
            }
    }

    private fun showAddVehicleDialog() {
        val dialog = Dialog(this)
        val dialogBinding = DialogAddVehicleBinding.inflate(layoutInflater)
        dialog.setContentView(dialogBinding.root)
        dialog.window?.setLayout(
            (resources.displayMetrics.widthPixels * 0.9).toInt(),
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)

        // Load vehicle types for Dropdown - Fetch from 'vehicleTypes' collection or defaults
        val vehicleTypesList = mutableListOf<String>()
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, vehicleTypesList)
        dialogBinding.actvVehicleType.setAdapter(adapter)

        db.collection("vehicleTypes").get()
            .addOnSuccessListener { snapshots ->
                vehicleTypesList.clear()
                if (!snapshots.isEmpty) {
                     snapshots.documents.forEach { doc ->
                        val name = doc.getString("name")
                        if (name != null) vehicleTypesList.add(name)
                    }
                } else {
                    // Fallback
                    vehicleTypesList.addAll(listOf("Sedan", "SUV", "Truck", "Motorcycle", "Van"))
                }
                adapter.notifyDataSetChanged()
            }
            .addOnFailureListener {
                 vehicleTypesList.addAll(listOf("Sedan", "SUV", "Truck", "Motorcycle", "Van"))
                 adapter.notifyDataSetChanged()
            }

        dialogBinding.btnSave.setOnClickListener {
            val model = dialogBinding.etModel.text.toString().trim()
            val plate = dialogBinding.etPlate.text.toString().trim()
            val color = dialogBinding.etColor.text.toString().trim()
            val selectedType = dialogBinding.actvVehicleType.text.toString().trim()
            val make = dialogBinding.etMake.text.toString().trim()

            if (selectedType.isBlank()) {
                Toast.makeText(this, "Please select a vehicle type", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (model.isBlank() || plate.isBlank() || make.isBlank()) {
                Toast.makeText(this, "Please fill all required fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Create new SavedVehicle
            val newVehicle = SavedVehicle(
                id = UUID.randomUUID().toString(),
                type = selectedType,
                make = make,
                model = model,
                color = color,
                plate = plate,
                isDefault = allVehicles.isEmpty() // Default if first one
            )

            saveVehicle(newVehicle) {
                dialog.dismiss()
            }
        }

        dialogBinding.btnCancel.setOnClickListener {
            dialog.dismiss()
        }

        dialog.show()
    }

    private fun saveVehicle(vehicle: SavedVehicle, onSuccess: () -> Unit) {
        val userId = auth.currentUser?.uid ?: return
        
        // Use arrayUnion to add to the savedVehicles array in user document
        db.collection("users").document(userId)
            .update("savedVehicles", FieldValue.arrayUnion(vehicle))
            .addOnSuccessListener {
                Toast.makeText(this, "Vehicle added successfully", Toast.LENGTH_SHORT).show()
                onSuccess()
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Error adding vehicle: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun onVehicleSelectionChanged(vehicle: SavedVehicle, isSelected: Boolean) {
        if (isSelected) {
            selectedVehicles.add(vehicle)
        } else {
            selectedVehicles.remove(vehicle)
        }
        
        // Update adapter visuals
        vehicleAdapter.updateSelection(selectedVehicles.map { it.id }.toSet())
        updateUI()
    }

    private fun updateUI() {
        val hasSelection = selectedVehicles.isNotEmpty()
        binding.btnContinue.isEnabled = hasSelection
        binding.btnContinue.backgroundTintList = ColorStateList.valueOf(
            if (hasSelection) Color.parseColor("#2563EB") 
            else Color.parseColor("#334155")
        )
    }

    private fun updateEmptyState() {
        if (allVehicles.isEmpty()) {
            binding.recyclerSavedVehicles.visibility = View.GONE
            Toast.makeText(this, "No vehicles saved. Add your first vehicle!", Toast.LENGTH_LONG).show()
        } else {
            binding.recyclerSavedVehicles.visibility = View.VISIBLE
        }
    }
}
