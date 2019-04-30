//FIX DISTANCE OF ORB DETECTION
//FIX PUSH DISTANCE
//FIX TIME FOR RESIDUAL ORB EXPLODING

let width = 600;
let height = 600;
let MAX = 400;
let MIN = 30;
let last_frame_mil = 0;
let contador = 0;
let COLOR_1;
let COLOR_2;
let COLOR_3;
let current_color;
let socket;
let balls = [];
let data;
let allower=0;
let hunter_ball;
let recieved = {terrain: false, orb: false};

function preload() {

  socket = io.connect('http://localhost:3000');
  terrain = new Terrain(MIN, MAX);



}

function test() {

  if (allower==1){
    push();
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
    if ((!orb.alive) && (ball.dist2(ball.pos, orb.pos) <= 1700)) {
      if (hunter_ball != ball) {
        data = {
          x: orb.pos.x,
          y: orb.pos.y
        };
        socket.emit('orb_killed', data);
      }
    }

    for (var i = balls.length - 1; i >= 0; i--) {
      var id = balls[i].id;
      if (id !== socket.id) {
        let ball_aux = new Ball(99, balls[i].x, balls[i].y, balls[i].r);
        ball_aux.draw();
        //console.log(balls);

        ball.checkBall(ball_aux);

        fill(255);
        textAlign(CENTER);
        textSize(20);
        text(subset(balls[i].id, 0, 4), balls[i].x, balls[i].y + balls[i].r);
      }
    }

    data = {
      x: ball.pos.x,
      y: ball.pos.y,
      r: ball.r
    };
    socket.emit('update', data);
    pop();
  }
}
function setup() {

  createCanvas(width, height);
  ball = new Ball(1, MAX / 2, MAX / 2, 20);
  orb = new Orb(MAX*10, MAX*10, 20);
  COLOR_1 = color(157, 172, 255);
  COLOR_2 = color(210, 190, 235);
  COLOR_3 = color(255, 210, 215);
  current_color = COLOR_1;


  data = {
    x: ball.pos.x,
    y: ball.pos.y,
    r: ball.r
  };
  socket.emit('start', data);

  socket.on('heartbeat',
    function(beat) {
      balls = beat.balls;
      orb.pos.x = beat.orb.x;
      orb.pos.y = beat.orb.y;
      orb.alive = beat.orb.alive;
      //1/60 = 0.1666666 seconds --> 16.67 miliseconds ~= 17
      if ((recieved.terrain == true)&&(recieved.terrain == true)) {
        let diff = (millis() - last_frame_mil);
        if (diff >= 17) {
          test();
          last_frame_mil = last_frame_mil + diff;
        }
      }
    }
    );

  socket.on('terrain',
    function(data) {
      Object.assign(terrain, data);
      recieved.terrain = true;
    }
    );

  socket.on('orb',
    function(data) {
      orb.pos.x = data.x;
      orb.pos.y = data.y;
      orb.alive = data.alive;
      recieved.orb = true;
    }
    );

  socket.on('orb_taken',
    function(data) {
      console.log("oi");
      if (orb.alive == true) {
        orb.alive = false;
        orb.explode();
        hunter_ball = data.dangerous_boi;
        console.log(data);
      }
    }
    );
}


// function mousePressed() {
//   let mouse = createVector(mouseX - (width / 2), mouseY - (height / 2));
//   ball.boost(mouse);
// }

function mousePressed() {
  allower=1;
}