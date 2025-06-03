document.addEventListener('DOMContentLoaded', function() {
    // Verificar si está logueado
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = '../index.html';
        return;
    }

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameMode = sessionStorage.getItem('gameMode');
    
    // Elementos del DOM
    const player1ScoreEl = document.getElementById('player1Score');
    const player2ScoreEl = document.getElementById('player2Score');
    const gameModeEl = document.getElementById('gameMode');
    const ballHitsEl = document.getElementById('ballHits');
    const pauseBtn = document.getElementById('pauseBtn');
    const backToMenuBtn = document.getElementById('backToMenu');
    const player2ControlsEl = document.getElementById('player2Controls');

    // Configurar modo de juego
    if (gameMode === 'single') {
        gameModeEl.textContent = 'Modo: Un Jugador';
        player2ControlsEl.textContent = 'Jugador 2: Controlado por IA';
    } else {
        gameModeEl.textContent = 'Modo: Dos Jugadores';
    }

    // Variables del juego
    let gameRunning = false;
    let gamePaused = false;
    let ballHits = 0;
    let aiSpeed = 1; // Velocidad inicial de la IA

    // Objetos del juego
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 5,
        dy: 3,
        radius: 10,
        speed: 5
    };

    const player1 = {
        x: 10,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        dy: 0,
        speed: 8,
        score: 0
    };

    const player2 = {
        x: canvas.width - 20,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        dy: 0,
        speed: 8,
        score: 0
    };

    // Controles
    const keys = {};

    document.addEventListener('keydown', function(e) {
        keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', function(e) {
        keys[e.key.toLowerCase()] = false;
    });

    // Funciones del juego
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
        ball.dy = (Math.random() - 0.5) * ball.speed;
    }

    function updatePaddles() {
        // Jugador 1
        if (keys['w'] && player1.y > 0) {
            player1.y -= player1.speed;
        }
        if (keys['s'] && player1.y < canvas.height - player1.height) {
            player1.y += player1.speed;
        }

        // Jugador 2 o IA
        if (gameMode === 'two') {
            if (keys['arrowup'] && player2.y > 0) {
                player2.y -= player2.speed;
            }
            if (keys['arrowdown'] && player2.y < canvas.height - player2.height) {
                player2.y += player2.speed;
            }
        } else {
            // IA
            const ballCenterY = ball.y;
            const paddleCenterY = player2.y + player2.height / 2;
            
            if (ballCenterY < paddleCenterY - 10) {
                player2.y -= aiSpeed;
            } else if (ballCenterY > paddleCenterY + 10) {
                player2.y += aiSpeed;
            }
            
            // Limitar movimiento de la IA
            if (player2.y < 0) player2.y = 0;
            if (player2.y > canvas.height - player2.height) {
                player2.y = canvas.height - player2.height;
            }
        }
    }

    function updateBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Colisión con paredes superior e inferior
        if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) {
            ball.dy = -ball.dy;
        }
 
        // Colisión con paletas
        if (ball.x <= player1.x + player1.width + ball.radius &&
            ball.y >= player1.y &&
            ball.y <= player1.y + player1.height &&
            ball.dx < 0) {
            ball.dx = -ball.dx;
            ballHits++;
            ballHitsEl.textContent = `Pases: ${ballHits}`;
        }

        if (ball.x >= player2.x - ball.radius &&
            ball.y >= player2.y &&
            ball.y <= player2.y + player2.height &&
            ball.dx > 0) {
            ball.dx = -ball.dx;
            ballHits++;
            ballHitsEl.textContent = `Pases: ${ballHits}`;
        }

        //velocidad bola
        if(ballHits >=1){
            ball.speed = 5 + Math.floor(ballHits / 5);
            ball.dx = (ball.dx > 0 ? 1 : -1) * ball.speed;
            ball.dy = (ball.dy > 0 ? 1 : -1) * ball.speed;
        }

        // Goles
        if (ball.x < 0) {
            player2.score++;
            player2ScoreEl.textContent = player2.score;
            if (gameMode === 'single') {
                aiSpeed += 0.5; // Aumentar velocidad de IA
            }
            resetBall();
        }

        if (ball.x > canvas.width) {
            player1.score++;
            player1ScoreEl.textContent = player1.score;
            if (gameMode === 'single') {
                aiSpeed += 0.5; // Aumentar velocidad de IA
            }
            resetBall();
        }
    }

    function draw() {
        // Limpiar canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Línea central
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.setLineDash([]);

        // Paletas
        ctx.fillStyle = 'white';
        ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
        ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

        // Pelota
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    function gameLoop() {
        if (!gamePaused && gameRunning) {
            updatePaddles();
            updateBall();
        }
        draw();
        requestAnimationFrame(gameLoop);
    }

    function startGame() {
        gameRunning = true;
        resetBall();
        gameLoop();
    }

    function endGame() {
        gameRunning = false;
        
        // Guardar estadísticas para la página de puntuación
        const goalsFor = player1.score;
        const goalsAgainst = player2.score;
        const totalPasses = ballHits;
        
        sessionStorage.setItem('goalsFor', goalsFor);
        sessionStorage.setItem('goalsAgainst', goalsAgainst);
        sessionStorage.setItem('totalPasses', totalPasses);
        
        if (gameMode === 'single') {
            window.location.href = 'score.html';
        } else {
            // En modo dos jugadores, mostrar ganador y volver al menú
            const winner = goalsFor > goalsAgainst ? 'Jugador 1' : 
                          goalsAgainst > goalsFor ? 'Jugador 2' : 'Empate';
            alert(`¡Juego terminado! Resultado: ${winner}`);
            window.location.href = 'menu.html';
        }
    }

    // Event listeners
    pauseBtn.addEventListener('click', function() {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Reanudar' : 'Pausar';
    });

    backToMenuBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres volver al menú? Se perderá el progreso actual.')) {
            window.location.href = 'menu.html';
        }
    });

    // Detectar fin de juego (cuando un jugador llega a 5 puntos)
    setInterval(function() {
        if (gameRunning && (player1.score >= 3 || player2.score >= 3)) {
            endGame();
        }
    }, 100);

   
    startGame();
});