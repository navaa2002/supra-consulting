/* ==========================================================================
   SUPRA CONSULTING — main.js
   Shared chrome (nav/footer/widgets) + page interactivity, no build step.

   Content that used to be hard-coded arrays (PROJECTS, GALLERY, services,
   testimonials, team) is now fetched from the Express/MySQL API defined in
   assets/js/api.js, so every public page reflects whatever the admin panel
   has published. Each render function fails gracefully (shows an empty/
   friendly state) if the API is unreachable, instead of throwing and
   breaking the rest of the page.
   ========================================================================== */

const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'about.html', label: 'About' },
  { href: 'services.html', label: 'Services' },
  { href: 'projects.html', label: 'Projects' },
  { href: 'gallery.html', label: 'Gallery' },
  { href: 'testimonials.html', label: 'Testimonials' },
  { href: 'contact.html', label: 'Contact' },
];

let siteSettings = {};
async function loadSiteSettings() {
  try {
    siteSettings = await apiFetch("/api/settings");
    console.log("Site Settings:", siteSettings);

    applySiteSettings();

  } catch (err) {
    console.error("Failed to load settings:", err);
  }
}
function applySiteSettings() {

  // Company Name
  document.querySelectorAll("[data-company-name]").forEach(el => {
    el.textContent = siteSettings.company_name || "";
  });

  // Phone
  document.querySelectorAll("[data-phone]").forEach(el => {
    el.textContent = siteSettings.phone || "";
    el.href = "tel:" + (siteSettings.phone || "");
  });

  // WhatsApp
  document.querySelectorAll("[data-whatsapp]").forEach(el => {
    const number = (siteSettings.whatsapp || "").replace(/\D/g, "");
    el.href = "https://wa.me/" + number;
  });

  // Email
  document.querySelectorAll("[data-email]").forEach(el => {
    el.textContent = siteSettings.email || "";
    el.href = "mailto:" + (siteSettings.email || "");
  });

  // Footer Social Links
  const facebook = document.getElementById("footerFacebook");
  if (facebook) {
    facebook.href = siteSettings.facebook || "#";
  }

  const linkedin = document.getElementById("footerLinkedin");
  if (linkedin) {
    linkedin.href = siteSettings.linkedin || "#";
  }

  const twitter = document.getElementById("footerTwitter");
  if (twitter) {
    twitter.href = siteSettings.twitter || "#";
 }

}

function currentPage(){
  const p = location.pathname.split('/').pop() || 'index.html';
  return p === '' ? 'index.html' : p;
}

function renderNav(){
  const page = currentPage();
  const links = NAV_LINKS.map(l => `<a href="${l.href}" class="${l.href===page?'active':''}">${l.label}</a>`).join('');
  const mobileLinks = NAV_LINKS.map(l => `<a href="${l.href}" class="${l.href===page?'active':''}">${l.label}</a>`).join('');
  document.getElementById('site-nav').innerHTML = `
  <div class="container nav-inner">
    <a href="index.html" class="brand">
      <span class="brand-chip"><img src="assets/img/logo-full.png" alt="Supra Consulting Engineers & Surveyors"></span>
    </a>
    <ul class="nav-links">${links}</ul>
    <div class="nav-right">
      <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">
        <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <a href="contact.html#quote" class="btn btn-primary" style="padding:12px 22px;">Get a Quote</a>
      <button class="icon-btn burger" id="burger-btn" aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>`;

  document.getElementById('mobile-menu').innerHTML = `
    <button class="mobile-close" id="mobile-close">&times;</button>
    <a href="index.html" class="brand" style="margin-bottom:30px;">
      <span class="brand-chip"><img src="assets/img/logo-full.png" alt="Supra Consulting Engineers"></span>
    </a>
    ${mobileLinks}
    <a href="contact.html" class="btn btn-primary" style="margin-top:24px;width:fit-content;">Get a Quote</a>
  `;
}

function renderFooter(){
  document.getElementById('site-footer').innerHTML = `
  <div class="container">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="brand" style="margin-bottom:18px;">
          <span class="brand-chip"><img src="assets/img/logo-full.png" alt="Supra Consulting Engineers & Surveyors"></span>
        </a>
        <p
    id="footerDescription"
    style="max-width:280px;margin-top:16px;">

    SUPRA Consulting Engineers & Surveyors delivers engineering, surveying and professional consulting services with precision, innovation and excellence.

</p>
        <div class="social-row" style="margin-top:20px;">
          <a id="footerLinkedin" href="#" aria-label="LinkedIn"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.9c0-1.4-.03-3.2-1.98-3.2-1.98 0-2.28 1.5-2.28 3.1V21H9z"/></svg></a>
          <a id="footerFacebook" href="#" aria-label="Facebook"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.93.26-1.56 1.63-1.56H17V3.3C16.66 3.26 15.5 3.16 14.14 3.16c-2.75 0-4.64 1.63-4.64 4.62V9.8H6.8V13h2.7v8z"/></svg></a>
          <a id="footerTwitter" href="#" aria-label="X"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3l7.4 9.6L3.2 21H5.8l6-6.7 4.6 6.7H21l-7.7-10 6.9-8.1H17.6l-5.6 6.2L7.6 3z"/></svg></a>
        </div>
      </div>
      <div><h5>Company</h5><ul>
        <li><a href="about.html">About Us</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="testimonials.html">Testimonials</a></li>
      </ul></div>
      <div><h5>Services</h5><ul>
        <li><a href="services.html">Engineering Consulting</a></li>
        <li><a href="services.html">Survey Services</a></li>
        <li><a href="services.html">Project Management</a></li>
        <li><a href="services.html">Structural Inspections</a></li>
      </ul></div>
      <div><h5>Head Office</h5><ul>
        <li id="footerAddress">PO Box 4041 Homebush NSW 2140</li>
<li id="footerPhone">0447 039 623</li>
<li id="footerEmail">info@supraconsulting.com.au</li>
        <li>Mon – Fri · 09.00 – 17.00</li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year"></span> Supra Consulting (Pvt) Ltd. All rights reserved.</span>
      <span>Privacy Policy &nbsp;·&nbsp; Terms of Service &nbsp;·&nbsp; <a href="admin.html" style="opacity:.6;">Admin</a></span>
    </div>
  </div>`;

  document.getElementById('year').textContent = new Date().getFullYear();
}

async function loadFooterSettings() {

    try {

        const s = await apiFetch("/api/settings");

        const address = document.getElementById("footerAddress");
        const phone = document.getElementById("footerPhone");
        const email = document.getElementById("footerEmail");

        if (address && s.address) {
            address.textContent = s.address;
        }

        if (phone && s.phone) {
            phone.textContent = s.phone;
        }

        if (email && s.email) {
            email.textContent = s.email;
        }

    } catch (err) {

        console.error("Footer Settings:", err);

    }

}
loadFooterSettings();
function renderWidgets(){
  document.body.insertAdjacentHTML('beforeend', `
  <div id="loader"><div class="loader-mark"></div><div class="loader-text">Surveying the page</div></div>

  <div class="mobile-menu" id="mobile-menu"></div>

  <div class="fab-stack">
    <button class="fab fab-top" id="fab-top" aria-label="Scroll to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="fab fab-chat" id="fab-chat" aria-label="Live chat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.9-.94L3 20l1.02-5.3A8.5 8.5 0 1 1 21 11.5z"/></svg>
    </button>
    <a class="fab fab-whatsapp" id="fab-whatsapp" href="https://wa.me/0447039623" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.7-.85-2-.94-.27-.1-.46-.15-.66.15-.2.3-.76.94-.93 1.13-.17.2-.34.22-.64.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.6.14-.14.3-.35.46-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.06 2.85 1.2 3.05c.15.2 2.1 3.2 5.08 4.5.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.7-.7 1.94-1.36.24-.67.24-1.25.17-1.37-.07-.12-.27-.2-.57-.34z"/><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z"/></svg>
    </a>
  </div>

  <div class="chat-panel" id="chat-panel">
    <div class="chat-head">
      <div><div class="t">Supra Consulting</div><div class="s">Online now</div></div>
      <button class="chat-close" id="chat-close">&times;</button>
    </div>
    <div class="chat-body">
      <div class="chat-bubble">👋 Hello! Need a quote for a survey, inspection or consulting project? Tell us what you need and our team will get back within one business day.</div>
    </div>
    <div class="chat-input">
      <input type="text" id="chat-input-field" placeholder="Type your message…">
      <button id="chat-send">Send</button>
    </div>
  </div>

  <div class="modal-overlay" id="project-modal">
    <div class="modal-box" id="project-modal-box"></div>
  </div>

  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" id="lightbox-close">&times;</button>
    <button class="lightbox-prev" id="lightbox-prev">&#10094;</button>
    <img src="" id="lightbox-img" alt="">
    <button class="lightbox-next" id="lightbox-next">&#10095;</button>
  </div>
  `);
}

async function loadBranding() {

    try {

        const s = await apiFetch("/api/settings");

        if (s.logo) {

            document.querySelectorAll(".brand-chip img").forEach(img => {

                img.src = resolveImage(s.logo);

            });

        }

    } catch (err) {

        console.error("Branding:", err);

    }

}

/* ---------- theme ---------- */
function initTheme(){
  const saved = localStorage.getItem('supra-theme');
  if(saved === 'dark'){ document.documentElement.setAttribute('data-theme','dark'); }
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const setIcon = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    icon.innerHTML = dark
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  };
  setIcon();
  btn.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if(dark){ document.documentElement.removeAttribute('data-theme'); localStorage.setItem('supra-theme','light'); }
    else{ document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('supra-theme','dark'); }
    setIcon();
  });
}

/* ---------- nav scroll state ---------- */
function initNavScroll(){
  const nav = document.getElementById('site-nav');
  const onScroll = () => {
    if(window.scrollY > 60) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    const top = document.getElementById('fab-top');
    if(window.scrollY > 500) top.classList.add('show'); else top.classList.remove('show');
  };
  document.addEventListener('scroll', onScroll);
  onScroll();
}

/* ---------- mobile menu ---------- */
function initMobileMenu(){
  const menu = document.getElementById('mobile-menu');
  document.getElementById('burger-btn').addEventListener('click', () => menu.classList.add('open'));
  document.getElementById('mobile-close').addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ---------- loader ---------- */
function initLoader(){
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 350);
  });
  setTimeout(() => { const l = document.getElementById('loader'); if(l) l.classList.add('hide'); }, 1800);
}

/* ---------- reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal:not(.in), .reveal-scale:not(.in)');
  if(typeof IntersectionObserver === 'undefined'){
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* ---------- counters ---------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1600; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target < 10 ? (target*eased).toFixed(1) : Math.floor(target*eased);
      el.textContent = val + suffix;
      if(p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if(typeof IntersectionObserver === 'undefined'){
    counters.forEach(animate);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ---------- scroll to top / chat / whatsapp ---------- */
function initWidgets(){
  document.getElementById('fab-top').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  const panel = document.getElementById('chat-panel');
  document.getElementById('fab-chat').addEventListener('click', () => panel.classList.toggle('open'));
  document.getElementById('chat-close').addEventListener('click', () => panel.classList.remove('open'));
  const send = () => {
    const field = document.getElementById('chat-input-field');
    if(!field.value.trim()) return;
    const body = document.querySelector('.chat-body');
    body.insertAdjacentHTML('beforeend', `<div class="chat-bubble" style="margin-left:auto;background:var(--emerald);color:#fff;">${field.value.replace(/</g,'&lt;')}</div>`);
    field.value = '';
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      body.insertAdjacentHTML('beforeend', `<div class="chat-bubble">Thanks for reaching out — one of our consultants will follow up shortly. In the meantime, feel free to browse our <a href="services.html" style="color:var(--emerald);font-weight:600;">Services</a>.</div>`);
      body.scrollTop = body.scrollHeight;
    }, 900);
  };
  document.getElementById('chat-send').addEventListener('click', send);
  document.getElementById('chat-input-field').addEventListener('keydown', e => { if(e.key==='Enter') send(); });
}

/* ==========================================================================
   DATA LAYER — fetched from the Express/MySQL API (see assets/js/api.js)
   ========================================================================== */

/** Category value (as stored in DB, lowercased) -> label shown on cards/chips. */
const CATEGORY_LABELS = {
  engineering: 'Engineering',
  survey: 'Survey',
  management: 'Project Mgmt',
  inspection: 'Inspection',
  consulting: 'Consulting',
};
function categoryLabel(cat){
  const key = (cat || '').toLowerCase();
  return CATEGORY_LABELS[key] || (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'General');
}

/** SVG icon markup per service category, reused from the site's existing icon set. */
const SERVICE_ICONS = {
  engineering: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01" stroke-linecap="round" stroke-linejoin="round"/>',
  survey: '<path d="M12 2v20M4 6l8-4 8 4M4 18l8 4 8-4M4 6v12M20 6v12" stroke-linecap="round" stroke-linejoin="round"/>',
  management: '<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke-linecap="round" stroke-linejoin="round"/>',
  inspection: '<path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z" stroke-linecap="round" stroke-linejoin="round"/>',
  consulting: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linecap="round" stroke-linejoin="round"/>',
};
function serviceIcon(cat){
  const key = (cat || '').toLowerCase();
  return SERVICE_ICONS[key] || SERVICE_ICONS.consulting;
}

function starString(rating){
  const r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return '★★★★★☆☆☆☆☆'.slice(5 - r, 10 - r);
}

// In-memory caches so a page that needs the same data twice (e.g. the
// projects grid + its click-to-open modal) only fetches it once.
let projectsCache = null;
async function getProjects(){
  if(projectsCache) return projectsCache;
  try {
    const data = await apiFetch('/api/projects?status=Published');
    projectsCache = data.map(p => ({ ...p, catLabel: categoryLabel(p.category) }));
  } catch (err) {
    console.error('Failed to load projects:', err.message);
    projectsCache = [];
  }
  return projectsCache;
}

let galleryCache = null;
async function getGallery(){
  if(galleryCache) return galleryCache;
  try {
    galleryCache = await apiFetch('/api/gallery?status=Published');
  } catch (err) {
    console.error('Failed to load gallery:', err.message);
    galleryCache = [];
  }
  return galleryCache;
}

let servicesCache = null;
async function getServices(){
  if(servicesCache) return servicesCache;
  try {
    servicesCache = await apiFetch('/api/services?status=Published');
  } catch (err) {
    console.error('Failed to load services:', err.message);
    servicesCache = [];
  }
  return servicesCache;
}

let testimonialsCache = null;
async function getTestimonials(){
  if(testimonialsCache) return testimonialsCache;
  try {
    testimonialsCache = await apiFetch('/api/testimonials?status=Published');
  } catch (err) {
    console.error('Failed to load testimonials:', err.message);
    testimonialsCache = [];
  }
  return testimonialsCache;
}

let teamCache = null;
async function getTeam(){
  if(teamCache) return teamCache;
  try {
    teamCache = await apiFetch('/api/team?status=Published');
  } catch (err) {
    console.error('Failed to load team:', err.message);
    teamCache = [];
  }
  return teamCache;
}

/* ---------- projects page: filter + search + modal ---------- */
function renderProjectCard(p){
  return `
  <div class="proj-card reveal" data-cat="${p.category}" data-title="${(p.title||'').toLowerCase()}" data-id="${p.id}">
    <div class="proj-img"><span class="proj-tag">${p.catLabel}</span><img src="${resolveImage(p.image)}" alt="${p.title}" loading="lazy"></div>
    <div class="proj-body">
      <h3>${p.title}</h3>
      <p style="font-size:13.5px;">${(p.description||'').slice(0,90)}…</p>
      <div class="proj-meta"><span>${p.location||''}</span><span>${p.year||''}</span></div>
    </div>
  </div>`;
}

async function initProjectsPage(){
  const grid = document.getElementById('projects-grid');
  if(!grid) return;
  const search = document.getElementById('project-search');
  const chips = document.querySelectorAll('.chip[data-filter]');
  let activeFilter = 'all';

  const projects = await getProjects();

  const draw = () => {
    const q = (search.value || '').toLowerCase();
    const filtered = projects.filter(p => (activeFilter==='all' || (p.category||'').toLowerCase()===activeFilter) && (p.title||'').toLowerCase().includes(q));
    grid.innerHTML = filtered.map(renderProjectCard).join('') || `<p style="grid-column:1/-1;text-align:center;padding:60px 0;">No projects match your search.</p>`;
    initReveal();
    grid.querySelectorAll('.proj-card').forEach(card => card.addEventListener('click', () => openProjectModal(parseInt(card.dataset.id))));
  };

  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    draw();
  }));
  search.addEventListener('input', draw);
  draw();
}

async function openProjectModal(id){
  const projects = await getProjects();
  const p = projects.find(x => x.id === id);
  if(!p) return;
  const overlay = document.getElementById('project-modal');
  document.getElementById('project-modal-box').innerHTML = `
    <button class="modal-close" id="modal-close-btn">&times;</button>
    <img src="${resolveImage(p.image)}" class="modal-img" alt="${p.title}">
    <div class="modal-content">
      <span class="badge-soft">${p.catLabel}</span>
      <h2 style="margin-top:16px;">${p.title}</h2>
      <div class="proj-meta" style="margin-bottom:18px;"><span>${p.location||''}</span><span>Completed ${p.year||''}</span></div>
      <p>${p.description||''}</p>
      <a href="contact.html" class="btn btn-dark" style="margin-top:10px;">Discuss a similar project</a>
    </div>`;
  overlay.classList.add('open');
  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('open'));
}

async function loadServicesPage() {
console.log("LOAD SERVICES STARTED");
    const container = document.getElementById("servicesPageContainer");
console.log(container);
    if (!container) return;

   const services = await getServices();
   console.log(services);
    container.innerHTML = "";


    services
        .filter(s => s.status === "Published")
        .sort((a, b) => a.sort_order - b.sort_order)
        .forEach((service, index) => {
console.log(container.innerHTML);
          console.log("Rendering:", service);
          
container.innerHTML += `
<div class="service-detail">

    <div>
        <img
            src="${resolveImage(service.image)}"
            style="width:100%;border-radius:10px;"
        >
    </div>

    <div>

       <span class="service-badge">
    ${service.title}
</span>

<h2>${service.heading || service.title}</h2>

<p>${service.intro || service.description}</p>
<ul class="service-features">

    ${service.feature1 ? `<li>✓ ${service.feature1}</li>` : ""}

    ${service.feature2 ? `<li>✓ ${service.feature2}</li>` : ""}

    ${service.feature3 ? `<li>✓ ${service.feature3}</li>` : ""}

    ${service.feature4 ? `<li>✓ ${service.feature4}</li>` : ""}

</ul>

<button
    class="btn btn-dark"
    style="margin-top:26px;"
    onclick="openQuoteModal('${service.title}')">

    ${service.button_text || "Request This Service"}

</button>

    </div>

</div>
`;



        });

}

/* ================= QUOTE MODAL ================= */
function openQuoteModal(serviceName) {

    document.getElementById("quoteModal").style.display = "flex";

    document.getElementById("quoteTitle").textContent =
        "Request a Quote - " + serviceName;

    document.getElementById("quoteService").value = serviceName || "";

    document.getElementById("quoteMessage").value =
`Hello Supra Consulting,

I would like to request a quotation for the following service.

Service:
${serviceName}

Please contact me with more details.

Thank you.`;

}
function closeQuoteModal() {

    document.getElementById("quoteModal").style.display = "none";

    document.getElementById("quoteForm").reset();

}

document.addEventListener("click",(e)=>{

    if(e.target.id==="closeQuoteModal"){

        closeQuoteModal();

    }

    if(e.target.id==="quoteModal"){

        closeQuoteModal();

    }

});

const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {

    quoteForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const payload = {

            name: document.getElementById("quoteName").value,

            email: document.getElementById("quoteEmail").value,

            phone: document.getElementById("quotePhone").value,

            service: document.getElementById("quoteService").value,

            message: document.getElementById("quoteMessage").value

        };

        try {

console.log("Payload:", payload);

            await apiFetch("/api/contact", {

                method: "POST",

                body: JSON.stringify(payload)

            });

            alert("Request sent successfully!");

            quoteForm.reset();

            closeQuoteModal();

        }

        catch (err) {

            alert(err.message);

        }

    });

}

function initModalOverlayClose(){
  const overlay = document.getElementById('project-modal');
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.classList.remove('open'); });
}

async function openServiceDetails(id){

console.log("Service clicked:", id);

  const services = await getServices();

console.log(services);

  const s = services.find(x => x.id === id);

  if(!s) return;

  const overlay = document.getElementById("service-modal");

  const box = document.getElementById("service-modal-box");
if (!overlay || !box) {
    console.error("Service modal not found");
    return;
}
  box.innerHTML = `
    <button class="modal-close" id="service-close">&times;</button>

    ${s.image ? `<img src="${resolveImage(s.image)}" class="modal-img" alt="${s.title}">` : ""}

    <div class="modal-content">

      <span class="badge-soft">${categoryLabel(s.category)}</span>

      <h2>${s.title}</h2>

      <p style="margin-top:18px;">
        ${s.description || ""}
      </p>

      <a href="contact.html" class="btn btn-dark" style="margin-top:25px;">
        Contact Us
      </a>

    </div>
  `;

  overlay.classList.add("open");

  document
    .getElementById("service-close")
    .addEventListener("click", () => {

      overlay.classList.remove("open");

    });

  overlay.onclick = function(e){

    if(e.target === overlay){

      overlay.classList.remove("open");

    }

  };

}
/* ---------- home page: featured projects ---------- */
async function initFeaturedProjects() {

    const el = document.getElementById("featured-projects");

    if (!el) return;

    const projects = await getProjects();

    el.innerHTML =
        projects.slice(0, 3).map(renderProjectCard).join("") ||
        `<p style="grid-column:1/-1;text-align:center;padding:40px 0;">
            Projects coming soon.
        </p>`;

    initReveal();

    el.querySelectorAll(".proj-card").forEach(card => {

        card.addEventListener("click", () => {

            openProjectModal(parseInt(card.dataset.id));

        });

    });

}

/* ---------- gallery page ---------- */
let lightboxIndex = 0;
let lightboxData = [];
async function initGalleryPage(){
  const grid = document.getElementById('gallery-grid');
  if(!grid) return;
  const items = await getGallery();
  lightboxData = items;
  grid.innerHTML = items.map((g,i) => `
    <div class="gallery-item reveal-scale" data-i="${i}">
      <img src="${resolveImage(g.image)}" alt="${g.caption||''}" loading="lazy">
      <div class="gallery-overlay">${g.caption||''}</div>
    </div>`).join('') || `<p style="text-align:center;padding:60px 0;">No gallery images yet.</p>`;
  initReveal();
  grid.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => openLightbox(parseInt(item.dataset.i))));

  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-close').addEventListener('click', () => lb.classList.remove('open'));
  document.getElementById('lightbox-next').addEventListener('click', () => { lightboxIndex = (lightboxIndex+1) % lightboxData.length; setLightboxImg(); });
  document.getElementById('lightbox-prev').addEventListener('click', () => { lightboxIndex = (lightboxIndex-1+lightboxData.length) % lightboxData.length; setLightboxImg(); });
  lb.addEventListener('click', e => { if(e.target === lb) lb.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') lb.classList.remove('open');
    if(e.key==='ArrowRight') { lightboxIndex=(lightboxIndex+1)%lightboxData.length; setLightboxImg(); }
    if(e.key==='ArrowLeft') { lightboxIndex=(lightboxIndex-1+lightboxData.length)%lightboxData.length; setLightboxImg(); }
  });
}
function openLightbox(i){ lightboxIndex = i; setLightboxImg(); document.getElementById('lightbox').classList.add('open'); }
function setLightboxImg(){
  const item = lightboxData[lightboxIndex];
  if(!item) return;
  document.getElementById('lightbox-img').src = resolveImage(item.image);
  document.getElementById('lightbox-img').alt = item.caption || '';
}

/* ---------- services grid (index.html "Featured Services" + services.html "At a Glance") ---------- */
function renderServiceCard(s){
  return `
  <div class="glass-card reveal service-card" data-id="${s.id}">
    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
        ${serviceIcon(s.category)}
      </svg>
    </div>

    <h3>${s.title}</h3>

    <p>${(s.description || '').slice(0,110)}</p>

    <button class="card-link" type="button">
      Learn more
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  </div>`;
}
async function initServicesGrid(){

  const els = document.querySelectorAll('[data-services-grid]');
  if(!els.length) return;

  const services = await getServices();

  els.forEach(el => {

    const limit = parseInt(el.dataset.servicesGrid) || services.length;

    const ctaCard = el.querySelector('[data-cta-card]');

    const ctaHtml =
      ('appendCta' in el.dataset) && ctaCard
        ? ctaCard.outerHTML.replace('display:none;','')
        : '';

    el.innerHTML =
      (services.slice(0, limit).map(renderServiceCard).join('') ||
      `<p style="grid-column:1/-1;text-align:center;padding:40px 0;">Services coming soon.</p>`)
      + ctaHtml;

    // NEW: Click event for every service card

console.log("Cards found:", el.querySelectorAll(".service-card").length);

    el.querySelectorAll(".service-card").forEach(card => {

      card.addEventListener("click", () => {

        const id = parseInt(card.dataset.id);

        openServiceDetails(id);

      });

    });

  });

  initReveal();

}

/* ---------- testimonials (index.html preview + testimonials.html full list) ---------- */
function renderTestimonialCard(t){
  return `
  <div class="testi-card reveal">
    <div class="stars">${starString(t.rating)}</div>
    <p class="testi-quote">"${t.quote}"</p>
    <div class="testi-person">
      <img class="avatar" src="${resolveImage(t.avatar)}" alt="${t.client_name}">
      <div><div class="name">${t.client_name}</div><div class="role">${[t.role, t.company].filter(Boolean).join(', ')}</div></div>
    </div>
  </div>`;
}
async function initTestimonialsSection(){
  const els = document.querySelectorAll('[data-testimonials-grid]');
  if(!els.length) return;
  const testimonials = await getTestimonials();
  els.forEach(el => {
    const limit = parseInt(el.dataset.testimonialsGrid) || testimonials.length;
    el.innerHTML = testimonials.slice(0, limit).map(renderTestimonialCard).join('') || `<p style="grid-column:1/-1;text-align:center;padding:40px 0;">No testimonials published yet.</p>`;
  });
  initReveal();
}

/* ---------- team (about.html) ---------- */
function renderTeamCard(m){
  return `
  <div class="team-card reveal">
    <div class="team-photo"><img src="${resolveImage(m.photo)}" alt="${m.name}"><div class="social"><a class="icon-btn" style="width:32px;height:32px;" href="${m.social_link||'#'}"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.9c0-1.4-.03-3.2-1.98-3.2-1.98 0-2.28 1.5-2.28 3.1V21H9z"/></svg></a></div></div>
    <h4>${m.name}</h4><div class="team-role">${m.role||''}</div>
  </div>`;
}
async function initTeamSection(){
  const el = document.getElementById('team-grid');
  if(!el) return;
  const team = await getTeam();
  el.innerHTML = team.map(renderTeamCard).join('') || `<p style="grid-column:1/-1;text-align:center;padding:40px 0;">Team profiles coming soon.</p>`;
  initReveal();
}

/* ---------- contact form ---------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    const success = document.getElementById('form-success');

    const payload = {
      name: form.querySelector('[name="name"]')?.value || '',
      email: form.querySelector('[name="email"]')?.value || '',
      phone: form.querySelector('[name="phone"]')?.value || '',
      service: form.querySelector('[name="service"]')?.value || '',
      message: form.querySelector('[name="message"]')?.value || '',
    };

    if(!payload.name || !payload.email || !payload.message){
      alert('Please fill all required fields.');
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      await apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
      if(success) success.style.display = 'flex';
      form.reset();
    } catch (err) {
       console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const inits = [
    renderWidgets, renderNav, renderFooter,loadSiteSettings, initTheme, initNavScroll, initMobileMenu,
    initLoader, initWidgets, initModalOverlayClose, initReveal, initCounters,
    initProjectsPage, initFeaturedProjects, initGalleryPage, initServicesGrid,
    initTestimonialsSection, initTeamSection, initContactForm,loadBranding, loadServicesPage
  ];
  // Each initializer runs independently — one throwing (e.g. a slow/broken
  // API call, or a browser missing some optional feature) must never stop
  // the rest of the page's chrome and content from loading.
  inits.forEach(fn => {
    try { fn(); } catch (err) { console.error(`[main.js] ${fn.name} failed:`, err); }
  });
});

console.log("MAIN JS LOADED");