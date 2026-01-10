package com.carwash.app.ui.admin

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.databinding.ActivityAdminManageListBinding
import com.carwash.app.model.Addon
import com.carwash.app.model.ServiceFee
import com.google.firebase.firestore.FirebaseFirestore

class AdminAddonsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminManageListBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var addonAdapter: AddonAdapter
    private val vehicleTypes = listOf("Sedan", "SUV", "Truck", "Van", "Other")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminManageListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()

        binding.txtTitle.text = "Add-ons"
        binding.btnBack.setOnClickListener { finish() }

        addonAdapter = AddonAdapter(
            onEditClick = { addon -> showEditDialog(addon) },
            onDeleteClick = { addon -> deleteAddon(addon) }
        )
        
        binding.recyclerItems.layoutManager = LinearLayoutManager(this)
        binding.recyclerItems.adapter = addonAdapter

        binding.fabAdd.setOnClickListener {
            showEditDialog(null)
        }

        loadAddons()
    }

    private fun loadAddons() {
        db.collection("addons").addSnapshotListener { snapshots, e ->
            if (e == null && snapshots != null) {
                val addons = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(Addon::class.java)?.copy(id = doc.id)
                }
                addonAdapter.submitList(addons)
            }
        }
    }

    private fun showEditDialog(addon: Addon?) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_edit_addon, null)
        
        val inputName = dialogView.findViewById<EditText>(R.id.inputName)
        val inputDescription = dialogView.findViewById<EditText>(R.id.inputDescription)
        val inputDuration = dialogView.findViewById<EditText>(R.id.inputDuration)
        val pricesContainer = dialogView.findViewById<LinearLayout>(R.id.pricesContainer)
        val inputWasherCommission = dialogView.findViewById<EditText>(R.id.inputWasherCommission)
        val inputAppCommission = dialogView.findViewById<EditText>(R.id.inputAppCommission)
        val feesContainer = dialogView.findViewById<LinearLayout>(R.id.feesContainer)
        val btnAddFee = dialogView.findViewById<Button>(R.id.btnAddFee)

        addon?.let {
            inputName.setText(it.name)
            inputDescription.setText(it.description)
            inputDuration.setText(it.duration)
            inputWasherCommission.setText(it.washerCommission.toString())
            inputAppCommission.setText(it.appCommission.toString())
        }

        val priceInputs = mutableMapOf<String, EditText>()
        vehicleTypes.forEach { type ->
            val priceRow = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                setPadding(0, 8, 0, 8)
            }
            
            val label = TextView(this).apply {
                text = type
                textSize = 14f
                setTextColor(getColor(android.R.color.white))
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }
            
            val input = EditText(this).apply {
                hint = "Price"
                inputType = android.text.InputType.TYPE_CLASS_NUMBER or android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL
                setText(addon?.price?.get(type)?.toString() ?: "0")
                setTextColor(getColor(android.R.color.white))
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }
            
            priceInputs[type] = input
            priceRow.addView(label)
            priceRow.addView(input)
            pricesContainer.addView(priceRow)
        }

        val fees = mutableListOf<Pair<EditText, EditText>>()
        addon?.fees?.forEach { fee ->
            addFeeRow(feesContainer, fees, fee.name, fee.percentage)
        }

        btnAddFee.setOnClickListener {
            addFeeRow(feesContainer, fees, "", 0.0)
        }

        AlertDialog.Builder(this)
            .setTitle(if (addon == null) "Add Add-on" else "Edit Add-on")
            .setView(dialogView)
            .setPositiveButton("Save") { _, _ ->
                val name = inputName.text.toString()
                val description = inputDescription.text.toString()
                val duration = inputDuration.text.toString()
                val prices = priceInputs.mapValues { it.value.text.toString().toDoubleOrNull() ?: 0.0 }
                val washerCommission = inputWasherCommission.text.toString().toIntOrNull() ?: 80
                val appCommission = inputAppCommission.text.toString().toIntOrNull() ?: 20
                val serviceFees = fees.map { (nameInput, percentInput) ->
                    ServiceFee(
                        name = nameInput.text.toString(),
                        percentage = percentInput.text.toString().toDoubleOrNull() ?: 0.0
                    )
                }.filter { it.name.isNotEmpty() }

                val newAddon = Addon(
                    id = addon?.id ?: "",
                    name = name,
                    description = description,
                    duration = duration,
                    price = prices,
                    washerCommission = washerCommission,
                    appCommission = appCommission,
                    fees = serviceFees
                )

                saveAddon(newAddon)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun addFeeRow(container: LinearLayout, fees: MutableList<Pair<EditText, EditText>>, feeName: String, feePercent: Double) {
        val feeRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, 8, 0, 8)
        }

        val nameInput = EditText(this).apply {
            hint = "Fee name"
            setText(feeName)
            setTextColor(getColor(android.R.color.white))
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 2f)
        }

        val percentInput = EditText(this).apply {
            hint = "%"
            inputType = android.text.InputType.TYPE_CLASS_NUMBER or android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL
            setText(if (feePercent > 0) feePercent.toString() else "")
            setTextColor(getColor(android.R.color.white))
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        }

        val deleteBtn = Button(this).apply {
            text = "X"
            setOnClickListener {
                container.removeView(feeRow)
                fees.remove(Pair(nameInput, percentInput))
            }
        }

        fees.add(Pair(nameInput, percentInput))
        feeRow.addView(nameInput)
        feeRow.addView(percentInput)
        feeRow.addView(deleteBtn)
        container.addView(feeRow)
    }

    private fun saveAddon(addon: Addon) {
        val docRef = if (addon.id.isEmpty()) {
            db.collection("addons").document()
        } else {
            db.collection("addons").document(addon.id)
        }

        docRef.set(addon.copy(id = docRef.id))
            .addOnSuccessListener {
                Toast.makeText(this, "Add-on saved", Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error: ${it.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun deleteAddon(addon: Addon) {
        AlertDialog.Builder(this)
            .setTitle("Delete Add-on")
            .setMessage("Are you sure you want to delete ${addon.name}?")
            .setPositiveButton("Delete") { _, _ ->
                db.collection("addons").document(addon.id).delete()
                    .addOnSuccessListener {
                        Toast.makeText(this, "Add-on deleted", Toast.LENGTH_SHORT).show()
                    }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}

class AddonAdapter(
    private val onEditClick: (Addon) -> Unit,
    private val onDeleteClick: (Addon) -> Unit
) : RecyclerView.Adapter<AddonAdapter.ViewHolder>() {

    private var addons = listOf<Addon>()

    fun submitList(newAddons: List<Addon>) {
        addons = newAddons
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_addon_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(addons[position], onEditClick, onDeleteClick)
    }

    override fun getItemCount() = addons.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val addonName: TextView = itemView.findViewById(R.id.addonName)
        private val addonDescription: TextView = itemView.findViewById(R.id.addonDescription)
        private val addonPrice: TextView = itemView.findViewById(R.id.addonPrice)
        private val addonDuration: TextView = itemView.findViewById(R.id.addonDuration)
        private val btnEdit: ImageButton = itemView.findViewById(R.id.btnEdit)
        private val btnDelete: ImageButton = itemView.findViewById(R.id.btnDelete)

        fun bind(addon: Addon, onEditClick: (Addon) -> Unit, onDeleteClick: (Addon) -> Unit) {
            addonName.text = addon.name
            addonDescription.text = addon.description
            addonPrice.text = "$${addon.price["Sedan"] ?: 0}+"
            addonDuration.text = addon.duration

            btnEdit.setOnClickListener { onEditClick(addon) }
            btnDelete.setOnClickListener { onDeleteClick(addon) }
        }
    }
}
