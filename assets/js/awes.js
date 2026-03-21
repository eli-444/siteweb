/*!
 * Aurora Web & Sec - JS global (awes.js)
 * Idempotent, sans dependances, compatible <script defer>
 * Expose window.AWES avec quelques helpers.
 */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.prototype.slice.call(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts || false);
  const raf = (fn) => requestAnimationFrame(fn);
  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const isIO = 'IntersectionObserver' in window;

  const LANG_KEY = 'awes-language';
  const DEFAULT_LANG = 'fr';
  const SUPPORTED_LANGS = ['fr', 'en'];
  const MAIL_TO = 'aurorawebsec@gmail.com';

  const EN_TRANSLATIONS = {
    'common.skipLink': 'Skip to content',
    'common.nav.primary': 'Primary navigation',
    'common.nav.services': 'Services',
    'common.nav.about': 'About',
    'common.nav.contact': 'Contact',
    'common.nav.openMenu': 'Open menu',
    'common.nav.closeMenu': 'Close menu',
    'common.nav.languageSwitcher': 'Change language',
    'common.footer.nav': 'Footer links',
    'common.footer.legal': 'Legal notice',
    'common.footer.privacy': 'Privacy',
    'common.footer.cgv': 'Terms',
    'common.footer.rights': 'Aurora Web & Sec - All rights reserved',
    'common.footer.brandOnly': 'Aurora Web & Sec',
    'common.cookies.message': 'We use cookies to measure traffic and improve your experience. You can accept or refuse them.',
    'common.cookies.decline': 'Decline',
    'common.cookies.accept': 'Accept',
    'common.cookies.notice': 'You can change your choice later in the <a href="./pages/confidentialite.html">privacy policy</a>.',
    'home.meta.title': 'Aurora Web & Sec | Web and security agency - websites & apps',
    'home.meta.description': 'Aurora Web & Sec: high-performance brochure websites, custom web apps, technical SEO and application security. Fast quote.',
    'home.hero.titleSuffix': '<span class="gradient-copy">Web design</span><span class="gradient-tail">agency</span>',
    'home.hero.lead': 'Fast <strong>brochure websites</strong> (SEO-friendly), custom <strong>web applications</strong>, <strong>technical SEO</strong> and <strong>application security</strong>. We align design, performance and growth.',
    'home.hero.primaryCta': 'Tell us about your project',
    'home.hero.secondaryCta': 'Explore our services',
    'home.services.heading': 'Website creation<br>&amp; web applications',
    'home.services.lead': 'From optimized <em>brochure websites</em> to scalable <em>web apps</em>, our deliverables follow SEO best practices and Core Web Vitals.',
    'home.services.card1.title': 'Who do we work with?',
    'home.services.card1.lead': 'We love supporting:',
    'home.services.card1.item1': 'Local service businesses',
    'home.services.card1.item2': 'SaaS startups',
    'home.services.card1.item3': 'AI startups',
    'home.services.card2.title': 'What do we do?',
    'home.services.card2.item1': 'Web design',
    'home.services.card2.item2': 'Web development',
    'home.services.card2.item3': 'Search engine optimization (SEO)',
    'home.services.card2.item4': 'GEO (AI SEO)',
    'home.services.card3.title': 'Why us?',
    'home.services.card3.item1': 'Clear and transparent',
    'home.services.card3.item2': 'Fast and responsive',
    'home.services.card3.item3': 'Results-focused',
    'home.trust.heading': 'They trusted us',
    'home.contact.heading': 'Have a project? Let’s talk!',
    'home.contact.lead': 'Tell us what you need and we will do our best to reply within the next 24 hours.',
    'home.contact.phone': 'Or call us at <a href="tel:+33645227470" aria-label="Call 06 45 22 74 70">06 45 22 74 70</a>.',
    'home.contact.bookingTitle': 'Book a meeting',
    'home.contact.bookingHeading': 'Booking calendar',
    'home.contact.bookingCta': 'Book a meeting directly',
    'home.contact.bookingChip': 'Google Calendar + Meet',
    'home.contact.bookingNote': 'Choose an available slot directly for a Google Meet call.',
    'home.contact.bookingPlaceholder': 'Add the public URL of your Google Calendar booking page here to display the calendar directly on the website.',
    'home.contact.form.nameLabel': 'Name',
    'home.contact.form.namePlaceholder': 'Your name',
    'home.contact.form.emailLabel': 'Email',
    'home.contact.form.emailPlaceholder': 'you@example.com',
    'home.contact.form.messageLabel': 'Message',
    'home.contact.form.messagePlaceholder': 'Briefly describe your project',
    'home.contact.form.consent': 'I agree to the <a href="./pages/confidentialite.html" target="_blank" rel="noopener">privacy policy</a>.',
    'home.contact.form.submit': 'Send',
    'services.meta.title': 'Services | Aurora Web & Sec',
    'services.meta.description': 'Our services: SEO brochure websites, custom web applications, SEO and security audits, maintenance and hosting.',
    'services.hero.heading': 'Our services',
    'services.hero.lead': 'Solid foundations from SEO, accessibility and security all the way to production deployment.',
    'services.card1.title': 'SEO brochure websites',
    'services.card1.body': 'Semantic architecture, markup, performance (CWV), responsive layouts and Search Console monitoring.',
    'services.card2.title': 'Web applications',
    'services.card2.body': 'Dashboards, internal tools, APIs, CI/CD, monitoring and logs.',
    'services.card3.title': 'Audits & security',
    'services.card3.body': 'Technical SEO audits, security headers, CSP and backups.',
    'about.meta.title': 'About | Aurora Web & Sec',
    'about.meta.description': 'Aurora Web & Sec: web and security agency. Our mission is to combine design, performance, SEO and security for websites and apps that convert.',
    'about.hero.heading': 'About',
    'about.hero.lead': 'An impact-driven team building fast, accessible and secure digital experiences.',
    'about.card1.title': 'Our vision',
    'about.card1.body': 'Deliver scalable, maintainable products that are genuinely useful for your business.',
    'about.card2.title': 'Method',
    'about.card2.body': 'Discovery, prototyping, fast iterations, QA, deployment, measurement and continuous improvement.',
    'about.card3.title': 'Quality',
    'about.card3.body': 'Accessibility, technical SEO, application security and performance by default.',
    'notFound.meta.title': 'Page not found - 404 | Aurora Web & Sec',
    'notFound.hero.lead': 'Oops, this page does not exist anymore.',
    'notFound.hero.primaryCta': 'Back to home',
    'notFound.hero.secondaryCta': 'View services'
  };

  const UI_MESSAGES = {
    fr: {
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      formValidation: 'Veuillez remplir tous les champs et accepter la politique de confidentialité.',
      mailClientOpening: 'Ouverture de votre client mail...',
      contactSubject: 'Contact',
      bodyName: 'Nom',
      bodyEmail: 'Email'
    },
    en: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      formValidation: 'Please complete every field and accept the privacy policy.',
      mailClientOpening: 'Opening your email app...',
      contactSubject: 'Contact',
      bodyName: 'Name',
      bodyEmail: 'Email'
    }
  };

  const state = {
    lang: DEFAULT_LANG,
    defaults: {},
    defaultsCaptured: false
  };

  function setYear() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

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

  function getCurrentLang() {
    return state.lang;
  }

  function getUiMessage(key) {
    return (UI_MESSAGES[getCurrentLang()] && UI_MESSAGES[getCurrentLang()][key]) || UI_MESSAGES.fr[key] || '';
  }

  function captureDefaultTranslations() {
    if (state.defaultsCaptured) return;

    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && !(key in state.defaults)) {
        state.defaults[key] = el.textContent;
      }
    });

    $$('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key && !(key in state.defaults)) {
        state.defaults[key] = el.innerHTML;
      }
    });

    $$('*').forEach((el) => {
      Array.prototype.forEach.call(el.attributes, (attr) => {
        if (!attr.name.startsWith('data-i18n-')) return;
        if (attr.name === 'data-i18n' || attr.name === 'data-i18n-html') return;
        const targetAttr = attr.name.replace('data-i18n-', '');
        const key = attr.value;
        if (!key || key in state.defaults) return;
        state.defaults[key] = el.getAttribute(targetAttr) || '';
      });
    });

    state.defaultsCaptured = true;
  }

  function getTranslationValue(key) {
    if (getCurrentLang() === 'en' && Object.prototype.hasOwnProperty.call(EN_TRANSLATIONS, key)) {
      return EN_TRANSLATIONS[key];
    }
    return Object.prototype.hasOwnProperty.call(state.defaults, key) ? state.defaults[key] : '';
  }

  function applyTranslations() {
    captureDefaultTranslations();

    document.documentElement.lang = getCurrentLang();

    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = getTranslationValue(key);
      if (value) el.textContent = value;
    });

    $$('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const value = getTranslationValue(key);
      if (value) el.innerHTML = value;
    });

    $$('*').forEach((el) => {
      Array.prototype.forEach.call(el.attributes, (attr) => {
        if (!attr.name.startsWith('data-i18n-')) return;
        if (attr.name === 'data-i18n' || attr.name === 'data-i18n-html') return;
        const targetAttr = attr.name.replace('data-i18n-', '');
        const value = getTranslationValue(attr.value);
        if (value) {
          el.setAttribute(targetAttr, value);
        }
      });
    });
  }

  function syncLanguageButtons() {
    $$('[data-lang-switch]').forEach((btn) => {
      const isActive = btn.getAttribute('data-lang-switch') === getCurrentLang();
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function setLanguage(lang) {
    const nextLang = SUPPORTED_LANGS.indexOf(lang) >= 0 ? lang : DEFAULT_LANG;
    state.lang = nextLang;
    localStorage.setItem(LANG_KEY, nextLang);
    applyTranslations();
    syncLanguageButtons();
    initBookingEmbed();
    syncBookingUiForLanguage();
  }

  function initLanguageSwitcher() {
    captureDefaultTranslations();

    const stored = localStorage.getItem(LANG_KEY);
    state.lang = SUPPORTED_LANGS.indexOf(stored) >= 0 ? stored : DEFAULT_LANG;
    applyTranslations();
    syncLanguageButtons();

    $$('[data-lang-switch]').forEach((btn) => {
      on(btn, 'click', () => {
        setLanguage(btn.getAttribute('data-lang-switch'));
        if (window.AWES && typeof window.AWES.closeMenu === 'function') {
          window.AWES.closeMenu();
        }
      });
    });
  }

  function initMobileNav() {
    const navInner = $('.nav-inner');
    const menu = $('.menu');
    const toggle = $('.nav-toggle');
    if (!navInner || !menu || !toggle) return;

    const closeMenu = () => {
      navInner.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', getUiMessage('openMenu'));
    };

    const openMenu = () => {
      navInner.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', getUiMessage('closeMenu'));
    };

    const syncMenuState = () => {
      if (window.innerWidth > 760) {
        closeMenu();
      } else if (!navInner.classList.contains('menu-open')) {
        toggle.setAttribute('aria-label', getUiMessage('openMenu'));
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

    $$('.menu a, .menu .lang-btn', navInner).forEach((link) => on(link, 'click', closeMenu));

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

    window.AWES = window.AWES || {};
    window.AWES.closeMenu = closeMenu;
  }

  function initReveal() {
    const nodes = $$('.reveal');
    if (!nodes.length) return;
    if (!isIO) {
      nodes.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((el) => io.observe(el));
  }

  function initParallaxBlobs() {
    const blobs = $$('.blob');
    if (!blobs.length) return;
    on(window, 'scroll', () => {
      const y = window.scrollY * 0.04;
      blobs.forEach((blob, index) => {
        blob.style.transform = `translateY(${index % 2 ? -y : y}px)`;
      });
    }, { passive: true });
  }

  function initConsent() {
    const banner = $('#cookie-banner');
    if (!banner) return;

    const LS_KEY = 'awes-consent';
    const stored = localStorage.getItem(LS_KEY);

    function loadTag(el) {
      if (!el || el.type !== 'text/plain') return;
      const src = el.dataset.src;
      if (src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
      } else {
        const script = document.createElement('script');
        script.text = el.textContent;
        document.head.appendChild(script);
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

  function initBookingEmbed() {
    const bookingUrl = (document.documentElement.getAttribute('data-booking-url') || '').trim();
    const hasEmbedUrl = /^https?:\/\//i.test(bookingUrl);
    const frame = $('[data-booking-embed]');
    const placeholder = $('[data-booking-placeholder]');

    if (frame) {
      if (hasEmbedUrl) {
        frame.src = bookingUrl;
        frame.hidden = false;
      } else {
        frame.removeAttribute('src');
        frame.hidden = true;
      }
    }

    if (placeholder) {
      placeholder.hidden = hasEmbedUrl;
    }
  }

  function initBookingToggle() {
    const toggle = $('[data-booking-toggle]');
    const stage = $('#booking-stage-panel');
    if (!toggle || !stage) return;

    on(toggle, 'click', () => {
      const willOpen = stage.hidden;
      stage.hidden = !willOpen ? true : false;
      toggle.setAttribute('aria-expanded', String(willOpen));
    });
  }

  function syncBookingUiForLanguage() {
    const toggle = $('[data-booking-toggle]');
    const stage = $('#booking-stage-panel');
    if (!toggle || !stage) return;

    if (stage.hidden) {
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const msg = $('#formMsg');

    on(form, 'submit', (e) => {
      e.preventDefault();

      const name = ($('#name') && $('#name').value || '').trim();
      const email = ($('#email') && $('#email').value || '').trim();
      const message = ($('#message') && $('#message').value || '').trim();
      const okRgpd = $('#consent') && $('#consent').checked;

      if (!name || !email || !message || !okRgpd) {
        if (msg) msg.textContent = getUiMessage('formValidation');
        return;
      }

      const subject = encodeURIComponent(`${getUiMessage('contactSubject')} - ${name}`);
      const body = encodeURIComponent([
        `${getUiMessage('bodyName')}: ${name}`,
        `${getUiMessage('bodyEmail')}: ${email}`,
        '',
        message
      ].join('\r\n'));

      window.location.href = `mailto:${MAIL_TO}?subject=${subject}&body=${body}`;

      if (msg) msg.textContent = getUiMessage('mailClientOpening');
    });
  }

  function init() {
    setYear();
    initProgressBar();
    initDropdown();
    initLanguageSwitcher();
    initMobileNav();
    initReveal();
    initParallaxBlobs();
    initConsent();
    initBookingEmbed();
    initBookingToggle();
    initContactForm();
    syncBookingUiForLanguage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AWES = window.AWES || {};
  window.AWES.init = init;
  window.AWES.setYear = setYear;
  window.AWES.setLanguage = setLanguage;
})();
