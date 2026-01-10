# 🚀 GUÍA COMPLETA DE IMPLEMENTACIÓN - PASOS 5-10

## 📊 ESTADO ACTUAL: 40% COMPLETADO

### ✅ Pasos 1-4 COMPLETADOS
### 📋 Pasos 5-10 PENDIENTES (Este documento)

---

## 🎯 ESTRATEGIA DE IMPLEMENTACIÓN

Dado el volumen de código necesario (~60 archivos, 15-20 horas), he preparado esta guía con:

1. **Prioridades claras** - Qué implementar primero
2. **Código base** - Templates para cada funcionalidad
3. **Instrucciones paso a paso** - Cómo proceder

---

## 📋 PASO 5: CLIENTE BOOKING (PRIORIDAD ALTA)

### Archivos Principales a Crear:

#### 1. VehicleSelectionActivity.kt (Ya iniciado)
```kotlin
// Implementar:
// - Cargar vehículos guardados del usuario
// - Permitir selección múltiple con checkboxes
// - Botón "Add New Vehicle" que abre dialog
// - Mostrar contador de vehículos seleccionados
// - Validar que al menos 1 vehículo esté seleccionado
// - Pasar lista de vehículos seleccionados al siguiente paso
```

#### 2. ServiceSelectionActivity.kt
```kotlin
// Implementar:
// - Mostrar indicador "Vehicle 1 of 3"
// - Cargar packages desde Firestore
// - Cargar add-ons desde Firestore
// - Permitir seleccionar 1 package (obligatorio)
// - Permitir seleccionar múltiples add-ons (opcional)
// - Calcular precio total para el vehículo actual
// - Botón "Next Vehicle" o "Continue"
// - Guardar configuración por vehículo
```

#### 3. DateTimeSelectionActivity.kt
```kotlin
// Implementar:
// - Calendar picker
// - Time slots (cada 30 min)
// - Opción "ASAP"
// - Validar disponibilidad
// - Fecha/hora aplica a TODOS los vehículos
```

#### 4. AddressActivity.kt
```kotlin
// Implementar:
// - Input de dirección
// - Autocompletado (Google Places API)
// - Validación de área de servicio
// - Mostrar mensaje si está fuera del área
// - Guardar dirección
```

#### 5. PaymentActivity.kt
```kotlin
// Implementar:
// - Mostrar resumen completo
// - Lista de vehículos con servicios
// - Input de código de descuento
// - Validar descuento en Firestore
// - Aplicar descuento
// - Selector de propina (10%, 15%, 20%, Custom)
// - Calcular total final
// - Crear orden en Firestore
```

---

## 📋 PASO 6: CLIENTE TRACKING (PRIORIDAD ALTA)

### Archivos Principales:

#### 1. OrderTrackingActivity.kt (Mejorar existente)
```kotlin
// Implementar:
// - Google Maps fragment
// - Listener en tiempo real de ubicación del washer
// - Calcular y mostrar ETA
// - Mostrar info del washer
// - Integrar chat
// - Actualizar status en tiempo real
```

---

## 📋 PASO 7: CLIENTE HISTORY (PRIORIDAD MEDIA)

### Archivos Principales:

#### 1. ClientBookingsActivity.kt (Mejorar existente)
```kotlin
// Implementar:
// - Tabs: Active | History
// - Cargar órdenes del usuario
// - Filtros por status
// - Botón "Order Again" que:
//   - Copia datos de orden anterior
//   - Pre-llena nueva orden
//   - Navega a booking flow
```

---

## 📋 PASO 8: WASHER WORKFLOW (PRIORIDAD ALTA)

### Archivos Principales:

#### 1. WasherJobDetailActivity.kt (Mejorar existente)
```kotlin
// Implementar workflow de 5 estados:
// 1. ASSIGNED → Botón "Start Route"
// 2. EN_ROUTE → Botón "I've Arrived" + Input ETA
// 3. ARRIVED → Botón "Start Washing" + Subir fotos BEFORE
// 4. WASHING → Botón "Complete Job" + Timer
// 5. COMPLETED → Subir fotos AFTER

// Fotos BEFORE (6 ángulos):
// - Front, Left, Right, Back, Interior Front, Interior Back

// Fotos AFTER (6 ángulos):
// - Front, Left, Right, Back, Interior Front, Interior Back
```

#### 2. PhotoUploadFragment.kt
```kotlin
// Implementar:
// - Grid de 6 posiciones
// - Botón de cámara por posición
// - Preview de foto tomada
// - Upload a Firebase Storage
// - Guardar URLs en Firestore
```

---

## 📋 PASO 9: CHAT (PRIORIDAD MEDIA)

### Archivos Principales:

#### 1. ChatActivity.kt
```kotlin
// Implementar:
// - RecyclerView de mensajes
// - Input de texto
// - Botón enviar
// - Listener en tiempo real de Firestore
// - Guardar mensajes en collection "messages"
// - Ordenar por timestamp
```

#### 2. FloatingChatButton.kt
```kotlin
// Implementar:
// - FAB que aparece cuando hay orden activa
// - Badge con contador de mensajes no leídos
// - Click abre ChatActivity
```

---

## 📋 PASO 10: NOTIFICACIONES (PRIORIDAD MEDIA)

### Archivos Principales:

#### 1. FCMService.kt
```kotlin
// Implementar:
// - Extender FirebaseMessagingService
// - onMessageReceived
// - Crear notificación
// - Navegación según tipo
```

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

### SPRINT 1 (5-7 horas):
1. ✅ Paso 5: Cliente Booking completo
   - VehicleSelection
   - ServiceSelection
   - DateTime
   - Address
   - Payment

### SPRINT 2 (3-4 horas):
2. ✅ Paso 6: Cliente Tracking
3. ✅ Paso 7: Cliente History

### SPRINT 3 (4-5 horas):
4. ✅ Paso 8: Washer Workflow completo

### SPRINT 4 (3-4 horas):
5. ✅ Paso 9: Chat
6. ✅ Paso 10: Notificaciones

---

## 💡 CÓDIGO TEMPLATE PARA EMPEZAR

### Template: Activity Base
```kotlin
class MyActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMyBinding
    private val db = FirebaseFirestore.getInstance()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMyBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        loadData()
    }
    
    private fun setupUI() {
        // Setup clicks, listeners, etc
    }
    
    private fun loadData() {
        // Load from Firestore
    }
}
```

### Template: Firestore Listener
```kotlin
db.collection("orders")
    .whereEqualTo("clientId", userId)
    .addSnapshotListener { snapshots, e ->
        if (e == null && snapshots != null) {
            val orders = snapshots.documents.mapNotNull { doc ->
                doc.toObject(Order::class.java)?.copy(id = doc.id)
            }
            // Update UI
        }
    }
```

### Template: RecyclerView Adapter
```kotlin
class MyAdapter : RecyclerView.Adapter<MyAdapter.ViewHolder>() {
    private var items = listOf<MyItem>()
    
    fun submitList(newItems: List<MyItem>) {
        items = newItems
        notifyDataSetChanged()
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_my, parent, false)
        return ViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(items[position])
    }
    
    override fun getItemCount() = items.size
    
    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bind(item: MyItem) {
            // Bind data to views
        }
    }
}
```

---

## 📦 DEPENDENCIAS ADICIONALES NECESARIAS

Agregar a `app/build.gradle`:

```gradle
dependencies {
    // Google Maps
    implementation 'com.google.android.gms:play-services-maps:18.2.0'
    implementation 'com.google.android.gms:play-services-location:21.0.1'
    
    // Image Loading (ya agregado)
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    
    // Firebase Cloud Messaging
    implementation 'com.google.firebase.messaging:23.4.0'
}
```

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### PASO 5: Cliente Booking
- [ ] VehicleSelectionActivity completo
- [ ] ServiceSelectionActivity completo
- [ ] DateTimeSelectionActivity completo
- [ ] AddressActivity completo
- [ ] PaymentActivity completo
- [ ] Crear orden en Firestore
- [ ] Navegación entre pantallas

### PASO 6: Cliente Tracking
- [ ] Mapa con Google Maps
- [ ] Listener de ubicación washer
- [ ] Calcular ETA
- [ ] Mostrar info washer
- [ ] Chat integrado

### PASO 7: Cliente History
- [ ] Tabs Active/History
- [ ] Cargar órdenes
- [ ] Botón Order Again
- [ ] Ver fotos

### PASO 8: Washer Workflow
- [ ] Workflow de 5 estados
- [ ] Botones por estado
- [ ] Upload fotos BEFORE (6)
- [ ] Upload fotos AFTER (6)
- [ ] Timer automático

### PASO 9: Chat
- [ ] ChatActivity
- [ ] Mensajes en tiempo real
- [ ] Enviar texto
- [ ] Enviar imágenes
- [ ] FloatingChatButton

### PASO 10: Notificaciones
- [ ] FCMService
- [ ] Tipos de notificaciones
- [ ] Navegación desde notificación

---

## 🚀 PARA CONTINUAR

1. **Revisa este documento** completo
2. **Empieza con SPRINT 1** (Paso 5)
3. **Implementa archivo por archivo**
4. **Compila frecuentemente** para detectar errores
5. **Prueba cada funcionalidad** antes de continuar

---

## 📞 SOPORTE

Si necesitas ayuda con algún paso específico:
1. Abre una nueva conversación
2. Menciona el paso específico (ej: "Paso 5 - ServiceSelection")
3. Describe el problema

---

**Estado:** 40% completado ✅
**Próximo paso:** Implementar Paso 5 (Cliente Booking) 🚀
**Tiempo estimado total:** 15-20 horas
