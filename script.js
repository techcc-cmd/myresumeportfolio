// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.style.boxShadow = 'none';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  }
  
  lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      
      // Animate progress bars
      if (entry.target.classList.contains('skill-item')) {
        const progressBar = entry.target.querySelector('.progress');
        if (progressBar) {
          const width = progressBar.getAttribute('data-width');
          setTimeout(() => {
            progressBar.style.width = width + '%';
          }, 200);
        }
      }
    }
  });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .project-card, .cert-card, .skill-item').forEach(el => {
  observer.observe(el);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Typing effect for hero title
const typewriterText = document.querySelector('.typewriter');
if (typewriterText) {
  const text = typewriterText.textContent;
  typewriterText.textContent = '';
  let i = 0;
  
  function typeWriter() {
    if (i < text.length) {
      typewriterText.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }
  
  setTimeout(typeWriter, 500);
}

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    hero.style.opacity = 1 - scrolled / 700;
  }
});

// Copy email to clipboard
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
  emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailLink.textContent;
    navigator.clipboard.writeText(email).then(() => {
      const originalText = emailLink.textContent;
      emailLink.textContent = 'Email Copied!';
      setTimeout(() => {
        emailLink.textContent = originalText;
      }, 2000);
    });
  });
}
