package com.carwash.app.ui.admin

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.R
import com.carwash.app.databinding.ActivityAdminManageListBinding
import com.carwash.app.databinding.DialogAddCouponBinding
import com.carwash.app.model.Coupon
import com.google.firebase.firestore.FirebaseFirestore

class AdminCouponsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminManageListBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var couponAdapter: CouponAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminManageListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()

        binding.txtTitle.text = getString(R.string.admin_coupons_title)
        binding.btnBack.setOnClickListener { finish() }

        couponAdapter = CouponAdapter { coupon ->
            showEditDialog(coupon)
        }
        binding.recyclerItems.layoutManager = LinearLayoutManager(this)
        binding.recyclerItems.adapter = couponAdapter

        binding.fabAdd.setOnClickListener {
            showAddDialog()
        }

        fetchCoupons()
    }

    private fun fetchCoupons() {
        db.collection("coupons").addSnapshotListener { snapshots, e ->
            if (e == null && snapshots != null) {
                val coupons = snapshots.toObjects(Coupon::class.java)
                couponAdapter.submitList(coupons)
            }
        }
    }

    private fun showAddDialog() {
        val dialogBinding = DialogAddCouponBinding.inflate(layoutInflater)
        dialogBinding.inputCode.hint = getString(R.string.admin_coupons_code_hint)
        dialogBinding.inputDiscount.hint = getString(R.string.admin_coupons_discount_hint)

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.admin_coupons_add_dialog_title))
            .setView(dialogBinding.root)
            .setPositiveButton(getString(R.string.dialog_add_button)) { _, _ ->
                val code = dialogBinding.inputCode.text.toString().uppercase()
                val discount = dialogBinding.inputDiscount.text.toString().toDoubleOrNull() ?: 0.0
                
                if (code.isNotEmpty()) {
                    val coupon = Coupon(code = code, discount = discount)
                    db.collection("coupons").add(coupon)
                }
            }
            .setNegativeButton(getString(R.string.dialog_cancel_button), null)
            .show()
    }

    private fun showEditDialog(coupon: Coupon) {
        val dialogBinding = DialogAddCouponBinding.inflate(layoutInflater)
        dialogBinding.inputCode.setText(coupon.code)
        dialogBinding.inputDiscount.setText(coupon.discount.toString())

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.admin_coupons_edit_dialog_title))
            .setView(dialogBinding.root)
            .setPositiveButton(getString(R.string.dialog_save_button)) { _, _ ->
                val code = dialogBinding.inputCode.text.toString().uppercase()
                val discount = dialogBinding.inputDiscount.text.toString().toDoubleOrNull() ?: 0.0
                
                db.collection("coupons").document(coupon.id).update(
                    mapOf("code" to code, "discount" to discount)
                )
            }
            .setNeutralButton(getString(R.string.dialog_delete_button)) { _, _ ->
                 db.collection("coupons").document(coupon.id).delete()
            }
            .setNegativeButton(getString(R.string.dialog_cancel_button), null)
            .show()
    }
}

class CouponAdapter(private val onEditClick: (Coupon) -> Unit) : ListAdapter<Coupon, CouponAdapter.ViewHolder>(CouponDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val view = inflater.inflate(android.R.layout.simple_list_item_2, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val coupon = getItem(position)
        holder.bind(coupon, onEditClick)
    }

    class ViewHolder(itemView: android.view.View) : RecyclerView.ViewHolder(itemView) {
        private val text1: TextView = itemView.findViewById(android.R.id.text1)
        private val text2: TextView = itemView.findViewById(android.R.id.text2)
        fun bind(coupon: Coupon, onEditClick: (Coupon) -> Unit) {
            text1.text = coupon.code
            text2.text = itemView.context.getString(R.string.admin_coupons_discount_text, coupon.discount)
            itemView.setOnClickListener { onEditClick(coupon) }
        }
    }
}

class CouponDiffCallback : DiffUtil.ItemCallback<Coupon>() {
    override fun areItemsTheSame(oldItem: Coupon, newItem: Coupon): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: Coupon, newItem: Coupon): Boolean {
        return oldItem == newItem
    }
}
