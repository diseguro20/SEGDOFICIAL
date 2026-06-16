/* ========================================
   SEGD LANDING PAGE - SCRIPT.JS
   Animations, Interactions & Effects
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- NAVIGATION ----
  initNavigation();
  // ---- SCROLL REVEAL ----
  initScrollReveal();
  // ---- BACKGROUND CANVAS ----
  initBackgroundCanvas();
  // ---- VISUALIZER BARS ----
  initVisualizerBars();
  // ---- SMOKE PARTICLES ----
  initSmokeParticles();
  // ---- HERO SOUNDWAVE ----
  initHeroSoundwave();
  // ---- 3D CARD TILT ----
  initCardTilt();
  // ---- MOBILE MENU ----
  initMobileMenu();
  // ---- GLITCH TEXT ----
  initGlitchText();
});

/* ====== NAVIGATION ====== */
function initNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ====== SCROLL REVEAL ====== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ====== BACKGROUND CANVAS (Particles + Waves) ====== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];
  let waveOffset = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Create floating particles
  const PARTICLE_COUNT = 60;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 270 : 200, // purple or blue
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
      ctx.fill();
    });
  }

  function drawWaves() {
    const centerY = canvas.height * 0.5;
    const amplitude = 30;
    const frequency = 0.005;

    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${270 - wave * 30}, 70%, 50%, ${0.05 - wave * 0.015})`;
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x++) {
        const y = centerY +
          Math.sin(x * frequency + waveOffset + wave * 2) * amplitude * (1 + wave * 0.3) +
          Math.sin(x * frequency * 2.5 + waveOffset * 1.5) * amplitude * 0.3;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    waveOffset += 0.008;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawParticles();
    drawWaves();
    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Cleanup on page visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

/* ====== AUDIO VISUALIZER BARS ====== */
function initVisualizerBars() {
  const container = document.querySelector('.almas__visualizer');
  if (!container) return;

  const BAR_COUNT = 32;
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'almas__visualizer-bar';
    bar.style.animationDelay = `${Math.random() * 1.2}s`;
    bar.style.animationDuration = `${0.8 + Math.random() * 0.8}s`;
    container.appendChild(bar);
  }
}

/* ====== SMOKE PARTICLES ====== */
function initSmokeParticles() {
  const container = document.querySelector('.almas__particles');
  if (!container) return;

  const PARTICLE_COUNT = 20;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.className = 'smoke-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `${Math.random() * 20}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;

    // Vary colors
    const colors = ['#9b30ff', '#00c6ff', '#ff2d7b'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(particle);
  }
}

/* ====== HERO SOUNDWAVE (SVG Animated) ====== */
function initHeroSoundwave() {
  const container = document.querySelector('.hero__soundwave');
  if (!container) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100');
  svg.setAttribute('viewBox', '0 0 1440 100');
  svg.setAttribute('preserveAspectRatio', 'none');

  // Create gradient
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'waveGrad');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '0%');

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#9b30ff');
  stop1.setAttribute('stop-opacity', '0.3');

  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '50%');
  stop2.setAttribute('stop-color', '#00c6ff');
  stop2.setAttribute('stop-opacity', '0.5');

  const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop3.setAttribute('offset', '100%');
  stop3.setAttribute('stop-color', '#ff2d7b');
  stop3.setAttribute('stop-opacity', '0.3');

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  gradient.appendChild(stop3);
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Create wave lines
  for (let i = 0; i < 3; i++) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#waveGrad)');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('opacity', `${0.4 - i * 0.1}`);
    path.classList.add('hero-wave-path');
    path.dataset.waveIndex = i;
    svg.appendChild(path);
  }

  container.appendChild(svg);

  // Animate waves
  let t = 0;
  function animateWaves() {
    const paths = svg.querySelectorAll('.hero-wave-path');
    paths.forEach((path, idx) => {
      let d = 'M0 50';
      for (let x = 0; x <= 1440; x += 10) {
        const y = 50 +
          Math.sin(x * 0.008 + t + idx * 1.5) * 15 +
          Math.sin(x * 0.015 + t * 1.5 + idx) * 8 +
          Math.sin(x * 0.003 + t * 0.5) * 20;
        d += ` L${x} ${y}`;
      }
      path.setAttribute('d', d);
    });
    t += 0.02;
    requestAnimationFrame(animateWaves);
  }
  animateWaves();
}

/* ====== 3D CARD TILT ====== */
function initCardTilt() {
  const cards = document.querySelectorAll('.disc-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
    });
  });
}

/* ====== MOBILE MENU ====== */
function initMobileMenu() {
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-menu__link');

  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ====== GLITCH TEXT RANDOMIZER ====== */
function initGlitchText() {
  const glitchElements = document.querySelectorAll('.glitch-text');
  glitchElements.forEach(el => {
    el.setAttribute('data-text', el.textContent);
  });
}

/* ====== SMOOTH SCROLL FOR ANCHOR LINKS ====== */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});
