const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const size = 30;
const snake = [{ x: 0, y: 0 }];
var speed = 300;
var eatedFoods = 0;

let direction, loopId;

function randomNumber(min, max){
  return Math.round(Math.random() * (max - min) + min);
}

function randomPosition(){
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
}

function randomColor(){
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red},${green},${blue})`;
}

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

function drawFood(){
  //desestrutura os elementos de um dicionário
  const { x, y, color } = food;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
}

function drawSnake(){
  ctx.fillStyle = "#ddd";
  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "grey";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
}

function moveSnake(){
  if (!direction) return;
  const head = snake[snake.length - 1];
  // shift remove o primeiro elemento de um array
  snake.shift();
  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }
  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }
  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }
  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }
}

document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != " left") {
    direction = "right";
  }
  if (key == "ArrowLeft" && direction != " right") {
    direction = "left";
  }
  if (key == "ArrowDown" && direction != " up") {
    direction = "down";
  }
  if (key == "ArrowUp" && direction != " down") {
    direction = "up";
  }
})

function drawGrid(){
  ctx.lineWidth = 1;
  ctx.strokeStyle = " #191919";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
}

function checkEat(){
  const head = snake[snake.length - 1];
  if (head.x == food.x && head.y == food.y) {
    snake.push(head);
    // verifica se a comida nao esta sendo criada em cima da cobra
    let x = randomPosition();
    let y = randomPosition();
    while (snake.find((position)=> position.x == x && position.y == y)) {
        x = randomPosition();
        y = randomPosition();
    }
    food.x = x;
    food.y = y;
    food.color = randomColor();
    eatedFoods = eatedFoods + 1;
    speedUp();
    scoreboard();
  }
}

function checkColision(){
  const head = snake[snake.length-1];
  
  //Wall colision
  if(head.x > 600 || head.x < 0 || head.y > 600 || head.y < 0){
    alert('colisão');
  }
  //Body colision
  
}

function speedUp(){
  speed = speed - 5;
  console.log(speed);
}

function scoreboard() {
  const scoreSpeedElements = document.getElementsByClassName('speed');
  const scoreFoodsElements = document.getElementsByClassName('foods');
  
  for (const element of scoreSpeedElements) {
    element.innerText = `${speed}`;
  }

  for (const element of scoreFoodsElements) {
    element.innerText = `${eatedFoods}`;
  }
}

function gameLoop(){
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkColision();
  loopId = setTimeout(() => {
    gameLoop();
  }, speed);
}


gameLoop();
