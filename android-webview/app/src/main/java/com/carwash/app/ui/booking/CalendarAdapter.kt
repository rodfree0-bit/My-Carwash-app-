package com.carwash.app.ui.booking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.carwash.app.databinding.ItemCalendarDayBinding
import java.text.SimpleDateFormat
import java.util.*

class CalendarAdapter(
    private val onDateSelected: (Date) -> Unit
) : RecyclerView.Adapter<CalendarAdapter.ViewHolder>() {

    private val dates = mutableListOf<Date>()
    private var selectedDate: Date? = null

    fun submitList(newDates: List<Date>) {
        dates.clear()
        dates.addAll(newDates)
        notifyDataSetChanged()
    }

    fun selectDate(date: Date?) {
        selectedDate = date
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemCalendarDayBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(dates[position])
    }

    override fun getItemCount() = dates.size

    inner class ViewHolder(private val binding: ItemCalendarDayBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(date: Date) {
            val dayNameFormat = SimpleDateFormat("EEE", Locale.US)
            val dayNumberFormat = SimpleDateFormat("d", Locale.US)

            binding.txtDayName.text = dayNameFormat.format(date)
            binding.txtDayNumber.text = dayNumberFormat.format(date)

            val isSelected = selectedDate != null && isSameDay(date, selectedDate!!)

            if (isSelected) {
                binding.cardContainer.setCardBackgroundColor(android.graphics.Color.parseColor("#3B82F6")) // Blue 500
                binding.txtDayName.setTextColor(android.graphics.Color.WHITE)
                binding.txtDayNumber.setTextColor(android.graphics.Color.WHITE)
            } else {
                binding.cardContainer.setCardBackgroundColor(android.graphics.Color.parseColor("#1E293B")) // Slate 800
                binding.txtDayName.setTextColor(android.graphics.Color.parseColor("#94A3B8")) // Slate 400
                binding.txtDayNumber.setTextColor(android.graphics.Color.WHITE)
            }

            binding.root.setOnClickListener {
                onDateSelected(date)
            }
        }
        
        private fun isSameDay(date1: Date, date2: Date): Boolean {
            val fmt = SimpleDateFormat("yyyyMMdd", Locale.US)
            return fmt.format(date1) == fmt.format(date2)
        }
    }
}
