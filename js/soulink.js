// ============================================
// SOULINK - JavaScript Unificado
// Archivo único con todas las funcionalidades
// ============================================

'use strict';

// Configuración global
const SoulinkConfig = {
    appName: 'SOULINK',
    version: '1.0.0',
    storagePrefix: 'soulink_',
    debug: true
};

// ===== 1. UTILIDADES BÁSICAS =====
const SoulinkUtils = {
    log: function(message, data = null) {
        if (SoulinkConfig.debug) {
            console.log(`[${SoulinkConfig.appName}] ${message}`, data || '');
        }
    },
    
    // Guardar en localStorage
    save: function(key, data) {
        try {
            const storageKey = SoulinkConfig.storagePrefix + key;
            localStorage.setItem(storageKey, JSON.stringify(data));
            return true;
        } catch (e) {
            this.log('Error guardando datos:', e);
            return false;
        }
    },
    
    // Cargar de localStorage
    load: function(key) {
        try {
            const storageKey = SoulinkConfig.storagePrefix + key;
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            this.log('Error cargando datos:', e);
            return null;
        }
    },
    
    // Mostrar notificación
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} soulink-notification`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
            animation: soulinkFadeIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        const icons = {
            success: 'fa-check-circle',
            danger: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <button type="button" class="close" onclick="this.parentElement.remove()">
                <span>&times;</span>
            </button>
            <i class="fas ${icons[type] || 'fa-info-circle'} mr-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Remover automáticamente después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'soulinkFadeOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Agregar animaciones CSS si no existen
        if (!document.querySelector('#soulink-styles')) {
            const style = document.createElement('style');
            style.id = 'soulink-styles';
            style.textContent = `
                @keyframes soulinkFadeIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes soulinkFadeOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(100%); }
                }
                .soulink-notification {
                    font-size: 14px;
                    padding: 12px 15px;
                    border-radius: 8px;
                    border-left: 4px solid;
                }
                .soulink-notification.alert-success { border-left-color: #28a745; }
                .soulink-notification.alert-danger { border-left-color: #dc3545; }
                .soulink-notification.alert-warning { border-left-color: #ffc107; }
                .soulink-notification.alert-info { border-left-color: #17a2b8; }
            `;
            document.head.appendChild(style);
        }
    }
};

// ===== 2. FUNCIONALIDADES GLOBALES =====
const SoulinkCore = {
    init: function() {
        SoulinkUtils.log('Inicializando aplicación');
        
        // Contador de visitas
        this.trackVisits();
        
        // Botón "volver arriba"
        this.createBackToTop();
        
        // Mejorar navegación
        this.enhanceNavigation();
        
        // Mejorar formularios
        this.enhanceForms();
        
        // Actualizar estado de login
        this.updateLoginStatus();
        
        // Efectos en tarjetas
        this.enhanceCards();
        
        // Inicializar componentes específicos por página
        this.initPageSpecificFeatures();
    },
    
    trackVisits: function() {
        let visits = this.load('visits') || 0;
        visits++;
        this.save('visits', visits);
        
        // Mostrar en footer si existe
        const visitElement = document.getElementById('visitCounter');
        if (visitElement) {
            visitElement.textContent = `Visitas: ${visits}`;
        }
        
        SoulinkUtils.log(`Visita número: ${visits}`);
    },
    
    createBackToTop: function() {
        const btn = document.createElement('button');
        btn.id = 'soulink-back-to-top';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        btn.title = 'Volver arriba';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-color, #8C52FF);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(btn);
        
        // Mostrar/ocultar al hacer scroll
        window.addEventListener('scroll', () => {
            btn.style.opacity = window.scrollY > 300 ? '1' : '0';
            btn.style.transform = window.scrollY > 300 ? 'scale(1)' : 'scale(0.8)';
        });
        
        // Click para volver arriba
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },
    
    enhanceNavigation: function() {
        // Navegación suave para anclas
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        window.scrollTo({
                            top: target.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Mejorar dropdowns
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('mouseenter', function() {
                if (window.innerWidth > 992) {
                    this.click();
                }
            });
        });
    },
    
    enhanceForms: function() {
        // Validación básica para todos los formularios
        document.querySelectorAll('form').forEach(form => {
            // Agregar clases a los inputs requeridos
            form.querySelectorAll('[required]').forEach(input => {
                input.addEventListener('invalid', function() {
                    this.classList.add('is-invalid');
                });
                
                input.addEventListener('input', function() {
                    if (this.checkValidity()) {
                        this.classList.remove('is-invalid');
                    }
                });
            });
            
            // Mejorar experiencia de usuario
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    
                    // Simular envío
                    setTimeout(() => {
                        SoulinkUtils.showNotification('Formulario enviado correctamente', 'success');
                        if (!form.hasAttribute('data-no-reset')) {
                            form.reset();
                        }
                        if (submitBtn) {
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                        }
                    }, 1500);
                    
                    // Feedback visual
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                    submitBtn.disabled = true;
                }
            });
        });
    },
    
    updateLoginStatus: function() {
        const isLoggedIn = this.load('user_logged_in') === true;
        
        // Actualizar menú de usuario
        const loggedOutMenu = document.getElementById('loggedOutMenu');
        const loggedInMenu = document.getElementById('loggedInMenu');
        const userMenuText = document.getElementById('userMenuText');
        
        if (loggedOutMenu && loggedInMenu && userMenuText) {
            if (isLoggedIn) {
                loggedOutMenu.style.display = 'none';
                loggedInMenu.style.display = 'block';
                userMenuText.textContent = 'Mi Cuenta';
            } else {
                loggedOutMenu.style.display = 'block';
                loggedInMenu.style.display = 'none';
                userMenuText.textContent = 'Iniciar Sesión';
            }
        }
        
        // Configurar botón de logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.save('user_logged_in', false);
            SoulinkUtils.showNotification('Sesión cerrada correctamente', 'success');
            setTimeout(() => location.reload(), 1000);
        });
    },
    
    enhanceCards: function() {
        // Efecto hover en tarjetas
        document.querySelectorAll('.service-card, .team-card, .test-card, .resource-card, .card').forEach(card => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
    },
    
    initPageSpecificFeatures: function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        SoulinkUtils.log(`Página actual: ${currentPage}`);
        
        // Inicializar funcionalidades por página
        switch(currentPage) {
            case 'index.html':
                this.initHomePage();
                break;
            case 'servicios.html':
                this.initServicesPage();
                break;
            case 'contacto.html':
                this.initContactPage();
                break;
            case 'login.html':
                this.initLoginPage();
                break;
            case 'comunidad.html':
                this.initCommunityPage();
                break;
            case 'colaboraciones.html':
                this.initCollaborationsPage();
                break;
            case 'acerca.html':
                this.initAboutPage();
                break;
            case 'admin.html':
                this.initAdminPage();
                break;
        }
    },
    
    // Funciones específicas por página
    initHomePage: function() {
        SoulinkUtils.log('Inicializando página de inicio');
        
        // Configurar carrusel de testimonios
        const testimonialCarousel = document.getElementById('testimonialCarousel');
        if (testimonialCarousel) {
            // Auto-avance cada 5 segundos
            setInterval(() => {
                $('#testimonialCarousel').carousel('next');
            }, 5000);
        }
    },
    
    initServicesPage: function() {
        SoulinkUtils.log('Inicializando página de servicios');
        
        // Foro comunitario
        this.initForum();
        
        // Tests autoevaluativos
        this.initTests();
        
        // Mapa de centros
        this.initMap();
        
        // Navegación interna
        this.initServicesNavigation();
    },
    
    initContactPage: function() {
        SoulinkUtils.log('Inicializando página de contacto');
        
        // Chat de primer contacto
        this.initChat();
        
        // Validación específica del formulario de contacto
        this.initContactForm();
    },
    
    initLoginPage: function() {
        SoulinkUtils.log('Inicializando página de login');
        
        // Toggle visibilidad de contraseña
        this.initPasswordToggles();
        
        // Manejo de formularios de autenticación
        this.initAuthForms();
    },
    
    initCommunityPage: function() {
        SoulinkUtils.log('Inicializando página de comunidad');
        
        // Testimonios interactivos
        this.initTestimonials();
        
        // Filtro de artículos
        this.initArticleFilter();
        
        // Calendario de eventos
        this.initEvents();
    },
    
    initCollaborationsPage: function() {
        SoulinkUtils.log('Inicializando página de colaboraciones');
        
        // Donaciones
        this.initDonations();
        
        // Formulario de voluntariado
        this.initVolunteerForm();
    },
    
    initAboutPage: function() {
        SoulinkUtils.log('Inicializando página "Acerca de"');
        
        // Animación de equipo
        this.initTeamAnimation();
    },
    
    initAdminPage: function() {
        SoulinkUtils.log('Inicializando panel de administración');
        
        // Verificar autenticación
        this.checkAdminAuth();
        
        // Estadísticas
        this.initAdminStats();
    },
    
    // Más funciones específicas...
    initForum: function() {
        const forumContainer = document.getElementById('forumPostsContainer');
        if (!forumContainer) return;
        
        // Posts de ejemplo
        const samplePosts = [
            {
                id: 1,
                title: "Mi experiencia con la ansiedad",
                content: "Llevo 3 meses practicando técnicas de respiración y he notado gran mejora. Comparto mi rutina diaria...",
                category: "ansiedad",
                author: "Ana M.",
                date: "2024-03-15",
                likes: 12,
                comments: 5
            }
        ];
        
        // Cargar posts
        const posts = this.load('forum_posts') || samplePosts;
        
        forumContainer.innerHTML = posts.map(post => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${post.title}</h5>
                        <span class="badge badge-primary">${post.category}</span>
                    </div>
                    <p class="card-text">${post.content}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Por ${post.author} • ${post.date}</small>
                        <div>
                            <button class="btn btn-sm btn-outline-primary like-post" data-id="${post.id}">
                                <i class="far fa-heart"></i> <span class="like-count">${post.likes}</span>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary ml-2">
                                <i class="far fa-comment"></i> ${post.comments}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Funcionalidad de "me gusta"
        document.querySelectorAll('.like-post').forEach(btn => {
            btn.addEventListener('click', function() {
                const countElement = this.querySelector('.like-count');
                let count = parseInt(countElement.textContent);
                count++;
                countElement.textContent = count;
                
                this.classList.add('active');
                this.innerHTML = `<i class="fas fa-heart"></i> <span class="like-count">${count}</span>`;
                
                SoulinkUtils.showNotification('¡Gracias por tu apoyo!', 'success');
            });
        });
    },
    
    initTests: function() {
        // Test de ansiedad (GAD-7 simplificado)
        const anxietyTestBtn = document.querySelector('[data-target="#anxietyTestModal"]');
        if (anxietyTestBtn) {
            anxietyTestBtn.addEventListener('click', () => {
                SoulinkUtils.showNotification('Test de ansiedad - Cargando preguntas', 'info');
            });
        }
        
        // Diario de gratitud
        const gratitudeBtn = document.getElementById('startGratitudeJournal');
        if (gratitudeBtn) {
            gratitudeBtn.addEventListener('click', () => {
                const entry = prompt('Escribe 3 cosas por las que estás agradecido hoy:');
                if (entry && entry.trim()) {
                    let journal = this.load('gratitude_journal') || [];
                    journal.push({
                        date: new Date().toLocaleDateString(),
                        entry: entry.trim()
                    });
                    this.save('gratitude_journal', journal);
                    SoulinkUtils.showNotification('¡Entrada guardada en tu diario!', 'success');
                }
            });
        }
    },
    
    initChat: function() {
        const openChatBtn = document.getElementById('openChat');
        if (!openChatBtn) return;
        
        openChatBtn.addEventListener('click', function() {
            const chatContainer = document.getElementById('chatContainer');
            if (chatContainer) {
                chatContainer.style.display = 'block';
                this.style.display = 'none';
                
                // Mensaje automático del bot
                setTimeout(() => {
                    const chatMessages = document.getElementById('chatMessages');
                    if (chatMessages) {
                        const botMessage = document.createElement('div');
                        botMessage.className = 'message bot';
                        botMessage.innerHTML = '<p>Hola, soy Soulie. Estoy aquí para escucharte. ¿En qué puedo ayudarte hoy?</p>';
                        chatMessages.appendChild(botMessage);
                    }
                }, 500);
            }
        });
        
        // Enviar mensaje
        const sendMessageBtn = document.getElementById('sendMessage');
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => {
                const chatInput = document.getElementById('chatInput');
                const chatMessages = document.getElementById('chatMessages');
                
                if (chatInput && chatInput.value.trim() && chatMessages) {
                    // Agregar mensaje del usuario
                    const userMsg = document.createElement('div');
                    userMsg.className = 'message user';
                    userMsg.innerHTML = `<p>${chatInput.value}</p>`;
                    chatMessages.appendChild(userMsg);
                    
                    // Limpiar input
                    const userText = chatInput.value;
                    chatInput.value = '';
                    
                    // Respuesta automática del bot
                    setTimeout(() => {
                        const responses = [
                            "Entiendo cómo te sientes. ¿Puedes contarme más sobre eso?",
                            "Eso suena difícil. Recuerda que no estás solo/a en esto.",
                            "Gracias por compartir eso conmigo. ¿Hay algo específico en lo que pueda ayudarte?",
                            "Es normal sentirse así en situaciones difíciles. ¿Has probado las técnicas de respiración?",
                            "Me preocupo por ti. Si necesitas ayuda inmediata, contacta los números de emergencia."
                        ];
                        
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        
                        const botMsg = document.createElement('div');
                        botMsg.className = 'message bot';
                        botMsg.innerHTML = `<p>${randomResponse}</p>`;
                        chatMessages.appendChild(botMsg);
                        
                        // Hacer scroll al final
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1000);
                }
            });
        }
    },
    
    initPasswordToggles: function() {
        document.querySelectorAll('.input-group-append button').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.closest('.input-group').querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    },
    
    initAuthForms: function() {
        // Formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail')?.value;
                const password = document.getElementById('loginPassword')?.value;
                
                if (email && password && password.length >= 6) {
                    // Simular login exitoso
                    this.save('user_logged_in', true);
                    this.save('user_email', email);
                    
                    SoulinkUtils.showNotification('¡Inicio de sesión exitoso!', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    SoulinkUtils.showNotification('Credenciales incorrectas', 'danger');
                }
            });
        }
        
        // Formulario de registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const password = document.getElementById('regPassword')?.value;
                const confirmPassword = document.getElementById('regConfirmPassword')?.value;
                
                if (password !== confirmPassword) {
                    SoulinkUtils.showNotification('Las contraseñas no coinciden', 'danger');
                    return;
                }
                
                if (password.length < 8) {
                    SoulinkUtils.showNotification('La contraseña debe tener al menos 8 caracteres', 'danger');
                    return;
                }
                
                // Simular registro exitoso
                this.save('user_logged_in', true);
                SoulinkUtils.showNotification('¡Cuenta creada exitosamente!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            });
        }
    },
    
    // Funciones de ayuda (alias para SoulinkUtils)
    save: function(key, data) {
        return SoulinkUtils.save(key, data);
    },
    
    load: function(key) {
        return SoulinkUtils.load(key);
    }
};

// ===== 3. INICIALIZACIÓN =====
// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    SoulinkCore.init();
    
    // También inicializar cuando se cargue completamente la página
    window.addEventListener('load', function() {
        SoulinkUtils.log('Página completamente cargada');
    });
});

// Hacer funciones disponibles globalmente (para la consola)
window.Soulink = {
    utils: SoulinkUtils,
    core: SoulinkCore,
    config: SoulinkConfig
};

SoulinkUtils.log('Módulo SOULINK cargado correctamente');
