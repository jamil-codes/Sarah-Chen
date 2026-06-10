/* =============================================
   SARAH CHEN — PORTFOLIO SCRIPTS
============================================= */

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    // spotlight on hero
    const hero = document.getElementById('hero');
    if (hero) {
        const rect = hero.getBoundingClientRect();
        const pct_x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
        const pct_y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
        document.getElementById('spotlight').style.setProperty('--mx', pct_x + '%');
        document.getElementById('spotlight').style.setProperty('--my', pct_y + '%');
    }
});

function animateCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const [s1, s2] = burger.querySelectorAll('span');
    if (menuOpen) {
        s1.style.transform = 'rotate(45deg) translate(0px,0px)';
        s2.style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
        s1.style.transform = '';
        s2.style.transform = '';
    }
});
document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        burger.querySelectorAll('span').forEach(s => s.style.transform = '');
    });
});

// ── HERO CANVAS — dot grid ──
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
let animFrame;

function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    dots = [];
    const spacing = 44;
    const cols = Math.ceil(canvas.width / spacing) + 1;
    const rows = Math.ceil(canvas.height / spacing) + 1;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dots.push({
                x: c * spacing,
                y: r * spacing,
                baseX: c * spacing,
                baseY: r * spacing,
                phase: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.4
            });
        }
    }
}

let time = 0;
function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.008;
    dots.forEach(d => {
        const wave = Math.sin(d.phase + time * d.speed) * 3;
        const px = d.baseX + wave * 0.5;
        const py = d.baseY + wave;
        const dist = Math.hypot(mouseX - (canvas.getBoundingClientRect().left + px),
            mouseY - (canvas.getBoundingClientRect().top + py));
        const proximity = Math.max(0, 1 - dist / 180);
        const alpha = 0.08 + proximity * 0.35;
        const size = 1.2 + proximity * 2;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${alpha})`;
        ctx.fill();
    });
    animFrame = requestAnimationFrame(drawDots);
}

initCanvas();
drawDots();
window.addEventListener('resize', () => { initCanvas(); });

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                // trigger skill bars
                if (entry.target.classList.contains('skill-card')) {
                    entry.target.classList.add('visible');
                }
            }, 60 * (entry.target.dataset.delay || 0));
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
    el.dataset.delay = i % 4;
    io.observe(el);
});

// stagger siblings
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = [...skillCards];
            const idx = cards.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('reveal', 'visible');
            }, idx * 80);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
skillCards.forEach(c => skillObserver.observe(c));

// ── HERO LINE STAGGER ──
const lines = document.querySelectorAll('.hero-title .line');
lines.forEach((l, i) => {
    l.style.transitionDelay = `${0.1 + i * 0.09}s`;
    l.style.transition = 'transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.9s';
    l.style.transform = 'translateY(110%)';
    l.style.opacity = '0';
});
setTimeout(() => {
    lines.forEach(l => {
        l.style.transform = 'translateY(0)';
        l.style.opacity = '1';
    });
}, 200);

// ── HERO BADGE + SUB + ACTIONS reveal ──
const heroRevEls = document.querySelectorAll('.hero-badge, .hero-sub, .hero-actions, .hero-stats');
heroRevEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    el.style.transitionDelay = `${0.5 + i * 0.12}s`;
    setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, 100);
});

// ── SEND BUTTON FEEDBACK ──
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.contact-form-wrap input, .contact-form-wrap select, .contact-form-wrap textarea');
        let filled = true;
        inputs.forEach(i => { if (!i.value.trim()) filled = false; });
        if (!filled) {
            sendBtn.textContent = 'Please fill all fields ✗';
            sendBtn.style.background = '#ef4444';
            setTimeout(() => {
                sendBtn.innerHTML = 'Send message <span class="btn-arrow">→</span>';
                sendBtn.style.background = '';
            }, 2000);
            return;
        }
        sendBtn.innerHTML = 'Message sent! ✓';
        sendBtn.style.background = '#10b981';
        inputs.forEach(i => i.value = '');
        setTimeout(() => {
            sendBtn.innerHTML = 'Send message <span class="btn-arrow">→</span>';
            sendBtn.style.background = '';
        }, 3000);
    });
}

// ── SMOOTH SCROLL FOR NAV ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── PROJECT CARD PARALLAX ──
const projectVisuals = document.querySelectorAll('.project-visual');
window.addEventListener('scroll', () => {
    projectVisuals.forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift = center * 0.04;
        el.style.transform = `translateY(${shift}px)`;
    });
}, { passive: true });
