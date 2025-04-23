const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io('https://flappy-server.onrender.com'); // ✅ 你的后端地址

let playerId = null;
const players = {};

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (players[playerId]) {
      players[playerId].vy = -8;
    }
  }
});

socket.on('connect', () => {
  playerId = socket.id;
  players[playerId] = { x: 100, y: 300, vy: 0 };
});

socket.on('state', (serverPlayers) => {
  for (let id in serverPlayers) {
    players[id] = serverPlayers[id];
  }
});

function drawPlayer(id, player) {
  player.vy += 0.5; // gravity
  player.y += player.vy;

  const color = id === playerId ? 'red' : 'blue';
  ctx.fillStyle = color;
  ctx.fillRect(player.x, player.y, 30, 30);

  ctx.fillStyle = 'black';
  ctx.font = '12px Arial';
  ctx.fillText(id.slice(0, 5), player.x, player.y - 10); // 显示 ID 前5位
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
