// ===== Smooth Scroll Behavior =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Add Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.card, .section, .tech-card, .node-card, .sidebar-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ===== Add Interactive Effects =====
document.querySelectorAll('.card, .tech-card, .node-card, .sidebar-card, .info-item').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Press 'T' to go to top
    if (e.key === 't' || e.key === 'T') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Press 'B' to go to bottom
    if (e.key === 'b' || e.key === 'B') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease-in';
});

// ===== Accessibility: Focus Management =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Remove focus from any focused element
        document.activeElement.blur();
    }
});

// ===== Dynamic Content from pizza.json =====
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display info from pizza.json if available
    loadProjectInfo();
});

async function loadProjectInfo() {
    try {
        const response = await fetch('pizza.json');
        if (!response.ok) throw new Error('Could not load pizza.json');
        
        const data = await response.json();
        
        // Update project title if available
        if (data.name) {
            const projectTitle = document.querySelector('.section-title');
            if (projectTitle && !projectTitle.textContent.includes('Componentes')) {
                // Already showing project info, don't override
            }
        }
        
        console.log('✅ Project info loaded from pizza.json');
        console.log('Project:', data.name);
        console.log('Nodes:', data.nodes.length);
        console.log('Status:', data.active ? 'Ativo' : 'Inativo');
        
    } catch (error) {
        console.log('ℹ️ pizza.json não encontrado - página está funcionando com conteúdo estático');
    }
}

// ===== Utility: Copy to Clipboard =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('✅ Copiado para área de transferência!');
    }).catch(err => {
        console.error('❌ Erro ao copiar:', err);
    });
}

// ===== Scroll to Top Button (Hidden by Default) =====
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑ Topo';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 12px 20px;
    background: #d4521f;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Theme Toggle (Light/Dark) =====
function toggleTheme() {
    const isDark = document.body.style.filter === 'invert(1)';
    document.body.style.filter = isDark ? 'none' : 'invert(1)';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.style.filter = 'invert(1)';
}

// ===== Console Easter Egg =====
console.log('%c🍕 PizzaCode — Aula 1: Webhook Chatbot', 
    'font-size: 20px; color: #d4521f; font-weight: bold;');
console.log('%cBem-vindo ao projeto educacional!', 
    'font-size: 14px; color: #2c3e50;');
console.log('%cDica: Pressione "T" para ir ao topo e "B" para ir ao final!', 
    'font-size: 12px; color: #666; font-style: italic;');
console.log('%c' + '='.repeat(50), 'color: #ddd;');
