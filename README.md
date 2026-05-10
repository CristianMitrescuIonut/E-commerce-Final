# Glitch Code — E-commerce Web

Sitio web estático del e-commerce de suplementación deportiva **Glitch Code**.

## 📁 Estructura de archivos

| Archivo | Descripción |
|---|---|
| `home-glitch-popup.html` | **Home** — Página principal |
| `plp-glitch-code.html` | **Tienda** — Listado de productos |
| `pdp_proteina_iso_tech.html` | **PDP** — Ficha Proteína Iso-Tech |
| `pdp_creatina_monohidrato.html` | **PDP** — Ficha Creatina Monohidrato |
| `checkout-glitch.html` | **Checkout** — Proceso de compra |
| `comunidad_blog_glitch_code.html` | **Comunidad & Blog** |
| `contacto_v2_glitch_code.html` | **Contacto** |
| `sobre-nosotros.html` | **Sobre nosotros** |
| `login.html` | **Login / Registro** |
| `perfil-usuario-glitch.html` | **Perfil de usuario** |
| `legales-glitch-code.html` | **Textos legales** (Aviso legal, Privacidad, Cookies, CGC) |
| `carrito.js` | **Carrito popup** — Script global para todas las páginas |

## 🚀 Cómo subir a GitHub Pages

1. Crea un repositorio en GitHub (ej: `glitchcode-web`)
2. Sube todos los archivos de esta carpeta a la raíz del repo
3. Ve a **Settings → Pages → Source: main branch / root**
4. Tu web estará en `https://tuusuario.github.io/glitchcode-web/home-glitch-popup.html`

> Tip: Renombra `home-glitch-popup.html` a `index.html` para que sea la URL raíz.

## 🔗 Mapa de navegación

```
Home
├── Tienda (PLP)
│   ├── Proteína Iso-Tech (PDP)
│   └── Creatina Monohidrato (PDP)
│       └── Añadir al carrito → Carrito popup → Checkout
├── Comunidad & Blog
├── Sobre nosotros
├── Contacto
├── Login / Registro → Perfil de usuario
└── Textos Legales
    ├── Aviso Legal
    ├── Política de Privacidad
    ├── Política de Cookies
    └── Condiciones Generales
```

## ⚡ Carrito popup

El carrito funciona como popup en todas las páginas. Para añadir el carrito a cualquier página:
1. El script `carrito.js` ya está incluido en todos los HTML
2. Para enlazar productos al carrito desde los PDPs, usa atributos `data-add-to-cart` en los botones

## ⚠️ Páginas pendientes (funcionalidad futura)

- `confirmacion.html` — Confirmación de pedido post-pago
- `404.html` — Página de error
- Backend: pasarela de pago real (Stripe/PayPal), autenticación, gestión de pedidos

---
*Glitch Code SA · Zaragoza · glitchcode.es*
