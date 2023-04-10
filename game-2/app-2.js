const canvas = document.getElementById("canvas");
const height = canvas.height;
const width = canvas.width;
const ctx = canvas.getContext("2d");
ctx.lineJoin = "round";
//color
ctx.fillStyle = "red";
let gcolor = ctx.createLinearGradient(0, 0, width, height);
gcolor.addColorStop(1, "#4D5139");
gcolor.addColorStop(0.75, "#E79460");
gcolor.addColorStop(0, "#4D5139");

//unit radius
const r = 20;
let c_x = r;
let c_y = r;

//speed
let sp = { x: r, y: r };

//object: ground、bricks
const groundW = 200;
const groundH = 5;
const gpadding = 115;
let g = { x: (width - groundW) / 2, y: height - groundH - gpadding };
canvas.addEventListener("mousemove", (e) => {
  g.x = e.layerX;
  if (e.layerX > 1200 - groundW) {
    g.x = 1200 - groundW;
  } //avoid ground beyond context
});

let color = {
  0: `rgb(193,50,142)`,
  1: `rgb(224,60,138)`,
  2: `rgb(155,144,194)`,
  3: `rgb(152,109,178)`,
  4: `rgb(193,50,142)`,
  5: `rgb(224,60,138)`,
  6: `rgb(155,144,194)`,
  7: `rgb(152,109,178)`,
  8: `rgb(193,50,142)`,
  9: `rgb(224,60,138)`,
};
let brickArray = [];
let count = 0; // brickArray.length
class brick {
  constructor(x, y, n) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.visible = true;
    this.color = color[n];
    brickArray.push(this);
  }
  drawB() {
    ctx.save();
    ctx.fillStyle = gcolor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  touched(ballX, ballY) {
    return (
      ballX >= this.x - r &&
      ballX <= this.x + this.width + r &&
      ballY >= this.y - r &&
      ballY <= this.y + this.height + r
    );
  }
}
let x;
let y;
let n = -1;
let result = true;

//draw bricks without Overlapping
while (brickArray.length < 2) {
  n++;
  result = true;
  x = random(0, width - 50);
  y = random(0, height - 50);
  for (let j = 0; j < brickArray.length; j++) {
    if (
      x > brickArray[j].x - 70 &&
      x < brickArray[j].x + 70 &&
      y > brickArray[j].y - 70 &&
      y < brickArray[j].y + 70
    ) {
      result = false;
      //console.log(n, "no", brickArray.length);
      continue;
    }
  }
  if (result) {
    new brick(x, y, n);
    //console.log(n, brickArray.length);
  }
}
function random(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function drawC() {
  ctx.clearRect(0, 0, width, height);

  //touched brick
  brickArray.forEach((b) => {
    if (b.visible && b.touched(c_x, c_y)) {
      b.visible = false;
      count++;
      sp.y *= -1;
      ctx.fillStyle = b.color;
      console.log(b.color);
    }
    // delete brick splice(start ,deletcount )
    //brickArray.splice(index,1);
    if (count == 2) {
      confirm("time");
      clearInterval(game);
    }
  });

  //draw brick
  brickArray.forEach((b) => {
    if (b.visible) {
      b.drawB();
    }
  });

  //draw ground
  ctx.save();
  ctx.strokeStyle = "gray";
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(g.x, g.y);
  ctx.lineTo(g.x + groundW, g.y);
  ctx.lineWidth = groundH;
  ctx.stroke();
  ctx.restore();
  //ctx.fillStyle = "green";
  //ctx.fillRect(g.x, g.y, groundW, groundH);

  //draw ball
  c_x += sp.x;
  c_y += sp.y;
  ctx.beginPath();
  ctx.arc(c_x, c_y, r, 0, 2 * Math.PI);
  ctx.fill();

  //touch ground rebound decide next speed value
  if (
    c_x >= g.x - r / 2 &&
    c_x <= g.x + groundW + r &&
    c_y >= g.y - r &&
    c_y <= g.y + r
  ) {
    //去除不合理的反彈情況（從ground左右兩端切入到反彈點時）
    if ((sp.y > 0 && c_y == g.y + r) || (sp.y < 0 && c_y == g.y - r)) {
      sp.y = -sp.y;
    } else {
      //plus 20 rebound energe
      if (sp.y > 0) {
        c_y -= 40;
      } else {
        c_y += 40;
      }
    }
    sp.y = -sp.y;
  }

  // touch wall rebound decide next speed value
  if (c_x == r || c_x == width - r) {
    sp.x = -sp.x;
  }
  if (c_y == r || c_y == height - r) {
    sp.y = -sp.y;
  }
}

// play or pause
let game = setInterval(drawC, 45);
let pause = false;
window.addEventListener("keydown", (e) => {
  if (e.key == " " && pause) {
    game = setInterval(drawC, 45);
    pause = false;
  } else if (e.key == " ") {
    clearInterval(game);
    pause = true;
  }
});

if (confirm("time")) {
  count = 0;
  game = setInterval(drawC, 45);
}
