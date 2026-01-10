package com.carwash.app.ui.washer

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.carwash.app.LoginActivity
import com.carwash.app.databinding.FragmentWasherProfileBinding
import com.google.firebase.auth.FirebaseAuth

class WasherProfileFragment : Fragment() {

    private var _binding: FragmentWasherProfileBinding? = null
    private val binding get() = _binding!!

    private val auth = FirebaseAuth.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWasherProfileBinding.inflate(inflater, container, false)

        binding.txtWasherEmail.text = auth.currentUser?.email

        binding.btnWasherLogout.setOnClickListener {
            auth.signOut()
            startActivity(Intent(context, LoginActivity::class.java))
            activity?.finish()
        }

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
