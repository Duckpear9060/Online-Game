const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 确保画布有合理尺寸
canvas.width = 400;
canvas.height = 600;

const bird = {
  x: 80,
  y: canvas.height / 2 - 15, // 确保在正中间 (减去一半鸟高)
  width: 30,
  height: 30,
  gravity: 0.5,
  velocity: 0,
  jump: -10,
  color: 'yellow'
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let animationId = null;

// 添加点击事件支持移动端
canvas.addEventListener('click', handleJump);
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    handleJump();
  }
});

function handleJump() {
  if (gameOver) {
    resetGame();
  } else {
    bird.velocity = bird.jump;
  }
}

function drawBird() {
  ctx.fillStyle = bird.color;
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  
  // 添加眼睛让鸟更明显
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(bird.x + 22, bird.y + 10, 3, 0, Math.PI * 2);
  ctx.fill();
}

function updateGame() {
  if (gameOver) {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    drawGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 先更新物理再绘制
  updatePhysics();
  drawBird();
  updatePipes();
  drawPipes();
  drawScore();
  
  checkCollisions();
  
  animationId = requestAnimationFrame(updateGame);
  frame++;
}

function updatePhysics() {
  // 只在游戏进行时应用重力
  if (!gameOver) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
  }
}

function updatePipes() {
  if (frame % 90 === 0) {
    const top = Math.random() * (canvas.height - 200) + 50;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      gap: 140,
      passed: false,
      color: '#4CAF50'
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = pipe.color;
    // 上管道
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    // 下管道
    ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);
  });
}

function checkCollisions() {
  // 地面和天花板碰撞
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
    bird.color = 'red'; // 碰撞时变红
    return;
  }

  // 管道碰撞
  for (const pipe of pipes) {
    const inXRange = bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width;
    const hitTop = bird.y < pipe.top;
    const hitBottom = bird.y + bird.height > pipe.top + pipe.gap;
    
    if (inXRange && (hitTop || hitBottom)) {
      gameOver = true;
      bird.color = 'red';
      break;
    } else if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      pipe.passed = true;
      score++;
    }
  }
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40);
}

function drawGameOver() {
  ctx.fillStyle = 'black';
  ctx.font = '30px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 20);
  ctx.font = '20px Arial';
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 20);
  ctx.fillText('Press SPACE or Click to Restart', canvas.width / 2 - 140, canvas.height / 2 + 60);
}

function resetGame() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  bird.y = canvas.height / 2 - 15;
  bird.velocity = 0;
  bird.color = 'yellow';
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 重新开始游戏
  updateGame();
}

// 初始化游戏
resetGame();