/* ================================================================
   GLITCH CODE — gc-utils.js
   Wishlist · Popup Próximamente · Product card links
   ================================================================ */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // 1. WISHLIST
  // ══════════════════════════════════════════════════════════════
  var WISH_KEY = 'gc_wishlist';

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function saveWishlist(list) {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function isWished(id) {
    return getWishlist().some(function (i) { return i.id === id; });
  }
  function toggleWish(id, name, price) {
    var list = getWishlist();
    var idx = list.findIndex(function (i) { return i.id === id; });
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push({ id: id, name: name, price: price, ts: Date.now() });
    }
    saveWishlist(list);
    updateWishBadge();
    return idx === -1; // true = added
  }
  function updateWishBadge() {
    var count = getWishlist().length;
    var badge = document.getElementById('gc-wish-badge');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    }
  }

  // Expose globally
  window.GCWish = {
    toggle: function (id, name, price, btn) {
      var added = toggleWish(id, name, price);
      // Update button state
      if (btn) {
        btn.classList.toggle('wished', added);
        btn.setAttribute('aria-label', added ? 'Quitar de favoritos' : 'Añadir a favoritos');
        btn.querySelector('svg') && (btn.querySelector('svg').style.fill = added ? '#A8FF00' : 'none');
        btn.querySelector('svg') && (btn.querySelector('svg').style.stroke = added ? '#A8FF00' : 'currentColor');
      }
      // Toast
      GCToast.show(
        added ? '❤️ Añadido a favoritos' : '🤍 Eliminado de favoritos',
        added ? 'success' : 'info'
      );
      return added;
    },
    getAll: getWishlist,
    isWished: isWished,
    count: function () { return getWishlist().length; }
  };

  // ══════════════════════════════════════════════════════════════
  // 2. TOAST NOTIFICATIONS
  // ══════════════════════════════════════════════════════════════
  window.GCToast = {
    show: function (msg, type) {
      var existing = document.getElementById('gc-toast');
      if (existing) existing.remove();

      var el = document.createElement('div');
      el.id = 'gc-toast';
      el.setAttribute('role', 'status');
      el.innerHTML = '<span>' + msg + '</span>';
      el.style.cssText = [
        'position:fixed', 'bottom:28px', 'left:50%',
        'transform:translateX(-50%) translateY(80px)',
        'z-index:99999',
        'background:' + (type === 'success' ? 'rgba(168,255,0,0.12)' : type === 'info' ? 'rgba(0,123,255,0.12)' : 'rgba(255,79,79,0.12)'),
        'border:1px solid ' + (type === 'success' ? 'rgba(168,255,0,0.35)' : type === 'info' ? 'rgba(0,123,255,0.35)' : 'rgba(255,79,79,0.35)'),
        'backdrop-filter:blur(16px)',
        'border-radius:100px',
        'padding:12px 24px',
        'font-family:Poppins,sans-serif',
        'font-size:0.82rem',
        'font-weight:500',
        'color:#fff',
        'pointer-events:none',
        'transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
        'opacity:0',
        'white-space:nowrap',
        'box-shadow:0 8px 32px rgba(0,0,0,0.4)'
      ].join(';');
      document.body.appendChild(el);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.style.transform = 'translateX(-50%) translateY(0)';
          el.style.opacity = '1';
        });
      });
      setTimeout(function () {
        el.style.transform = 'translateX(-50%) translateY(80px)';
        el.style.opacity = '0';
        setTimeout(function () { el.remove(); }, 400);
      }, 2600);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // 3. POPUP PRÓXIMAMENTE — diseño premium
  // ══════════════════════════════════════════════════════════════
  var COMING_SOON_PAGES = [
    'discord.html', 'eventos.html', 'retos.html', 'comunidad-miembros.html', 'blog-archivo.html',
    'faq.html', 'embajadores.html', 'seguimiento.html',
    'confirmacion.html', '404.html', 'blog-glitch-code.html',
    'afiliados.html', 'press.html', 'app.html', 'reviews.html',
    'wishlist.html', 'rewards.html'
  ];

  function injectProximamenteStyles() {
    if (document.getElementById('gc-prox-styles')) return;
    var css = document.createElement('style');
    css.id = 'gc-prox-styles';
    css.textContent = `
      #gc-prox-overlay {
        position: fixed; inset: 0; z-index: 99000;
        background: rgba(5,5,5,0.88);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; visibility: hidden;
        transition: opacity .4s ease, visibility .4s;
        padding: 20px;
      }
      #gc-prox-overlay.open {
        opacity: 1; visibility: visible;
      }
      #gc-prox-card {
        position: relative;
        background: #0f0f0f;
        border: 1px solid rgba(168,255,0,0.18);
        border-radius: 24px;
        padding: 56px 48px 48px;
        max-width: 520px; width: 100%;
        text-align: center;
        transform: scale(0.88) translateY(24px);
        transition: transform .45s cubic-bezier(0.34,1.56,0.64,1);
        overflow: hidden;
        box-shadow: 0 0 0 1px rgba(168,255,0,0.06), 0 32px 80px rgba(0,0,0,0.7);
      }
      #gc-prox-overlay.open #gc-prox-card {
        transform: scale(1) translateY(0);
      }

      /* Background grid */
      #gc-prox-card::before {
        content: '';
        position: absolute; inset: 0;
        background-image:
          linear-gradient(rgba(168,255,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168,255,0,0.04) 1px, transparent 1px);
        background-size: 32px 32px;
        pointer-events: none;
      }
      /* Glow top */
      #gc-prox-card::after {
        content: '';
        position: absolute;
        top: -80px; left: 50%; transform: translateX(-50%);
        width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(168,255,0,0.1) 0%, transparent 65%);
        pointer-events: none;
        animation: gc-prox-pulse 3s ease-in-out infinite;
      }
      @keyframes gc-prox-pulse {
        0%,100% { opacity: 1; transform: translateX(-50%) scale(1); }
        50% { opacity: 0.6; transform: translateX(-50%) scale(1.15); }
      }

      /* Close */
      #gc-prox-close {
        position: absolute; top: 16px; right: 16px;
        width: 32px; height: 32px; border-radius: 50%;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: #5A5A5A;
        transition: all .2s; z-index: 2;
      }
      #gc-prox-close:hover { color: #fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); }
      #gc-prox-close svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; }

      /* Hexagon icon */
      .gc-prox-hex {
        position: relative; z-index: 1;
        width: 80px; height: 80px; margin: 0 auto 28px;
        display: flex; align-items: center; justify-content: center;
      }
      .gc-prox-hex svg.hex-bg {
        position: absolute; inset: 0; width: 100%; height: 100%;
        animation: gc-prox-spin 12s linear infinite;
      }
      @keyframes gc-prox-spin { to { transform: rotate(360deg); } }
      .gc-prox-hex-emoji {
        position: relative; z-index: 1;
        font-size: 1.8rem; line-height: 1;
      }

      /* Tag */
      .gc-prox-tag {
        position: relative; z-index: 1;
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 14px;
        background: rgba(168,255,0,0.08);
        border: 1px solid rgba(168,255,0,0.2);
        border-radius: 100px;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.38rem; font-weight: 700;
        letter-spacing: 3px; text-transform: uppercase;
        color: #A8FF00; margin-bottom: 20px;
      }
      .gc-prox-tag-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #A8FF00;
        animation: gc-prox-blink 1.4s ease-in-out infinite;
      }
      @keyframes gc-prox-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

      /* Title */
      #gc-prox-title {
        position: relative; z-index: 1;
        font-family: 'Orbitron', sans-serif;
        font-size: clamp(1.2rem, 5vw, 2rem);
        font-weight: 900; line-height: 1.1;
        letter-spacing: -0.5px; color: #fff;
        margin-bottom: 12px;
      }
      #gc-prox-title .lm { color: #A8FF00; }

      /* Sub */
      #gc-prox-sub {
        position: relative; z-index: 1;
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem; color: rgba(255,255,255,0.45);
        line-height: 1.7; margin-bottom: 32px;
        max-width: 360px; margin-left: auto; margin-right: auto;
      }
      #gc-prox-sub strong { color: rgba(255,255,255,0.75); font-weight: 600; }

      /* Email form */
      .gc-prox-form {
        position: relative; z-index: 1;
        display: flex; gap: 8px; margin-bottom: 16px;
      }
      .gc-prox-input {
        flex: 1;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 12px 16px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem; color: #fff;
        outline: none;
        transition: border-color .2s;
      }
      .gc-prox-input::placeholder { color: rgba(90,90,90,0.8); }
      .gc-prox-input:focus { border-color: rgba(168,255,0,0.4); }
      .gc-prox-btn {
        padding: 12px 20px;
        background: #A8FF00; color: #0E0E0E;
        border: none; border-radius: 10px;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.42rem; font-weight: 700;
        letter-spacing: 1px; cursor: pointer;
        transition: all .2s; white-space: nowrap;
      }
      .gc-prox-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(168,255,0,0.3); }
      .gc-prox-note {
        position: relative; z-index: 1;
        font-size: 0.65rem; color: rgba(90,90,90,0.7);
        margin-bottom: 28px;
      }

      /* Bottom links */
      .gc-prox-links {
        position: relative; z-index: 1;
        display: flex; gap: 12px; justify-content: center;
        flex-wrap: wrap; padding-top: 24px;
        border-top: 1px solid rgba(255,255,255,0.05);
      }
      .gc-prox-link {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.38rem; letter-spacing: 2px;
        color: rgba(90,90,90,0.7); text-decoration: none;
        text-transform: uppercase;
        transition: color .2s; cursor: pointer;
        background: none; border: none;
        padding: 0;
      }
      .gc-prox-link:hover { color: #A8FF00; }

      /* Particles */
      .gc-prox-particles {
        position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
      }
      .gc-prox-particle {
        position: absolute;
        width: 2px; height: 2px;
        background: #A8FF00;
        border-radius: 50%;
        animation: gc-prox-float linear infinite;
        opacity: 0;
      }
      @keyframes gc-prox-float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.2; }
        100% { transform: translateY(-300px) translateX(var(--dx,20px)); opacity: 0; }
      }

      /* Success state */
      .gc-prox-success {
        display: none; flex-direction: column; align-items: center; gap: 12px;
        position: relative; z-index: 1;
      }
      .gc-prox-success.show { display: flex; animation: gc-fadein .4s ease; }
      @keyframes gc-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
      .gc-prox-success-icon {
        width: 52px; height: 52px; border-radius: 50%;
        background: rgba(168,255,0,0.1);
        border: 1px solid rgba(168,255,0,0.3);
        display: flex; align-items: center; justify-content: center;
      }
      .gc-prox-success-icon svg { width: 22px; height: 22px; stroke: #A8FF00; fill: none; stroke-width: 2.5; }
      .gc-prox-success-title { font-family: 'Orbitron', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; color: #fff; }
      .gc-prox-success-sub { font-size: 0.75rem; color: rgba(255,255,255,0.4); }

      @media (max-width: 540px) {
        #gc-prox-card { padding: 48px 24px 36px; }
        .gc-prox-form { flex-direction: column; }
      }
    `;
    document.head.appendChild(css);
  }

  function injectProximamenteHTML() {
    if (document.getElementById('gc-prox-overlay')) return;

    var html = `
    <div id="gc-prox-overlay" role="dialog" aria-modal="true" aria-label="Próximamente">
      <div id="gc-prox-card">

        <!-- Partículas de fondo -->
        <div class="gc-prox-particles" id="gc-prox-particles"></div>

        <!-- Cerrar -->
        <button id="gc-prox-close" onclick="GCProx.close()" aria-label="Cerrar">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Icono hexagonal -->
        <div class="gc-prox-hex">
          <svg class="hex-bg" viewBox="0 0 80 80">
            <polygon points="40,4 72,22 72,58 40,76 8,58 8,22"
              fill="none" stroke="rgba(168,255,0,0.15)" stroke-width="1"/>
            <polygon points="40,14 62,27 62,53 40,66 18,53 18,27"
              fill="none" stroke="rgba(168,255,0,0.08)" stroke-width="1"/>
          </svg>
          <span class="gc-prox-hex-emoji" id="gc-prox-emoji">⚡</span>
        </div>

        <!-- Tag -->
        <div class="gc-prox-tag">
          <span class="gc-prox-tag-dot"></span>
          En desarrollo
        </div>

        <!-- Contenido principal -->
        <div id="gc-prox-main">
          <h2 id="gc-prox-title">VIENE<br><span class="lm">MUY FUERTE.</span></h2>
          <p id="gc-prox-sub">
            <strong id="gc-prox-feature">Esta sección</strong> está en construcción.
            Estamos trabajando duro para que sea exactamente lo que necesitas.
            <br>Sé el primero en saberlo.
          </p>

          <!-- Email capture -->
          <div class="gc-prox-form">
            <input type="email" class="gc-prox-input" id="gc-prox-email"
              placeholder="tu@email.com" autocomplete="email">
            <button class="gc-prox-btn" onclick="GCProx.subscribe()">Avísame</button>
          </div>
          <p class="gc-prox-note">Sin spam. Solo una notificación cuando esté listo.</p>

          <!-- Links -->
          <div class="gc-prox-links">
            <a href="plp-glitch-code.html" class="gc-prox-link">Ver productos</a>
            <span style="color:rgba(90,90,90,0.3);font-size:0.6rem">·</span>
            <a href="comunidad_blog_glitch_code.html" class="gc-prox-link">Comunidad</a>
            <span style="color:rgba(90,90,90,0.3);font-size:0.6rem">·</span>
            <button class="gc-prox-link" onclick="GCProx.close()">Volver atrás</button>
          </div>
        </div>

        <!-- Success state (post-subscribe) -->
        <div class="gc-prox-success" id="gc-prox-success">
          <div class="gc-prox-success-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p class="gc-prox-success-title">¡Apuntado!</p>
          <p class="gc-prox-success-sub">Te avisamos en cuanto esté disponible.</p>
          <button class="gc-prox-link" onclick="GCProx.close()" style="color:#A8FF00;margin-top:8px">
            Cerrar →
          </button>
        </div>

      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    // Generar partículas
    var container = document.getElementById('gc-prox-particles');
    if (container) {
      for (var i = 0; i < 18; i++) {
        var p = document.createElement('div');
        p.className = 'gc-prox-particle';
        var left = Math.random() * 100;
        var delay = Math.random() * 6;
        var duration = 4 + Math.random() * 6;
        var dx = (Math.random() - 0.5) * 80;
        p.style.cssText = [
          'left:' + left + '%',
          'bottom:0',
          'animation-delay:' + delay + 's',
          'animation-duration:' + duration + 's',
          '--dx:' + dx + 'px',
          'width:' + (1 + Math.random() * 2) + 'px',
          'height:' + (1 + Math.random() * 2) + 'px',
        ].join(';');
        container.appendChild(p);
      }
    }

    // Cerrar con overlay click
    document.getElementById('gc-prox-overlay').addEventListener('click', function (e) {
      if (e.target === this) GCProx.close();
    });
    // Cerrar con ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') GCProx.close();
    });
  }

  // Metadata por feature
  var FEATURE_META = {
    'faq.html':                 { emoji: '💬', title: 'PREGUNTAS<br><span class="lm">FRECUENTES.</span>', desc: 'Estamos recopilando las dudas más habituales de nuestra comunidad para respondértelas todas en un solo sitio.' },
    'embajadores.html':         { emoji: '🏆', title: 'PROGRAMA DE<br><span class="lm">EMBAJADORES.</span>', desc: 'Estamos construyendo el programa más honesto del sector. Sin filtros, sin cuerpos irreales. Solo personas reales con resultados reales.' },
    'seguimiento.html':         { emoji: '📦', title: 'SEGUIMIENTO<br><span class="lm">DE PEDIDO.</span>', desc: 'Podrás seguir tu pedido en tiempo real desde tu perfil. Integración con transportistas en proceso.' },
    'confirmacion.html':        { emoji: '✅', title: 'CONFIRMACIÓN<br><span class="lm">DE PEDIDO.</span>', desc: 'La página de confirmación estará disponible cuando activemos el sistema de pagos real.' },
    'blog-glitch-code.html':    { emoji: '📚', title: 'ARTÍCULOS<br><span class="lm">INDIVIDUALES.</span>', desc: 'Las fichas de artículo individuales del blog están en desarrollo. Mientras tanto, visita la comunidad.' },
    'afiliados.html':           { emoji: '💸', title: 'PROGRAMA DE<br><span class="lm">AFILIADOS.</span>', desc: 'Comparte Glitch Code con tu comunidad y gana por cada venta. Muy pronto.' },
    'discord.html':            { emoji: '💬', title: 'SERVIDOR DE<br><span class=\"lm\">DISCORD.</span>', desc: 'Estamos construyendo el servidor más activo del fitness en español. Canales por objetivo, expertos en vivo, retos diarios y mucho más.' },
    'eventos.html':            { emoji: '📅', title: 'EVENTOS<br><span class=\"lm\">Y QUEDADAS.</span>', desc: 'Meetups en las principales ciudades, entrenos en grupo y eventos online. El fitness que se vive, no que se scrollea.' },
    'retos.html':              { emoji: '🏆', title: 'RETOS<br><span class=\"lm\">GLITCH CODE.</span>', desc: 'Retos mensuales con ranking en tiempo real, premios y reconocimiento dentro de la comunidad. La constancia que se premia.' },
    'comunidad-miembros.html': { emoji: '🤝', title: 'LA<br><span class=\"lm\">COMUNIDAD.</span>', desc: 'El directorio completo de miembros, perfiles, logros y conexiones está en desarrollo. Pronto podrás encontrar tu tribu.' },
    'blog-archivo.html':       { emoji: '📚', title: 'ARCHIVO<br><span class=\"lm\">DEL BLOG.</span>', desc: 'El archivo completo de artículos con filtros, búsqueda y colecciones temáticas está llegando. Mientras, lee los artículos destacados.' },
    'rewards.html':             { emoji: '🎯', title: 'GLITCH<br><span class="lm">REWARDS.</span>', desc: 'Sistema de puntos y recompensas para la comunidad. Constancia que se premia.' },
    'wishlist.html':            { emoji: '❤️', title: 'TUS<br><span class="lm">FAVORITOS.</span>', desc: 'La lista de favoritos completa estará en tu perfil. Estamos construyéndola.' },
  };

  window.GCProx = {
    open: function (href) {
      injectProximamenteStyles();
      injectProximamenteHTML();

      var meta = FEATURE_META[href] || {};
      var emoji = meta.emoji || '⚡';
      var title = meta.title || 'VIENE MUY<br><span class="lm">FUERTE.</span>';
      var featureName = meta.desc || 'Esta sección está en construcción. Estamos trabajando duro para que sea exactamente lo que necesitas.';

      document.getElementById('gc-prox-emoji').textContent = emoji;
      document.getElementById('gc-prox-title').innerHTML = title;
      document.getElementById('gc-prox-sub').innerHTML = featureName;
      document.getElementById('gc-prox-main').style.display = 'block';
      document.getElementById('gc-prox-success').classList.remove('show');
      document.getElementById('gc-prox-email').value = '';

      requestAnimationFrame(function () {
        document.getElementById('gc-prox-overlay').classList.add('open');
      });
      document.body.style.overflow = 'hidden';
    },

    close: function () {
      var overlay = document.getElementById('gc-prox-overlay');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    },

    subscribe: function () {
      var email = document.getElementById('gc-prox-email').value.trim();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValid) {
        var inp = document.getElementById('gc-prox-email');
        inp.style.borderColor = 'rgba(255,79,79,0.5)';
        inp.placeholder = 'Introduce un email válido';
        setTimeout(function () {
          inp.style.borderColor = '';
          inp.placeholder = 'tu@email.com';
        }, 2000);
        return;
      }
      // Simulate subscribe
      document.getElementById('gc-prox-main').style.display = 'none';
      document.getElementById('gc-prox-success').classList.add('show');
      // Store locally
      try {
        var subs = JSON.parse(localStorage.getItem('gc_subs') || '[]');
        if (!subs.includes(email)) subs.push(email);
        localStorage.setItem('gc_subs', JSON.stringify(subs));
      } catch (e) {}
    }
  };

  // ══════════════════════════════════════════════════════════════
  // 4. INTERCEPT COMING SOON LINKS
  // ══════════════════════════════════════════════════════════════
  function interceptLinks() {
    var comingSoon = [
      'faq.html','embajadores.html','seguimiento.html','confirmacion.html',
      'blog-glitch-code.html','afiliados.html','press.html','app.html',
      'reviews.html','wishlist.html','rewards.html'
    ];

    document.addEventListener('click', function (e) {
      var el = e.target.closest('a[href]');
      if (!el) return;
      var href = el.getAttribute('href');
      if (!href) return;
      var filename = href.split('/').pop().split('?')[0].split('#')[0];
      if (comingSoon.indexOf(filename) > -1) {
        e.preventDefault();
        GCProx.open(filename);
      }
    }, true);
  }

  // ══════════════════════════════════════════════════════════════
  // 5. HOME — hacer product cards clickables al PDP
  // ══════════════════════════════════════════════════════════════
  function linkHomeCards() {
    var page = window.location.pathname.split('/').pop();
    if (page !== 'home-glitch-popup.html' && page !== '' && page !== 'index.html') return;

    // Map de nombre → PDP
    var pdpMap = {
      'proteína iso-tech': 'pdp_proteina_iso_tech.html',
      'iso-tech':          'pdp_proteina_iso_tech.html',
      'proteína':          'pdp_proteina_iso_tech.html',
      'creatina monohidrato': 'pdp_creatina_monohidrato.html',
      'monohidrato':       'pdp_creatina_monohidrato.html',
      'creatina':          'pdp_creatina_monohidrato.html',
    };

    // Encontrar todas las pcards
    document.querySelectorAll('.pcard').forEach(function (card) {
      // Ya tiene link?
      if (card.querySelector('a.pcard-link, a.pcard-img-link')) return;

      // Detectar qué producto es por el texto
      var text = (card.textContent || '').toLowerCase();
      var targetPDP = null;
      Object.keys(pdpMap).forEach(function (key) {
        if (!targetPDP && text.indexOf(key) > -1) {
          targetPDP = pdpMap[key];
        }
      });
      if (!targetPDP) targetPDP = 'plp-glitch-code.html';

      // Hacer la imagen/visual clickable
      var vis = card.querySelector('.pcard-vis, .pcard-img, .product-img');
      if (vis) {
        vis.style.cursor = 'pointer';
        vis.addEventListener('click', function () {
          window.location.href = targetPDP;
        });
      }

      // Hacer el nombre clickable
      var nameEl = card.querySelector('.pcard-name, .pcard-title, h3, h4');
      if (nameEl) {
        nameEl.style.cursor = 'pointer';
        nameEl.addEventListener('click', function () {
          window.location.href = targetPDP;
        });
      }

      // Añadir data attributes al botón de carrito
      var btn = card.querySelector('.pcard-btn, button');
      if (btn && btn.textContent.trim().toLowerCase().includes('carrito')) {
        btn.setAttribute('data-pdp', targetPDP);
      }
    });
  }

  // ══════════════════════════════════════════════════════════════
  // 6. WISHLIST HEART ICON — hacer funcional en PDPs
  // ══════════════════════════════════════════════════════════════
  function initWishlistButtons() {
    // Botones con data-wish-id en PDPs
    document.querySelectorAll('[data-wish-id]').forEach(function (btn) {
      var id = btn.getAttribute('data-wish-id');
      if (isWished(id)) {
        btn.classList.add('wished');
        var svg = btn.querySelector('svg');
        if (svg) { svg.style.fill = '#A8FF00'; svg.style.stroke = '#A8FF00'; }
      }
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var name = btn.getAttribute('data-wish-name') || 'Producto';
        var price = btn.getAttribute('data-wish-price') || '';
        GCWish.toggle(id, name, price, btn);
      });
    });

    // Nav heart icon — click abre wishlist mini panel o va a perfil
    var wishIcon = document.getElementById('gc-wish-icon');
    if (wishIcon) {
      wishIcon.addEventListener('click', function (e) {
        var count = GCWish.count();
        if (count === 0) {
          e.preventDefault();
          GCToast.show('Tu lista de favoritos está vacía. Añade productos con ❤️', 'info');
        }
        // Si hay items → deja navegar al perfil normalmente
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════════════════════
  function init() {
    updateWishBadge();
    interceptLinks();
    initWishlistButtons();
    linkHomeCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- CONFIGURACIÓN BASE ---------------- */
    // Base de datos completa generada a partir de tu tienda
  const dbProductos = [
    {
      "id": "proteina-iso-tech",
      "nombre": "Proteína Iso-Tech",
      "precio": "45.99€",
      "img": "img/producto-proteina-iso-tech.png",
      "url": "pdp_proteina_iso_tech.html"
    },
    {
      "id": "creatina-mono",
      "nombre": "Creatina Monohidrato 500g",
      "precio": "24.99€",
      "img": "img/producto-creatina-monohidrato.png",
      "url": "pdp_creatina_monohidrato.html"
    },
    {
      "id": "creatina-hcl",
      "nombre": "Creatina HCL Pro",
      "precio": "29.99€",
      "img": "img/producto-creatina-hcl.png",
      "url": "#"
    },
    {
      "id": "stack-creatina-beta",
      "nombre": "Stack Creatina + Beta-Alanina",
      "precio": "39.99€",
      "img": "img/producto-extra-1.png",
      "url": "#"
    },
    {
      "id": "glitch-fuel",
      "nombre": "Glitch Fuel Pre-Workout",
      "precio": "29.99€",
      "img": "img/producto-preworkout.png",
      "url": "#"
    },
    {
      "id": "vitamina-d3-k2",
      "nombre": "Vitamina D3 + K2",
      "precio": "12.99€",
      "img": "img/producto-vitamina-d3-k2.png",
      "url": "#"
    },
    {
      "id": "complejo-b",
      "nombre": "Complejo B6 & B12",
      "precio": "9.99€",
      "img": "img/producto-complejo-b.png",
      "url": "#"
    },
    {
      "id": "zma",
      "nombre": "Zinc & Magnesio ZMA",
      "precio": "14.99€",
      "img": "img/producto-zma.png",
      "url": "#"
    },
    {
      "id": "multivitaminico",
      "nombre": "Multivitamínico Sport",
      "precio": "19.99€",
      "img": "img/producto-multivitaminico.png",
      "url": "#"
    },
    {
      "id": "omega3",
      "nombre": "Omega 3 2000mg",
      "precio": "14.99€",
      "img": "img/producto-omega3.png",
      "url": "#"
    },
    {
      "id": "munequeras-glitch",
      "nombre": "Muñequeras Glitch Code",
      "precio": "22.99€",
      "img": "img/producto-extra-4.png",
      "url": "#"
    },
    {
      "id": "straps-glitch",
      "nombre": "Straps Glitch Code",
      "precio": "24.99€",
      "img": "img/producto-extra-5.png",
      "url": "#"
    },
    {
      "id": "barrita-crunch",
      "nombre": "Barrita Glitch Crunch",
      "precio": "2.99€",
      "img": "img/producto-barrita-crunch.png",
      "url": "#"
    },
    {
      "id": "protein-cookie",
      "nombre": "Galletas Protein Cookie",
      "precio": "8.99€",
      "img": "img/producto-galletas-cookie.png",
      "url": "#"
    },
    {
      "id": "protein-chips",
      "nombre": "Protein Chips BBQ",
      "precio": "1.99€",
      "img": "img/producto-extra-2.png",
      "url": "#"
    },
    {
      "id": "glitch-shake",
      "nombre": "Glitch Shake RTD",
      "precio": "3.49€",
      "img": "img/producto-extra-3.png",
      "url": "#"
    }
  ];

  /* ---------------- GESTOR DE FAVORITOS ---------------- */
  window.Wishlist = {
    get: () => JSON.parse(localStorage.getItem('gc_wishlist') || '[]'),
    save: (list) => localStorage.setItem('gc_wishlist', JSON.stringify(list)),
    
    toggle: function(id) {
      let list = this.get();
      const index = list.findIndex(p => p.id === id);
      if (index > -1) {
        list.splice(index, 1); // Quitar si ya está
      } else {
        const prod = dbProductos.find(p => p.id === id);
        if(prod) list.push(prod); // Añadir
      }
      this.save(list);
      this.updateUI();
    },

    updateUI: function() {
      const list = this.get();
      
      // 1. Actualizar el contador (badge) del header
      const badge = document.getElementById('gc-wish-badge');
      if(badge) badge.textContent = list.length;

      // 2. Pintar corazones del panel de búsqueda y favoritos
      document.querySelectorAll('.gc-wish-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if(list.some(p => p.id === id)) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      // 3. Pintar corazones de las tarjetas de la tienda (Catálogo PLP)
      document.querySelectorAll('.card-wish').forEach(btn => {
        const card = btn.closest('.card');
        if(card) {
          const nombre = card.getAttribute('data-name');
          const prod = dbProductos.find(p => p.nombre === nombre);
          if(prod && list.some(p => p.id === prod.id)) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });

      this.renderPanel();
    },

    renderPanel: function() {
      const box = document.getElementById('gc-wish-results');
      if(!box) return;
      const list = this.get();
      box.innerHTML = '';
      if(list.length === 0) {
        box.innerHTML = '<p class="gc-search-empty">No tienes favoritos guardados.</p>';
        return;
      }
      
      list.forEach(prod => {
        const urlDestino = prod.url === '#' ? 'plp-glitch-code.html' : prod.url;
        const item = document.createElement('div');
        item.className = 'gc-search-item';
        item.innerHTML = `
          <a href="${urlDestino}" style="display:flex; align-items:center; gap:15px; text-decoration:none; flex-grow:1;">
            <img src="${prod.img}" alt="${prod.nombre}">
            <div><h4>${prod.nombre}</h4><p>${prod.precio}</p></div>
          </a>
          <button class="gc-wish-btn active" data-id="${prod.id}" onclick="event.preventDefault(); Wishlist.toggle('${prod.id}')">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        `;
        box.appendChild(item);
      });
    }
  };

  /* ---------------- PANELES LATERALES ---------------- */
  const searchBtn = document.getElementById('gc-search-btn');
  const searchPanel = document.getElementById('gc-search-panel');
  const searchClose = document.getElementById('gc-search-close');
  const searchInput = document.getElementById('gc-search-live-input');
  const searchResults = document.getElementById('gc-search-results');
  const searchOverlay = document.getElementById('gc-search-overlay');

  const wishIconHeader = document.getElementById('gc-wish-icon');
  const wishPanel = document.getElementById('gc-wish-panel');
  const wishClose = document.getElementById('gc-wish-close');

  const closePanels = () => {
    if(searchPanel) searchPanel.classList.remove('active');
    if(wishPanel) wishPanel.classList.remove('active');
    if(searchOverlay) searchOverlay.classList.remove('active');
  };

  // Click en documento para cerrar paneles (click afuera)
  document.addEventListener('click', (e) => {
    const isClickOnPanel = searchPanel && searchPanel.contains(e.target);
    const isClickOnWishPanel = wishPanel && wishPanel.contains(e.target);
    const isClickOnOverlay = searchOverlay && searchOverlay.contains(e.target);
    const isClickOnBtn = searchBtn && searchBtn.contains(e.target);
    const isClickOnWishBtn = wishIconHeader && wishIconHeader.contains(e.target);
    
    // Si hace click en el overlay o fuera de los paneles, cerrar
    if(isClickOnOverlay || (!isClickOnPanel && !isClickOnWishPanel && !isClickOnBtn && !isClickOnWishBtn)) {
      // Verificar si algún panel está abierto
      if(searchPanel && searchPanel.classList.contains('active')) {
        closePanels();
      } else if(wishPanel && wishPanel.classList.contains('active')) {
        closePanels();
      }
    }
  });
  
  // Botones de cierre
  if(searchClose) searchClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanels();
  });
  if(wishClose) wishClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanels();
  });
  
  // Tecla Escape para cerrar
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      closePanels();
    }
  });

  // Abrir Búsqueda
  if(searchBtn) searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closePanels();
    searchPanel.classList.add('active');
    searchOverlay.classList.add('active');
    searchInput.value = '';
    renderSearch(dbProductos);
    searchInput.focus();
  });

  // Abrir Favoritos (sobreescribimos el enlace original del perfil)
  if(wishIconHeader) wishIconHeader.addEventListener('click', (e) => {
    e.preventDefault();
    closePanels();
    wishPanel.classList.add('active');
    searchOverlay.classList.add('active');
  });

  /* ---------------- BUSCADOR ---------------- */
  const renderSearch = (productos) => {
    searchResults.innerHTML = '';
    if(productos.length === 0) {
      searchResults.innerHTML = '<p class="gc-search-empty">No hemos encontrado ningún suplemento.</p>';
      return;
    }
    productos.forEach(prod => {
      // AQUÍ REDIRIGIMOS A LA TIENDA SI EL LINK ES '#'
      const urlDestino = prod.url === '#' ? 'plp-glitch-code.html' : prod.url;
      const isFav = Wishlist.get().some(p => p.id === prod.id) ? 'active' : '';

      const item = document.createElement('div');
      item.className = 'gc-search-item';
      item.innerHTML = `
        <a href="${urlDestino}" style="display:flex; align-items:center; gap:15px; text-decoration:none; flex-grow:1;">
          <img src="${prod.img}" alt="${prod.nombre}">
          <div><h4>${prod.nombre}</h4><p>${prod.precio}</p></div>
        </a>
        <button class="gc-wish-btn ${isFav}" data-id="${prod.id}" onclick="event.preventDefault(); Wishlist.toggle('${prod.id}')">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      `;
      searchResults.appendChild(item);
    });
  };

  if(searchInput) {
    searchInput.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase().trim();
      renderSearch(dbProductos.filter(p => p.nombre.toLowerCase().includes(termino)));
    });
  }

  /* ---------------- ACTIVAR BOTONES DE FAVORITOS EN LA TIENDA (PLP) ---------------- */
  document.querySelectorAll('.card-wish').forEach(btn => {
    // Quita el onclick inline que trae tu HTML y usa este listener limpio
    btn.removeAttribute('onclick'); 
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = e.target.closest('.card');
      if(card) {
        const nombre = card.getAttribute('data-name');
        const prod = dbProductos.find(p => p.nombre === nombre);
        if(prod) Wishlist.toggle(prod.id);
      }
    });
  });

  // Inicializar Interfaz al cargar la página
  Wishlist.updateUI();
});
