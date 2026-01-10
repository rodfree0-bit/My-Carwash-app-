package com.carwash.app.ui.admin.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import com.carwash.app.R
import com.carwash.app.ui.admin.AdminTeamActivity

class AdminTeamFragment : Fragment() {
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_admin_team, container, false)
        
        val btnManageTeam = view.findViewById<Button>(R.id.btnManageTeam)
        btnManageTeam.setOnClickListener {
            startActivity(Intent(requireContext(), AdminTeamActivity::class.java))
        }
        
        return view
    }
}
