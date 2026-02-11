/**
 * ALAMCTA - JavaScript Principal
 * Versión: 2.0
 * Autor: ALAMCTA Development Team
 * Descripción: Funcionalidades interactivas para el sitio web
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
    // ==========================================================================
    const body = document.body;
    const isMobile = window.innerWidth <= 768;
    
    // ==========================================================================
    // MANEJO DEL HEADER Y NAVEGACIÓN
    // ==========================================================================
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Menú móvil
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            
            // Bloquear scroll cuando el menú está abierto
            if (navMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = '';
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = '';
            }
        });
    }
    
    // ==========================================================================
    // ANIMACIONES AL SCROLL
    // ==========================================================================
    
    // Observador de intersección para animaciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animaciones específicas por clase
                if (entry.target.classList.contains('pilar-card')) {
                    entry.target.style.animationDelay = `${entry.target.dataset.delay || '0'}s`;
                }
                
                // Una vez animado, dejar de observar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse
    const animatedElements = document.querySelectorAll('.pilar-card, .metodologia-card, .proyecto-detallado, .conferencista-card');
    animatedElements.forEach((el, index) => {
        el.dataset.delay = (index * 0.1) + 's';
        observer.observe(el);
    });
    
    // ==========================================================================
    // FORMULARIOS
    // ==========================================================================
    
    // Manejo de formularios de contacto
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Validación básica
            if (!validateForm(this)) {
                return;
            }
            
            // Simular envío (en producción, sería una llamada a una API)
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Simular retardo de red
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Mostrar mensaje de éxito
                showFormMessage(this, '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                this.reset();
                
            } catch (error) {
                showFormMessage(this, 'Error al enviar el mensaje. Por favor, intente nuevamente.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    });
    
    // Función de validación de formularios
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Crear mensaje de error si no existe
                if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Este campo es requerido';
                    errorMsg.style.color = 'var(--error-color)';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.marginTop = '0.25rem';
                    field.parentNode.insertBefore(errorMsg, field.nextSibling);
                }
            } else {
                field.classList.remove('error');
                
                // Remover mensaje de error si existe
                if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                    field.nextElementSibling.remove();
                }
            }
        });
        
        return isValid;
    }
    
    // Mostrar mensajes de formulario
    function showFormMessage(form, message, type) {
        // Remover mensajes anteriores
        const existingMessages = form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type === 'success' ? 'form-success' : 'form-error'}`;
        messageDiv.textContent = message;
        
        // Insertar antes del botón de submit
        const submitBtn = form.querySelector('button[type="submit"]');
        form.insertBefore(messageDiv, submitBtn);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // ==========================================================================
    // MAPA INTERACTIVO (Proyectos)
    // ==========================================================================
    
    const proyectoPuntos = document.querySelectorAll('.proyecto-punto');
    
    proyectoPuntos.forEach(punto => {
        punto.addEventListener('click', function() {
            const proyectoId = this.dataset.proyecto;
            const proyectoDetallado = document.getElementById(`proyecto${proyectoId}`);
            
            if (proyectoDetallado) {
                // Scroll suave al proyecto
                proyectoDetallado.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Efecto visual de resaltado
                proyectoDetallado.classList.add('highlight');
                setTimeout(() => {
                    proyectoDetallado.classList.remove('highlight');
                }, 2000);
            }
        });
    });
    
    // ==========================================================================
    // ACORDEÓN PARA FAQ
    // ==========================================================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        
        if (question) {
            question.style.cursor = 'pointer';
            
            question.addEventListener('click', () => {
                // Cerrar otros items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Alternar item actual
                item.classList.toggle('active');
            });
        }
    });
    
    // ==========================================================================
    // CONTADORES ANIMADOS
    // ==========================================================================
    
    const counters = document.querySelectorAll('.resultado-valor');
    
    function animateCounter(counter) {
        const target = parseInt(counter.textContent);
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                counter.textContent = target + (counter.textContent.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : '');
            }
        }, 16);
    }
    
    // Observador para contadores
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // ==========================================================================
    // GESTIÓN DE EVENTOS DEL CONGRESO
    // ==========================================================================
    
    // Contador regresivo para el congreso
    function initCountdown() {
        const countdownElement = document.querySelector('.countdown');
        
        if (!countdownElement) return;
        
        const targetDate = new Date('October 15, 2025 09:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = targetDate - now;
            
            if (timeLeft < 0) {
                countdownElement.innerHTML = '<div class="countdown-ended">¡El congreso ha comenzado!</div>';
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days}</span>
                    <span class="countdown-label">Días</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours}</span>
                    <span class="countdown-label">Horas</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">Minutos</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">Segundos</span>
                </div>
            `;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // ==========================================================================
    // GESTIÓN DE DESCARGA DE ARCHIVOS
    // ==========================================================================
    
    const downloadButtons = document.querySelectorAll('.btn-descarga, .btn-manual');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular descarga (en producción, sería un archivo real)
            const filename = this.textContent.includes('PDF') ? 'documento.pdf' : 'archivo.zip';
            
            // Mostrar notificación
            showNotification(`Descargando ${filename}...`, 'info');
            
            // Simular tiempo de descarga
            setTimeout(() => {
                showNotification('¡Descarga completada!', 'success');
            }, 1500);
        });
    });
    
    // ==========================================================================
    // SISTEMA DE NOTIFICACIONES
    // ==========================================================================
    
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Estilos para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: getNotificationColor(type),
            color: 'white',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease',
            maxWidth: '350px'
        });
        
        // Botón para cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        document.body.appendChild(notification);
        
        // Animaciones CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
        `;
        document.head.appendChild(style);
    }
    
    function getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    function getNotificationColor(type) {
        const colors = {
            'success': 'var(--success-color)',
            'error': 'var(--error-color)',
            'warning': 'var(--warning-color)',
            'info': 'var(--info-color)'
        };
        return colors[type] || 'var(--info-color)';
    }
    
    // ==========================================================================
    // FILTROS PARA PROYECTOS
    // ==========================================================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase activa de todos los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Agregar clase activa al botón clickeado
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                const proyectos = document.querySelectorAll('.proyecto-detallado');
                
                proyectos.forEach(proyecto => {
                    if (filter === 'all' || proyecto.dataset.category === filter) {
                        proyecto.style.display = 'block';
                        setTimeout(() => {
                            proyecto.style.opacity = '1';
                            proyecto.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        proyecto.style.opacity = '0';
                        proyecto.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            proyecto.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // ==========================================================================
    // FUNCIONALIDAD DE BÚSQUEDA
    // ==========================================================================
    
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Implementar búsqueda según la página
            if (window.location.pathname.includes('proyectos')) {
                filterProjects(searchTerm);
            } else if (window.location.pathname.includes('investigacion')) {
                filterMetodologias(searchTerm);
            }
        });
    }
    
    function filterProjects(searchTerm) {
        const proyectos = document.querySelectorAll('.proyecto-detallado');
        
        proyectos.forEach(proyecto => {
            const text = proyecto.textContent.toLowerCase();
            const title = proyecto.querySelector('h2').textContent.toLowerCase();
            
            if (text.includes(searchTerm) || title.includes(searchTerm)) {
                proyecto.style.display = 'block';
            } else {
                proyecto.style.display = 'none';
            }
        });
    }
    
    // ==========================================================================
    // INICIALIZACIÓN DE COMPONENTES
    // ==========================================================================
    
    // Inicializar cuando el DOM esté listo
    function init() {
        // Header scroll
        window.addEventListener('scroll', handleHeaderScroll);
        handleHeaderScroll(); // Ejecutar al cargar
        
        // Contador regresivo
        initCountdown();
        
        // Tooltips
        initTooltips();
        
        // Carga perezosa de imágenes
        initLazyLoading();
        
        // Ajustar altura de elementos
        adjustElementHeights();
        
        // Manejar eventos de teclado
        initKeyboardNavigation();
    }
    
    // ==========================================================================
    // FUNCIONALIDADES ADICIONALES
    // ==========================================================================
    
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('.tooltip');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.querySelector('.tooltip-text');
                if (tooltipText) {
                    tooltipText.style.visibility = 'visible';
                    tooltipText.style.opacity = '1';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltipText = this.querySelector('.tooltip-text');
                if (tooltipText) {
                    tooltipText.style.visibility = 'hidden';
                    tooltipText.style.opacity = '0';
                }
            });
        });
    }
    
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antiguos
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
    
    function adjustElementHeights() {
        // Ajustar altura de cards en la misma fila
        if (!isMobile) {
            const cardGroups = document.querySelectorAll('.pilares-grid, .metodologias-grid');
            
            cardGroups.forEach(group => {
                const cards = group.querySelectorAll('.card');
                let maxHeight = 0;
                
                // Reset heights
                cards.forEach(card => {
                    card.style.height = 'auto';
                });
                
                // Encontrar la altura máxima
                cards.forEach(card => {
                    maxHeight = Math.max(maxHeight, card.offsetHeight);
                });
                
                // Aplicar altura uniforme
                cards.forEach(card => {
                    card.style.height = `${maxHeight}px`;
                });
            });
        }
    }
    
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Esc para cerrar menú móvil
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = '';
            }
            
            // Navegación por teclado en formularios
            if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !e.target.type === 'submit') {
                e.preventDefault();
                const form = e.target.closest('form');
                const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
                const currentIndex = inputs.indexOf(e.target);
                
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus();
                }
            }
        });
    }
    
    // ==========================================================================
    // MANEJO DE EVENTOS DE REDIMENSIÓN
    // ==========================================================================
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            adjustElementHeights();
        }, 250);
    });
    
    // ==========================================================================
    // INICIALIZAR TODO
    // ==========================================================================
    
    init();
    
    // ==========================================================================
    // EXPORTAR FUNCIONALIDADES PARA USO GLOBAL (si es necesario)
    // ==========================================================================
    
    window.ALAMCTA = {
        showNotification,
        animateCounter,
        validateForm
    };
    
});

// Polyfill para navegadores antiguos
if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// Console greeting
console.log('%cALAMCTA Website v3.0', 'color: #1a5276; font-size: 18px; font-weight: bold;');
console.log('%cAsociación Latinoamericana de Mutagénesis, Carcinogénesis y Teratogénesis Ambiental', 'color: #7f8c8d;');
console.log('%cCiencia para un ambiente saludable desde 1980', 'color: #28b463; font-style: italic;');
// Control del video de fondo
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video');
    const videoContainer = document.querySelector('.hero-video-container');
    
    if (heroVideo) {
        // Intentar reproducir el video
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('✅ Video de ADN reproduciéndose');
            }).catch(error => {
                console.log('⚠️ Autoplay bloqueado, mostrando fallback');
                // Mostrar animación CSS como fallback
                const fallback = videoContainer.querySelector('.video-fallback');
                if (fallback) {
                    fallback.style.display = 'flex';
                }
            });
        }
        
        // Crear controles de video si no existen
        if (!document.querySelector('.video-controls')) {
            const controls = document.createElement('div');
            controls.className = 'video-controls';
            controls.innerHTML = `
                <button class="video-control-btn" id="mute-video" title="Silenciar/Activar sonido">
                    <i class="fas fa-volume-up"></i>
                </button>
                <button class="video-control-btn" id="pause-video" title="Pausar/Reanudar">
                    <i class="fas fa-pause"></i>
                </button>
            `;
            videoContainer.appendChild(controls);
            
            // Control de mute
            document.getElementById('mute-video').addEventListener('click', function() {
                heroVideo.muted = !heroVideo.muted;
                this.innerHTML = heroVideo.muted 
                    ? '<i class="fas fa-volume-mute"></i>' 
                    : '<i class="fas fa-volume-up"></i>';
            });
            
            // Control de pausa
            document.getElementById('pause-video').addEventListener('click', function() {
                if (heroVideo.paused) {
                    heroVideo.play();
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    heroVideo.pause();
                    this.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }
    }
    
    // Detectar si el video está disponible
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', function() {
            console.log('✅ Video de ADN cargado correctamente');
        });
        
        heroVideo.addEventListener('error', function() {
            console.log('❌ Error al cargar el video de ADN');
            // Mostrar fallback
            const fallback = videoContainer.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'flex';
            }
        });
    }
});