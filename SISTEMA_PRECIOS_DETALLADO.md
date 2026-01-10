# 🚗 SISTEMA DE PRECIOS POR TAMAÑO DE VEHÍCULO

## 🎯 TU PLAN (PERFECTO)

Necesitas diferenciar por **tamaño real** del vehículo:

```
Toyota Tacoma (pequeño)  → $40
Ford F-150 (grande)      → $55
Ford F-350 (extra grande) → $70
```

---

## 📊 CATEGORÍAS DETALLADAS

### 1. **CARS (Autos)**
```typescript
{
  "compact_car": {
    name: "Compact Car",
    size: "Small",
    examples: ["Honda Civic", "Toyota Corolla", "Mazda 3"],
    basePrice: 25,
    icon: "🚗"
  },
  "sedan": {
    name: "Mid-Size Sedan",
    size: "Medium",
    examples: ["Honda Accord", "Toyota Camry", "Nissan Altima"],
    basePrice: 30,
    icon: "🚙"
  },
  "large_sedan": {
    name: "Large Sedan",
    size: "Large",
    examples: ["Chevy Impala", "Toyota Avalon", "Dodge Charger"],
    basePrice: 35,
    icon: "🚙"
  }
}
```

### 2. **SUVS**
```typescript
{
  "compact_suv": {
    name: "Compact SUV",
    size: "Small",
    examples: ["Honda HR-V", "Mazda CX-3", "Kia Soul"],
    basePrice: 35,
    icon: "🚐"
  },
  "midsize_suv": {
    name: "Mid-Size SUV",
    size: "Medium",
    examples: ["Honda CR-V", "Toyota RAV4", "Nissan Rogue"],
    basePrice: 40,
    icon: "🚐"
  },
  "large_suv": {
    name: "Large SUV",
    size: "Large",
    examples: ["Chevy Tahoe", "Ford Expedition", "Toyota Sequoia"],
    basePrice: 50,
    icon: "🚐"
  }
}
```

### 3. **TRUCKS (Pickups)**
```typescript
{
  "compact_truck": {
    name: "Compact Pickup",
    size: "Small",
    examples: ["Toyota Tacoma", "Chevy Colorado", "Ford Ranger"],
    basePrice: 40,
    icon: "🛻"
  },
  "fullsize_truck": {
    name: "Full-Size Pickup",
    size: "Large",
    examples: ["Ford F-150", "Chevy Silverado 1500", "Ram 1500"],
    basePrice: 55,
    icon: "🛻"
  },
  "heavy_duty_truck": {
    name: "Heavy Duty Pickup",
    size: "Extra Large",
    examples: ["Ford F-250/F-350", "Chevy Silverado 2500/3500", "Ram 2500/3500"],
    basePrice: 70,
    icon: "🛻"
  }
}
```

### 4. **VANS**
```typescript
{
  "minivan": {
    name: "Minivan",
    size: "Medium",
    examples: ["Honda Odyssey", "Toyota Sienna", "Chrysler Pacifica"],
    basePrice: 45,
    icon: "🚐"
  },
  "cargo_van": {
    name: "Cargo Van",
    size: "Large",
    examples: ["Ford Transit", "Mercedes Sprinter", "Ram ProMaster"],
    basePrice: 60,
    icon: "🚐"
  }
}
```

### 5. **RVS & SPECIAL**
```typescript
{
  "class_b_rv": {
    name: "Class B RV (Van)",
    size: "Large",
    examples: ["Mercedes Sprinter RV", "Ford Transit RV"],
    basePrice: 80,
    icon: "🚐"
  },
  "class_c_rv": {
    name: "Class C RV",
    size: "Extra Large",
    examples: ["Winnebago", "Thor Motor Coach"],
    basePrice: 120,
    icon: "🚐"
  },
  "class_a_rv": {
    name: "Class A RV",
    size: "Massive",
    examples: ["Newmar", "Tiffin Allegro"],
    basePrice: 200,
    icon: "🚐"
  },
  "luxury_sports": {
    name: "Luxury/Sports Car",
    size: "Medium",
    examples: ["Mercedes S-Class", "BMW 7 Series", "Porsche 911"],
    basePrice: 75,
    icon: "🏎️"
  }
}
```

---

## 🎨 UI MEJORADA

### Selección por Categoría Principal
```
┌─────────────────────────────┐
│ What type of vehicle?       │
├─────────────────────────────┤
│ 🚗 Cars                     │
│ 🚐 SUVs                     │
│ 🛻 Trucks (Pickups)         │
│ 🚐 Vans                     │
│ 🚐 RVs & Motorhomes         │
│ 🏎️ Luxury/Sports            │
└─────────────────────────────┘
```

### Luego Selección por Tamaño
```
┌─────────────────────────────┐
│ Select Truck Size           │
├─────────────────────────────┤
│ ┌─────────────────────┐     │
│ │ 🛻 Compact Pickup   │     │
│ │ Tacoma, Ranger      │     │
│ │ Starting at $40     │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🛻 Full-Size Pickup │     │
│ │ F-150, Silverado    │     │
│ │ Starting at $55     │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🛻 Heavy Duty       │     │
│ │ F-250, F-350        │     │
│ │ Starting at $70     │     │
│ └─────────────────────┘     │
└─────────────────────────────┘
```

---

## 📦 ESTRUCTURA FIRESTORE

### Collection: `vehicle_types`
```json
{
  "compact_truck": {
    "id": "compact_truck",
    "name": "Compact Pickup",
    "category": "trucks",
    "size": "small",
    "basePrice": 40,
    "icon": "🛻",
    "examples": ["Toyota Tacoma", "Chevy Colorado", "Ford Ranger"],
    "description": "Small to mid-size pickup trucks",
    "active": true
  },
  "fullsize_truck": {
    "id": "fullsize_truck",
    "name": "Full-Size Pickup",
    "category": "trucks",
    "size": "large",
    "basePrice": 55,
    "icon": "🛻",
    "examples": ["Ford F-150", "Chevy Silverado 1500", "Ram 1500"],
    "description": "Standard full-size pickup trucks",
    "active": true
  },
  "heavy_duty_truck": {
    "id": "heavy_duty_truck",
    "name": "Heavy Duty Pickup",
    "category": "trucks",
    "size": "xlarge",
    "basePrice": 70,
    "icon": "🛻",
    "examples": ["Ford F-250", "Ford F-350", "Chevy Silverado 2500/3500"],
    "description": "Heavy duty pickup trucks (F-250, F-350, etc)",
    "active": true
  }
}
```

---

## 💰 CÁLCULO DE PRECIO

### Fórmula:
```typescript
const calculatePrice = (vehicleType, servicePackage, addons) => {
  // Base price del tipo de vehículo
  const basePrice = vehicleType.basePrice;
  
  // Precio del paquete de servicio
  const packagePrice = servicePackage.price;
  
  // Addons
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  
  // Subtotal
  const subtotal = basePrice + packagePrice + addonsTotal;
  
  // Tax
  const tax = subtotal * 0.08;
  
  // Total
  const total = subtotal + tax;
  
  return {
    vehicleBase: basePrice,
    package: packagePrice,
    addons: addonsTotal,
    subtotal,
    tax,
    total
  };
};
```

### Ejemplo:
```typescript
// Cliente selecciona:
vehicleType = "fullsize_truck" // F-150 → $55
package = "Premium Detail" // $50
addons = ["Wax ($15)", "Interior Shampoo ($20)"] // $35

// Cálculo:
basePrice = $55
packagePrice = $50
addonsTotal = $35
subtotal = $140
tax = $11.20
TOTAL = $151.20
```

---

## 🚀 IMPLEMENTACIÓN

### Paso 1: Seed de Firestore
```typescript
// Script para poblar vehicle_types
const vehicleTypes = [
  {
    id: "compact_car",
    name: "Compact Car",
    category: "cars",
    size: "small",
    basePrice: 25,
    icon: "🚗",
    examples: ["Honda Civic", "Toyota Corolla"],
    active: true
  },
  // ... todos los demás
];

// Subir a Firestore
vehicleTypes.forEach(async (type) => {
  await setDoc(doc(db, "vehicle_types", type.id), type);
});
```

### Paso 2: Componente de Selección
```typescript
// VehicleTypeSelector.tsx
const categories = {
  cars: vehicleTypes.filter(t => t.category === "cars"),
  suvs: vehicleTypes.filter(t => t.category === "suvs"),
  trucks: vehicleTypes.filter(t => t.category === "trucks"),
  vans: vehicleTypes.filter(t => t.category === "vans"),
  rvs: vehicleTypes.filter(t => t.category === "rvs")
};
```

---

## ✅ VENTAJAS DE ESTE SISTEMA

1. ✅ **Preciso:** Tacoma ≠ F-150 ≠ F-350
2. ✅ **Flexible:** Fácil agregar nuevos tipos
3. ✅ **Escalable:** Funciona para RVs, boats, etc
4. ✅ **Justo:** Cliente paga por tamaño real
5. ✅ **Simple:** Admin puede editar precios fácilmente

---

## 📋 LISTA COMPLETA DE TIPOS

### Total: 16 tipos de vehículos

**Cars (3):**
- Compact Car → $25
- Mid-Size Sedan → $30
- Large Sedan → $35

**SUVs (3):**
- Compact SUV → $35
- Mid-Size SUV → $40
- Large SUV → $50

**Trucks (3):**
- Compact Pickup → $40
- Full-Size Pickup → $55
- Heavy Duty Pickup → $70

**Vans (2):**
- Minivan → $45
- Cargo Van → $60

**RVs (3):**
- Class B RV → $80
- Class C RV → $120
- Class A RV → $200

**Special (2):**
- Luxury/Sports → $75
- Motorcycle → $15

---

**¿Creo el script para poblar Firestore con estos tipos?**
