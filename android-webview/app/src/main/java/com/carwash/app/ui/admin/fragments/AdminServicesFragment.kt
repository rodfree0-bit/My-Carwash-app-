package com.carwash.app.ui.admin.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.carwash.app.databinding.FragmentAdminServicesBinding

class AdminServicesFragment : Fragment() {

    private var _binding: FragmentAdminServicesBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdminServicesBinding.inflate(inflater, container, false)
        
        Toast.makeText(context, "Admin Services", Toast.LENGTH_SHORT).show()
        
        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
