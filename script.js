const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) root.dataset.theme = savedTheme;

function syncThemeButton() {
  const dark = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}
syncThemeButton();
toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', root.dataset.theme);
  syncThemeButton();
});

const timeNode = document.querySelector('#local-time');
function updateTime() {
  timeNode.textContent = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date());
}
updateTime();
setInterval(updateTime, 30000);

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
  revealObserver.observe(item);
});

const sections = [...document.querySelectorAll('#work, #about, #services, #contact')];
const navLinks = [...document.querySelectorAll('.side-nav a')];
const navObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
}, { rootMargin: '-25% 0px -55%', threshold: [0, .2, .5] });
sections.forEach(section => navObserver.observe(section));

for (const button of document.querySelectorAll('.service-list button')) {
  button.addEventListener('click', () => {
    const detail = button.nextElementSibling;
    const willOpen = !detail.classList.contains('open');
    document.querySelectorAll('.service-detail').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.service-list button').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.querySelector('i').textContent = '+';
    });
    if (willOpen) {
      detail.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      button.querySelector('i').textContent = '−';
    }
  });
}

for (const card of document.querySelectorAll('.project[tabindex]')) {
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') card.querySelector('.text-link')?.click();
  });
}
