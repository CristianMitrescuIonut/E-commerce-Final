/* ============================================================
   GLITCH CODE — CARRITO POPUP
   Incluye este archivo en cualquier página y el carrito
   aparecerá automáticamente al hacer click en .cart-trigger
   ============================================================ */

(function () {
  'use strict';

  // ── ESTADO DEL CARRITO ──────────────────────────────────────
  // En producción esto vendría de localStorage / backend.
  // De momento usamos datos de demo que puedes reemplazar.
  let cartItems = [
    {
      id: 'proteina-iso-tech-vainilla',
      name: 'Proteína Iso-Tech',
      variant: 'Vainilla · 2kg',
      price: 54.99,
      qty: 1,
      img: null   // pon la ruta de tu imagen aquí
    }
  ];

  const FREE_SHIPPING_THRESHOLD = 50; // € para envío gratis

  // ── INYECTAR HTML ───────────────────────────────────────────
  function injectCart() {
    if (document.getElementById('gc-cart-overlay')) return;

    const html = `
    <!-- OVERLAY -->
    <div id="gc-cart-overlay" onclick="GCCart.close()"></div>

    <!-- DRAWER -->
    <aside id="gc-cart-drawer" role="dialog" aria-label="Carrito de compra">

      <!-- HEAD -->
      <div class="gc-cart-head">
        <div class="gc-cart-head-left">
          <span class="gc-cart-title">MI CARRITO</span>
          <span class="gc-cart-count" id="gc-count-badge">0</span>
        </div>
        <button class="gc-cart-close" onclick="GCCart.close()" aria-label="Cerrar carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- ENVÍO GRATIS BAR -->
      <div class="gc-shipping-bar" id="gc-shipping-bar">
        <div class="gc-shipping-text" id="gc-shipping-text"></div>
        <div class="gc-shipping-track">
          <div class="gc-shipping-fill" id="gc-shipping-fill"></div>
        </div>
      </div>

      <!-- ITEMS -->
      <div class="gc-items" id="gc-items"></div>

      <!-- EMPTY STATE -->
      <div class="gc-empty" id="gc-empty">
        <div class="gc-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <p class="gc-empty-title">Tu carrito está vacío</p>
        <p class="gc-empty-sub">Añade productos para empezar.</p>
        <a href="plp-glitch-code.html" class="gc-btn-shop" onclick="GCCart.close()">Ver productos →</a>
      </div>

      <!-- FOOTER -->
      <div class="gc-cart-foot" id="gc-cart-foot">
        <div class="gc-subtotal-row">
          <span class="gc-subtotal-label">Subtotal</span>
          <span class="gc-subtotal-val" id="gc-subtotal">0,00 €</span>
        </div>
        <p class="gc-foot-note">IVA incluido · Envío calculado al pagar</p>
        <a href="checkout-glitch.html" class="gc-btn-checkout">
          <span>Finalizar compra</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
        <a href="plp-glitch-code.html" class="gc-btn-continue" onclick="GCCart.close()">← Seguir comprando</a>
      </div>

    </aside>`;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ── INYECTAR ESTILOS ────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('gc-cart-styles')) return;

    const css = `
    /* OVERLAY */
    #gc-cart-overlay {
      position: fixed; inset: 0; z-index: 900;
      background: rgba(0,0,0,.7);
      backdrop-filter: blur(4px);
      opacity: 0; visibility: hidden;
      transition: opacity .35s ease, visibility .35s;
    }
    #gc-cart-overlay.open { opacity: 1; visibility: visible; }

    /* DRAWER */
    #gc-cart-drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      z-index: 901;
      width: 420px; max-width: 100vw;
      background: #111;
      border-left: 1px solid rgba(168,255,0,.1);
      display: flex; flex-direction: column;
      transform: translateX(100%);
      transition: transform .38s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
    }
    #gc-cart-drawer.open { transform: translateX(0); }

    /* HEAD */
    .gc-cart-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 22px 16px;
      border-bottom: 1px solid rgba(255,255,255,.05);
      flex-shrink: 0;
    }
    .gc-cart-head-left { display: flex; align-items: center; gap: 10px; }
    .gc-cart-title {
      font-family: 'Orbitron', sans-serif;
      font-size: .52rem; font-weight: 700;
      letter-spacing: 4px; color: #fff;
    }
    .gc-cart-count {
      background: #A8FF00; color: #0E0E0E;
      font-family: 'Orbitron', sans-serif;
      font-size: .4rem; font-weight: 900;
      min-width: 20px; height: 20px;
      border-radius: 10px; padding: 0 6px;
      display: flex; align-items: center; justify-content: center;
    }
    .gc-cart-close {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: none;
      border: 1px solid rgba(255,255,255,.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #5A5A5A;
      transition: border-color .2s, color .2s;
    }
    .gc-cart-close:hover { border-color: rgba(168,255,0,.4); color: #A8FF00; }
    .gc-cart-close svg { width: 14px; height: 14px; }

    /* SHIPPING BAR */
    .gc-shipping-bar {
      padding: 12px 22px;
      background: rgba(168,255,0,.04);
      border-bottom: 1px solid rgba(255,255,255,.04);
      flex-shrink: 0;
    }
    .gc-shipping-text {
      font-size: .7rem; color: rgba(255,255,255,.6);
      margin-bottom: 8px; line-height: 1.4;
    }
    .gc-shipping-text strong { color: #A8FF00; }
    .gc-shipping-track {
      height: 3px; border-radius: 2px;
      background: rgba(255,255,255,.08);
      overflow: hidden;
    }
    .gc-shipping-fill {
      height: 100%; border-radius: 2px;
      background: #A8FF00;
      transition: width .5s cubic-bezier(.4,0,.2,1);
    }

    /* ITEMS LIST */
    .gc-items {
      flex: 1; overflow-y: auto;
      padding: 10px 0;
    }
    .gc-items::-webkit-scrollbar { width: 3px; }
    .gc-items::-webkit-scrollbar-thumb { background: rgba(168,255,0,.3); border-radius: 2px; }

    /* SINGLE ITEM */
    .gc-item {
      display: grid;
      grid-template-columns: 72px 1fr auto;
      gap: 14px; align-items: start;
      padding: 16px 22px;
      border-bottom: 1px solid rgba(255,255,255,.04);
      animation: gc-fadein .25s ease;
      transition: background .2s;
    }
    .gc-item:hover { background: rgba(255,255,255,.02); }
    @keyframes gc-fadein {
      from { opacity: 0; transform: translateX(12px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* ITEM IMAGE */
    .gc-item-img {
      width: 72px; height: 72px;
      border-radius: 10px;
      background: #1a1a1a;
      border: 1px solid rgba(255,255,255,.07);
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .gc-item-img img { width: 100%; height: 100%; object-fit: cover; }
    .gc-item-img-placeholder {
      width: 32px; height: 32px; opacity: .2;
    }

    /* ITEM INFO */
    .gc-item-info { min-width: 0; }
    .gc-item-name {
      font-family: 'Orbitron', sans-serif;
      font-size: .5rem; font-weight: 700;
      letter-spacing: 1px; color: #fff;
      margin-bottom: 3px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .gc-item-variant {
      font-size: .68rem; color: #5A5A5A;
      margin-bottom: 12px;
    }

    /* QTY CONTROL */
    .gc-qty {
      display: inline-flex; align-items: center;
      background: #161616;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 8px;
      overflow: hidden;
    }
    .gc-qty-btn {
      width: 30px; height: 30px;
      background: none; border: none;
      cursor: pointer; color: #5A5A5A;
      font-size: 1rem; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      transition: color .2s, background .2s;
    }
    .gc-qty-btn:hover { color: #A8FF00; background: rgba(168,255,0,.06); }
    .gc-qty-num {
      font-family: 'Orbitron', sans-serif;
      font-size: .48rem; font-weight: 700;
      color: #fff; min-width: 28px;
      text-align: center;
    }

    /* ITEM PRICE + REMOVE */
    .gc-item-right {
      display: flex; flex-direction: column;
      align-items: flex-end; gap: 8px;
    }
    .gc-item-price {
      font-family: 'Orbitron', sans-serif;
      font-size: .58rem; font-weight: 700;
      color: #A8FF00; white-space: nowrap;
    }
    .gc-item-remove {
      background: none; border: none; cursor: pointer;
      color: #3a3a3a; font-size: .65rem;
      padding: 4px; border-radius: 4px;
      transition: color .2s;
      font-family: 'Poppins', sans-serif;
    }
    .gc-item-remove:hover { color: #ff4f4f; }

    /* EMPTY STATE */
    .gc-empty {
      display: none; flex-direction: column;
      align-items: center; justify-content: center;
      flex: 1; padding: 40px 24px;
      text-align: center;
    }
    .gc-empty.show { display: flex; }
    .gc-empty-icon {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.07);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      color: #3a3a3a;
    }
    .gc-empty-icon svg { width: 34px; height: 34px; }
    .gc-empty-title {
      font-family: 'Orbitron', sans-serif;
      font-size: .65rem; font-weight: 700;
      letter-spacing: 2px; color: #fff;
      margin-bottom: 8px;
    }
    .gc-empty-sub { font-size: .75rem; color: #5A5A5A; margin-bottom: 24px; }
    .gc-btn-shop {
      display: inline-block;
      padding: 11px 24px;
      border: 1px solid rgba(168,255,0,.3);
      border-radius: 8px;
      font-family: 'Orbitron', sans-serif;
      font-size: .42rem; font-weight: 700; letter-spacing: 2px;
      color: #A8FF00; text-decoration: none;
      transition: all .2s;
    }
    .gc-btn-shop:hover {
      background: rgba(168,255,0,.08);
      border-color: #A8FF00;
    }

    /* FOOTER */
    .gc-cart-foot {
      padding: 18px 22px 24px;
      border-top: 1px solid rgba(255,255,255,.06);
      flex-shrink: 0;
      background: #111;
    }
    .gc-cart-foot.hidden { display: none; }
    .gc-subtotal-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 6px;
    }
    .gc-subtotal-label {
      font-family: 'Orbitron', sans-serif;
      font-size: .42rem; letter-spacing: 2px; color: #5A5A5A;
      text-transform: uppercase;
    }
    .gc-subtotal-val {
      font-family: 'Orbitron', sans-serif;
      font-size: .85rem; font-weight: 900; color: #fff;
    }
    .gc-foot-note {
      font-size: .65rem; color: #3a3a3a;
      margin-bottom: 16px;
    }
    .gc-btn-checkout {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; padding: 15px;
      background: #A8FF00; color: #0E0E0E;
      border-radius: 10px;
      font-family: 'Orbitron', sans-serif;
      font-size: .5rem; font-weight: 700; letter-spacing: 3px;
      text-decoration: none; text-transform: uppercase;
      transition: all .2s; margin-bottom: 12px;
      position: relative; overflow: hidden;
    }
    .gc-btn-checkout::before {
      content: '';
      position: absolute; inset: 0;
      background: rgba(255,255,255,.15);
      transform: translateX(-100%);
      transition: transform .3s ease;
    }
    .gc-btn-checkout:hover::before { transform: translateX(0); }
    .gc-btn-checkout:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(168,255,0,.25); }
    .gc-btn-checkout svg { width: 14px; height: 14px; flex-shrink: 0; }
    .gc-btn-continue {
      display: block; text-align: center;
      font-size: .7rem; color: #5A5A5A;
      text-decoration: none; transition: color .2s;
    }
    .gc-btn-continue:hover { color: #A8FF00; }

    /* BODY LOCK */
    body.gc-locked { overflow: hidden; }

    /* RESPONSIVE */
    @media (max-width: 480px) {
      #gc-cart-drawer { width: 100vw; }
    }`;

    const style = document.createElement('style');
    style.id = 'gc-cart-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── RENDER ──────────────────────────────────────────────────
  function render() {
    const itemsEl    = document.getElementById('gc-items');
    const emptyEl    = document.getElementById('gc-empty');
    const footEl     = document.getElementById('gc-cart-foot');
    const countEl    = document.getElementById('gc-count-badge');
    const subtotalEl = document.getElementById('gc-subtotal');
    const fillEl     = document.getElementById('gc-shipping-fill');
    const textEl     = document.getElementById('gc-shipping-text');

    if (!itemsEl) return;

    // Total qty
    const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

    // Badge
    if (countEl) {
      countEl.textContent = totalQty;
      countEl.style.display = totalQty === 0 ? 'none' : 'flex';
    }

    // Global dot on cart icon
    document.querySelectorAll('.gc-dot').forEach(d => {
      d.style.display = totalQty > 0 ? 'block' : 'none';
    });

    // Empty / filled states
    if (cartItems.length === 0) {
      itemsEl.innerHTML = '';
      emptyEl.classList.add('show');
      footEl.classList.add('hidden');
    } else {
      emptyEl.classList.remove('show');
      footEl.classList.remove('hidden');

      // Render items
      itemsEl.innerHTML = cartItems.map(item => `
        <div class="gc-item" id="gc-item-${item.id}">
          <div class="gc-item-img">
            ${item.img
              ? `<img src="${item.img}" alt="${item.name}">`
              : `<svg class="gc-item-img-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                   <rect x="3" y="3" width="18" height="18" rx="2"/>
                   <path d="M3 9h18M9 21V9"/>
                 </svg>`
            }
          </div>
          <div class="gc-item-info">
            <p class="gc-item-name">${item.name}</p>
            <p class="gc-item-variant">${item.variant}</p>
            <div class="gc-qty">
              <button class="gc-qty-btn" onclick="GCCart.updateQty('${item.id}', -1)">−</button>
              <span class="gc-qty-num">${item.qty}</span>
              <button class="gc-qty-btn" onclick="GCCart.updateQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <div class="gc-item-right">
            <span class="gc-item-price">${(item.price * item.qty).toFixed(2).replace('.',',')} €</span>
            <button class="gc-item-remove" onclick="GCCart.removeItem('${item.id}')">Eliminar</button>
          </div>
        </div>
      `).join('');
    }

    // Subtotal
    if (subtotalEl) subtotalEl.textContent = totalPrice.toFixed(2).replace('.', ',') + ' €';

    // Shipping bar
    if (fillEl && textEl) {
      const pct = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
      fillEl.style.width = pct + '%';
      if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
        textEl.innerHTML = '🎉 <strong>¡Envío gratis desbloqueado!</strong>';
      } else {
        const left = (FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(2).replace('.', ',');
        textEl.innerHTML = `Te faltan <strong>${left} €</strong> para <strong>envío gratis</strong>`;
      }
    }
  }

  // ── ENLAZAR TRIGGERS ────────────────────────────────────────
  function bindTriggers() {
    // Cualquier elemento con data-cart-open o clase .cart-trigger
    document.querySelectorAll('[data-cart-open], .cart-trigger').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); GCCart.open(); });
    });

    // Icono del carrito en el nav (busca el link que apunte a carrito.html)
    document.querySelectorAll('a[href="carrito.html"], a[href="./carrito.html"]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); GCCart.open(); });
      // Añadir punto indicador
      addDot(el);
    });

    // Botones "Añadir al carrito" en PDPs
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id      = btn.dataset.id      || 'producto-' + Date.now();
        const name    = btn.dataset.name    || 'Producto';
        const variant = btn.dataset.variant || '';
        const price   = parseFloat(btn.dataset.price) || 0;
        const img     = btn.dataset.img     || null;
        GCCart.addItem({ id, name, variant, price, img });
      });
    });
  }

  function addDot(el) {
    if (el.querySelector('.gc-dot')) return;
    const dot = document.createElement('span');
    dot.className = 'gc-dot';
    dot.style.cssText = `
      position:absolute; top:-2px; right:-2px;
      width:9px; height:9px;
      background:#A8FF00; border-radius:50%;
      border:2px solid #0E0E0E;
      display:none;
    `;
    el.style.position = 'relative';
    el.appendChild(dot);
  }

  // ── API PÚBLICA ──────────────────────────────────────────────
  window.GCCart = {

    open() {
      document.getElementById('gc-cart-overlay').classList.add('open');
      document.getElementById('gc-cart-drawer').classList.add('open');
      document.body.classList.add('gc-locked');
      render();
    },

    close() {
      document.getElementById('gc-cart-overlay').classList.remove('open');
      document.getElementById('gc-cart-drawer').classList.remove('open');
      document.body.classList.remove('gc-locked');
    },

    addItem(item) {
      const existing = cartItems.find(i => i.id === item.id);
      if (existing) {
        existing.qty++;
      } else {
        cartItems.push({ ...item, qty: 1 });
      }
      render();
      this.open();

      // Micro-feedback en el botón
      const btn = document.querySelector(`[data-id="${item.id}"][data-add-to-cart]`);
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ Añadido';
        btn.style.background = '#A8FF00';
        btn.style.color = '#0E0E0E';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.color = '';
        }, 1800);
      }
    },

    removeItem(id) {
      const el = document.getElementById('gc-item-' + id);
      if (el) {
        el.style.transition = 'opacity .2s, transform .2s';
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        setTimeout(() => {
          cartItems = cartItems.filter(i => i.id !== id);
          render();
        }, 200);
      }
    },

    updateQty(id, delta) {
      const item = cartItems.find(i => i.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) {
        this.removeItem(id);
      } else {
        render();
      }
    },

    getItems() { return cartItems; },
    getTotal()  { return cartItems.reduce((s, i) => s + i.price * i.qty, 0); },
    getCount()  { return cartItems.reduce((s, i) => s + i.qty, 0); },
    clear()     { cartItems = []; render(); }
  };

  // ── INIT ────────────────────────────────────────────────────
  function init() {
    injectStyles();
    injectCart();
    bindTriggers();
    render();

    // Cerrar con ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') GCCart.close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
