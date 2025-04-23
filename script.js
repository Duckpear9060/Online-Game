const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io('https://flappy-server.onrender.com'); // ✅ 替换为你的 Render 地址

let playerId = null;
const players = {};

function log(...args) {
  console.log('[LOG]', ...args);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (players[playerId]) {
      players[playerId].vy = -8;
      log('Jumped');
    }
  }
});

socket.on('connect', () => {
  playerId = socket.id;
  players[playerId] = { x: 100, y: 300, vy: 0 };
  log('Connected as', playerId);
});

socket.on('state', (serverPlayers) => {
  for (let id in serverPlayers) {
    players[id] = serverPlayers[id];
  }
  log('Received state from server:', serverPlayers);
});

function drawPlayer(id, player) {
  player.vy += 0.5;
  player.y += player.vy;

  const color = id === playerId ? 'red' : 'blue';
  ctx.fillStyle = color;
  ctx.fillRect(player.x, player.y, 30, 30);

  ctx.fillStyle = 'black';
  ctx.font = '12px Arial';
  ctx.fillText(id.slice(0, 5), player.x, player.y - 10);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let id in players) {
    drawPlayer(id, players[id]);
  }

  if (playerId && players[playerId]) {
    socket.emit('update', players[playerId]);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
