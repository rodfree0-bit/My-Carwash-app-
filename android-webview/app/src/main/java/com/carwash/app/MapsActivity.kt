package com.carwash.app

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.carwash.app.databinding.ActivityMapsBinding
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions

class MapsActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mMap: GoogleMap
    private lateinit var binding: ActivityMapsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMapsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Animación de entrada
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap

        // Add a marker in Miami and move the camera
        val miami = LatLng(25.7617, -80.1918)
        mMap.addMarker(MarkerOptions().position(miami).title(getString(R.string.maps_activity_washer_location_marker)))
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(miami, 15f))
    }
    
    override fun finish() {
        super.finish()
        // Animación de salida al volver atrás
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
    }
}
