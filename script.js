const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 12;
const paddleHeight = 80;
const ballSize = 14;
const playerX = 20;
const aiX = canvas.width - playerX - paddleWidth;
const paddleSpeed = 8;
const aiSpeed = 4;

// Initial game state
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    vx: 5 * (Math.random() < 0.5 ? 1 : -1),
    vy: 4 * (Math.random() < 0.5 ? 1 : -1)
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function resetBall() {
    ball.x = canvas.width / 2 - ballSize / 2;
    ball.y = canvas.height / 2 - ballSize / 2;
    ball.vx = 5 * (Math.random() < 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() < 0.5 ? 1 : -1);
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Draw paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#0ff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#f0f");

    // Draw ball
    drawCircle(ball.x + ballSize / 2, ball.y + ballSize / 2, ballSize / 2, "#fff");
}

function update() {
    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top/bottom
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.vy *= -1;
        ball.y = Math.max(0, Math.min(ball.y, canvas.height - ballSize));
    }

    // Ball collision with player paddle
    if (
        ball.x <= playerX + paddleWidth &&
        ball.y + ballSize > playerY &&
        ball.y < playerY + paddleHeight
    ) {
        ball.vx = Math.abs(ball.vx);
        // Add spin
        let hitPos = (ball.y + ballSize / 2 - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy += hitPos * 2;
    }

    // Ball collision with AI paddle
    if (
        ball.x + ballSize >= aiX &&
        ball.y + ballSize > aiY &&
        ball.y < aiY + paddleHeight
    ) {
        ball.vx = -Math.abs(ball.vx);
        // Add spin
        let hitPos = (ball.y + ballSize / 2 - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy += hitPos * 2;
    }

    // Ball out of bounds (score)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    // AI paddle movement (simple tracking)
    let aiCenter = aiY + paddleHeight / 2;
    let ballCenter = ball.y + ballSize / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += aiSpeed;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= aiSpeed;
    }
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse controls for player paddle
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Start the game
gameLoop();