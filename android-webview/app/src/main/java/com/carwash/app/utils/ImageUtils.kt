package com.carwash.app.utils

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import java.io.File
import java.io.FileOutputStream
import java.io.ByteArrayOutputStream

object ImageUtils {

    fun compressImage(context: Context, imageUri: Uri): File? {
        try {
            val inputStream = context.contentResolver.openInputStream(imageUri)
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream?.close()

            if (bitmap == null) return null

            // Resize if too big (e.g., max 1024x1024)
            val resizedBitmap = resizeBitmap(bitmap, 1024)

            // Compress to JPEG
            val bytes = ByteArrayOutputStream()
            resizedBitmap.compress(Bitmap.CompressFormat.JPEG, 70, bytes) // 70% quality

            // Save to temp file
            val file = File.createTempFile("compressed_", ".jpg", context.cacheDir)
            val fos = FileOutputStream(file)
            fos.write(bytes.toByteArray())
            fos.flush()
            fos.close()

            return file
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }

    private fun resizeBitmap(bitmap: Bitmap, maxSize: Int): Bitmap {
        var width = bitmap.width
        var height = bitmap.height

        if (width <= maxSize && height <= maxSize) {
            return bitmap
        }

        val ratio: Float = width.toFloat() / height.toFloat()

        if (ratio > 1) {
            width = maxSize
            height = (width / ratio).toInt()
        } else {
            height = maxSize
            width = (height * ratio).toInt()
        }

        return Bitmap.createScaledBitmap(bitmap, width, height, true)
    }
}
