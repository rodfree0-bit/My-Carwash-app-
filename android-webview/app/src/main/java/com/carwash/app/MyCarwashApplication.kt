package com.carwash.app

import android.util.Log
import androidx.multidex.MultiDexApplication
import com.google.firebase.FirebaseApp

class MyCarwashApplication : MultiDexApplication() {
    override fun onCreate() {
        super.onCreate()
        
        // Install crash handler for debugging
        com.carwash.app.utils.CrashHandler.install(this)
        
        // Initialize Firebase
        FirebaseApp.initializeApp(this)
        
        Log.d("MyCarwashApp", "Application started successfully")
    }
}
