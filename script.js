// Configuration du jeu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ballCountDisplay = document.getElementById('ball-count');
const ballCounter = document.getElementById('ball-counter-value');
const timeDisplay = document.getElementById('time');
const gameOverScreen = document.getElementById('game-over');
const finalTime = document.getElementById('final-time');
const finalBalls = document.getElementById('final-balls');
const restartBtn = document.getElementById('restart-btn');
const restartBtnOver = document.getElementById('restart-btn-over');
        
// Variables du jeu
let paddle;
let balls = [];
let gameRunning = true;
let startTime = Date.now();
let ballInterval;
let ballSpeed = 2.5;
let playerName = "ABBE MOREL"; // Remplacez par votre nom
        
// Configuration initiale
function init() {
// Réinitialisation du canvas
    canvas.width = 600;
    canvas.height = 400;
            
            
    paddle = {
        x: canvas.width / 2 - 75,
        y: canvas.height - 30,
        width: 150,
        height: 15,
        speed: 10
    };
            
    balls = [];
    addBall();
            
    gameRunning = true;
    startTime = Date.now();
    timeDisplay.textContent = '0';
    ballCountDisplay.textContent = '1';
    ballCounter.textContent = '1';
    gameOverScreen.style.display = 'none';
            
    clearInterval(ballInterval);
    ballInterval = setInterval(() => {
        if (gameRunning) {
            addBall();
            ballSpeed += 0.1;
        }
    }, 10000); // Ajoute une nouvelle balle toutes les 10 secondes
    gameLoop();// Ajout ici pour relancer la boucle à chaque init
}
        
// Ajouter une nouvelle balle
function addBall() {
    const radius = 15;
    balls.push({
        x: Math.random() * (canvas.width - radius * 2) + radius,
        y: 30,
        dx: (Math.random() - 0.5) * 4,
        dy: ballSpeed,
        radius: radius,
        color: getRandomColor()
    });
            
    ballCountDisplay.textContent = balls.length;
    ballCounter.textContent = balls.length;
}
        
// Obtenir une couleur aléatoire
function getRandomColor() {
    const colors = ['#FF5252', '#FFD740', '#7C4DFF', '#18FFFF', '#69F0AE', '#FF4081'];
    return colors[Math.floor(Math.random() * colors.length)];
}
        
// Dessiner la barre transversale avec le nom
function drawPaddle() {
    // Barre transversale
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
            
    // Nom sur la barre
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(playerName, paddle.x + paddle.width / 2, paddle.y + paddle.height / 2 + 1);
}
        
// Dessiner les boules
function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    });
}
        
// Dessiner le nom dans le cadre
function drawNameInCanvas() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'italic bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${playerName}`, canvas.width / 2, 30);
}
        
// Mettre à jour la position des boules
function updateBalls() {
    if (!gameRunning) return;
            
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
                
        // Mise à jour de la position
        ball.x += ball.dx;
        ball.y += ball.dy;
                
        // Collision avec les bords horizontaux
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx = -ball.dx;
        }
                
        // Collision avec le haut
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }
                
        // Collision avec la barre (simplifiée)
        const paddleTop = paddle.y;
        const paddleBottom = paddle.y + paddle.height;
        const paddleLeft = paddle.x;
        const paddleRight = paddle.x + paddle.width;
                
        if (
            ball.y + ball.radius > paddleTop &&
            ball.y - ball.radius < paddleBottom &&
            ball.x > paddleLeft &&
            ball.x < paddleRight
        ) {
            // Ajuster la position pour éviter la collision multiple
            ball.y = paddleTop - ball.radius;
                    
            // Inverser la direction verticale
            ball.dy = -ball.dy;
                    
            // Ajuster la direction horizontale en fonction de l'impact
            const hitPosition = (ball.x - paddle.x) / paddle.width;
            ball.dx = 8 * (hitPosition - 0.5);
        }
                
        // Vérifier si la balle est tombée
        if (ball.y - ball.radius > canvas.height) {
            gameOver();
            return;
        }
    }
}
        
// Mettre à jour le temps
function updateTime() {
    if (!gameRunning) return;
            
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = elapsedTime;
}
        
// Gestion de la fin de jeu
function gameOver() {
    gameRunning = false;
    clearInterval(ballInterval);
            
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    finalTime.textContent = elapsedTime;
    finalBalls.textContent = balls.length;
            
    gameOverScreen.style.display = 'block';
}
        
// Dessiner le jeu
function draw() {
    // Fond du canvas
    ctx.fillStyle = '#0c1021';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
            
    // Dessiner les éléments
    drawNameInCanvas();
    drawBalls();
    drawPaddle();
}
        
// Boucle de jeu
function gameLoop() {
    updateBalls();
    updateTime();
    draw();
            
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}
        
// Gestion des événements
canvas.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
            
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    paddle.x = (e.clientX - rect.left) * scaleX - paddle.width / 2;
            
    // Garder la barre dans le canvas
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
});
        
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
            
    if (e.key === 'ArrowLeft') {
        paddle.x -= paddle.speed;
        if (paddle.x < 0) paddle.x = 0;
    } else if (e.key === 'ArrowRight') {
        paddle.x += paddle.speed;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
});
        
// Redémarrer le jeu
restartBtn.addEventListener('click', init);
restartBtnOver.addEventListener('click', init);
        
// Démarrer le jeu
init();
gameLoop();