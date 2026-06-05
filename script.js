// Galaxy background
(function () {
  const canvas = document.getElementById('galaxy');
  const ctx    = canvas.getContext('2d');

  let W, H, stars = [], nebulas = [];

  const STAR_COUNT  = 260;
  const STAR_COLORS = ['#ffffff','#ffffff','#ffffff','#a8c8ff','#7ab3ff','#fffde8'];

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:           Math.random() * W,
      y:           Math.random() * H,
      r:           Math.random() * 1.3 + 0.2,
      baseOpacity: Math.random() * 0.55 + 0.15,
      phase:       Math.random() * Math.PI * 2,
      speed:       Math.random() * 0.006 + 0.002,
      color:       STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
    }));

    nebulas = [
      { x: 0.12, y: 0.18, r: 320, c: [32,  80, 220] },
      { x: 0.84, y: 0.48, r: 260, c: [80,  20, 180] },
      { x: 0.50, y: 0.82, r: 340, c: [20,  60, 200] },
      { x: 0.70, y: 0.10, r: 220, c: [50, 110, 240] },
      { x: 0.28, y: 0.68, r: 280, c: [60,  30, 160] },
    ];
  }

  init();
  window.addEventListener('resize', init);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, W, H);

    nebulas.forEach(n => {
      const x = n.x * W, y = n.y * H;
      const g = ctx.createRadialGradient(x, y, 0, x, y, n.r);
      g.addColorStop(0,   `rgba(${n.c[0]},${n.c[1]},${n.c[2]},0.18)`);
      g.addColorStop(0.4, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},0.08)`);
      g.addColorStop(1,   'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(x - n.r, y - n.r, n.r * 2, n.r * 2);
    });

    stars.forEach(s => {
      s.phase += s.speed;
      const opacity = s.baseOpacity * (0.4 + 0.6 * Math.sin(s.phase));
      ctx.globalAlpha = opacity;
      ctx.fillStyle   = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
})();

// Nav scroll effect
(function () {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });
})();

// Fade-in on scroll
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in, .project-card').forEach(el => obs.observe(el));
})();

// Project filter tabs
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match && !card.classList.contains('visible')) {
          card.classList.add('visible');
        }
      });
    });
  });
})();

// Contact form (Formspree)
(function () {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    status.style.color = '#6b7280';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        status.textContent = 'Message sent — I\'ll get back to you soon.';
        status.style.color = '#00d084';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Try emailing me directly.';
        status.style.color = '#f06060';
      }
    } catch {
      status.textContent = 'Network error. Please try again.';
      status.style.color = '#f06060';
    }
  });
})();
