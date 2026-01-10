package com.carwash.app.ui.booking

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.carwash.app.databinding.FragmentSelectTimeBinding

class SelectTimeFragment : Fragment() {

    private var _binding: FragmentSelectTimeBinding? = null
    private val binding get() = _binding!!

    private val bookingViewModel: BookingViewModel by activityViewModels()
    
    private var selectedDate: String = ""
    private var selectedTime: String = ""

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSelectTimeBinding.inflate(inflater, container, false)

        Toast.makeText(context, "Select date and time", Toast.LENGTH_SHORT).show()

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
