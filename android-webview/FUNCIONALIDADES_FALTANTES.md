# Android App - Funcionalidades Faltantes para 100% Paridad con Web

## 🎯 Objetivo
Hacer que la app Android sea 100% idéntica a la web en funcionalidades.

## 📊 Estado Actual vs Web

### ✅ YA IMPLEMENTADO:
1. **Bottom Navigation** con 5 tabs
2. **Dashboard** con métricas y gráfico de revenue
3. **Toolbar** con Settings y Logout
4. **Arquitectura moderna** con Fragments

### ❌ FALTA IMPLEMENTAR:

## 1. **PACKAGES (Servicios)**

### Web tiene:
- ✅ Nombre
- ✅ **Descripción** (textarea)
- ✅ **Imagen** (URL)
- ✅ **Precios por tipo de vehículo** (Sedan, SUV, Truck, Van, etc.)
- ✅ **Duración** (ej: "30m", "1h")
- ✅ **Comisión del washer** (%)
- ✅ **Comisión de la app** (%)
- ✅ **Fees/Deductions** (lista de fees con nombre y porcentaje)
- ✅ **Vista de card** con imagen, nombre, descripción, precio
- ✅ **Botones Edit/Delete** al hacer hover

### Android tiene actualmente:
- ❌ Solo nombre y precio simple
- ❌ No tiene descripción
- ❌ No tiene imagen
- ❌ No tiene precios por tipo de vehículo
- ❌ No tiene duración
- ❌ No tiene comisiones
- ❌ No tiene fees

## 2. **ADD-ONS**

### Web tiene:
- ✅ Nombre
- ✅ **Descripción**
- ✅ **Precios por tipo de vehículo**
- ✅ **Duración**
- ✅ **Comisión del washer**
- ✅ **Comisión de la app**
- ✅ **Fees/Deductions**

### Android tiene actualmente:
- ❌ Funcionalidad básica similar a packages

## 3. **VEHICLE TYPES (Tipos de Vehículos)**

### Web tiene:
- ✅ Nombre
- ✅ **Icono** (URL de imagen o Material Symbol)
- ✅ **Selector visual de iconos** con preview
  - Imágenes: sedan.webp, suv.webp, pickup.webp, van.webp, trailer.webp, trailer_box.webp
  - Material Icons: two_wheeler, sports_motorsports, agriculture, directions_bus
- ✅ **Preview del icono** en tiempo real

### Android tiene actualmente:
- ❌ Solo nombre
- ❌ No tiene selector de iconos
- ❌ No muestra preview

## 4. **ORDERS (Órdenes)**

### Web tiene:
- ✅ Lista de órdenes activas
- ✅ **Filtros** (All, New, Assigned, En Route, etc.)
- ✅ **Búsqueda** por nombre o ID
- ✅ **Asignar washer** a orden
- ✅ **Editar orden** (status, fecha, hora, precio)
- ✅ **Ver detalles** con fotos before/after
- ✅ **Notificar cliente** al cambiar status

### Android tiene actualmente:
- ❌ Solo muestra métricas
- ❌ No tiene lista de órdenes
- ❌ No tiene filtros ni búsqueda

## 5. **TEAM (Equipo)**

### Web tiene:
- ✅ Lista de washers
- ✅ **Agregar washer** con todos los datos (nombre, email, licencia, seguro, vehículo)
- ✅ **Editar washer**
- ✅ **Bloquear/Desbloquear washer**
- ✅ **Ver estadísticas** del washer
- ✅ **Aprobar/Rechazar** washers pendientes

### Android tiene actualmente:
- ✅ Actividad básica de team
- ❌ Falta funcionalidad completa

## 6. **CLIENTS (Clientes)**

### Web tiene:
- ✅ Lista de clientes
- ✅ **Ver historial** de órdenes del cliente
- ✅ **Bloquear/Desbloquear** cliente
- ✅ **Ver detalles** del cliente

### Android tiene actualmente:
- ❌ Solo placeholder

## 7. **METRICS/ANALYTICS**

### Web tiene:
- ✅ **Selector de rango** (Day, Week, Month, Year)
- ✅ **Gross Revenue**
- ✅ **Washer Payout** (80%)
- ✅ **Net Profit** (20%)
- ✅ **Total Orders**
- ✅ **Recent Feedback** (ratings y reviews)

### Android tiene actualmente:
- ❌ Solo placeholder

## 8. **COUPONS (Cupones)**

### Web tiene:
- ✅ Crear cupones
- ✅ Código, descuento, fecha de expiración
- ✅ Editar/Eliminar cupones

### Android tiene actualmente:
- ✅ Actividad básica
- ❌ Falta funcionalidad completa

---

## 🚀 PLAN DE ACCIÓN

### Prioridad 1 (Crítico):
1. **Packages completos** con descripción, imagen, precios por vehículo, duración
2. **Add-ons completos** con las mismas funcionalidades
3. **Vehicle Types** con selector de iconos visual

### Prioridad 2 (Importante):
4. **Orders** con lista, filtros, asignación, edición
5. **Team** con gestión completa de washers
6. **Metrics** con analytics completos

### Prioridad 3 (Deseable):
7. **Clients** con gestión completa
8. **Coupons** con funcionalidad completa

---

## 📝 NOTAS TÉCNICAS

### Modelos a actualizar:
- `Package.kt` → agregar: description, image, duration (String), washerCommission, appCommission, fees
- `Addon.kt` → agregar: description, duration, washerCommission, appCommission, fees
- `VehicleType.kt` → agregar: icon (String)

### Layouts a crear:
- `dialog_edit_package.xml` → formulario completo con todos los campos
- `dialog_edit_addon.xml` → formulario completo
- `dialog_edit_vehicle_type.xml` → con selector de iconos
- `item_package_card.xml` → card con imagen, descripción, etc.

### Activities a mejorar:
- `AdminServicesActivity` → refactorizar completamente
- `AdminAddonsActivity` → refactorizar completamente
- `AdminVehicleTypesActivity` → agregar selector de iconos
- `AdminOrdersActivity` → agregar lista, filtros, asignación
- `AdminTeamActivity` → agregar gestión completa

---

¿Quieres que empiece implementando las funcionalidades de **Prioridad 1** (Packages, Add-ons, Vehicle Types)?
