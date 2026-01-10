package com.carwash.app.ui.booking

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.carwash.app.model.VehicleServiceConfig

class BookingViewModel : ViewModel() {
    
    // Selected vehicles for the booking
    private val _selectedVehicles = MutableLiveData<List<String>>(emptyList())
    val selectedVehicles: LiveData<List<String>> = _selectedVehicles
    
    // Service configurations per vehicle
    private val _vehicleConfigs = MutableLiveData<MutableMap<String, VehicleServiceConfig>>(mutableMapOf())
    val vehicleConfigs: LiveData<MutableMap<String, VehicleServiceConfig>> = _vehicleConfigs
    
    // Selected date and time
    private val _selectedDate = MutableLiveData<String>("")
    val selectedDate: LiveData<String> = _selectedDate
    
    private val _selectedTime = MutableLiveData<String>("")
    val selectedTime: LiveData<String> = _selectedTime
    
    // Selected address
    private val _selectedAddress = MutableLiveData<String>("")
    val selectedAddress: LiveData<String> = _selectedAddress
    
    // Functions to update data
    fun setSelectedVehicles(vehicles: List<String>) {
        _selectedVehicles.value = vehicles
    }
    
    fun setVehicleConfig(vehicleId: String, config: VehicleServiceConfig) {
        val currentConfigs = _vehicleConfigs.value ?: mutableMapOf()
        currentConfigs[vehicleId] = config
        _vehicleConfigs.value = currentConfigs
    }
    
    fun setDateTime(date: String, time: String) {
        _selectedDate.value = date
        _selectedTime.value = time
    }
    
    fun setAddress(address: String) {
        _selectedAddress.value = address
    }
    
    // Get total price
    fun getTotalPrice(): Double {
        var total = 0.0
        _vehicleConfigs.value?.values?.forEach { config ->
            total += config.packagePrice + config.addonsPrice
        }
        return total
    }
    
    // Get configurations as list
    fun getVehicleConfigsList(): List<VehicleServiceConfig> {
        return _vehicleConfigs.value?.values?.toList() ?: emptyList()
    }
    
    // Clear all data
    fun clear() {
        _selectedVehicles.value = emptyList()
        _vehicleConfigs.value = mutableMapOf()
        _selectedDate.value = ""
        _selectedTime.value = ""
        _selectedAddress.value = ""
    }
}
