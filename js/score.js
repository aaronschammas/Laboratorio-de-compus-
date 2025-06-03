document.addEventListener('DOMContentLoaded', function() {
    // Verificar si está logueado
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = '../index.html';
        return;
    }

    // Obtener estadísticas del juego
    const goalsFor = parseInt(sessionStorage.getItem('goalsFor')) || 0;
    const goalsAgainst = parseInt(sessionStorage.getItem('goalsAgainst')) || 0;
    const totalPasses = parseInt(sessionStorage.getItem('totalPasses')) || 0;

    // Calcular puntos
    const goalsForPoints = goalsFor * 10; // 10 puntos por gol a favor
    const goalsAgainstPoints = goalsAgainst * 5; // -5 puntos por gol en contra
    const passesPoints = totalPasses * 2; // 2 puntos por pase
    const finalScore = goalsForPoints - goalsAgainstPoints + passesPoints;

    // Mostrar estadísticas
    document.getElementById('goalsFor').textContent = goalsFor;
    document.getElementById('goalsForPoints').textContent = goalsForPoints;
    document.getElementById('goalsAgainst').textContent = goalsAgainst;
    document.getElementById('goalsAgainstPoints').textContent = goalsAgainstPoints;
    document.getElementById('totalPasses').textContent = totalPasses;
    document.getElementById('passesPoints').textContent = passesPoints;
    document.getElementById('finalScore').textContent = finalScore;

    // Prellenar el nombre del jugador
    const username = sessionStorage.getItem('username');
    document.getElementById('playerName').value = username || '';

    // Manejar formulario de puntuación
    const scoreForm = document.getElementById('scoreForm');
    const successMessage = document.getElementById('success-message');

    scoreForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const playerName = document.getElementById('playerName').value;
        const comments = document.getElementById('comments').value;

        // Simular guardado de puntuación
        setTimeout(() => {
            successMessage.style.display = 'block';
            scoreForm.style.display = 'none';
            
            // Scroll hacia el mensaje de éxito
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    });

    // Botones de navegación
    document.getElementById('playAgain').addEventListener('click', function() {
        sessionStorage.setItem('gameMode', 'single');
        window.location.href = 'game.html';
    });

    document.getElementById('backToMenu').addEventListener('click', function() {
        window.location.href = 'menu.html';
    });
});