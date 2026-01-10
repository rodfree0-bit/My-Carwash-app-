# 🧪 Guía de Pruebas de Campo (Testing Script)

Sigue estos pasos para validar el funcionamiento completo de tu App "Uber-style" de Carwash con Asignación Manual.

### 📋 Prerrequisitos
1.  Genera el APK e instálalo en **2 dispositivos** (o 1 dispositivo + 1 emulador).
    *   *Dispositivo A*: Será el **Cliente**.
    *   *Dispositivo B*: Será el **Admin/Lavador** (puedes cerrar sesión e iniciar con otra cuenta).

---

## 🏎️ Escenario 1: El Cliente Pide (Dispositivo A)
1.  Abre la App.
2.  **Regístrate** como nuevo usuario (ej. `cliente@test.com`).
3.  Completa el Wizard:
    *   Selecciona "SUV Premium".
    *   Elige servicio "Ferrari Detail".
    *   Fecha: Hoy.
    *   Pago: "Credit Card" (Simulado).
4.  Confirma la reserva.
5.  **Resultado Esperado**:
    *   Te lleva a la pantalla de "Live Tracking".
    *   Estado: **"Confirming Washer..."** (Barra al 10%).
    *   Map: Oculto (o sin marcador aún).

---

## 👮 Escenario 2: El Admin Despacha (Dispositivo B)
1.  Cierra sesión (si estabas logueado) e inicia como **Admin** (`admin@test.com` - asegúrate de tener este usuario creado en Firestore con rol `admin`).
2.  Ve al **Command Center** (Dashboard Azul).
3.  Verás "Active Jobs: 1". Da click en la tarjeta **"Active Jobs"**.
4.  Verás la orden del Cliente en la lista "Unassigned".
5.  Toca la orden y selecciona un Lavador de la lista (ej. `pedro@washer.com`).
6.  **Resultado Esperado**:
    *   Toast: "Washer Assigned!".
    *   La orden desaparece de la lista "Unassigned".

---

## 🧽 Escenario 3: El Lavador Ejecuta (Dispositivo B)
1.  Cierra sesión de Admin.
2.  Inicia sesión como el **Lavador** que asignaste (`pedro@washer.com`).
3.  En el Dashboard, verás "Active Jobs: 1".
4.  Verás la tarjeta del pedido con el botón **"Open Job"**.
5.  Entra al detalle y toca: **"Start Route"**.
    *   *Status cambia a "En Route"*.
6.  Toca **"Arrived"**.
    *   *Status cambia a "Arrived"*.
7.  Prueba la **Cámara**: Toca el icono de cámara y toma una foto de prueba.
8.  Toca **"Start Washing"**.
    *   *Status cambia a "Washing"*.

---

## 📱 Escenario 4: Verificación en Vivo (Dispositivo A - Cliente)
1.  Miras el teléfono del Cliente.
2.  **Resultado Esperado**:
    *   La pantalla se ha actualizado sola (sin recargar).
    *   El mapa debe ser visible.
    *   La barra de progreso avanza.
    *   Texto: "Scrubbing & Foam" (o el estado actual).
    *   Si configuraste las Cloud Functions, deberías haber recibido notificaciones Push vibrando.

---

## ✅ Éxito
Si logras completar este ciclo, tu aplicación está lista para el mundo real. ¡Felicidades! 🚀
