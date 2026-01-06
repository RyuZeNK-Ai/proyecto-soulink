document.addEventListener('DOMContentLoaded', function() {
    // Si ya puede acceder a la carpeta, no verificar
    // Si YA está logueado como admin, redirigir al panel
    if (sessionStorage.getItem('adminAutenticado') === 'true') {
        window.location.href = 'panel_admin.html';
    }
    
    document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;

        // Admin por defecto
        const adminUser = {
            email: "admin@soulink.com",
            password: "admin123"
        };

        if (email === adminUser.email && password === adminUser.password) {
            // Guardar en sessionStorage (más seguro)
            sessionStorage.setItem('adminAutenticado', 'true');
            window.location.href = 'panel_admin.html';
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    });
});