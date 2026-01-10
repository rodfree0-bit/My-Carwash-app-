package com.carwash.app

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.carwash.app.databinding.ActivityOnboardingBinding
import com.google.firebase.auth.FirebaseAuth

class OnboardingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityOnboardingBinding
    private lateinit var auth: FirebaseAuth
    private var currentIndex = 0
    private val handler = Handler(Looper.getMainLooper())

    private val slides = listOf(
        Slide("Premium Hand Wash", "Expert care with meticulous attention to every detail"),
        Slide("Premium Ceramic Coating", "Professional nano-ceramic protection that shields your paint from UV rays, dirt, and scratches with a stunning mirror finish"),
        Slide("Professional Wheel Detailing", "Deep cleaning and polishing of rims, tires, and brake calipers for a showroom-quality shine"),
        Slide("Paint Correction & Restoration", "Expert buffing and polishing to remove swirl marks, scratches, and oxidation - bringing back your car's original brilliance"),
        Slide("Complete Interior Detailing", "Deep cleaning, conditioning, and protection for seats, carpets, dashboard, and every interior surface")
    )

    data class Slide(val title: String, val desc: String)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOnboardingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = FirebaseAuth.getInstance()

        // If user is already logged in, go to the main activity
        if (auth.currentUser != null) {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            return
        }

        // Buttons
        binding.btnCreateAccount.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        binding.btnIHaveAccount.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }

        // Start auto-update for descriptions and dots
        startCarousel()
    }

    private fun startCarousel() {
        handler.postDelayed(object : Runnable {
            override fun run() {
                currentIndex = (currentIndex + 1) % slides.size
                updateContent()
                handler.postDelayed(this, 4500)
            }
        }, 4500)
    }

    private fun updateContent() {
        // Update Text
        val slide = slides[currentIndex]
        binding.subtitleText.text = slide.title
        binding.descriptionText.text = slide.desc

        // Update Dots
        val dots = listOf(binding.dot0, binding.dot1, binding.dot2, binding.dot3, binding.dot4)
        dots.forEachIndexed { index, dot ->
            dot.setBackgroundResource(if (index == currentIndex) R.drawable.dot_active else R.drawable.dot_inactive)
        }

        // Update Image
        binding.carouselFlipper.displayedChild = currentIndex
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
    }
}