const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// UI
const playAgainBtn = document.getElementById("playAgain");

// Game settings
const paddleWidth = 12;
const paddleHeight = 80;
const ballSize = 14;
const playerX = 20;
const aiX = canvas.width - playerX - paddleWidth;
const aiSpeed = 4;
const WIN_SCORE = 5;

// Initial game state
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

let ball = {
  x: canvas.width / 2 - ballSize / 2,
  y: canvas.height / 2 - ballSize / 2,
  vx: 5 * (Math.random() < 0.5 ? 1 : -1),
  vy: 4 * (Math.random() < 0.5 ? 1 : -1),
};

let playerScore = 0;
let aiScore = 0;
let isPaused = false;
let gameOver = false;

// --- Drawing helpers
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

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, canvas.width * 0.25, 30);
  ctx.fillText(aiScore, canvas.width * 0.75, 30);
}

function drawCenterLine() {
  ctx.strokeStyle = "#333";
  ctx.setLineDash([6, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCenterNet(){
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.setLineDash([10, 12]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.restore();
}


function drawGameOverOverlay() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "32px Arial";
  const winner =
    playerScore >= WIN_SCORE ? "You Win! 🎉" : "AI Wins! 🤖";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText(winner, canvas.width / 2, canvas.height / 2 + 20);
  // Button is shown via DOM (below)
}

// --- Core
function resetBall(scorer) {
  // update scores if scorer provided
  if (scorer === "player") playerScore++;
  if (scorer === "ai") aiScore++;

  ball.x = canvas.width / 2 - ballSize / 2;
  ball.y = canvas.height / 2 - ballSize / 2;
  ball.vx = 5 * (Math.random() < 0.5 ? 1 : -1);
  ball.vy = 4 * (Math.random() < 0.5 ? 1 : -1);
}

function checkWin() {
  if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) {
    gameOver = true;
    isPaused = true;
    // show the button
    playAgainBtn.style.display = "inline-block";
  }
}

function draw() {
  // Trail clear (instead of a hard wipe)
  ctx.fillStyle = "rgba(12,12,24,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCenterNet();

  // Neon paddles
  ctx.save();
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 14;
  drawRect(playerX, playerY, paddleWidth, paddleHeight, "#00e5ff");
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "#ff00e5";
  ctx.shadowBlur = 14;
  drawRect(aiX, aiY, paddleWidth, paddleHeight, "#ff00e5");
  ctx.restore();

  // Neon ball
  ctx.save();
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 18;
  drawCircle(ball.x + ballSize / 2, ball.y + ballSize / 2, ballSize / 2, "#fff");
  ctx.restore();
}


function update() {
  // Skip physics if paused
  if (isPaused) return;

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
    const hitPos =
      (ball.y + ballSize / 2 - (playerY + paddleHeight / 2)) /
      (paddleHeight / 2);
    ball.vy += hitPos * 2;
  }

  // Ball collision with AI paddle
  if (
    ball.x + ballSize >= aiX &&
    ball.y + ballSize > aiY &&
    ball.y < aiY + paddleHeight
  ) {
    ball.vx = -Math.abs(ball.vx);
    const hitPos =
      (ball.y + ballSize / 2 - (aiY + paddleHeight / 2)) /
      (paddleHeight / 2);
    ball.vy += hitPos * 2;
  }

  // Ball out of bounds (score)
  if (ball.x < 0) {
    resetBall("ai"); // AI scores
    checkWin();
  } else if (ball.x > canvas.width) {
    resetBall("player"); // Player scores
    checkWin();
  }

  // AI paddle movement (simple tracking)
  const aiCenter = aiY + paddleHeight / 2;
  const ballCenter = ball.y + ballSize / 2;
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
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Play Again resets everything
playAgainBtn.addEventListener("click", () => {
  // reset scores
  playerScore = 0;
  aiScore = 0;

  // reset positions
  playerY = canvas.height / 2 - paddleHeight / 2;
  aiY = canvas.height / 2 - paddleHeight / 2;

  // reset ball (no scorer)
  ball.x = canvas.width / 2 - ballSize / 2;
  ball.y = canvas.height / 2 - ballSize / 2;
  ball.vx = 5 * (Math.random() < 0.5 ? 1 : -1);
  ball.vy = 4 * (Math.random() < 0.5 ? 1 : -1);

  // hide overlay/button and resume
  gameOver = false;
  isPaused = false;
  playAgainBtn.style.display = "none";
});

// Start the game
gameLoop();
