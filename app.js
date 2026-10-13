'use strict';
(() => {
  const root = document.documentElement;
  const menu = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#nav-links');
  const themeBtn = document.querySelector('#theme-toggle');
  const backtop = document.querySelector('#backtop');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const productData = {
    chatgpt: {
      kicker: 'ASISTENTE DE INTELIGENCIA ARTIFICIAL',
      title: 'Un espacio para pensar en grande.',
      description: 'ChatGPT ayuda a explorar ideas, redactar, aprender y trabajar con información a través de una conversación natural.',
      link: 'https://chatgpt.com/', cta: 'Conocer ChatGPT',
      label: 'Un espacio para tus ideas',
      question: '¿Cómo podemos hacer que una idea compleja sea fácil de comprender?'
    },
    api: {
      kicker: 'PLATAFORMA PARA DESARROLLADORES',
      title: 'La IA integrada en tus proyectos.',
      description: 'La plataforma API permite a los equipos crear experiencias propias y añadir capacidades de IA a sus aplicaciones.',
      link: 'https://platform.openai.com/docs/', cta: 'Explorar la documentación',
      label: 'Diseñar con inteligencia',
      question: 'Diseña un flujo inteligente que clasifique y resuma solicitudes.'
    },
    codex: {
      kicker: 'HERRAMIENTAS PARA PROGRAMAR',
      title: 'De la idea al código, más cerca.',
      description: 'Codex ofrece asistencia para tareas de desarrollo como comprender, escribir y mejorar código dentro de flujos de programación.',
      link: 'https://openai.com/codex/', cta: 'Descubrir Codex',
      label: 'Construyendo la siguiente versión',
      question: 'Ayúdame a revisar este módulo y proponer una implementación clara.'
    }
  };

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
  }
  menu?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) setMenu(false); });

  const remembered = (() => { try { return localStorage.getItem('openai-concept-theme'); } catch (_) { return null; } })();
  if (remembered === 'dark') root.dataset.theme = 'dark';
  function syncTheme() { if (themeBtn) { themeBtn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark')); themeBtn.title = root.dataset.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'; } }
  syncTheme();
  themeBtn?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('openai-concept-theme', root.dataset.theme); } catch (_) {}
    syncTheme();
  });

  const tabs = [...document.querySelectorAll('[data-product]')];
  function activateProduct(key, shouldFocus = false) {
    const item = productData[key]; if (!item) return;
    tabs.forEach(tab => {
      const active = tab.dataset.product === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && shouldFocus) tab.focus();
    });
    const panel = document.querySelector('#product-panel');
    const active = tabs.find(x => x.dataset.product === key);
    panel?.setAttribute('aria-labelledby', active?.id || 'tab-chatgpt');
    for (const [selector, value] of Object.entries({
      '#detail-kicker': item.kicker, '#detail-title': item.title,
      '#detail-description': item.description, '#demo-label': item.label,
      '#demo-question': item.question
    })) { const node = document.querySelector(selector); if (node) node.textContent = value; }
    const detailLink = document.querySelector('#detail-link');
    if (detailLink) { detailLink.href = item.link; detailLink.innerHTML = `${item.cta} <svg class="ic" aria-hidden="true"><use href="#i-ne"/></svg>`; }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateProduct(tab.dataset.product));
    tab.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const target = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activateProduct(tabs[target].dataset.product, true);
    });
  });

  const intersectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); intersectionObserver.unobserve(entry.target); } });
  }, { threshold: .10, rootMargin: '0px 0px -28px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(el => { if (!intersectionObserver || reducedMotion) el.classList.add('visible'); else intersectionObserver.observe(el); });

  const updateScroll = () => { backtop?.classList.toggle('visible', window.scrollY > 700); document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 20); };
  document.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  backtop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' }));
})();
