# 🚗 SISTEMA DE PRECIOS - CATEGORÍAS SEPARADAS

## 🎯 SOLUCIÓN: SELECCIÓN EN 2 PASOS

### PASO 1: Cliente selecciona CATEGORÍA PRINCIPAL
```
┌─────────────────────────────┐
│ What are you washing?       │
├─────────────────────────────┤
│ ┌─────────────────────┐     │
│ │ 🚗 CARS & SUVS      │     │
│ │ Starting at $50     │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🛻 TRUCKS & PICKUPS │     │
│ │ Starting at $60     │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🚐 RVS & MOTORHOMES │     │
│ │ Starting at $150    │     │
│ └─────────────────────┘     │
└─────────────────────────────┘
```

### PASO 2: Cliente selecciona TAMAÑO ESPECÍFICO

#### Si eligió "CARS & SUVS":
```
┌─────────────────────────────┐
│ Select Car/SUV Size         │
├─────────────────────────────┤
│ ┌─────────────────────┐     │
│ │ 🚗 Compact Car      │     │
│ │ Civic, Corolla      │     │
│ │ $50                 │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🚙 Mid-Size Sedan   │     │
│ │ Accord, Camry       │     │
│ │ $60                 │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🚐 SUV              │     │
│ │ CR-V, RAV4          │     │
│ │ $70                 │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🚐 Large SUV        │     │
│ │ Tahoe, Expedition   │     │
│ │ $80                 │     │
│ └─────────────────────┘     │
└─────────────────────────────┘
```

#### Si eligió "TRUCKS & PICKUPS":
```
┌─────────────────────────────┐
│ Select Truck Size           │
├─────────────────────────────┤
│ ┌─────────────────────┐     │
│ │ 🛻 Compact Pickup   │     │
│ │ Tacoma, Ranger      │     │
│ │ $60                 │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🛻 Full-Size Pickup │     │
│ │ F-150, Silverado    │     │
│ │ $75                 │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🛻 Heavy Duty       │     │
│ │ F-250, F-350        │     │
│ │ $90                 │     │
│ └─────────────────────┘     │
└─────────────────────────────┘
```

#### Si eligió "RVS & MOTORHOMES":
```
┌─────────────────────────────┐
│ Select RV Class             │
├─────────────────────────────┤
│ ┌─────────────────────┐     │
│ │ 🚐 Class B RV       │     │
│ │ Van-based RV        │     │
│ │ $150                │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🚐 Class C RV       │     │
│ │ Mid-size motorhome  │     │
│ │ $250                │     │
│ └─────────────────────┘     │
│                             │
│ ┌─────────────────────┐     │
│ │ 🚐 Class A RV       │     │
│ │ Large motorhome     │     │
│ │ $400                │     │
│ └─────────────────────┘     │
└─────────────────────────────┘
```

---

## 📊 ESTRUCTURA DE DATOS

### Firestore Collection: `vehicle_types`

```json
{
  // CARS & SUVS
  "compact_car": {
    "id": "compact_car",
    "name": "Compact Car",
    "mainCategory": "cars_suvs",
    "subCategory": "car",
    "size": "small",
    "basePrice": 50,
    "icon": "🚗",
    "examples": ["Honda Civic", "Toyota Corolla", "Mazda 3"],
    "order": 1
  },
  "midsize_sedan": {
    "id": "midsize_sedan",
    "name": "Mid-Size Sedan",
    "mainCategory": "cars_suvs",
    "subCategory": "car",
    "size": "medium",
    "basePrice": 60,
    "icon": "🚙",
    "examples": ["Honda Accord", "Toyota Camry", "Nissan Altima"],
    "order": 2
  },
  "suv": {
    "id": "suv",
    "name": "SUV",
    "mainCategory": "cars_suvs",
    "subCategory": "suv",
    "size": "medium",
    "basePrice": 70,
    "icon": "🚐",
    "examples": ["Honda CR-V", "Toyota RAV4", "Nissan Rogue"],
    "order": 3
  },
  "large_suv": {
    "id": "large_suv",
    "name": "Large SUV",
    "mainCategory": "cars_suvs",
    "subCategory": "suv",
    "size": "large",
    "basePrice": 80,
    "icon": "🚐",
    "examples": ["Chevy Tahoe", "Ford Expedition", "Toyota Sequoia"],
    "order": 4
  },

  // TRUCKS & PICKUPS
  "compact_truck": {
    "id": "compact_truck",
    "name": "Compact Pickup",
    "mainCategory": "trucks",
    "subCategory": "pickup",
    "size": "small",
    "basePrice": 60,
    "icon": "🛻",
    "examples": ["Toyota Tacoma", "Chevy Colorado", "Ford Ranger"],
    "order": 1
  },
  "fullsize_truck": {
    "id": "fullsize_truck",
    "name": "Full-Size Pickup",
    "mainCategory": "trucks",
    "subCategory": "pickup",
    "size": "large",
    "basePrice": 75,
    "icon": "🛻",
    "examples": ["Ford F-150", "Chevy Silverado 1500", "Ram 1500"],
    "order": 2
  },
  "heavy_duty_truck": {
    "id": "heavy_duty_truck",
    "name": "Heavy Duty Pickup",
    "mainCategory": "trucks",
    "subCategory": "pickup",
    "size": "xlarge",
    "basePrice": 90,
    "icon": "🛻",
    "examples": ["Ford F-250/F-350", "Chevy Silverado 2500/3500", "Ram 2500/3500"],
    "order": 3
  },

  // RVS & MOTORHOMES
  "class_b_rv": {
    "id": "class_b_rv",
    "name": "Class B RV",
    "mainCategory": "rvs",
    "subCategory": "rv",
    "size": "medium",
    "basePrice": 150,
    "icon": "🚐",
    "examples": ["Mercedes Sprinter RV", "Ford Transit RV"],
    "order": 1
  },
  "class_c_rv": {
    "id": "class_c_rv",
    "name": "Class C RV",
    "mainCategory": "rvs",
    "subCategory": "rv",
    "size": "large",
    "basePrice": 250,
    "icon": "🚐",
    "examples": ["Winnebago", "Thor Motor Coach"],
    "order": 2
  },
  "class_a_rv": {
    "id": "class_a_rv",
    "name": "Class A RV",
    "mainCategory": "rvs",
    "subCategory": "rv",
    "size": "xlarge",
    "basePrice": 400,
    "icon": "🚐",
    "examples": ["Newmar", "Tiffin Allegro", "Fleetwood"],
    "order": 3
  }
}
```

---

## 💻 CÓDIGO PARA FILTRAR

### En el componente de selección:
```typescript
// Agrupar por categoría principal
const vehiclesByMainCategory = {
  cars_suvs: vehicleTypes.filter(v => v.mainCategory === 'cars_suvs'),
  trucks: vehicleTypes.filter(v => v.mainCategory === 'trucks'),
  rvs: vehicleTypes.filter(v => v.mainCategory === 'rvs')
};

// Paso 1: Seleccionar categoría principal
const [selectedMainCategory, setSelectedMainCategory] = useState(null);

// Paso 2: Mostrar solo vehículos de esa categoría
const availableVehicles = vehiclesByMainCategory[selectedMainCategory];
```

---

## 🎨 COMPONENTE UI

```typescript
// VehicleCategorySelector.tsx
const VehicleCategorySelector = ({ onSelect }) => {
  const [step, setStep] = useState(1);
  const [mainCategory, setMainCategory] = useState(null);

  const mainCategories = [
    {
      id: 'cars_suvs',
      name: 'Cars & SUVs',
      icon: '🚗',
      startingPrice: 50,
      description: 'Sedans, coupes, and SUVs'
    },
    {
      id: 'trucks',
      name: 'Trucks & Pickups',
      icon: '🛻',
      startingPrice: 60,
      description: 'All pickup trucks'
    },
    {
      id: 'rvs',
      name: 'RVs & Motorhomes',
      icon: '🚐',
      startingPrice: 150,
      description: 'Recreational vehicles'
    }
  ];

  if (step === 1) {
    return (
      <div>
        <h2>What are you washing?</h2>
        {mainCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setMainCategory(cat.id);
              setStep(2);
            }}
          >
            <span>{cat.icon}</span>
            <h3>{cat.name}</h3>
            <p>Starting at ${cat.startingPrice}</p>
          </button>
        ))}
      </div>
    );
  }

  if (step === 2) {
    const vehicles = vehicleTypes.filter(
      v => v.mainCategory === mainCategory
    );

    return (
      <div>
        <button onClick={() => setStep(1)}>← Back</button>
        <h2>Select Size</h2>
        {vehicles.map(vehicle => (
          <button
            key={vehicle.id}
            onClick={() => onSelect(vehicle)}
          >
            <span>{vehicle.icon}</span>
            <h3>{vehicle.name}</h3>
            <p>{vehicle.examples.join(', ')}</p>
            <p className="price">${vehicle.basePrice}</p>
          </button>
        ))}
      </div>
    );
  }
};
```

---

## 📋 LISTA COMPLETA DE PRECIOS

### 🚗 CARS & SUVS (4 tipos)
- Compact Car → **$50**
- Mid-Size Sedan → **$60**
- SUV → **$70**
- Large SUV → **$80**

### 🛻 TRUCKS & PICKUPS (3 tipos)
- Compact Pickup (Tacoma) → **$60**
- Full-Size Pickup (F-150) → **$75**
- Heavy Duty (F-250/F-350) → **$90**

### 🚐 RVS & MOTORHOMES (3 tipos)
- Class B RV → **$150**
- Class C RV → **$250**
- Class A RV → **$400**

**Total: 10 tipos de vehículos**

---

## ✅ VENTAJAS DE ESTE SISTEMA

1. ✅ **Separado:** Cars no se mezclan con RVs
2. ✅ **Claro:** Cliente sabe qué categoría elegir
3. ✅ **Escalable:** Fácil agregar más categorías
4. ✅ **Organizado:** Todo en orden lógico
5. ✅ **Flexible:** Precios ajustables por admin

---

**¿Creo el script para poblar Firestore con estos 10 tipos?**
