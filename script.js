const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io('https://flappy-server.onrender.com');


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

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    const p = players[id];
    p.vy += 0.5; // gravity
    p.y += p.vy;

    ctx.fillStyle = id === playerId ? 'red' : 'blue';
    ctx.fillRect(p.x, p.y, 30, 30);
  }

  if (playerId && players[playerId]) {
    socket.emit('update', players[playerId]);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
