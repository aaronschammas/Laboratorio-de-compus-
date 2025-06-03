document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Credenciales estáticas
        if (username === 'nombre' && password === 'contraseña') {
            // Login exitoso
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', username);
            window.location.href = 'templates/menu.html';
        } else {
            // Login fallido
            errorMessage.textContent = 'Usuario o contraseña incorrectos';
            errorMessage.style.display = 'block';
            
            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    });

    if (sessionStorage.getItem('loggedIn') === 'true') {
        window.location.href = '../templates/menu.html';
    }
});