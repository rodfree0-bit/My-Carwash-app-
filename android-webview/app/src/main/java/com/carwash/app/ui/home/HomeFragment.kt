package com.carwash.app.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.carwash.app.R
import com.carwash.app.databinding.FragmentHomeBinding
import java.text.SimpleDateFormat
import java.util.*

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private val homeViewModel: HomeViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)

        setupUI()
        setupObservers()
        homeViewModel.fetchData()

        return binding.root
    }

    private fun setupUI() {
        val sdf = SimpleDateFormat(getString(R.string.home_date_format), Locale.getDefault())
        binding.dateText.text = sdf.format(Date())
    }

    private fun setupObservers() {
        homeViewModel.revenue.observe(viewLifecycleOwner) { revenue ->
            binding.revenueText.text = getString(R.string.order_history_price_format, revenue)
        }

        homeViewModel.clients.observe(viewLifecycleOwner) { clients ->
            binding.clientsText.text = clients.toString()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
