/**
 * ARMANDO'S PESCADOS Y MARISCOS
 * main.js — Lógica principal del sitio
 * Funcionalidades: navegación, animaciones, menú tabs, galería, formulario
 */

'use strict';

/* ────────────────────────────────────────────────────────────
   UTILITIES
   ──────────────────────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

function showToast(msg, type = 'success', duration = 4000) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `show ${type}`;
  setTimeout(() => toast.className = '', duration);
}

/* ────────────────────────────────────────────────────────────
   HERO — Ken Burns on background image
   ──────────────────────────────────────────────────────────── */
function initHero() {
  const bg = $('.hero-bg');
  if (!bg) return;
  // Trigger Ken Burns after paint
  requestAnimationFrame(() => {
    setTimeout(() => bg.classList.add('loaded'), 100);
  });
}

/* ────────────────────────────────────────────────────────────
   NAVBAR — Scroll effect + Mobile toggle
   ──────────────────────────────────────────────────────────── */
function initNavbar() {
  const nav      = $('#navbar');
  const toggle   = $('#nav-toggle');
  const menu     = $('#mobile-menu');
  if (!nav) return;

  // Scroll detection
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 80);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init

  // Mobile menu toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    $$('.mobile-link', menu).forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll for nav links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
   ──────────────────────────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal').forEach(el => obs.observe(el));
}

/* ────────────────────────────────────────────────────────────
   COUNTER ANIMATION (Stats bar)
   ──────────────────────────────────────────────────────────── */
function initCounters() {
  const statsEl = $('#stats');
  if (!statsEl) return;

  function animCount(el, target, decimals = 0, suffix = '') {
    const dur = 2000;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * ease).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animCount($('#c-anios'),   25, 0, '+');
        animCount($('#c-platos'), 500, 0, '+');
        animCount($('#c-clientes'), 4.9, 1, '★');
        animCount($('#c-mesas'),    45, 0, '');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  obs.observe(statsEl);
}

/* ────────────────────────────────────────────────────────────
   MENÚ TABS
   ──────────────────────────────────────────────────────────── */
function initMenuTabs() {
  const tabs   = $$('.menu-tab');
  const panels = $$('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = $(`#panel-${target}`);
      if (panel) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
   GALERÍA LIGHTBOX
   ──────────────────────────────────────────────────────────── */
function initGallery() {
  const lightbox = $('#lightbox');
  const lbImg    = $('#lb-img');
  if (!lightbox || !lbImg) return;

  $$('.g-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = $('img', card);
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      $('#lb-close').focus();
    });
    // Keyboard
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  function closeLb() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  $('#lb-close').addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb();
  });
}

/* ────────────────────────────────────────────────────────────
   RESERVACIONES FORM
   ──────────────────────────────────────────────────────────── */
function initForm() {
  const form = $('#reserva-form');
  if (!form) return;

  function showError(inputId, msg) {
    const el = $(`#err-${inputId}`);
    if (el) { el.textContent = msg; el.classList.add('show'); }
    const inp = $(`#${inputId}`);
    if (inp) inp.style.borderColor = '#c0392b';
  }
  function clearError(inputId) {
    const el = $(`#err-${inputId}`);
    if (el) { el.textContent = ''; el.classList.remove('show'); }
    const inp = $(`#${inputId}`);
    if (inp) inp.style.borderColor = '';
  }

  // Limpiar errores al escribir
  $$('.form-input, .form-select', form).forEach(inp => {
    inp.addEventListener('input', () => {
      clearError(inp.id);
      if (inp.id === 'r-hora' || inp.id === 'r-fecha') {
        const horaInp = $('#r-hora');
        if(horaInp) horaInp.style.borderColor = '';
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // Validaciones
    const name    = $('#r-nombre');
    const email   = $('#r-email');
    const phone   = $('#r-telefono');
    const date    = $('#r-fecha');
    const persons = $('#r-personas');
    const horaInput = $('#r-hora');

    if (!name?.value.trim()) { showError('r-nombre', 'Por favor ingresa tu nombre.'); valid = false; }
    if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError('r-email', 'Ingresa un email válido.'); valid = false;
    }
    if (!phone?.value.trim() || phone.value.replace(/\D/g,'').length < 10) {
      showError('r-telefono', 'Ingresa un teléfono válido (10 dígitos).'); valid = false;
    }
    if (!date?.value) { showError('r-fecha', 'Selecciona una fecha.'); valid = false; }
    if (!persons?.value || parseInt(persons.value) < 1) {
      showError('r-personas', 'Indica el número de personas.'); valid = false;
    }

    const horaValor = horaInput.value || "12:00";

    // --- VALIDACIÓN: Evitar horas en el pasado ---
    if (date?.value) {
      const fechaSeleccionada = new Date(`${date.value}T${horaValor}:00`);
      const fechaActual = new Date();

      if (fechaSeleccionada < fechaActual) {
        if (horaInput) horaInput.style.borderColor = '#c0392b';
        showToast('No puedes elegir una hora que ya pasó.', 'error');
        valid = false;
      }
    }

    if (!valid) return;

    // Parseamos la fecha y hora para Java
    const fechaHoraStr = `${date.value}T${horaValor}:00`;

    // Extraer el número base de personas correctamente (ej. de "7-10" tomará el 10)
    let numPersonas = parseInt(persons.value.split('-').pop());
    if(isNaN(numPersonas)) numPersonas = 10;

    const reservaData = {
      nombre: name.value,
      email: email.value,
      telefono: phone.value,
      personas: numPersonas,
      fechaHora: fechaHoraStr
    };

    const submitBtn = $('.form-submit', form);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Verificando disponibilidad...</span>';

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservaData)
      });

      const responseText = await response.text();

      if (response.ok) {
        submitBtn.innerHTML = '✓ Reservación confirmada';
        submitBtn.classList.add('success');
        showToast('¡Reservación confirmada exitosamente! Revisaremos tu correo.', 'success');
        form.reset();
      } else {
        showToast(responseText, 'error', 6000);
        submitBtn.innerHTML = 'Intentar otra hora →';
      }
    } catch (error) {
      showToast('Error de conexión con el servidor.', 'error');
      submitBtn.innerHTML = 'Confirmar Reservación →';
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('success');
        if(submitBtn.innerHTML.includes('Reservación confirmada')) {
          submitBtn.innerHTML = 'Confirmar Reservación →';
        }
      }, 5000);
    }
  });
}

/* ────────────────────────────────────────────────────────────
   LAZY LOAD DE IMÁGENES
   ──────────────────────────────────────────────────────────── */
function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  $$('img[data-src]').forEach(img => obs.observe(img));
}

/* ────────────────────────────────────────────────────────────
   ACTIVE NAV LINK (scroll spy)
   ──────────────────────────────────────────────────────────── */
function initScrollSpy() {
  const sections = $$('section[id]');
  const links    = $$('.nav-links a');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

/* ────────────────────────────────────────────────────────────
   STICKY HEADER HIDE ON SCROLL DOWN
   ──────────────────────────────────────────────────────────── */
function initHeaderHide() {
  const nav = $('#navbar');
  if (!nav) return;
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 100) {
          if (y > lastY + 5) {
            nav.style.transform = 'translateY(-100%)';
          } else if (y < lastY - 5) {
            nav.style.transform = 'translateY(0)';
          }
        } else {
          nav.style.transform = 'translateY(0)';
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ────────────────────────────────────────────────────────────
   FECHA MÍNIMA (hoy) en formulario
   ──────────────────────────────────────────────────────────── */
function initMinDate() {
  const dateInput = $('#r-fecha');
  if (!dateInput) return;
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  // Se quitó el "+ 1" para que permita seleccionar el día de hoy
  const dd    = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/* ────────────────────────────────────────────────────────────
   INIT ALL
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initNavbar();
  initReveal();
  initCounters();
  initMenuTabs();
  initGallery();
  initForm();
  initLazyLoad();
  initScrollSpy();
  initHeaderHide();
  initMinDate();
});
