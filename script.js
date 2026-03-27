// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Header shadow on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.pageYOffset > 10
    ? '0 2px 30px rgba(0,0,0,0.5)'
    : 'none';
});

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('animate-in');

    // Animate skill bars
    if (entry.target.classList.contains('skill-item')) {
      const bar = entry.target.querySelector('.bar-fill');
      if (bar) {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('section, .proj-card, .cert-card, .skill-item').forEach(el => {
  observer.observe(el);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.pageYOffset >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

// Typewriter
const tw = document.querySelector('.typewriter');
if (tw) {
  const text = tw.textContent;
  tw.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) { tw.textContent += text[i++]; setTimeout(type, 85); }
  };
  setTimeout(type, 700);
}

// Copy email
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
  emailLink.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText(emailLink.textContent.trim()).then(() => {
      const orig = emailLink.textContent;
      emailLink.textContent = 'Copied!';
      setTimeout(() => { emailLink.textContent = orig; }, 2000);
    });
  });
}

window.addEventListener('load', () => document.body.classList.add('loaded'));
