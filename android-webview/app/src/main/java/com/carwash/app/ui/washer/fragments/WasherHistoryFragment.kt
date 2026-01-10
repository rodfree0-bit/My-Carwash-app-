package com.carwash.app.ui.washer.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.carwash.app.databinding.FragmentWasherHistoryBinding

class WasherHistoryFragment : Fragment() {

    private var _binding: FragmentWasherHistoryBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWasherHistoryBinding.inflate(inflater, container, false)

        // TODO: Implement history loading
        binding.tvPlaceholder.text = "Historial de órdenes completadas"

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
