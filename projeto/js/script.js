/* =============================================
   ARDUINO CONTROL CENTER — script.js
   ============================================= */

'use strict';

// ── Intersection Observer: reveal on scroll ──
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();


// ── Mobile navigation ──
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-mobile');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();


// ── Active nav link on scroll ──
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const setActive = () => {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });

    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


// ── Meter bars animate on scroll ──
(function initMeters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const fills = e.target.querySelectorAll('.meter-fill[data-width]');
          fills.forEach((fill) => {
            // slight delay for stagger
            setTimeout(() => {
              fill.style.width = fill.dataset.width;
            }, 150);
          });
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.meter-group').forEach((g) => observer.observe(g));
})();


// ── Copy to clipboard ──
(function initCopyButtons() {
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.target;
      const panel   = panelId ? document.getElementById(panelId) : null;

      let text = '';

      if (panel) {
        // Gather text from all .line-code cells
        panel.querySelectorAll('.line-code').forEach((cell) => {
          text += cell.innerText + '\n';
        });
      } else {
        text = btn.dataset.copy || '';
      }

      if (!text.trim()) {
        showCopyFeedback(btn, 'Vazio');
        return;
      }

      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(btn, 'Copiado!');
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopyFeedback(btn, 'Copiado!');
      });
    });
  });

  function showCopyFeedback(btn, msg) {
    const origHTML = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>${msg}`;

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = origHTML;
    }, 2000);
  }
})();


// ── Smooth scroll for anchor links ──
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ── Navbar shadow on scroll ──
(function initNavbarShadow() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0, 0, 0, 0.4)'
      : '';
  }, { passive: true });
})();
