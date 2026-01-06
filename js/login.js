    document.addEventListener('DOMContentLoaded', async function() {
        console.log("🚀 TASK 10: Formulario de login con autenticación real");
        
        // Verificar si ya hay sesión activa para actualizar el menú
        verificarSesionEnNavbar();
        
        // 1. Inicializar usuarios
        await inicializarUsuarios();
        
        // 2. Configurar toggles
        setupPasswordToggles();
        
        // 3. Inicializar validaciones
        initLoginValidation();
        initRegisterValidation();
        initRecoverValidation();
        initTabHandling();
        
        // 4. Mostrar credenciales en consola
        mostrarCredencialesPrueba();
    });

    // ==================== VERIFICAR SESIÓN EN NAVBAR ====================
    function verificarSesionEnNavbar() {
        const userMenuContainer = document.getElementById('userMenuContainer');
        const userMenuText = document.getElementById('userMenuText');
        const userDropdown = userMenuContainer ? userMenuContainer.querySelector('.dropdown-menu') : null;
        
        if (!userMenuContainer || !userMenuText) return;
        
        // Verificar si hay sesión activa
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
        
        if (usuarioActual) {
            console.log("✅ Sesión detectada en navbar:", usuarioActual.nombre_completo);
            
            // Actualizar texto del menú
            const primerNombre = usuarioActual.nombre_completo.split(' ')[0];
            userMenuText.innerHTML = `
                <i class="fas fa-user-circle mr-1"></i>
                ${primerNombre}
            `;
            
            
            // Agregar clases de estilo
            userMenuContainer.classList.add('user-logged-in');
            userMenuText.classList.add('text-primary', 'font-weight-bold');
        }
    }

    // ==================== INICIALIZAR USUARIOS ====================
    async function inicializarUsuarios() {
        try {
            // Intentar cargar desde data/usuarios.json
            const response = await fetch('../data/usuarios.json');
            if (!response.ok) throw new Error('Archivo no encontrado');
            
            const usuarios = await response.json();
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            console.log("✅ Usuarios cargados desde data/usuarios.json");
            return usuarios;
        } catch (error) {
            console.log("⚠️ No se pudo cargar usuarios.json, usando datos por defecto");
            
            // Crear usuarios por defecto
            const usuariosDefault = [
                {
                    id: 1,
                    nombre_completo: "Ana García López",
                    email: "ana@ejemplo.com",
                    telefono: "+34 612 345 678",
                    contrasena_codificada: "UGFzc3dvcmQxMjM=", // Password123
                    fecha_registro: "2025-01-15",
                    rol: "usuario"
                },
                {
                    id: 2,
                    nombre_completo: "Carlos Martínez",
                    email: "carlos@ejemplo.com",
                    telefono: "+34 600 111 222",
                    contrasena_codificada: "VGVzdDEyMzQ=", // Test1234
                    fecha_registro: "2025-01-10",
                    rol: "usuario"
                }
            ];
            
            localStorage.setItem('usuarios', JSON.stringify(usuariosDefault));
            return usuariosDefault;
        }
    }

    function mostrarCredencialesPrueba() {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        console.log("🔑 Credenciales de prueba (Task 10):");
        usuarios.forEach(user => {
            console.log(`📧 ${user.email} | 🔐 ${atob(user.contrasena_codificada)}`);
        });
    }

    // ==================== CONFIGURACIÓN DE TOGGLE PASSWORD ====================
    function setupPasswordToggles() {
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('loginPassword');
                togglePasswordVisibility(passwordInput, this);
            });
        }
        
        const toggleRegPassword = document.getElementById('toggleRegPassword');
        if (toggleRegPassword) {
            toggleRegPassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('regPassword');
                togglePasswordVisibility(passwordInput, this);
            });
        }
    }

    function togglePasswordVisibility(input, button) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        const icon = button.querySelector('i');
        icon.className = type === 'text' ? 'fas fa-eye-slash' : 'fas fa-eye';
    }

    // ==================== VALIDACIÓN COMÚN ====================
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        input.classList.remove('is-invalid');
        
        if (message) {
            input.classList.add('is-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message invalid-feedback d-block';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
    }

    function validateName(input) {
        const value = input.value.trim();
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s-]+$/;
        
        if (!value) {
            showError(input, 'Este campo es requerido');
            return false;
        }
        
        if (value.length < 2) {
            showError(input, 'Mínimo 2 caracteres');
            return false;
        }
        
        if (!regex.test(value)) {
            showError(input, 'Solo letras, espacios y guiones');
            return false;
        }
        
        showError(input, '');
        return true;
    }

    function validatePhone(input) {
        const phone = input.value.trim();
        
        if (!phone) {
            showError(input, 'El teléfono es requerido');
            return false;
        }
        
        const phoneRegex = /^[+]?[\d\s\-()]{8,20}$/;
        
        if (!phoneRegex.test(phone)) {
            showError(input, 'Formato inválido. Ej: +34 612 345 678');
            return false;
        }
        
        const digitCount = phone.replace(/\D/g, '').length;
        if (digitCount < 8) {
            showError(input, 'Mínimo 8 dígitos');
            return false;
        }
        
        showError(input, '');
        return true;
    }

    function validateEmail(input) {
        const email = input.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError(input, 'El email es requerido');
            return false;
        }
        
        if (!regex.test(email)) {
            showError(input, 'Email inválido (ejemplo@dominio.com)');
            return false;
        }
        
        showError(input, '');
        return true;
    }

    function validatePassword(input) {
        const password = input.value;
        
        if (!password) {
            showError(input, 'La contraseña es requerida');
            return false;
        }
        
        if (password.length < 8) {
            showError(input, 'Mínimo 8 caracteres');
            return false;
        }
        
        showError(input, '');
        return true;
    }

    function validateConfirmPassword(passInput, confirmInput) {
        const password = passInput.value;
        const confirm = confirmInput.value;
        
        if (!confirm) {
            showError(confirmInput, 'Confirma tu contraseña');
            return false;
        }
        
        if (password !== confirm) {
            showError(confirmInput, 'Las contraseñas no coinciden');
            return false;
        }
        
        showError(confirmInput, '');
        return true;
    }

    function validateBirthDate(input) {
        const dateValue = input.value;
        if (!dateValue) {
            showError(input, '');
            return true;
        }
        
        const birthDate = new Date(dateValue);
        const today = new Date();
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 13);
        
        if (birthDate > today) {
            showError(input, 'Fecha no puede ser futura');
            return false;
        }
        
        if (birthDate > minAgeDate) {
            showError(input, 'Debes tener al menos 13 años');
            return false;
        }
        
        showError(input, '');
        return true;
    }

    // ==================== VALIDACIÓN LOGIN - TASK 10 ====================
    function initLoginValidation() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        
        if (loginEmail) {
            loginEmail.addEventListener('blur', () => validateEmail(loginEmail));
            loginEmail.addEventListener('input', () => {
                if (loginEmail.classList.contains('is-invalid')) validateEmail(loginEmail);
            });
        }
        
        if (loginPassword) {
            loginPassword.addEventListener('blur', () => validatePassword(loginPassword));
            loginPassword.addEventListener('input', () => {
                if (loginPassword.classList.contains('is-invalid')) validatePassword(loginPassword);
            });
        }
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formato básico
            if (!validateEmail(loginEmail) || !validatePassword(loginPassword)) {
                return;
            }
            
            const email = loginEmail.value.trim();
            const password = loginPassword.value;
            
            // ========== TASK 10: AUTENTICACIÓN REAL ==========
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            
            // Buscar usuario
            const usuarioEncontrado = usuarios.find(user => 
                user.email.toLowerCase() === email.toLowerCase()
            );
            
            if (!usuarioEncontrado) {
                mostrarErrorLogin("❌ Usuario no encontrado. Verifica tu email.");
                return;
            }
            
            // Verificar contraseña CODIFICADA (Base64)
            const contrasenaDecodificada = atob(usuarioEncontrado.contrasena_codificada);
            
            if (password !== contrasenaDecodificada) {
                mostrarErrorLogin("❌ Contraseña incorrecta. Intenta nuevamente.");
                return;
            }
            
            // ✅ LOGIN EXITOSO
            console.log("✅ TASK 10: Login exitoso - Usuario:", usuarioEncontrado.nombre_completo);
            
            // Guardar sesión CORRECTAMENTE
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
            localStorage.setItem('sesionActiva', 'true');
            
            // Mostrar éxito y redirigir
            mostrarExitoLogin(usuarioEncontrado.nombre_completo);
            
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 3000);
        });
    }

    function mostrarErrorLogin(mensaje) {
        const erroresPrevios = document.querySelectorAll('.error-login-task10');
        erroresPrevios.forEach(error => error.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger error-login-task10 mt-3 login-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensaje}`;
        
        const loginForm = document.getElementById('loginForm');
        loginForm.appendChild(errorDiv);
    }

    // ==================== FUNCIÓN CORREGIDA PARA GUARDAR SESIÓN ====================
    function mostrarExitoLogin(nombreUsuario) {
        const loginForm = document.getElementById('loginForm');
        const cardBody = loginForm.closest('.card-body');
        
        // Reemplazar TODO el contenido del card-body manteniendo altura
        cardBody.innerHTML = `
            <div class="login-success-container">
                <div class="text-center p-5">
                    <div class="mb-4">
                        <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                    </div>
                    <h3 class="mb-3">¡Bienvenido/a, ${nombreUsuario}!</h3>
                    <p class="mb-4 text-muted">Sesión iniciada correctamente en SOULINK</p>
                    
                    <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
                        <span class="sr-only">Cargando...</span>
                    </div>
                    <p class="mb-4"><strong>Redirigiendo al inicio...</strong></p>
                    
                    <div class="mt-4">
                        <a href="../index.html" class="btn btn-primary btn-lg">
                            <i class="fas fa-home"></i> Ir al inicio ahora
                        </a>
                    </div>
                    
                    <div class="mt-5 text-muted small">
                        <p>Si no eres redirigido automáticamente en 3 segundos,<br>haz click en "Ir al inicio ahora"</p>
                    </div>
                </div>
            </div>
        `;
        
        // ✅ GUARDAR SESIÓN CORRECTAMENTE
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioEncontrado = usuarios.find(user => 
            user.nombre_completo === nombreUsuario
        );
        
        if (usuarioEncontrado) {
            // Guardar usuario completo en localStorage
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
            
            // Guardar bandera simple de sesión activa
            localStorage.setItem('sesionActiva', 'true');
            
            console.log("✅ Sesión guardada correctamente:", usuarioEncontrado.nombre_completo);
        }
    }

    // ==================== FUNCIÓN PARA CERRAR SESIÓN ====================
    function cerrarSesion() {
        // Limpiar datos de sesión
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('usuarioActual');
        
        // Mostrar mensaje de confirmación
        alert('✅ Sesión cerrada correctamente');
        
        // Recargar la página para actualizar el menú
        setTimeout(() => {
            window.location.href = "login.html";
        }, 500);
        
        return false; // Prevenir comportamiento por defecto
    }

    // ==================== VALIDACIÓN REGISTRO - TASK 9 ====================
    function initRegisterValidation() {
        const registerForm = document.getElementById('registerForm');
        if (!registerForm) return;
        
        const regNombre = document.getElementById('regNombre');
        const regApellido = document.getElementById('regApellido');
        const regTelefono = document.getElementById('regTelefono');
        const regEmail = document.getElementById('regEmail');
        const regPassword = document.getElementById('regPassword');
        const regConfirmPassword = document.getElementById('regConfirmPassword');
        const regFechaNacimiento = document.getElementById('regFechaNacimiento');
        const acceptTerms = document.getElementById('acceptTerms');
        
        setupRealTimeValidation(regNombre, validateName);
        setupRealTimeValidation(regApellido, validateName);
        setupRealTimeValidation(regTelefono, validatePhone);
        setupRealTimeValidation(regEmail, validateEmail);
        setupRealTimeValidation(regPassword, validatePassword);
        
        if (regPassword && regConfirmPassword) {
            regPassword.addEventListener('input', () => {
                if (regConfirmPassword.value) validateConfirmPassword(regPassword, regConfirmPassword);
            });
            regConfirmPassword.addEventListener('input', () => validateConfirmPassword(regPassword, regConfirmPassword));
        }
        
        if (regFechaNacimiento) {
            regFechaNacimiento.addEventListener('blur', () => validateBirthDate(regFechaNacimiento));
            regFechaNacimiento.addEventListener('change', () => validateBirthDate(regFechaNacimiento));
        }
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            if (!validateName(regNombre)) isValid = false;
            if (!validateName(regApellido)) isValid = false;
            if (!validatePhone(regTelefono)) isValid = false;
            if (!validateEmail(regEmail)) isValid = false;
            if (!validatePassword(regPassword)) isValid = false;
            if (!validateConfirmPassword(regPassword, regConfirmPassword)) isValid = false;
            if (!validateBirthDate(regFechaNacimiento)) isValid = false;
            
            if (!acceptTerms.checked) {
                showError(acceptTerms, 'Debes aceptar los términos y condiciones');
                isValid = false;
            } else {
                showError(acceptTerms, '');
            }
            
            if (isValid) {
                // ✅ TASK 9: Crear objeto JSON
                const usuarioTask9 = {
                    nombre: regNombre.value + " " + regApellido.value,
                    telefono: regTelefono.value,
                    email: regEmail.value,
                    contrasena: regPassword.value
                };
                
                console.log("✅ TASK 9: Objeto JSON creado:", usuarioTask9);
                
                // ✅ TASK 10: Guardar usuario para login
                guardarUsuarioParaLogin(usuarioTask9);
                
                // Cambiar a pestaña de login
                document.querySelector('#register-tab').classList.remove('active');
                document.querySelector('#login-tab').classList.add('active');
                document.querySelector('#register').classList.remove('show', 'active');
                document.querySelector('#login').classList.add('show', 'active');
                
                // Autocompletar email en login
                document.getElementById('loginEmail').value = usuarioTask9.email;
                
                alert('✅ Registro exitoso\n\nAhora puedes iniciar sesión con tu email y contraseña.');
            }
        });
    }

    function setupRealTimeValidation(input, validationFunction) {
        if (!input) return;
        input.addEventListener('blur', () => validationFunction(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) validationFunction(input);
        });
    }

    // ==================== GUARDAR USUARIO PARA LOGIN ====================
    function guardarUsuarioParaLogin(usuarioTask9) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        
        // Codificar contraseña en Base64 (Task 10)
        const contrasenaCodificada = btoa(usuarioTask9.contrasena);
        
        const nuevoUsuario = {
            id: Date.now(),
            nombre_completo: usuarioTask9.nombre,
            email: usuarioTask9.email,
            telefono: usuarioTask9.telefono,
            contrasena_codificada: contrasenaCodificada,
            fecha_registro: new Date().toISOString().split('T')[0],
            rol: "usuario"
        };
        
        // Verificar si ya existe
        const existe = usuarios.some(u => u.email === usuarioTask9.email);
        
        if (!existe) {
            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            console.log("💾 Usuario guardado para Task 10:", nuevoUsuario);
            
            // Opcional: Simular guardado en JSON
            console.log("📁 Simulación: Se guardaría en data/usuarios.json");
            console.log(JSON.stringify(nuevoUsuario, null, 2));
        }
        
        return nuevoUsuario;
    }

    // ==================== VALIDACIÓN RECUPERACIÓN ====================
    function initRecoverValidation() {
        const recoverForm = document.getElementById('recoverForm');
        if (!recoverForm) return;
        
        const recoverEmail = document.getElementById('recoverEmail');
        const recoverSuccess = document.getElementById('recoverSuccess');
        
        if (recoverEmail) {
            recoverEmail.addEventListener('blur', () => validateEmail(recoverEmail));
            recoverEmail.addEventListener('input', () => {
                if (recoverEmail.classList.contains('is-invalid')) validateEmail(recoverEmail);
            });
        }
        
        recoverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateEmail(recoverEmail)) {
                recoverSuccess.style.display = 'block';
                setTimeout(() => {
                    recoverSuccess.style.display = 'none';
                }, 5000);
            }
        });
    }

    function clearFormValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        const invalidInputs = form.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => input.classList.remove('is-invalid'));
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
    }

    function initTabHandling() {
        const authTabs = document.querySelectorAll('a[data-toggle="tab"]');
        authTabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', function(e) {
                const target = e.target.getAttribute('href');
                switch(target) {
                    case '#login': clearFormValidation('loginForm'); break;
                    case '#register': clearFormValidation('registerForm'); break;
                    case '#recover': clearFormValidation('recoverForm'); break;
                }
            });
        });
    }