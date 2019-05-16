//FIX DISTANCE OF ORB DETECTION
//FIX PUSH DISTANCE
//FIX TIME FOR RESIDUAL ORB EXPLODING

let width = 600;
let height = 600;
let MAX = 400;
let MIN = 30;
let last_frame_mil = 0;
let contador = 0;
let contador2 = 0;
let contador3 = 0;
let COLOR_1;
let COLOR_2;
let COLOR_3;
let current_color;
let socket;
let balls = [];
let data;
let allower=0;
let hunter_ball=0;
let connection_id;
let recieved = {terrain: false, orb: false};
let exploded_ball;

function gotName(){
  let name = document.getElementsByName("ball_name")[0].value;
  socket.emit('ball_name', name);
  document.getElementById("info").style.visibility = "hidden";
  document.getElementsByTagName("CANVAS")[0].style.visibility = "visible";
  allower=1;
}

function preload() {

  socket = io();
  terrain = new Terrain(MIN, MAX);

}

function test() {

  if (allower==1){
    push();
    translate(windowWidth / 2, (windowHeight/2) / 2);
    translate(-ball.pos.x, -ball.pos.y);
    background(92, 39, 81);
    terrain.draw(current_color, color(100, 87, 166));
    let mouse = createVector(mouseX - (windowWidth / 2) + ball.pos.x, mouseY - ((windowHeight/2) / 2) + ball.pos.y);
    
    if (!ball.alive) {
      console.log("entrei");
      if (contador3 == 0) {
        ball.explode();
        contador3 = Math.floor(Date.now()/1000);
      }
      else if ((Math.floor(Date.now()/1000)) - contador3 > 7) {
        contador3 = 0;
      }
      else {
        ball.draw();
      }
    }
    else {

      ball.move();
      ball.draw();
      ball.keepInside(terrain);
      stroke(92, 39, 81);
      line(mouse.x, mouse.y, ball.pos.x, ball.pos.y);

    }

    if (state_change) {
      if (color_option == 1) {
        current_color = COLOR_1;
      } else if (color_option == 2) {
        current_color = COLOR_2;
      } else if (color_option == 3) {
        current_color = COLOR_3;
      }
      ball.boost(p5.Vector.sub(mouse, ball.pos));
    }
    contador++;

    orb.draw();
    ball.checkOrb(orb);
    if ((orb.alive) && (ball.dist2(ball.pos, orb.pos) <= 1700)) {
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

        if (!balls[i].alive) {
          if (contador2 == 0) {
            exploded_ball = ball_aux;
            exploded_ball.explode();
            exploded_ball.alive = false;
            contador2 = Math.floor(Date.now()/1000);
          }
          else if ((Math.floor(Date.now()/1000)) - contador2 > 7) {
            exploded_ball = 0;
            contador2 = 0;
          }
          else {
            exploded_ball.draw();
          }
        }
        else {
          ball_aux.draw();
          fill(255);
          textAlign(CENTER);
          textSize(20);
          text(subset(balls[i].name, 0, 9), balls[i].x, balls[i].y + balls[i].r);
        }

        //touches returns true if the two balls touched
        if (hunter_ball.id == socket.id) {
          if(ball.touches(ball_aux)&&(balls[i].alive==true)){
            kill = {
              x: ball_aux.pos.x,
              y: ball_aux.pos.y,
              id: id
            };
            socket.emit('ball_killed', kill);
          }
        }

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

  createCanvas(windowWidth, (windowHeight/2));
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
      state_change = beat.state_change;
      color_option = beat.color;
      if ((recieved.terrain == true)&&(recieved.terrain == true)) {
        test();
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
      if (orb.alive == true) {
        orb.alive = false;
        orb.explode();
        hunter_ball = data.dangerous_boi;
      }
    }
    );

  socket.on('kill',
    function(data) {
      if (data.id == socket.id) {
        ball.alive = false;
        console.log("I died");
        setTimeout(()=>{
          socket.emit("disconnect");
          socket.disconnect();
        }, 7000);
      }
    }
    );
}

// function mousePressed() {
//   allower=1;
// }