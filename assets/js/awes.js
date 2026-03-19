/*!
 * Aurora Web & Sec — JS global (awes.js)
 * Idempotent, sans dépendances, compatible <script defer>
 * Expose window.AWES avec quelques helpers.
 */
(function () {
  'use strict';

  // ---------- Utils ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.prototype.slice.call(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts || false);
  const raf = (fn) => requestAnimationFrame(fn);
  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const isIO = 'IntersectionObserver' in window;

  // ---------- Year ----------
  function setYear() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // ---------- Scroll progress ----------
  function initProgressBar() {
    const bar = $('#progress');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const denom = Math.max(1, h.scrollHeight - h.clientHeight);
      const scrolled = clamp01(h.scrollTop / denom);
      bar.style.transform = `scaleX(${scrolled})`;
    };
    update();
    on(window, 'scroll', () => raf(update), { passive: true });
    on(window, 'resize', update);
  }

  // ---------- Dropdown menu ----------
  function initDropdown() {
    const dropdown = $('.dropdown');
    const btn = $('#menuBtn');
    if (!dropdown || !btn) return;
    on(btn, 'click', () => {
      const expanded = dropdown.getAttribute('aria-expanded') === 'true';
      dropdown.setAttribute('aria-expanded', String(!expanded));
      btn.setAttribute('aria-expanded', String(!expanded));
    });
    on(document, 'click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Mobile nav ----------
  function initMobileNav() {
    const navInner = $('.nav-inner');
    const menu = $('.menu');
    const toggle = $('.nav-toggle');
    if (!navInner || !menu || !toggle) return;

    const closeMenu = () => {
      navInner.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
    };

    const openMenu = () => {
      navInner.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fermer le menu');
    };

    const syncMenuState = () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    };

    on(toggle, 'click', () => {
      const isOpen = navInner.classList.contains('menu-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    $$('.menu a', navInner).forEach((link) => on(link, 'click', closeMenu));

    on(document, 'click', (e) => {
      if (window.innerWidth > 760) return;
      if (!navInner.contains(e.target)) {
        closeMenu();
      }
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });

    on(window, 'resize', syncMenuState);
    syncMenuState();
  }

  // ---------- Reveal on scroll ----------
  function initReveal() {
    const nodes = $$('.reveal');
    if (!nodes.length) return;
    if (!isIO) {
      nodes.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((el) => io.observe(el));
  }

  // ---------- Parallax blobs ----------
  function initParallaxBlobs() {
    const blobs = $$('.blob');
    if (!blobs.length) return;
    on(window, 'scroll', () => {
      const y = window.scrollY * 0.04;
      blobs.forEach((b, i) => { b.style.transform = `translateY(${(i % 2 ? -y : y)}px)`; });
    }, { passive: true });
  }

  // ---------- Cookie banner + Consent Mode v2 + GA4 ----------
  function initConsent() {
    const banner = $('#cookie-banner');
    if (!banner) return;

    const LS_KEY = 'awes-consent';
    const stored = localStorage.getItem(LS_KEY);

    function loadTag(el) {
      if (!el || el.type !== 'text/plain') return;
      const src = el.dataset.src;
      if (src) {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        document.head.appendChild(s);
      } else {
        const s = document.createElement('script');
        s.text = el.textContent;
        document.head.appendChild(s);
      }
    }

    function applyConsent(mode) {
      const allow = mode === 'granted';
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { analytics_storage: allow ? 'granted' : 'denied' });
      }
      if (allow) {
        $$('script[data-cookiecategory="analytics"]').forEach(loadTag);
      }
    }

    if (!stored) {
      banner.style.display = 'block';
    } else {
      applyConsent(stored);
    }

    const btnAccept = $('#btn-accept');
    const btnDecline = $('#btn-decline');

    on(btnAccept, 'click', () => {
      localStorage.setItem(LS_KEY, 'granted');
      banner.style.display = 'none';
      applyConsent('granted');
    });

    on(btnDecline, 'click', () => {
      localStorage.setItem(LS_KEY, 'denied');
      banner.style.display = 'none';
      applyConsent('denied');
    });

    window.AWES = window.AWES || {};
    window.AWES.openConsent = function () {
      banner.style.display = 'block';
    };
  }

  // ---------- Form (POST → /api/contact) ----------
 // ---------- Form (mailto) ----------
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const msg = document.getElementById('formMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = (document.getElementById('name')    ?.value || '').trim();
    const email   = (document.getElementById('email')   ?.value || '').trim();
    const message = (document.getElementById('message') ?.value || '').trim();
    const okRGPD  = document.getElementById('consent')?.checked;

    if (!name || !email || !message || !okRGPD) {
      if (msg) msg.textContent = 'Veuillez remplir tous les champs et accepter la politique de confidentialité.';
      return;
    }

    // Construire le mailto proprement (CRLF = %0D%0A)
    const to = 'contact@aurorawebandsecurity.com';
    const subject = encodeURIComponent(`Contact — ${name}`);
    const bodyLines = [
      `Nom: ${name}`,
      `Email: ${email}`,
      '',
      message
    ];
    const body = encodeURIComponent(bodyLines.join('\r\n'));

    // Ouvrir le client mail
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    // Optionnel : feedback visuel
    if (msg) msg.textContent = 'Ouverture de votre client mail…';
  });
}

  // ---------- Init global ----------
  function init() {
    setYear();
    initProgressBar();
    initDropdown();
    initMobileNav();
    initReveal();
    initParallaxBlobs();
    initConsent();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AWES = window.AWES || {};
  window.AWES.init = init;
  window.AWES.setYear = setYear;

})();
