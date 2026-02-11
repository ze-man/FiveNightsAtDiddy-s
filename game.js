const startBtn = document.getElementById('startBtn');
const customNightBtn = document.getElementById('customNightBtn');
const startMenu = document.getElementById('startMenu');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOverScreen');

startBtn.onclick = () => {
  startMenu.style.display = 'none';
  gameContainer.style.display = 'block';
  startGame();
};

customNightBtn.onclick = () => {
  alert('Custom Night coming soon!');
};

const ctx = document.getElementById('cameraView').getContext('2d');

let gameState = {
  power: 100,
  doorLeftClosed: false,
  doorRightClosed: false,
  currentCamera: 0,
  cameraCount: 11,
  isGameOver: false,
  night: 1,
  animDiddy: false,
  staticOverlay: false,
};

function startGame() {
  loadGameData();
  gameLoop();
}

function loadGameData() {
  const savedNight = localStorage.getItem('night');
  if (savedNight) {
    gameState.night = parseInt(savedNight);
  }
}

function saveGameData() {
  localStorage.setItem('night', gameState.night);
}

function gameLoop() {
  if (gameState.isGameOver) return;
  updateGame();
  drawGame();
  setTimeout(gameLoop, 1000 / 30); // 30 FPS
}

function updateGame() {
  // Example: decrease power over time
  if (gameState.power > 0) {
    gameState.power -= 0.05;
    document.getElementById('power').innerText = `Power: ${Math.floor(gameState.power)}%`;
  } else {
    triggerGameOver();
  }

  // Simulate random attack
  if (Math.random() < 0.001 && !gameState.doorLeftClosed && !gameState.doorRightClosed) {
    triggerGameOver();
  }
}

function drawGame() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 640, 360);

  // Draw static overlay for camera
  if (gameState.staticOverlay && Math.random() < 0.5) {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(0, 0, 640, 360);
  }

  // Draw camera view based on current camera
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText(`Camera ${gameState.currentCamera + 1}`, 10, 30);

  // If darkish, overlay darkness
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, 640, 360);
}

// Controls
document.getElementById('doorLeftBtn').onclick = () => {
  gameState.doorLeftClosed = !gameState.doorLeftClosed;
  document.getElementById('doorLeftStatus').innerText = `Door Left: ${gameState.doorLeftClosed ? 'Closed' : 'Open'}`;
};
document.getElementById('doorRightBtn').onclick = () => {
  gameState.doorRightClosed = !gameState.doorRightClosed;
  document.getElementById('doorRightStatus').innerText = `Door Right: ${gameState.doorRightClosed ? 'Closed' : 'Open'}`;
};
document.getElementById('changeCamBtn').onclick = () => {
  gameState.currentCamera = (gameState.currentCamera + 1) % gameState.cameraCount;
};

// Game Over
function triggerGameOver() {
  gameState.isGameOver = true;
  document.getElementById('gameOverScreen').style.display = 'block';
}

document.getElementById('restartBtn').onclick = () => {
  location.reload();
};
