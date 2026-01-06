// pages/admin/js/admin-protection.js
console.log("🛡️ Inicializando protección admin...");

// ==================== VERIFICACIÓN DE ADMIN ====================
function esAdministrador() {
    // 1. Verificar sesión activa
    const sesionActiva = localStorage.getItem('sesionActiva');
    if (sesionActiva !== 'true') {
        console.log("❌ No hay sesión activa");
        return false;
    }
    
    // 2. Obtener usuario actual
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    if (!usuarioActual || !usuarioActual.email) {
        console.log("❌ No hay usuario en sesión");
        return false;
    }
    
    // 3. Buscar usuario en la base de datos
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioDB = usuarios.find(u => u.email === usuarioActual.email);
    
    if (!usuarioDB) {
        console.log("❌ Usuario no encontrado en base de datos");
        return false;
    }
    
    // 4. Verificar rol admin
    const esAdmin = usuarioDB.rol === 'admin';
    console.log(`👤 Verificación: ${usuarioDB.email} -> Rol: ${usuarioDB.rol} -> ¿Admin? ${esAdmin}`);
    
    return esAdmin;
}

// ==================== PROTEGER PÁGINA ====================
function protegerPaginaAdmin() {
    console.log("🔐 Verificando acceso a página admin...");
    
    // Excluir login_admin.html de la protección (es la entrada)
    const paginaActual = window.location.pathname.split('/').pop();
    if (paginaActual === 'login_admin.html') {
        console.log("✅ Página de login admin - No requiere verificación");
        return true;
    }
    
    // Para todas las demás páginas en /admin/, verificar admin
    if (!esAdministrador()) {
        console.warn("⛔ ACCESO DENEGADO: No eres administrador");
        
        // Guardar la página que intentó acceder
        sessionStorage.setItem('redirectAfterAdminLogin', window.location.href);
        
        // Mostrar mensaje de acceso denegado
        mostrarAccesoDenegado();
        return false;
    }
    
    console.log("✅ Acceso admin concedido");
    return true;
}

// ==================== PANTALLA DE ACCESO DENEGADO ====================
function mostrarAccesoDenegado() {
    // Crear overlay de acceso denegado
    const overlay = document.createElement('div');
    overlay.id = 'adminAccessDenied';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #8C52FF 0%, #5CE1E6 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        text-align: center;
        padding: 20px;
    `;
    
    overlay.innerHTML = `
        <i class="fas fa-ban fa-5x mb-4" style="color: #ff6b6b;"></i>
        <h1 class="mb-3">⛔ ACCESO DENEGADO</h1>
        <p class="mb-4" style="max-width: 500px; font-size: 1.2rem;">
            No tienes permisos para acceder al panel de administración.<br>
            Esta área está restringida a administradores autorizados.
        </p>
        <div id="countdown" style="font-size: 4rem; font-weight: bold; margin: 20px 0;">5</div>
        <p>Redirigiendo al login en <span id="countdownText">5 segundos</span></p>
        <div class="mt-4">
            <button id="btnLoginAdmin" class="btn btn-light btn-lg mr-3">
                <i class="fas fa-sign-in-alt"></i> Ir al Login Admin
            </button>
            <button id="btnGoHome" class="btn btn-outline-light btn-lg">
                <i class="fas fa-home"></i> Ir al Inicio
            </button>
        </div>
    `;
    
    document.body.innerHTML = '';
    document.body.appendChild(overlay);
    
    // Contador regresivo
    let countdown = 5;
    const countdownEl = document.getElementById('countdown');
    const countdownText = document.getElementById('countdownText');
    
    const timer = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        countdownText.textContent = `${countdown} segundo${countdown !== 1 ? 's' : ''}`;
        
        if (countdown <= 0) {
            clearInterval(timer);
            irAlLoginAdmin();
        }
    }, 1000);
    
    // Botones
    document.getElementById('btnLoginAdmin').addEventListener('click', irAlLoginAdmin);
    document.getElementById('btnGoHome').addEventListener('click', irAlInicio);
}

// ==================== NAVEGACIÓN ====================
function irAlLoginAdmin() {
    window.location.href = 'login_admin.html';
}

function irAlInicio() {
    // Subir dos niveles desde /pages/admin/ hasta la raíz
    window.location.href = '../../index.html';
}

// ==================== CERRAR SESIÓN ADMIN ====================
function cerrarSesionAdmin() {
    if (confirm('¿Estás seguro de cerrar sesión como administrador?')) {
        // Limpiar solo sesión, mantener usuarios
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('usuarioActual');
        
        alert('✅ Sesión de administrador cerrada');
        irAlLoginAdmin();
    }
}

// ==================== INICIALIZACIÓN ====================
// Verificar acceso cuando se carga la página
if (!protegerPaginaAdmin()) {
    // Detener cualquier script adicional si no hay acceso
    console.error("⛔ Acceso denegado - Deteniendo scripts");
    throw new Error('Acceso admin denegado');
}

// ==================== EXPORTAR FUNCIONES ====================
window.AdminProtection = {
    esAdministrador,
    protegerPaginaAdmin,
    cerrarSesionAdmin,
    irAlLoginAdmin,
    irAlInicio
};

console.log("✅ Protección admin inicializada correctamente");