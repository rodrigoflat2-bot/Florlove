document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initCart();
    initNewsletter();
    initContactForm();
    initScrollAnimations();
    updateCartCount();
    initWhatsAppButton();
});

function initWhatsAppButton() {
    const whatsappBtn = document.createElement('div');
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.innerHTML = `
        <a href="https://wa.me/5511924694745?text=Olá! Gostaria de saber mais sobre os produtos da Flor & Afeto" target="_blank" rel="noopener noreferrer">
            <i class="ph ph-whatsapp-logo"></i>
            <span class="whatsapp-tooltip">Fale conosco!</span>
        </a>
    `;
    document.body.appendChild(whatsappBtn);
    
    const style = document.createElement('style');
    style.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 2000;
        }
        .whatsapp-float a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #25D366;
            border-radius: 50%;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            transition: all 0.3s ease;
            text-decoration: none;
        }
        .whatsapp-float a:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(37, 211, 102, 0.5);
        }
        .whatsapp-float i {
            font-size: 2rem;
            color: white;
        }
        .whatsapp-tooltip {
            position: absolute;
            right: 70px;
            background: white;
            color: #333;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            opacity: 0;
            transform: translateX(10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }
        .whatsapp-float a:hover .whatsapp-tooltip {
            opacity: 1;
            transform: translateX(0);
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
            70% { box-shadow: 0 0 0 20px rgba(37, 211, 102, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        .whatsapp-float a {
            animation: pulse 2s infinite;
        }
        .whatsapp-float a:hover {
            animation: none;
        }
        @media (max-width: 768px) {
            .whatsapp-float {
                bottom: 20px;
                right: 20px;
            }
            .whatsapp-float a {
                padding: 14px;
            }
            .whatsapp-float i {
                font-size: 1.6rem;
            }
            .whatsapp-tooltip {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.padding = '12px 0';
        } else {
            header.style.padding = '16px 0';
        }
        
        lastScroll = currentScroll;
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            
            if (nav.classList.contains('active')) {
                icon.className = 'ph ph-x';
                document.body.style.overflow = 'hidden';
            } else {
                icon.className = 'ph ph-list';
                document.body.style.overflow = '';
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const toggle = document.getElementById('menuToggle');
            if (toggle) toggle.querySelector('i').className = 'ph ph-list';
            document.body.style.overflow = '';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 76;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initCart() {
    window.addToCart = function(id, nome, preco) {
        let cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantidade++;
        } else {
            cart.push({ id, nome, preco, quantidade: 1 });
        }
        
        localStorage.setItem('florAfetoCart', JSON.stringify(cart));
        updateCartCount();
        showToast(nome);
    };
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const countElements = document.querySelectorAll('.cart-count');
    const totalItens = cart.reduce((sum, item) => sum + item.quantidade, 0);
    
    countElements.forEach(el => {
        el.textContent = totalItens;
        if (totalItens === 0) {
            el.style.display = 'none';
        } else {
            el.style.display = 'flex';
        }
    });
}

function showToast(productName) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastProduct = document.getElementById('toastProduct');
    toastProduct.textContent = productName;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    const emailInput = document.getElementById('emailInput');
    const successMessage = document.getElementById('newsletterSuccess');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            shakeInput(emailInput);
            return;
        }
        
        successMessage.classList.add('show');
        emailInput.value = '';
        
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function shakeInput(input) {
        input.style.animation = 'none';
        input.offsetHeight;
        input.style.animation = 'shake 0.5s ease';
        input.style.borderColor = '#e74c3c';
        
        setTimeout(() => {
            input.style.borderColor = '#e0e0e0';
        }, 2000);
    }
    
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(shakeStyle);
}

function initContactForm() {
    const form = document.getElementById('contatoForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const assunto = document.getElementById('assunto').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();
        
        if (!nome || !email || !assunto || !mensagem) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-circle-notch" style="animation: spin 1s linear infinite;"></i> Enviando...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="ph ph-check"></i> Mensagem Enviada!';
            btn.style.background = '#00b894';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.feature-item, .categoria-card, .produto-card, .depoimento-card');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    const sectionElements = document.querySelectorAll('.sobre-content, .newsletter-content, .contato-info');
    
    sectionElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
