const canvas = document.getElementById("gameSection");
const unit = 20;
//避免長寬與unit無法整除的情況（colum row 數量非整數）snake y、ｘ 則永遠不會等於長或寬
canvas.width = Math.floor((window.innerWidth * 50) / 100 / unit) * unit;
canvas.height = Math.floor((window.innerHeight * 45) / 100 / unit) * unit;
canvas.style.width = Math.floor((window.innerWidth * 50) / 100 / unit) * unit;
canvas.style.height = Math.floor((window.innerHeight * 45) / 100 / unit) * unit;
const ctx = canvas.getContext("2d");
//getContent() method can build a canvas drawing context that can draw in canvas
const row = canvas.height / unit;
const column = canvas.width / unit;
console.log(canvas.width, canvas.height);
console.log(row, column);
//color
let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(1, "red");
gradient.addColorStop(0.75, "white");
gradient.addColorStop(0.5, "red");
gradient.addColorStop(0.25, "white");
gradient.addColorStop(0, "red");

//start position
let snake = []; // x,y
function createSnake() {
  let start = 80;

  snake[0] = {
    x: start,
    y: 0,
  };
  snake[1] = {
    x: start - unit,
    y: 0,
  };
  snake[2] = {
    x: start - 2 * unit,
    y: 0,
  };
  snake[3] = {
    x: start - 3 * unit,
    y: 0,
  };
}
createSnake();

// food position
class Food {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit + 10;
    this.y = Math.floor(Math.random() * row) * unit + 10;
    console.log(this.x, this.y);
  }

  drawFood() {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(this.x, this.y, unit / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  pickAlocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlaping(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true; // pick again
          return;
        } else {
          overlapping = false;
        }
      }
    }
    do {
      new_x = Math.floor(Math.random() * column) * unit + 10;
      new_y = Math.floor(Math.random() * row) * unit + 10;
      checkOverlaping(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}
let food = new Food();

// moving direction setting
let d = "Right";
window.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Light") {
    d = "Right";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  }

  //防止在畫出下一幀前的連續keydown
  window.removeEventListener("keydown", changeDirection);
}

let score = 0;
let highScore;
(function getHighScore() {
  if (localStorage.getItem("highScore") == null) {
    highScore = 0;
  } else {
    highScore = Number(localStorage.getItem("highScore"));
  }
})();
document.getElementById("score").innerHTML = `score :${score}`;
document.getElementById("highScore").innerHTML = `record:${highScore}`;

// draw setting
function draw() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(move);
      alert("game Over");
      btn.setAttribute("onclick", "location.reload()");
      btn.innerText = "start";
      return;
    }
  }

  //clean context
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //draw food
  food.drawFood();

  //color
  ctx.fillStyle = gradient;

  //head
  ctx.beginPath();
  //center-x,cente-y,rakdius,startangel,endangel,clockwise(true/false)
  ctx.arc(snake[0].x + 10, snake[0].y + 10, unit / 2, 0, 2 * Math.PI);
  ctx.fill();

  console.log("haha");
  //body
  for (let i = 1; i < snake.length; i++) {
    // x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
  }

  //creat new head
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "Left") {
    if (snakeX == 0) {
      snakeX = canvas.width - unit;
    } else {
      snakeX -= unit;
    }
  } else if (d == "Up") {
    if (snakeY == 0) {
      snakeY = canvas.height - unit;
    } else {
      snakeY -= unit;
    }
  } else if (d == "Right") {
    if (snakeX == canvas.width) {
      snakeX = 0;
    } else {
      snakeX += unit;
    }
  } else if (d == "Down") {
    if (snakeY == canvas.height) {
      snakeY = 0;
    } else {
      snakeY += unit;
    }
  }

  let newsnake = {
    x: snakeX,
    y: snakeY,
  };

  // havent eaten the food
  //pop a tail add a new head in each step and old head will turn into body
  if (snake[0].x + 10 == food.x && snake[0].y + 10 == food.y) {
    food.pickAlocation();
    score++;
    document.getElementById("score").innerHTML = `score :${score}`;
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      highScore = score;
      document.getElementById("highScore").innerHTML = `record:${highScore}`;
    }
  } else {
    snake.pop();
  }

  snake.unshift(newsnake);
  window.addEventListener("keydown", changeDirection);
}

// start and pause
let move = setInterval(draw, 110);
let btn = document.querySelector("button");
btn.addEventListener("click", () => {
  if (btn.innerText == "start") {
    move = setInterval(draw, 110);
    btn.innerText = "pause";
  } else {
    btn.innerText = "start";
    clearInterval(move);
  }
});

window.addEventListener("resize", () => {
  location.reload();
});
