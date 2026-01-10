# Landing Page - Premium Car Wash

Página web profesional para tu aplicación de car wash móvil.

## 📁 Archivos Incluidos

```
landing/
├── index.html      # Página principal
├── styles.css      # Estilos CSS
└── script.js       # JavaScript interactivo
```

## 🚀 Cómo Usar

### 1. Abrir la Página Localmente
Simplemente abre `index.html` en tu navegador web.

### 2. Agregar Links de las Tiendas

**En `index.html`, busca y reemplaza los `#` con tus links reales:**

#### Hero Section (línea ~63-70):
```html
<!-- App Store -->
<a href="TU_LINK_DE_APP_STORE_AQUI" class="download-btn" id="appStoreBtn">

<!-- Google Play -->
<a href="TU_LINK_DE_GOOGLE_PLAY_AQUI" class="download-btn" id="playStoreBtn">
```

#### Footer (línea ~273-280):
```html
<!-- App Store -->
<a href="TU_LINK_DE_APP_STORE_AQUI" id="appStoreBtnFooter">

<!-- Google Play -->
<a href="TU_LINK_DE_GOOGLE_PLAY_AQUI" id="playStoreBtnFooter">
```

### 3. Personalizar Contenido

**Logo:**
- Reemplaza la ruta del logo en línea 26 y 267:
```html
<img src="../public/logo.webp" alt="Car Wash Logo">
```

**Información de Contacto (Footer):**
- Línea ~297-299: Actualiza email, teléfono y ubicación

**Links de la App:**
- Todos los botones "Book Now" apuntan a: `https://my-carwashapp-e6aba.web.app`
- Puedes cambiarlos si necesitas

## 🎨 Características

✅ **Diseño Moderno y Responsivo**
- Gradientes vibrantes
- Animaciones suaves
- Totalmente responsive (mobile, tablet, desktop)

✅ **Secciones Incluidas**
- Hero con estadísticas
- Features (6 características)
- How It Works (3 pasos)
- Pricing (3 paquetes)
- CTA Section
- Footer completo

✅ **Botones de Descarga**
- App Store badge oficial
- Google Play badge oficial
- En hero y footer

✅ **Interactividad**
- Smooth scroll
- Navbar con efecto scroll
- Animaciones on scroll
- Hover effects

## 📱 Responsive

La página se adapta perfectamente a:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔗 Links Importantes

Cuando tengas tus apps publicadas, reemplaza estos links:

1. **App Store**: Obtén el link de tu app en App Store Connect
2. **Google Play**: Obtén el link de tu app en Google Play Console

**Formato de links:**
- App Store: `https://apps.apple.com/app/id[TU_APP_ID]`
- Google Play: `https://play.google.com/store/apps/details?id=[TU_PACKAGE_NAME]`

## 🎯 Próximos Pasos

1. ✅ Reemplazar los `#` con tus links reales de las tiendas
2. ✅ Actualizar información de contacto en el footer
3. ✅ Verificar que el logo se vea correctamente
4. ✅ Probar en diferentes dispositivos
5. ✅ Desplegar en tu hosting (Firebase Hosting, Netlify, Vercel, etc.)

## 🚀 Desplegar

### Opción 1: Firebase Hosting
```bash
firebase init hosting
firebase deploy --only hosting
```

### Opción 2: Netlify
Arrastra la carpeta `landing` a netlify.com/drop

### Opción 3: Vercel
```bash
vercel
```

---

**¡Tu landing page está lista!** Solo agrega los links de las tiendas y despliégala. 🎉
