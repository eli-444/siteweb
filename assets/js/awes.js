(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initLoader() {
    if (reduceMotion || !document.body.classList.contains('home')) return;
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = '<div class="loader-word">AWS</div>';
    document.body.prepend(loader);
    setTimeout(() => loader.classList.add('done'), 1150);
    setTimeout(() => loader.remove(), 2100);
  }

  function initReveal() {
    const items = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) return items.forEach(el => el.classList.add('visible'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    items.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`; observer.observe(el); });
  }

  function initScroll() {
    const bar = $('#progress');
    const nav = $('.nav');
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      nav?.classList.toggle('scrolled', scrollY > 30);
    };
    addEventListener('scroll', update, { passive: true }); update();
  }

  function initMenu() {
    const button = $('.menu-toggle'), menu = $('.menu');
    if (!button || !menu) return;
    button.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open'); document.body.classList.remove('menu-open'); button.setAttribute('aria-expanded', 'false');
    }));
  }

  function initForm() {
    const form = $('#contactForm'), msg = $('#formMsg');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = ($('#name')?.value || '').trim();
      const email = ($('#email')?.value || '').trim();
      const message = ($('#message')?.value || '').trim();
      if (!name || !email || !message || !$('#consent')?.checked) {
        if (msg) msg.textContent = 'Merci de compléter tous les champs et d’accepter la politique de confidentialité.';
        return;
      }
      const subject = encodeURIComponent(`Nouveau projet — ${name}`);
      const body = encodeURIComponent(`Nom : ${name}\r\nE-mail : ${email}\r\n\r\n${message}`);
      if (msg) msg.textContent = 'Ouverture de votre messagerie…';
      location.href = `mailto:aurorawebsec@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  initLoader(); initReveal(); initScroll(); initMenu(); initForm();
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
})();
