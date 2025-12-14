// darkmode.js - Versión corregida sin forzar color en íconos

(function() {
    'use strict';

    console.log('🎯 Modo oscuro - Solo lo necesario');

    const style = document.createElement('style');
    style.id = 'darkmode-especifico';
    style.textContent = `
        body.dark-mode {
            background-color: #2a2a2a !important;
        }

        body.dark-mode p,
        body.dark-mode h1, body.dark-mode h2, body.dark-mode h3,
        body.dark-mode h4, body.dark-mode h5, body.dark-mode h6,
        body.dark-mode li,
        body.dark-mode td, body.dark-mode th,
        body.dark-mode label,
        body.dark-mode .text-content {
            color: #dddddd !important;
        }

        body.dark-mode span[role="img"],
        body.dark-mode .emoji,
        body.dark-mode [class*="emoji"],
        body.dark-mode [aria-label*="emoji"],
        body.dark-mode .symbol,
        body.dark-mode .checkmark {
            color: inherit !important;
            background-color: inherit !important;
        }

        body.dark-mode img {
            filter: brightness(1) !important;
        }

        body.dark-mode a:not(nav a):not(.navbar a):not([class*="navbar"] a):not([role="navigation"] a) {
            color: #4dabf7 !important;
            text-decoration: underline !important;
        }

        body.dark-mode nav a,
        body.dark-mode .navbar a,
        body.dark-mode [class*="navbar"] a,
        body.dark-mode [role="navigation"] a,
        body.dark-mode header a:not([class*="card"]) {
            color: #dddddd !important;
            text-decoration: none !important;
        }

        body.dark-mode .bg-white,
        body.dark-mode .bg-light,
        body.dark-mode .card,
        body.dark-mode [class*="card"] {
            background-color: #3a3a3a !important;
            border: 1px solid #4a4a4a !important;
        }

        #darkModeToggle {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 99999;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #0d6efd;
            color: white !important;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #darkModeToggle:hover {
            background: #0b5ed7;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    function protegerEmojisYSímbolos() {
        console.log('🔵 Protegiendo emojis y símbolos...');
        const emojisEspeciales = ['👁️', '💙', '❤️', '✔', '✓', '✅'];
        const todosElementos = document.querySelectorAll('*');
        todosElementos.forEach(elemento => {
            const texto = elemento.textContent || '';
            const tieneEmojiEspecial = emojisEspeciales.some(emoji => texto.includes(emoji));
            const esSimboloCorto = texto.trim().length <= 3;
            const esSimboloLista = texto.trim() === '✔' || texto.trim() === '✓';
            if ((tieneEmojiEspecial || esSimboloCorto || esSimboloLista) && 
                elemento.style.color === 'rgb(221, 221, 221)') {
                elemento.style.color = '';
                elemento.classList.add('emoji-protegido');
                if (elemento.closest('[class*="valores"], [class*="values"]')) {
                    elemento.style.color = '#28a745';
                }
            }
        });

        const imagenes = document.querySelectorAll('img');
        imagenes.forEach(img => {
            img.style.filter = 'brightness(1)';
            if (img.alt?.toLowerCase().includes('ayuda') || 
                img.alt?.toLowerCase().includes('conejo') ||
                img.src?.toLowerCase().includes('rabbit') ||
                img.closest('.btn, button')) {
                img.style.filter = 'brightness(1) contrast(1)';
                img.classList.add('imagen-protegida');
            }
        });

        const botones = document.querySelectorAll('.btn, button, [role="button"]');
        botones.forEach(boton => {
            const elementosInternos = boton.querySelectorAll('*');
            elementosInternos.forEach(el => {
                if (el.style.color === 'rgb(221, 221, 221)') {
                    el.style.color = '';
                }
            });

            const imgEnBoton = boton.querySelector('img');
            if (imgEnBoton) {
                imgEnBoton.style.filter = 'brightness(1)';
            }
        });

        const btnEmergencia = document.querySelector('.btn-emergency');
        if (btnEmergencia) {
            btnEmergencia.style.background = 'linear-gradient(135deg, #ff4b2b, #ff416c)';
            btnEmergencia.style.color = 'white';
            btnEmergencia.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }

        console.log('✅ Emojis, símbolos e imágenes protegidos');
    }

    function limpiarSubrayadosNavbar() {
        const enlacesNavbar = document.querySelectorAll(`
            body.dark-mode nav a,
            body.dark-mode .navbar a,
            body.dark-mode [class*="navbar"] a,
            body.dark-mode header a,
            body.dark-mode [role="navigation"] a
        `);
        enlacesNavbar.forEach(enlace => {
            if (enlace.style.textDecoration === 'underline') {
                enlace.style.textDecoration = 'none';
            }
            enlace.style.color = '#dddddd';
        });
    }

    function crearBoton() {
        if (document.getElementById('darkModeToggle')) return;
        const btn = document.createElement('button');
        btn.id = 'darkModeToggle';
        btn.innerHTML = '🌙';
        btn.title = 'Modo oscuro';
        document.body.appendChild(btn);
        return btn;
    }

    function restaurarEstilosOriginales() {
        console.log('♻️ Restaurando estilos originales tras desactivar modo oscuro');
        document.querySelectorAll('*').forEach(el => {
            if (el.style.color === 'rgb(221, 221, 221)' || el.style.color === '#dddddd') {
                el.style.color = '';
            }
            if (el.style.textDecoration === 'underline') {
                el.style.textDecoration = '';
            }
        });
        document.querySelectorAll('img').forEach(img => {
            img.style.filter = '';
        });
        const btnEmergencia = document.querySelector('.btn-emergency');
        if (btnEmergencia) {
            btnEmergencia.style.background = '';
            btnEmergencia.style.color = '';
            btnEmergencia.style.boxShadow = '';
        }
    }

    function alternarModoOscuro() {
        const esOscuro = !document.body.classList.contains('dark-mode');
        if (esOscuro) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').innerHTML = '☀️';
            localStorage.setItem('soulink-theme', 'dark');

            requestAnimationFrame(() => {
                const btnEmergencia = document.querySelector('.btn-emergency');
                if (btnEmergencia) {
                    btnEmergencia.style.background = 'linear-gradient(135deg, #ff4b2b, #ff416c)';
                    btnEmergencia.style.color = 'white';
                    btnEmergencia.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                }
            });

            setTimeout(() => {
                limpiarSubrayadosNavbar();
                protegerEmojisYSímbolos();
            }, 100);
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('darkModeToggle').innerHTML = '🌙';
            localStorage.setItem('soulink-theme', 'light');
            restaurarEstilosOriginales();
        }
    }

    function iniciar() {
        const btn = crearBoton();
        btn.addEventListener('click', alternarModoOscuro);
        const tema = localStorage.getItem('soulink-theme');
        if (tema === 'dark') {
            document.body.classList.add('dark-mode');
            btn.innerHTML = '☀️';
            setTimeout(() => {
                limpiarSubrayadosNavbar();
                protegerEmojisYSímbolos();
            }, 300);
        }
        console.log('✅ Modo oscuro - Emojis e imágenes protegidos');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();