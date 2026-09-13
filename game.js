const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let touches = 0;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 30,
    height: 30,
    speed: 5,
    color: '#e74c3c'
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    vx: 0,
    vy: 0,
    friction: 0.99,
    color: '#000'
};

// Goals
const goal1 = { x: 20, y: canvas.height / 2 - 50, width: 40, height: 100 }; // Left goal
const goal2 = { x: canvas.width - 60, y: canvas.height / 2 - 50, width: 40, height: 100 }; // Right goal

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') kickBall();
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Move player
function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;
}

// Kick ball
function kickBall() {
    const dx = ball.x - (player.x + player.width / 2);
    const dy = ball.y - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 60) {
        const force = 15;
        ball.vx = (-dx / distance) * force;
        ball.vy = (-dy / distance) * force;
        touches++;
        document.getElementById('touches').textContent = touches;
    }
}

// Update ball physics
function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= ball.friction;
    ball.vy *= ball.friction;

    // Wall collision
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.vx *= -0.8;
        ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy *= -0.8;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }

    // Check goals
    checkGoals();
}

// Check if ball entered goals
function checkGoals() {
    // Left goal
    if (ball.x - ball.radius < goal1.x + goal1.width &&
        ball.y > goal1.y && ball.y < goal1.y + goal1.height) {
        score++;
        document.getElementById('score').textContent = score;
        resetBall();
    }
    // Right goal
    if (ball.x + ball.radius > goal2.x &&
        ball.y > goal2.y && ball.y < goal2.y + goal2.height) {
        score++;
        document.getElementById('score').textContent = score;
        resetBall();
    }
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
}

// Draw functions
function drawField() {
    // Center line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Center circle
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
}

function drawGoals() {
    // Left goal
    ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
    ctx.fillRect(goal1.x, goal1.y, goal1.width, goal1.height);
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 3;
    ctx.strokeRect(goal1.x, goal1.y, goal1.width, goal1.height);

    // Right goal
    ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
    ctx.fillRect(goal2.x, goal2.y, goal2.width, goal2.height);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3;
    ctx.strokeRect(goal2.x, goal2.y, goal2.width, goal2.height);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw
    drawField();
    drawGoals();
    drawPlayer();
    drawBall();

    // Update
    movePlayer();
    updateBall();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();