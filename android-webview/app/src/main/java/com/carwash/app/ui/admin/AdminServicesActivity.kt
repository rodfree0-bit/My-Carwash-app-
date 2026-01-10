/* TEMPORARILY COMMENTED OUT - Needs refactoring to use ServicePackage model instead of Package
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
import com.bumptech.glide.Glide
import com.carwash.app.R
import com.carwash.app.databinding.ActivityAdminManageListBinding
import com.carwash.app.model.Package
import com.carwash.app.model.ServiceFee
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.firebase.firestore.FirebaseFirestore

class AdminServicesActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminManageListBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var packageAdapter: PackageAdapter
    private val vehicleTypes = listOf("Sedan", "SUV", "Truck", "Van", "Other")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminManageListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()

        binding.txtTitle.text = "Packages"
        binding.btnBack.setOnClickListener { finish() }

        packageAdapter = PackageAdapter(
            onEditClick = { pkg -> showEditDialog(pkg) },
            onDeleteClick = { pkg -> deletePackage(pkg) }
        )
        
        binding.recyclerItems.layoutManager = LinearLayoutManager(this)
        binding.recyclerItems.adapter = packageAdapter

        binding.fabAdd.setOnClickListener {
            showEditDialog(null)
        }

        loadPackages()
    }

    private fun loadPackages() {
        db.collection("packages").addSnapshotListener { snapshots, e ->
            if (e == null && snapshots != null) {
                val packages = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(Package::class.java)?.copy(id = doc.id)
                }
                packageAdapter.submitList(packages)
            }
        }
    }

    private fun showEditDialog(pkg: Package?) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_edit_package, null)
        
        val inputName = dialogView.findViewById<EditText>(R.id.inputName)
        val inputDescription = dialogView.findViewById<EditText>(R.id.inputDescription)
        val inputImageUrl = dialogView.findViewById<EditText>(R.id.inputImageUrl)
        val inputDuration = dialogView.findViewById<EditText>(R.id.inputDuration)
        val pricesContainer = dialogView.findViewById<LinearLayout>(R.id.pricesContainer)
        val inputWasherCommission = dialogView.findViewById<EditText>(R.id.inputWasherCommission)
        val inputAppCommission = dialogView.findViewById<EditText>(R.id.inputAppCommission)
        val feesContainer = dialogView.findViewById<LinearLayout>(R.id.feesContainer)
        val btnAddFee = dialogView.findViewById<Button>(R.id.btnAddFee)

        // Pre-fill if editing
        pkg?.let {
            inputName.setText(it.name)
            inputDescription.setText(it.description)
            inputImageUrl.setText(it.image)
            inputDuration.setText(it.duration)
            inputWasherCommission.setText(it.washerCommission.toString())
            inputAppCommission.setText(it.appCommission.toString())
        }

        // Add price inputs for each vehicle type
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
                setText(pkg?.price?.get(type)?.toString() ?: "0")
                setTextColor(getColor(android.R.color.white))
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }
            
            priceInputs[type] = input
            priceRow.addView(label)
            priceRow.addView(input)
            pricesContainer.addView(priceRow)
        }

        // Add existing fees
        val fees = mutableListOf<Pair<EditText, EditText>>()
        pkg?.fees?.forEach { fee ->
            addFeeRow(feesContainer, fees, fee.name, fee.percentage)
        }

        btnAddFee.setOnClickListener {
            addFeeRow(feesContainer, fees, "", 0.0)
        }

        AlertDialog.Builder(this)
            .setTitle(if (pkg == null) "Add Package" else "Edit Package")
            .setView(dialogView)
            .setPositiveButton("Save") { _, _ ->
                val name = inputName.text.toString()
                val description = inputDescription.text.toString()
                val image = inputImageUrl.text.toString()
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

                val newPackage = Package(
                    id = pkg?.id ?: "",
                    name = name,
                    description = description,
                    image = image,
                    duration = duration,
                    price = prices,
                    washerCommission = washerCommission,
                    appCommission = appCommission,
                    fees = serviceFees
                )

                savePackage(newPackage)
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

    private fun savePackage(pkg: Package) {
        val docRef = if (pkg.id.isEmpty()) {
            db.collection("packages").document()
        } else {
            db.collection("packages").document(pkg.id)
        }

        docRef.set(pkg.copy(id = docRef.id))
            .addOnSuccessListener {
                Toast.makeText(this, "Package saved", Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error: ${it.message}", Toast.LENGTH_SHORT).show()
            }
    }

    private fun deletePackage(pkg: Package) {
        AlertDialog.Builder(this)
            .setTitle("Delete Package")
            .setMessage("Are you sure you want to delete ${pkg.name}?")
            .setPositiveButton("Delete") { _, _ ->
                db.collection("packages").document(pkg.id).delete()
                    .addOnSuccessListener {
                        Toast.makeText(this, "Package deleted", Toast.LENGTH_SHORT).show()
                    }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}

class PackageAdapter(
    private val onEditClick: (Package) -> Unit,
    private val onDeleteClick: (Package) -> Unit
) : RecyclerView.Adapter<PackageAdapter.ViewHolder>() {

    private var packages = listOf<Package>()

    fun submitList(newPackages: List<Package>) {
        packages = newPackages
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_package_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(packages[position], onEditClick, onDeleteClick)
    }

    override fun getItemCount() = packages.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val packageImage: ImageView = itemView.findViewById(R.id.packageImage)
        private val packageName: TextView = itemView.findViewById(R.id.packageName)
        private val packageDescription: TextView = itemView.findViewById(R.id.packageDescription)
        private val packagePrice: TextView = itemView.findViewById(R.id.packagePrice)
        private val packageDuration: TextView = itemView.findViewById(R.id.packageDuration)
        private val btnEdit: ImageButton = itemView.findViewById(R.id.btnEdit)
        private val btnDelete: ImageButton = itemView.findViewById(R.id.btnDelete)

        fun bind(pkg: Package, onEditClick: (Package) -> Unit, onDeleteClick: (Package) -> Unit) {
            packageName.text = pkg.name
            packageDescription.text = pkg.description
            packagePrice.text = "$${pkg.price["Sedan"] ?: 0}+"
            packageDuration.text = pkg.duration

            if (pkg.image.isNotEmpty()) {
                Glide.with(itemView.context)
                    .load(pkg.image)
                    .into(packageImage)
            }

            btnEdit.setOnClickListener { onEditClick(pkg) }
            btnDelete.setOnClickListener { onDeleteClick(pkg) }
        }
    }
}

*/