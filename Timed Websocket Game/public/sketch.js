//FIX DISTANCE OF ORB DETECTION
//FIX PUSH DISTANCE
//FIX TIME FOR RESIDUAL ORB EXPLODING

let width = 600;
let height = 600;
let MAX = 400;
let MIN = 30;
let contador = 0;
let contador2 = 0;
let COLOR_1;
let COLOR_2;
let COLOR_3;
let current_color;
let socket;
let balls = [];
let data;

function setup() {

  createCanvas(width, height);
  terrain = new Terrain(MIN, MAX);
  terrain.setup();
  ball = new Ball(1, MAX / 2, MAX / 2, 20);
  orb = new Orb(((MAX + MIN) / 3) * cos(random(0, 2 * PI)), ((MAX + MIN) / 3) * sin(random(0, 2 * PI)), 20);
  COLOR_1 = color(157, 172, 255);
  COLOR_2 = color(210, 190, 235);
  COLOR_3 = color(255, 210, 215);
  current_color = COLOR_1;
  socket = io.connect('http://localhost:3000');
  // socket.on('balls', updatePos);

  data = {
    x: ball.pos.x,
    y: ball.pos.y,
    r: ball.r
  };
  console.log("***********"+data);
  socket.emit('start', data);

  socket.on('heartbeat',
    function(data) {
      //console.log(data);
      blobs = data;
    }
  );

}

function draw() {

  translate(width / 2, height / 2);
  translate(-ball.pos.x, -ball.pos.y);
  background(92, 39, 81);
  terrain.draw(current_color, color(100, 87, 166));
  ball.move();
  ball.draw();
  ball.keepInside(terrain);
  let mouse = createVector(mouseX - (width / 2) + ball.pos.x, mouseY - (height / 2) + ball.pos.y);
  stroke(92, 39, 81);
  line(mouse.x, mouse.y, ball.pos.x, ball.pos.y);

  if (contador % 25 == 0) {
    if (current_color == COLOR_3) {
      current_color = COLOR_1;
    } else if (current_color == COLOR_1) {
      current_color = COLOR_2;
    } else if (current_color == COLOR_2) {
      current_color = COLOR_3;
      ball.boost(p5.Vector.sub(mouse, ball.pos));
    }
  }
  contador++;

  orb.draw();
  ball.checkOrb(orb);
  if (!orb.alive) {
    if (contador2 == 0) {
      contador2 = second();
    }
    if (second() - contador2 > 3) {
      orb = new Orb(((MAX + MIN) / 2) * cos(random(0, 2 * PI)), ((MAX + MIN) / 2) * sin(random(0, 2 * PI)), 20);
      contador2 = 0;
    }
  }

  // socket.emit('ball', data);
  // console.log('sending:', mouseX +',', mouseY +',', clr)

  for (var i = balls.length - 1; i >= 0; i--) {
    var id = balls[i].id;
    if (id.substring(2, id.length) !== socket.id) {
      fill(0, 0, 255);
      ellipse(balls[i].x, balls[i].y, balls[i].r * 2, balls[i].r * 2);

      ball.checkBall(balls[i]);

      fill(255);
      textAlign(CENTER);
      textSize(4);
      text(balls[i].id, balls[i].x, balls[i].y + balls[i].r);
    }
    // balls[i].show();
    // if (blob.eats(balls[i])) {
    //   balls.splice(i, 1);
    // }
  }

  data = {
    x: ball.pos.x,
    y: ball.pos.y,
    r: ball.r
  };
  socket.emit('update', data);

}

function mousePressed() {
  let mouse = createVector(mouseX - (width / 2), mouseY - (height / 2));
  ball.boost(mouse);
}

// function updatePos(){
// }