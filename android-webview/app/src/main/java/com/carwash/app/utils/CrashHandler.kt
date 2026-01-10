package com.carwash.app.utils

import android.content.Context
import android.util.Log
import android.widget.Toast
import java.io.PrintWriter
import java.io.StringWriter

class CrashHandler(private val context: Context) : Thread.UncaughtExceptionHandler {
    
    private val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
    
    override fun uncaughtException(thread: Thread, throwable: Throwable) {
        try {
            // Log the crash
            val stackTrace = getStackTrace(throwable)
            Log.e("CRASH_HANDLER", "Uncaught exception in thread ${thread.name}")
            Log.e("CRASH_HANDLER", stackTrace)
            
            // You can also save to file or send to analytics here
            
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            // Call default handler
            defaultHandler?.uncaughtException(thread, throwable)
        }
    }
    
    private fun getStackTrace(throwable: Throwable): String {
        val sw = StringWriter()
        val pw = PrintWriter(sw)
        throwable.printStackTrace(pw)
        return sw.toString()
    }
    
    companion object {
        fun install(context: Context) {
            Thread.setDefaultUncaughtExceptionHandler(CrashHandler(context))
        }
    }
}
