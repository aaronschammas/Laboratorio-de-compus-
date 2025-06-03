document.addEventListener('DOMContentLoaded', function() {
    // Verificar si está logueado
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = '../index.html';
        return;
    }

    const singlePlayerBtn = document.getElementById('singlePlayer');
    const twoPlayersBtn = document.getElementById('twoPlayers');
    const logoutBtn = document.getElementById('logout');

    singlePlayerBtn.addEventListener('click', function() {
        sessionStorage.setItem('gameMode', 'single');
        window.location.href = 'game.html';
    });

    twoPlayersBtn.addEventListener('click', function() {
        sessionStorage.setItem('gameMode', 'two');
        window.location.href = 'game.html';
    });

    logoutBtn.addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = '../index.html';
    });
});