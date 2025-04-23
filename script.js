const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
  x: 100,
  y: 300,
  width: 30,
  height: 30,
  vy: 0,
  gravity: 0.5,
  jumpStrength: -8,
  alive: true
};

let pipes = [];
let score = 0;
let gameStarted = false;
let frames = 0;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (!gameStarted) {
      resetGame();
      gameStarted = true;
    }
    if (bird.alive) {
      bird.vy = bird.jumpStrength;
    } else {
      // 如果死亡，按空格可以重新开始
      resetGame();
      gameStarted = true;
    }
  }
});

function resetGame() {
  bird.y = 300;
  bird.vy = 0;
  bird.alive = true;
  score = 0;
  pipes = [];
  frames = 0;
}

function createPipe() {
  const gap = 140;
  const topHeight = Math.floor(Math.random() * 250) + 50;
  const bottomY = topHeight + gap;
  pipes.push({
    x: canvas.width,
    width: 60,
    top: topHeight,
    bottom: canvas.height - bottomY
  });
}

function update() {
  if (!bird.alive) return;

  bird.vy += bird.gravity;
  bird.y += bird.vy;

  if (frames % 90 === 0) {
    createPipe();
  }

  pipes.forEach(pipe => {
    pipe.x -= 3;

    if (pipe.x + pipe.width === bird.x && bird.alive) {
      score++;
    }

    // 碰撞检测
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (
        bird.y < pipe.top ||
        bird.y + bird.height > pipe.top + 140
      )
    ) {
      bird.alive = false;
    }
  });

  // 地面/顶部碰撞
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    bird.alive = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = bird.alive ? 'red' : 'gray';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + 140, pipe.width, pipe.bottom);
  });

  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  if (!bird.alive) {
    ctx.font = '36px Arial';
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText("Press Space to Restart", canvas.width / 2 - 110, canvas.height / 2 + 30);
  }
}

function gameLoop() {
  if (gameStarted) {
    update();
    frames++;
  }
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
