const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
  x: 100,
  y: 300,
  width: 30,
  height: 30,
  vy: 0,
  gravity: 0.6,
  jumpStrength: -8,
  alive: false
};

let pipes = [];
let score = 0;
let gameStarted = false;
let frames = 0;
const pipeGap = 160;
const pipeSpeed = 2;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (!gameStarted || !bird.alive) {
      resetGame();
      gameStarted = true;
      bird.alive = true;
    } else if (bird.alive) {
      bird.vy = bird.jumpStrength;
    }
  }
});

function resetGame() {
  bird.y = 300;
  bird.vy = 0;
  score = 0;
  pipes = [];
  frames = 0;
}

function createPipe() {
  const topHeight = Math.floor(Math.random() * 250) + 50;
  const bottomY = topHeight + pipeGap;
  pipes.push({
    x: canvas.width,
    width: 60,
    top: topHeight,
    bottom: canvas.height - bottomY
  });
}

function update() {
  if (!bird.alive) return; // 死了就不更新，但允许绘图
  
  bird.vy += bird.gravity;
  bird.y += bird.vy;

  if (frames % 100 === 0) {
    createPipe();
  }

  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    // 加分条件可以稍微宽松一些（避免 ===）
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true; // 添加一个标志避免多次加分
    }

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (
        bird.y < pipe.top ||
        bird.y + bird.height > pipe.top + pipeGap
      )
    ) {
      bird.alive = false;
    }
  });

  // 超出边界死亡
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
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipe.width, pipe.bottom);
  });

  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  if (!bird.alive && gameStarted) {
    ctx.font = '36px Arial';
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText("Press Space to Restart", canvas.width / 2 - 110, canvas.height / 2 + 30);
  }

  if (!gameStarted) {
    ctx.font = '32px Arial';
    ctx.fillText("Press Space to Start", canvas.width / 2 - 130, canvas.height / 2 - 40);
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

