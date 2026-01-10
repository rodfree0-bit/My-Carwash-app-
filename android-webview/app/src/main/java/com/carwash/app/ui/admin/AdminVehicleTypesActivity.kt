package com.carwash.app.ui.admin

import android.app.AlertDialog
import android.graphics.Color
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.databinding.ActivityAdminManageListBinding
import com.carwash.app.model.VehicleType
import com.google.firebase.firestore.FirebaseFirestore

class AdminVehicleTypesActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminManageListBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var vehicleTypeAdapter: VehicleTypeAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminManageListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()

        binding.txtTitle.text = "Vehicle Types"
        binding.btnBack.setOnClickListener { finish() }

        vehicleTypeAdapter = VehicleTypeAdapter(
            onEditClick = { type -> showEditDialog(type) },
            onDeleteClick = { type -> deleteVehicleType(type) }
        )
        
        binding.recyclerItems.layoutManager = LinearLayoutManager(this)
        binding.recyclerItems.adapter = vehicleTypeAdapter

        binding.fabAdd.setOnClickListener {
            showEditDialog(null)
        }

        loadVehicleTypes()
    }

    private fun loadVehicleTypes() {
        db.collection("vehicle_types").addSnapshotListener { snapshots, e ->
            if (e == null && snapshots != null) {
                val types = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(VehicleType::class.java)?.copy(id = doc.id)
                }
                vehicleTypeAdapter.submitList(types)
            }
        }
    }

    private fun showEditDialog(vehicleType: VehicleType?) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_edit_vehicle_type, null)
        
        val inputName = dialogView.findViewById<EditText>(R.id.inputName)
        val inputIcon = dialogView.findViewById<EditText>(R.id.inputIcon)
        val iconPreview = dialogView.findViewById<TextView>(R.id.iconPreview)
        val iconGrid = dialogView.findViewById<androidx.gridlayout.widget.GridLayout>(R.id.iconGrid)

        vehicleType?.let {
            inputName.setText(it.name)
            inputIcon.setText(it.icon)
            iconPreview.text = it.icon
        }

        // Update preview when typing
        inputIcon.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                iconPreview.text = s?.toString() ?: "🚗"
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })

        // Quick select icons
        val quickIcons = listOf(
            "🚗" to "Sedan",
            "🚙" to "SUV",
            "🛻" to "Pickup",
            "🚐" to "Van",
            "🚚" to "Trailer",
            "🏍️" to "Moto",
            "🚜" to "Tractor",
            "🚌" to "Bus",
            "🚕" to "Taxi",
            "🚓" to "Police"
        )

        quickIcons.forEach { (icon, _) ->
            val iconButton = Button(this).apply {
                text = icon
                textSize = 20f
                setOnClickListener {
                    inputIcon.setText(icon)
                    iconPreview.text = icon
                }
                layoutParams = ViewGroup.MarginLayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(4, 4, 4, 4)
                }
            }
            iconGrid.addView(iconButton)
        }

        AlertDialog.Builder(this)
            .setTitle(if (vehicleType == null) "Add Vehicle Type" else "Edit Vehicle Type")
            .setView(dialogView)
            .setPositiveButton("Save") { _, _ ->
                val name = inputName.text.toString()
                val icon = inputIcon.text.toString().ifEmpty { "🚗" }

                val newType = VehicleType(
                    id = vehicleType?.id ?: "",
                    name = name,
                    icon = icon
                )

                saveVehicleType(newType)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun saveVehicleType(type: VehicleType) {
        val docRef = if (type.id.isEmpty()) {
            db.collection("vehicle_types").document()
        } else {
            db.collection("vehicle_types").document(type.id)
        }

        docRef.set(type.copy(id = docRef.id))
            .addOnSuccessListener {
                Toast.makeText(this, "Vehicle type saved", Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error: ${it.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun deleteVehicleType(type: VehicleType) {
        AlertDialog.Builder(this)
            .setTitle("Delete Vehicle Type")
            .setMessage("Are you sure you want to delete ${type.name}?")
            .setPositiveButton("Delete") { _, _ ->
                db.collection("vehicle_types").document(type.id).delete()
                    .addOnSuccessListener {
                        Toast.makeText(this, "Vehicle type deleted", Toast.LENGTH_SHORT).show()
                    }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}

class VehicleTypeAdapter(
    private val onEditClick: (VehicleType) -> Unit,
    private val onDeleteClick: (VehicleType) -> Unit
) : RecyclerView.Adapter<VehicleTypeAdapter.ViewHolder>() {

    private var types = listOf<VehicleType>()

    fun submitList(newTypes: List<VehicleType>) {
        types = newTypes
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_vehicle_type_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(types[position], onEditClick, onDeleteClick)
    }

    override fun getItemCount() = types.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val vehicleIcon: TextView = itemView.findViewById(R.id.vehicleIcon)
        private val vehicleName: TextView = itemView.findViewById(R.id.vehicleName)
        private val btnEdit: ImageButton = itemView.findViewById(R.id.btnEdit)
        private val btnDelete: ImageButton = itemView.findViewById(R.id.btnDelete)

        fun bind(type: VehicleType, onEditClick: (VehicleType) -> Unit, onDeleteClick: (VehicleType) -> Unit) {
            vehicleName.text = type.name
            vehicleIcon.text = type.icon

            btnEdit.setOnClickListener { onEditClick(type) }
            btnDelete.setOnClickListener { onDeleteClick(type) }
        }
    }
}
