/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.classList.remove('loading');
    initReveal();
    animateCounters();
  }, 1600);
});
document.body.classList.add('loading');

/* ── CURSOR ── */
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
const glow = document.querySelector('.mouse-glow');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  glow.style.left = mx + 'px'; glow.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a, button, .proj-card, .cert-card, .orbit-node').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); navLinks.classList.remove('open');
}));
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' }); }
  });
});
function updateActiveNav() {
  const ids = ['about','skills','timeline','projects','certifications','contact'];
  let cur = '';
  ids.forEach(id => { const s = document.getElementById(id); if (s && scrollY >= s.offsetTop - 150) cur = id; });
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}

/* ── HERO CANVAS (particles + connecting lines) ── */
(function initHero() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COLORS = ['rgba(56,189,248,', 'rgba(167,139,250,', 'rgba(34,211,238,'];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function mkParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.6 + 0.2
    };
  }
  function init() { resize(); particles = Array.from({ length: 120 }, mkParticle); }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${0.08 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // mouse connections
    particles.forEach(p => {
      const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx*dx+dy*dy);
      if (d < 180) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(167,139,250,${0.15 * (1 - d/180)})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }
    });
    // particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.a + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  init(); draw();
  window.addEventListener('resize', init);
})();

/* ── TYPING ROLE CYCLE ── */
const roles = ['AI Systems', 'Agentic AI', 'Spring Boot APIs', 'Full-Stack Apps', 'ML Models', 'Multi-Agent Pipelines'];
let ri = 0, ci = 0, deleting = false;
const el = document.getElementById('role-cycle');
function typeRole() {
  const cur = roles[ri];
  if (!deleting) {
    el.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; return setTimeout(typeRole, 1800); }
  } else {
    el.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 60 : 90);
}
setTimeout(typeRole, 2000);

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  let cur = 0;
  const step = target / 50;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur) + (el.classList.contains('hs-n') ? '+' : '+');
    if (cur >= target) { el.textContent = target + '+'; clearInterval(t); }
  }, 30);
}
function animateCounters() {
  document.querySelectorAll('.hs-n, .stat-val').forEach(el => animateCounter(el));
}

/* ── INTERSECTION OBSERVER ── */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      // stat bars
      e.target.querySelectorAll('.stat-bar-fill').forEach(b => b.style.width = b.style.width);
      // stat counters on scroll
      if (e.target.classList.contains('stats-cards')) {
        e.target.querySelectorAll('.stat-val').forEach(v => animateCounter(v));
      }
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, [reveal-card]').forEach(el => io.observe(el));
  document.querySelectorAll('.stats-cards').forEach(el => io.observe(el));
}

/* ── SKILLS GALAXY CANVAS ── */
(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const skills = [
    { name: 'AI Core', r: 0, a: 0, size: 28, color: '#38bdf8', glow: 'rgba(56,189,248,0.4)', ring: 0 },
    { name: 'Java', r: 90, a: 0, size: 18, color: '#38bdf8', glow: 'rgba(56,189,248,0.3)', ring: 1 },
    { name: 'Python', r: 90, a: 2.1, size: 18, color: '#38bdf8', glow: 'rgba(56,189,248,0.3)', ring: 1 },
    { name: 'C++', r: 90, a: 4.2, size: 16, color: '#38bdf8', glow: 'rgba(56,189,248,0.3)', ring: 1 },
    { name: 'Spring Boot', r: 165, a: 0.5, size: 19, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', ring: 2 },
    { name: 'React', r: 165, a: 1.8, size: 17, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', ring: 2 },
    { name: 'FastAPI', r: 165, a: 3.2, size: 16, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', ring: 2 },
    { name: 'LangChain', r: 165, a: 4.6, size: 17, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', ring: 2 },
    { name: 'LangGraph', r: 165, a: 5.8, size: 15, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', ring: 2 },
    { name: 'ML', r: 240, a: 0.3, size: 17, color: '#34d399', glow: 'rgba(52,211,153,0.3)', ring: 3 },
    { name: 'Deep Learning', r: 240, a: 1.4, size: 16, color: '#34d399', glow: 'rgba(52,211,153,0.3)', ring: 3 },
    { name: 'OpenAI', r: 240, a: 2.6, size: 16, color: '#34d399', glow: 'rgba(52,211,153,0.3)', ring: 3 },
    { name: 'Docker', r: 240, a: 3.8, size: 15, color: '#f472b6', glow: 'rgba(244,114,182,0.3)', ring: 4 },
    { name: 'AWS', r: 240, a: 4.8, size: 15, color: '#f472b6', glow: 'rgba(244,114,182,0.3)', ring: 4 },
    { name: 'PostgreSQL', r: 240, a: 5.6, size: 15, color: '#f472b6', glow: 'rgba(244,114,182,0.3)', ring: 4 },
    { name: 'MongoDB', r: 240, a: 0.9, size: 14, color: '#f472b6', glow: 'rgba(244,114,182,0.3)', ring: 4 },
  ];
  const speeds = [0, 0.003, 0.0022, 0.0018, 0.0015];
  let angles = [0, 0, 0, 0, 0];
  let hovered = null;
  let W, H, cx, cy;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    cx = W / 2; cy = H / 2;
  }
  resize(); window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect(), mx = e.clientX - rect.left, my = e.clientY - rect.top;
    hovered = null;
    skills.forEach(s => {
      const ax = angles[s.ring] || 0;
      const sx = s.r === 0 ? cx : cx + s.r * Math.cos(s.a + ax);
      const sy = s.r === 0 ? cy : cy + s.r * Math.sin(s.a + ax);
      if (Math.hypot(mx - sx, my - sy) < s.size + 4) hovered = s;
    });
    canvas.style.cursor = hovered ? 'pointer' : 'crosshair';
  });
  function draw(ts) {
    ctx.clearRect(0, 0, W, H);
    for (let i = 1; i <= 4; i++) angles[i] = (angles[i] || 0) + speeds[i];
    // orbital rings
    [90, 165, 240].forEach((r, i) => {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56,189,248,${0.06 + i * 0.02})`;
      ctx.lineWidth = 1; ctx.stroke();
    });
    // connecting lines from core
    skills.forEach(s => {
      if (s.r === 0) return;
      const ax = angles[s.ring] || 0;
      const sx = cx + s.r * Math.cos(s.a + ax), sy = cy + s.r * Math.sin(s.a + ax);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy);
      ctx.strokeStyle = s === hovered ? s.color.replace(')', ',0.3)').replace('#', 'rgba(') : 'rgba(56,189,248,0.04)';
      if (s === hovered) { ctx.lineWidth = 1.5; } else ctx.lineWidth = 0.5;
      ctx.stroke();
    });
    // nodes
    skills.forEach(s => {
      const ax = angles[s.ring] || 0;
      const sx = s.r === 0 ? cx : cx + s.r * Math.cos(s.a + ax);
      const sy = s.r === 0 ? cy : cy + s.r * Math.sin(s.a + ax);
      const isHov = s === hovered, scale = isHov ? 1.3 : 1;
      // glow
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size * 2 * scale);
      g.addColorStop(0, s.glow); g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(sx, sy, s.size * 2 * scale, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      // node
      ctx.beginPath(); ctx.arc(sx, sy, s.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6,11,24,0.9)`; ctx.fill();
      ctx.strokeStyle = s.color; ctx.lineWidth = isHov ? 2 : 1.5; ctx.stroke();
      // label
      ctx.font = `${isHov ? 700 : 600} ${s.r === 0 ? 11 : 9}px Inter`;
      ctx.fillStyle = isHov ? s.color : (s.r === 0 ? '#fff' : s.color);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(s.name, sx, sy);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── AI NETWORK GRAPH ── */
(function initNetwork() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const nodes = [
    { id: 0, label: 'TradeSim', x: 0.15, y: 0.3, color: '#38bdf8' },
    { id: 1, label: 'Multi-Agent AI', x: 0.5, y: 0.15, color: '#a78bfa' },
    { id: 2, label: 'Myntra Clone', x: 0.85, y: 0.3, color: '#f472b6' },
    { id: 3, label: 'AI Resume', x: 0.35, y: 0.65, color: '#34d399' },
    { id: 4, label: 'Course Mgmt', x: 0.65, y: 0.65, color: '#fbbf24' },
    { id: 5, label: 'Spring Boot', x: 0.25, y: 0.5, color: '#38bdf8' },
    { id: 6, label: 'LangChain', x: 0.5, y: 0.5, color: '#a78bfa' },
    { id: 7, label: 'PostgreSQL', x: 0.75, y: 0.5, color: '#34d399' },
    { id: 8, label: 'React', x: 0.5, y: 0.82, color: '#22d3ee' },
    { id: 9, label: 'FastAPI', x: 0.5, y: 0.35, color: '#f472b6' },
  ];
  const edges = [[0,5],[1,6],[1,9],[2,7],[2,8],[3,6],[3,8],[4,5],[4,7],[4,8],[5,0],[6,1],[7,2],[8,3],[8,4],[9,1],[0,7],[3,9],[1,3]];
  let hovered = null, W, H;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize(); window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    hovered = nodes.find(n => Math.hypot(mx - n.x * W, my - n.y * H) < 22) || null;
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  });
  let pulse = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H); pulse += 0.03;
    // edges
    edges.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      const isHov = na === hovered || nb === hovered;
      ctx.beginPath(); ctx.moveTo(na.x * W, na.y * H); ctx.lineTo(nb.x * W, nb.y * H);
      ctx.strokeStyle = isHov ? 'rgba(56,189,248,0.5)' : 'rgba(56,189,248,0.1)';
      ctx.lineWidth = isHov ? 1.5 : 0.8; ctx.stroke();
      // animated pulse dot on edges
      if (isHov) {
        const t = (Math.sin(pulse) + 1) / 2;
        const px = na.x * W + (nb.x - na.x) * W * t;
        const py = na.y * H + (nb.y - na.y) * H * t;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2);
        ctx.fillStyle = '#38bdf8'; ctx.fill();
      }
    });
    // nodes
    nodes.forEach(n => {
      const nx = n.x * W, ny = n.y * H, isHov = n === hovered;
      const radius = isHov ? 22 : 16;
      // glow
      const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, radius * 2);
      const hex = n.color;
      g.addColorStop(0, hex + '40'); g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(nx, ny, radius * 2, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
      // circle
      ctx.beginPath(); ctx.arc(nx, ny, radius, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(6,11,24,0.9)'; ctx.fill();
      ctx.strokeStyle = n.color; ctx.lineWidth = isHov ? 2 : 1.5; ctx.stroke();
      // label
      ctx.fillStyle = n.color; ctx.font = `${isHov ? 700 : 600} 9px Inter`;
      ctx.textAlign = 'center'; ctx.textBaseline = isHov ? 'middle' : 'top';
      if (isHov) ctx.fillText(n.label, nx, ny);
      else ctx.fillText(n.label, nx, ny + radius + 4);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── PROJECT MODAL DATA ── */
const projects = {
  tradesim: {
    title: 'TradeSim Pro', sub: 'Virtual Stock Trading Simulator',
    desc: 'A production-ready virtual stock trading platform with ₹10,00,000 simulated capital. Engineered with real-time price simulation, competitive trading tournaments, portfolio analytics dashboard, and 30+ secure REST APIs. Features JWT-based authentication and role-based access control.',
    features: ['Real-time Stock Price Simulation Engine','Portfolio Analytics & Performance Dashboard','Trading Tournaments with Live Leaderboard','JWT Authentication & 30+ Secure REST APIs','Responsive React 19 Frontend with Tailwind CSS'],
    tech: ['Spring Boot 4','React 19','PostgreSQL','JWT','Tailwind CSS','Docker'],
    arch: `Client (React 19)\n  ↓ REST API (JWT Auth)\nSpring Boot Backend\n  ├── TradingEngine (Price Simulation)\n  ├── PortfolioService\n  ├── TournamentService\n  └── PostgreSQL Database`,
    github: 'https://github.com/techcc-cmd/tradesim', demo: '#'
  },
  multiagent: {
    title: 'Multi-Agent Autonomous AI System', sub: 'Intelligent Workflow Automation',
    desc: 'A sophisticated multi-agent AI architecture built with LangChain and FastAPI, enabling autonomous task delegation, context-aware routing, and persistent memory management across complex, multi-step workflows. Implements LangGraph for stateful agent orchestration.',
    features: ['Multi-Agent Orchestration with LangGraph','Context-Aware Intelligent Task Routing','Persistent Memory Management with Redis','Automated Multi-Step Workflow Engine','FastAPI with async agent execution'],
    tech: ['Python','FastAPI','LangChain','LangGraph','Redis','PostgreSQL','OpenAI API'],
    arch: `User Request\n  ↓\nOrchestrator Agent\n  ├── ResearchAgent\n  ├── AnalysisAgent\n  ├── WriterAgent\n  └── Memory Layer (Redis)\n  ↓\nFastAPI Response`,
    github: '#', demo: '#'
  },
  myntra: {
    title: 'Myntra Clone', sub: 'Full-Featured E-Commerce Platform',
    desc: 'A full-featured e-commerce platform delivering end-to-end shopping experiences with secure Razorpay payment integration, dynamic product catalog management, and a complete order lifecycle system. Built with Spring Boot backend and JSP frontend.',
    features: ['Secure User Authentication & Session Management','Dynamic Product Catalog with Filters','Shopping Cart, Wishlist & Order Tracking','Razorpay Payment Gateway Integration','Admin Dashboard for Inventory Management'],
    tech: ['Spring Boot','JSP','PostgreSQL','Razorpay API','Spring Security','HTML/CSS/JS'],
    arch: `Browser (JSP + HTML/CSS)\n  ↓ Form Submissions / REST\nSpring Boot MVC\n  ├── ProductController\n  ├── CartService\n  ├── OrderService (Razorpay)\n  └── PostgreSQL Database`,
    github: '#', demo: '#'
  },
  'portfolio-cms': {
    title: 'Dynamic Portfolio CMS', sub: 'Database-Driven Personal Website',
    desc: 'A professional, database-driven portfolio platform built with Spring Boot and JSP. Features a secure admin panel for real-time content management, enabling dynamic updates to projects, skills, and certifications without any code changes.',
    features: ['Secure Admin Panel with Authentication','Real-time Content Management System','Database-Driven Dynamic Content Loading','Fully Responsive Design','CRUD Operations for all Portfolio Sections'],
    tech: ['Spring Boot','JSP','PostgreSQL','Spring Security','Bootstrap'],
    arch: `Public Portfolio (JSP)\n  ↓\nSpring Boot MVC\n  ├── AdminController (secured)\n  ├── PortfolioController\n  └── PostgreSQL (content store)`,
    github: 'https://github.com/techcc-cmd/Myproject', demo: '#'
  },
  'course-mgmt': {
    title: 'Course Management System', sub: 'Role-Based EdTech Platform',
    desc: 'A role-based learning management system enabling instructors to create and publish courses while students enroll, track progress, and access materials. Secured with JWT and fine-grained RBAC access control.',
    features: ['Role-Based Access Control (Admin, Instructor, Student)','Course Creation & Publishing Workflow','Student Enrollment & Progress Tracking','JWT-Secured RESTful API','React SPA with protected routes'],
    tech: ['React','Spring Boot','PostgreSQL','JWT','Spring Security'],
    arch: `React SPA\n  ↓ JWT-secured REST\nSpring Boot API\n  ├── AuthService (JWT + RBAC)\n  ├── CourseService\n  ├── EnrollmentService\n  └── PostgreSQL`,
    github: 'https://github.com/techcc-cmd/course_management_System', demo: '#'
  },
  'ai-resume': {
    title: 'AI Resume Analyzer', sub: 'ATS Intelligence Tool',
    desc: 'An AI-powered resume analysis tool leveraging Spring AI and OpenAI to evaluate resumes against job descriptions, calculate ATS compatibility scores, extract key skills, and deliver actionable improvement suggestions.',
    features: ['ATS Score Calculation & Benchmarking','AI-Powered Skill Extraction','Job Description Matching Analysis','Personalized Improvement Suggestions','PDF Resume Parsing & Processing'],
    tech: ['Spring AI','React','OpenAI GPT-4','PostgreSQL','Spring Boot','PDF Parser'],
    arch: `React Frontend\n  ↓ Upload Resume + JD\nSpring Boot + Spring AI\n  ├── PDFParser\n  ├── OpenAI (GPT-4) Analysis\n  ├── ATSScorer\n  └── PostgreSQL (history)`,
    github: '#', demo: '#'
  },
  uart: {
    title: 'Serial Communication System', sub: 'ATmega32 Embedded Engineering',
    desc: 'A low-level UART communication system enabling bidirectional data exchange between an ATmega32 microcontroller and a PC terminal. Simulated and validated in Proteus, demonstrating core embedded systems programming with Embedded C.',
    features: ['UART Bidirectional Communication Protocol','Proteus Circuit Design & Simulation','Low-Level Embedded C Register Programming','Baud Rate Configuration & Interrupt Handling','PC Terminal Communication Testing'],
    tech: ['Embedded C','ATmega32','Proteus 8','Keil uVision','UART Protocol'],
    arch: `PC Terminal (COM Port)\n  ↓ UART (115200 baud)\nATmega32 MCU\n  ├── USART Registers\n  ├── TX/RX Interrupt Handlers\n  └── Proteus Simulation`,
    github: 'https://github.com/techcc-cmd/', demo: null
  }
};

/* ── MODAL ── */
const overlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
document.getElementById('modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('.pc-detail').forEach(btn => {
  btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.getAttribute('data-id')); });
});
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.getAttribute('data-id')));
});

function openModal(id) {
  const p = projects[id]; if (!p) return;
  modalContent.innerHTML = `
    <div class="modal-project-header">
      <h2>${p.title}</h2>
      <p>${p.sub}</p>
    </div>
    <p class="modal-desc">${p.desc}</p>
    <div class="modal-section-title">Key Features</div>
    <ul class="modal-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
    <div class="modal-section-title">Technology Stack</div>
    <div class="modal-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="modal-section-title">Architecture</div>
    <div class="modal-arch">${p.arch}</div>
    <div class="modal-links">
      <a href="${p.github}" target="_blank" class="modal-link modal-link-gh"><i class="fab fa-github"></i> GitHub</a>
      ${p.demo ? `<a href="${p.demo}" target="_blank" class="modal-link modal-link-demo"><i class="fas fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
    </div>`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── PROJECT FILTER ── */
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-filter');
    document.querySelectorAll('.proj-card').forEach(c => {
      const cats = c.getAttribute('data-cat') || '';
      c.style.display = (f === 'all' || cats.includes(f)) ? '' : 'none';
    });
  });
});

/* ── CHATBOT ── */
const chatFab = document.getElementById('chatbot-fab');
const chatPanel = document.getElementById('chatbot-panel');
const chatMsgs = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

chatFab.addEventListener('click', () => chatPanel.classList.toggle('open'));
document.getElementById('chat-close').addEventListener('click', () => chatPanel.classList.remove('open'));

const kb = {
  project: 'I have built 7+ projects including TradeSim Pro (stock trading simulator), Multi-Agent AI System, Myntra Clone e-commerce platform, AI Resume Analyzer, and more! Click any project card to see full details. 🚀',
  skill: 'My core skills include: Java, Spring Boot, React, Python, FastAPI, LangChain, LangGraph, Machine Learning, Deep Learning, PostgreSQL, MongoDB, Docker, AWS, and Azure. I specialize in Agentic AI systems! 🤖',
  contact: 'You can reach me at sivasangarc091@gmail.com or call +91 90252 36196. Also find me on LinkedIn and GitHub! 📬',
  ai: 'I specialize in Agentic AI and Multi-Agent Systems using LangChain, LangGraph, and FastAPI. I build autonomous AI workflows with context-aware routing and persistent memory! 🧠',
  experience: 'I am a Computer Science student with hands-on experience in Full-Stack Development, AI/ML, Spring Boot microservices, and embedded systems. I have participated in hackathons and built production-grade applications! 💼',
  cert: 'I hold 9+ certifications including Microsoft Azure, Cisco Networking, Python Development (Oasis Infobyte), Generative AI (LinkedIn), Cybersecurity (TATA Forage), and more! 🎓',
  hire: 'I am open to full-time roles, internships, and freelance projects. Whether you are from Google, Amazon, Microsoft, OpenAI, or a startup — let\'s connect! My email is sivasangarc091@gmail.com 💌',
  default: "I can tell you about Sivasangar's projects, skills, AI expertise, certifications, or contact info. What would you like to know? 🤖"
};

function botReply(q) {
  q = q.toLowerCase();
  if (q.includes('project') || q.includes('built') || q.includes('best')) return kb.project;
  if (q.includes('ai') || q.includes('machine') || q.includes('agent') || q.includes('langchain')) return kb.ai;
  if (q.includes('skill') || q.includes('tech') || q.includes('know') || q.includes('java') || q.includes('spring')) return kb.skill;
  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('phone')) return kb.contact;
  if (q.includes('cert') || q.includes('qualif') || q.includes('azure') || q.includes('cisco')) return kb.cert;
  if (q.includes('exper') || q.includes('hack') || q.includes('journey') || q.includes('background')) return kb.experience;
  if (q.includes('hire') || q.includes('job') || q.includes('opportun') || q.includes('work')) return kb.hire;
  return kb.default;
}

function addMsg(text, who) {
  const d = document.createElement('div');
  d.className = `chat-msg ${who}`;
  d.textContent = text;
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function sendChat() {
  const v = chatInput.value.trim(); if (!v) return;
  addMsg(v, 'user'); chatInput.value = '';
  setTimeout(() => addMsg(botReply(v), 'bot'), 600);
}

document.getElementById('chat-send').addEventListener('click', sendChat);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
document.querySelectorAll('.chat-sug').forEach(btn => {
  btn.addEventListener('click', () => { chatInput.value = btn.getAttribute('data-q'); sendChat(); });
});
