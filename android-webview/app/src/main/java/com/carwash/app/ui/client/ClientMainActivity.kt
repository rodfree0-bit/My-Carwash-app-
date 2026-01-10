package com.carwash.app.ui.client

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.carwash.app.R
import com.carwash.app.databinding.ActivityClientMainBinding
import com.carwash.app.ui.BaseActivity

class ClientMainActivity : BaseActivity() {

    private lateinit var binding: ActivityClientMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityClientMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Setup bottom navigation
        setupBottomNavigation()

        // Load default fragment
        if (savedInstanceState == null) {
            loadFragment(ClientHomeFragment())
        }
        
        loadUserProfileImage()
    }

    private fun loadUserProfileImage() {
        val user = com.google.firebase.auth.FirebaseAuth.getInstance().currentUser ?: return
        com.google.firebase.firestore.FirebaseFirestore.getInstance()
            .collection("users").document(user.uid)
            .get()
            .addOnSuccessListener { document ->
                val photoUrl = document.getString("photoUrl")
                if (!photoUrl.isNullOrEmpty()) {
                    loadBitmapFromUrl(photoUrl)
                }
            }
    }

    private fun loadBitmapFromUrl(url: String) {
        Thread {
            try {
                val inputStream = java.net.URL(url).openStream()
                val bitmap = android.graphics.BitmapFactory.decodeStream(inputStream)
                runOnUiThread {
                    val profileItem = binding.bottomNavigation.menu.findItem(R.id.nav_profile)
                    
                    // Set icon and clear tint to show original image colors
                    profileItem.icon = getCircularDrawable(bitmap)
                    profileItem.icon?.setTintList(null)
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        profileItem.iconTintList = null
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    private fun getCircularDrawable(bitmap: android.graphics.Bitmap): android.graphics.drawable.Drawable {
        val output = android.graphics.Bitmap.createBitmap(bitmap.width, bitmap.height, android.graphics.Bitmap.Config.ARGB_8888)
        val canvas = android.graphics.Canvas(output)
        val paint = android.graphics.Paint()
        val rect = android.graphics.Rect(0, 0, bitmap.width, bitmap.height)
        val rectF = android.graphics.RectF(rect)
        
        paint.isAntiAlias = true
        canvas.drawARGB(0, 0, 0, 0)
        paint.color = -0x1
        canvas.drawOval(rectF, paint)
        paint.xfermode = android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_IN)
        canvas.drawBitmap(bitmap, rect, rect, paint)
        
        return android.graphics.drawable.BitmapDrawable(resources, output)
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadFragment(ClientHomeFragment())
                    true
                }
                R.id.nav_bookings -> {
                    loadFragment(ClientHistoryFragment())
                    true
                }
                R.id.nav_garage -> {
                    loadFragment(ClientGarageFragment())
                    true
                }
                R.id.nav_profile -> {
                    loadFragment(ClientProfileFragment())
                    true
                }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }

    // Helper methods for navigation from fragments
    fun switchToHistoryTab() {
        binding.bottomNavigation.selectedItemId = R.id.nav_bookings
    }

    fun switchToGarageTab() {
        binding.bottomNavigation.selectedItemId = R.id.nav_garage
    }

    fun navigateToGarage() {
        binding.bottomNavigation.selectedItemId = R.id.nav_garage
    }

    fun navigateToProfile() {
        binding.bottomNavigation.selectedItemId = R.id.nav_profile
    }
}
