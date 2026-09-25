document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks)
    .map(link => {
      const href = link.getAttribute('href') || '';
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return null;
      return document.querySelector(href.slice(hashIndex));
    })
    .filter(Boolean);

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);

    if (sections.length) {
      let currentId = sections[0].id;
      sections.forEach(section => {
        if (window.scrollY + 120 >= section.offsetTop) currentId = section.id;
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.endsWith(`#${currentId}`)) link.classList.add('in-section');
      });
    }

    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal animation ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Broken image fallback ---------- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      img.classList.add('img-fallback');
      img.textContent = img.dataset.fallbackIcon || '🏟️';
      img.alt = img.alt || 'Image unavailable';
      img.removeAttribute('src');
    }, { once: true });
  });

  /* ---------- Animated achievement counters ---------- */
  const counters = document.querySelectorAll('.achieve strong[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterIO.observe(el));
  }

  /* ---------- Contact form (demo only) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.getElementById('contactFormNote');
      note.textContent = "Thanks — we'll be in touch within one business day.";
      contactForm.reset();
    });
  }

  /* ---------- Newsletter form (demo only) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const button = newsletterForm.querySelector('button');
      if (input.value) {
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        input.value = '';
        setTimeout(() => (button.innerHTML = '<i class="fa-solid fa-paper-plane"></i>'), 2000);
      }
    });
  }

  /* ---------- Password show/hide toggle (login + signup) ---------- */
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const showing = target.type === 'text';
      target.type = showing ? 'password' : 'text';
      btn.innerHTML = showing
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  });

  /* ---------- Shared form-validation helpers ---------- */
  function setFieldError(input, message) {
    const field = input.closest('.field');
    if (!field) return;
    const errorEl = field.querySelector('.field-error');
    field.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
    if (message) {
      field.classList.remove('shake');
      requestAnimationFrame(() => field.classList.add('shake'));
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* ---------- Login form ---------- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email;
      const password = loginForm.password;
      const note = document.getElementById('loginNote');
      let ok = true;

      if (!email.value.trim()) {
        setFieldError(email, 'Enter your email address.'); ok = false;
      } else if (!isValidEmail(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.'); ok = false;
      } else {
        setFieldError(email, '');
      }

      if (!password.value || password.value.length < 6) {
        setFieldError(password, 'Password must be at least 6 characters.'); ok = false;
      } else {
        setFieldError(password, '');
      }

      if (!ok) {
        note.style.color = '#d64545';
        note.textContent = 'Please fix the highlighted fields.';
        return;
      }

      note.style.color = 'var(--forest)';
      note.textContent = "You're logged in! Redirecting to your dashboard…";
      loginForm.querySelector('button[type="submit"]').disabled = true;
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  /* ---------- Signup form ---------- */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const passwordInput = document.getElementById('signupPassword');
    const meterBar = document.querySelector('#pwMeter span');

    if (passwordInput && meterBar) {
      passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        const pct = [0, 25, 50, 75, 100][score];
        const colors = ['#d64545', '#d64545', '#e0a83c', '#8fd431', 'var(--lime-dark)'];
        meterBar.style.width = pct + '%';
        meterBar.style.background = colors[score];
      });
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = signupForm.firstName;
      const lastName = signupForm.lastName;
      const email = signupForm.email;
      const password = signupForm.password;
      const confirmPassword = signupForm.confirmPassword;
      const terms = signupForm.terms;
      const note = document.getElementById('signupNote');
      let ok = true;

      if (!firstName.value.trim()) { setFieldError(firstName, 'Enter your first name.'); ok = false; }
      else setFieldError(firstName, '');

      if (!lastName.value.trim()) { setFieldError(lastName, 'Enter your last name.'); ok = false; }
      else setFieldError(lastName, '');

      if (!email.value.trim()) { setFieldError(email, 'Enter your email address.'); ok = false; }
      else if (!isValidEmail(email.value.trim())) { setFieldError(email, 'Enter a valid email address.'); ok = false; }
      else setFieldError(email, '');

      if (!password.value || password.value.length < 8) {
        setFieldError(password, 'Password must be at least 8 characters.'); ok = false;
      } else {
        setFieldError(password, '');
      }

      if (confirmPassword.value !== password.value || !confirmPassword.value) {
        setFieldError(confirmPassword, 'Passwords do not match.'); ok = false;
      } else {
        setFieldError(confirmPassword, '');
      }

      if (!terms.checked) {
        note.style.color = '#d64545';
        note.textContent = 'Please accept the Terms and Privacy Policy to continue.';
        ok = false;
      }

      if (!ok) {
        if (terms.checked) {
          note.style.color = '#d64545';
          note.textContent = 'Please fix the highlighted fields.';
        }
        return;
      }

      note.style.color = 'var(--forest)';
      note.textContent = 'Account created! Redirecting you to log in…';
      signupForm.querySelector('button[type="submit"]').disabled = true;
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    });
  }

  onScroll();
});