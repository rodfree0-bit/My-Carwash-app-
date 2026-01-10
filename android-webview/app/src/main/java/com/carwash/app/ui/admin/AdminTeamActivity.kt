package com.carwash.app.ui.admin

import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.databinding.ActivityAdminTeamBinding
import com.carwash.app.databinding.ItemWasherBinding
import com.carwash.app.model.Washer
import com.google.firebase.firestore.FirebaseFirestore

class AdminTeamActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAdminTeamBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var teamAdapter: TeamAdapter
    private var currentTab = 0 // 0 = Active, 1 = Requests

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminTeamBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()

        binding.toolbar.setNavigationOnClickListener { finish() }

        setupTabs()
        setupRecyclerView()
        
        binding.fabAddMember.setOnClickListener {
            showAddMemberDialog()
        }

        fetchData()
    }

    private fun setupTabs() {
        binding.tabLayout.addTab(binding.tabLayout.newTab().setText("Active Team"))
        binding.tabLayout.addTab(binding.tabLayout.newTab().setText("Requests"))

        binding.tabLayout.addOnTabSelectedListener(object : com.google.android.material.tabs.TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: com.google.android.material.tabs.TabLayout.Tab?) {
                currentTab = tab?.position ?: 0
                fetchData()
                binding.fabAddMember.visibility = if (currentTab == 0) android.view.View.VISIBLE else android.view.View.GONE
            }
            override fun onTabUnselected(tab: com.google.android.material.tabs.TabLayout.Tab?) {}
            override fun onTabReselected(tab: com.google.android.material.tabs.TabLayout.Tab?) {}
        })
    }

    private fun setupRecyclerView() {
        teamAdapter = TeamAdapter { washer ->
            if (currentTab == 0) {
                showDeleteConfirmation(washer)
            } else {
                showApprovalDialog(washer)
            }
        }
        binding.teamRecyclerView.layoutManager = LinearLayoutManager(this)
        binding.teamRecyclerView.adapter = teamAdapter
    }

    private fun fetchData() {
        val query = if (currentTab == 0) {
            // Active Washers or manually added ones (role washer/worker) AND status != Applicant
             db.collection("users").whereIn("role", listOf("washer", "worker"))
                 // Note: Ideally we filter by status too, avoiding complex composite indexes if possible for now.
                 // We will filter client-side if needed or assume Active ones lack "status=Applicant"
        } else {
            // Applicants
             db.collection("users").whereEqualTo("status", "Applicant")
        }

        query.addSnapshotListener { snapshots, e ->
            if (e != null) {
                Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                return@addSnapshotListener
            }

            if (snapshots != null) {
                val washers = snapshots.documents.mapNotNull { doc ->
                    doc.toObject(Washer::class.java)?.copy(id = doc.id)
                }.filter { 
                    if (currentTab == 0) it.status != "Applicant" && it.status != "Rejected"
                    else it.status == "Applicant"
                }
                teamAdapter.submitList(washers)
            }
        }
    }

    private fun showApprovalDialog(washer: Washer) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_review_application, null)
        val tvInfo = dialogView.findViewById<android.widget.TextView>(R.id.tvApplicantInfo)
        
        // Image Views
        val imgProfile = dialogView.findViewById<android.widget.ImageView>(R.id.imgProfilePreview)
        val imgLicense = dialogView.findViewById<android.widget.ImageView>(R.id.imgLicensePreview)
        val imgVehicle = dialogView.findViewById<android.widget.ImageView>(R.id.imgVehiclePreview)
        val imgInsurance = dialogView.findViewById<android.widget.ImageView>(R.id.imgInsurancePreview)
        val imgRegistration = dialogView.findViewById<android.widget.ImageView>(R.id.imgRegistrationPreview)
        val imgSSN = dialogView.findViewById<android.widget.ImageView>(R.id.imgSSNPreview)

        val message = """
            Name: ${washer.name}
            Email: ${washer.email}
            Phone: ${washer.phone}
            
            Identity Spec:
            SSN: ${washer.ssn ?: "N/A"}
            DOB: ${washer.dob ?: "N/A"}
            Address: ${washer.address ?: "N/A"}
            
            Vehicle: ${washer.vehicleColor} ${washer.vehicleMake} ${washer.vehicleModel} (${washer.vehicleYear})
            Plate: ${washer.vehiclePlate}
            
            [6 Docs Uploaded: Profile, License, SSN, Vehicle, Insurance, Registration]
        """.trimIndent()
        
        tvInfo.text = message

        // Load Images
        val requestManager = com.bumptech.glide.Glide.with(this)
        
        fun load(url: String?, target: android.widget.ImageView) {
            if (!url.isNullOrEmpty()) {
                requestManager.load(url).into(target)
                target.setOnClickListener {
                    // Simple full screen view or open in browser could go here. 
                    // For now, just a toast or basic zoom logic if we had it.
                    // Or open browser intent
                    val intent = android.content.Intent(android.content.Intent.ACTION_VIEW)
                    intent.data = android.net.Uri.parse(url)
                    startActivity(intent)
                }
            }
        }

        load(washer.profilePhotoUrl, imgProfile)
        load(washer.licensePhotoUrl, imgLicense)
        load(washer.vehiclePhotoUrl, imgVehicle)
        load(washer.insurancePhotoUrl, imgInsurance)
        load(washer.registrationPhotoUrl, imgRegistration)
        load(washer.ssnPhotoUrl, imgSSN)

        AlertDialog.Builder(this)
            .setTitle("Review Application")
            .setView(dialogView)
            .setPositiveButton("Approve") { _, _ -> updateWasherStatus(washer.id, "Active", true) }
            .setNegativeButton("Reject") { _, _ -> updateWasherStatus(washer.id, "Rejected", false) }
            .setNeutralButton("Cancel", null)
            .show()
    }
    
    private fun updateWasherStatus(uid: String, status: String, isActive: Boolean) {
        val updates = mapOf(
            "status" to status,
            "isActive" to isActive,
            "role" to "washer" // Ensure role is set
        )
        
        db.collection("users").document(uid).update(updates)
            .addOnSuccessListener {
                 Toast.makeText(this, "Application Processed: $status", Toast.LENGTH_SHORT).show()
                 fetchData() // Refresh
            }
            .addOnFailureListener {
                 Toast.makeText(this, "Error updating status", Toast.LENGTH_SHORT).show()
            }
    }

    private fun showAddMemberDialog() {
        val input = EditText(this)
        input.hint = "Enter email address"
        input.inputType = android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
        val padding = (16 * resources.displayMetrics.density).toInt()
        input.setPadding(padding, padding, padding, padding)

        AlertDialog.Builder(this)
            .setTitle("Add Team Member")
            .setMessage("Enter email of user to promote manually.")
            .setView(input)
            .setPositiveButton("Add") { _, _ ->
                val email = input.text.toString().trim()
                if (email.isNotEmpty()) addTeamMember(email)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun addTeamMember(email: String) {
        db.collection("users").whereEqualTo("email", email).get()
            .addOnSuccessListener { documents ->
                if (documents.isEmpty) {
                     Toast.makeText(this, "User not found", Toast.LENGTH_SHORT).show()
                } else {
                    val userDoc = documents.documents[0]
                    db.collection("users").document(userDoc.id)
                        .update("role", "washer", "status", "Active", "isActive", true)
                        .addOnSuccessListener { Toast.makeText(this, "Promoted!", Toast.LENGTH_SHORT).show() }
                }
            }
    }
    
    // Existing delete logic...
    private fun showDeleteConfirmation(washer: Washer) {
        AlertDialog.Builder(this)
            .setTitle("Remove Member")
            .setMessage("Remove ${washer.name} from team?")
            .setPositiveButton("Remove") { _, _ ->
                 removeTeamMember(washer.id)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun removeTeamMember(uid: String) {
        db.collection("users").document(uid)
            .update("role", "client", "isActive", false, "status", "Removed")
            .addOnSuccessListener {
                Toast.makeText(this, "Team member removed", Toast.LENGTH_SHORT).show()
            }
    }
}

class TeamAdapter(private val onDeleteClick: (Washer) -> Unit) : ListAdapter<Washer, TeamAdapter.ViewHolder>(WasherDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemWasherBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val washer = getItem(position)
        holder.bind(washer, onDeleteClick)
    }

    class ViewHolder(private val binding: ItemWasherBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(washer: Washer, onDeleteClick: (Washer) -> Unit) {
            binding.washerName.text = washer.name.ifEmpty { "Unnamed Washer" }
            binding.washerStatus.text = "Rating: ${String.format("%.1f", washer.rating)} ★"
            
            // ToDo: Load avatar if URL exists (assuming washer object has it or we query user)
            // For now just using default
            
            binding.btnDelete.setOnClickListener { onDeleteClick(washer) }
        }
    }
}

class WasherDiffCallback : DiffUtil.ItemCallback<Washer>() {
    override fun areItemsTheSame(oldItem: Washer, newItem: Washer): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: Washer, newItem: Washer): Boolean {
        return oldItem == newItem
    }
}
