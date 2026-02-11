/**
 * ALAMCTA - LazyLoad Avanzado
 * Carga perezosa de imágenes y componentes
 */

class AdvancedLazyLoad {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px 0px',
            threshold: 0.01,
            ...options
        };
        
        this.observer = null;
        this.elements = new Set();
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.options
            );
            
            this.observeElements();
        } else {
            this.loadAllImmediately();
        }
    }
    
    observeElements() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        lazyElements.forEach(element => {
            this.elements.add(element);
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                this.loadElement(element);
                this.unobserveElement(element);
            }
        });
    }
    
    loadElement(element) {
        const lazyType = element.dataset.lazy;
        
        switch(lazyType) {
            case 'image':
                this.loadImage(element);
                break;
            case 'background':
                this.loadBackground(element);
                break;
            case 'video':
                this.loadVideo(element);
                break;
            case 'iframe':
                this.loadIframe(element);
                break;
            default:
                this.loadGeneric(element);
        }
        
        element.classList.add('lazy-loaded');
    }
    
    loadImage(element) {
        const src = element.dataset.src;
        const srcset = element.dataset.srcset;
        const sizes = element.dataset.sizes;
        
        if (src) element.src = src;
        if (srcset) element.srcset = srcset;
        if (sizes) element.sizes = sizes;
        
        element.onload = () => {
            element.classList.add('loaded');
        };
    }
    
    loadBackground(element) {
        const bgImage = element.dataset.bg;
        if (bgImage) {
            element.style.backgroundImage = `url('${bgImage}')`;
        }
    }
    
    loadVideo(element) {
        const sources = element.querySelectorAll('source[data-src]');
        
        sources.forEach(source => {
            source.src = source.dataset.src;
        });
        
        element.load();
    }
    
    loadIframe(element) {
        element.src = element.dataset.src;
    }
    
    loadGeneric(element) {
        // Cargar contenido desde data-content
        if (element.dataset.content) {
            element.innerHTML = element.dataset.content;
        }
    }
    
    unobserveElement(element) {
        if (this.observer) {
            this.observer.unobserve(element);
            this.elements.delete(element);
        }
    }
    
    loadAllImmediately() {
        this.elements.forEach(element => {
            this.loadElement(element);
        });
        this.elements.clear();
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.elements.clear();
    }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.alamctaLazyLoad = new AdvancedLazyLoad();
});

// Exportar para uso modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedLazyLoad;
}