const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
  x: 80,
  y: canvas.height / 2, // 初始位置改为画布中间
  width: 30,
  height: 30,
  gravity: 0.5,
  velocity: 0,
  jump: -10
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let animationId = null; // 用于跟踪动画帧

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
    } else {
      bird.velocity = bird.jump;
    }
  }
});

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    const top = Math.random() * 250 + 50;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      gap: 140,
      passed: false // 添加passed属性
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision(pipe) {
  const inXRange = bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width;
  const hitTop = bird.y < pipe.top;
  const hitBottom = bird.y + bird.height > pipe.top + pipe.gap;
  return inXRange && (hitTop || hitBottom);
}

function updateGame() {
  if (gameOver) {
    cancelAnimationFrame(animationId); // 游戏结束时取消动画
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  updatePipes();

  pipes.forEach(pipe => {
    if (checkCollision(pipe)) {
      gameOver = true;
    } else if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      pipe.passed = true;
      score++;
    }
  });

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);

  if (gameOver) {
    ctx.fillText('Game Over! Press Space to Restart.', 50, canvas.height / 2);
  } else {
    animationId = requestAnimationFrame(updateGame);
  }
  frame++;
}

function resetGame() {
  // 取消之前的动画帧
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  bird.y = canvas.height / 2; // 重置到中间位置
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  updateGame();
}

// 确保canvas有正确的大小
canvas.width = 400;
canvas.height = 600;

updateGame();