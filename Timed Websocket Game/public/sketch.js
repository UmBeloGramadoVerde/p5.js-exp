//FIX DISTANCE OF ORB DETECTION
//FIX PUSH DISTANCE
//FIX TIME FOR RESIDUAL ORB EXPLODING

//IMPLEMENT ORB TAKING SOUND

//this is default value, but is updated based based on screen size
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
let FRIEND_COLOR;
let HUNTER_COLOR;
let current_color;
let socket;
let balls = [];
let data;
let allower=0;
let hunter_ball=0;
let connection_id;
let recieved = {terrain: false, orb: false};
let exploded_ball;
let respawning_flag = false;
let respawning = 0;
let TIME_FOR_RESPAWN = 5;

function gotName(){
  
  ball = new Ball(socket.id, ((MAX + MIN) / 2) * cos(random(0, 360)), ((MAX + MIN) / 2) * sin(random(0, 360)), 20);
  data = {
    x: ball.pos.x,
    y: ball.pos.y,
    r: ball.r
  };
  socket.emit('start', data);

  let name = document.getElementsByName("ball_name")[0].value;
  socket.emit('ball_name', name);
  document.getElementById("info").style.visibility = "hidden";
  document.getElementsByTagName("CANVAS")[0].style.visibility = "visible";
  document.getElementById("mute_button").style.visibility = "visible";
  document.getElementById("respawn_button").style.visibility = "visible";
  document.getElementById("music").play();

  allower=1;
}

function preload() {

  socket = io();
  terrain = new Terrain(MIN, MAX);

}

function test() {

  if (allower==1){
    push();
    translate(width / 2, height / 2);
    translate(-ball.pos.x, -ball.pos.y);
    background(92, 39, 81);
    terrain.draw(current_color, color(100, 87, 166));
    let mouse = createVector(mouseX - (width / 2) + ball.pos.x, mouseY - (height / 2) + ball.pos.y);
    
    if (!ball.alive) {
      if (contador3 == 0) {
        ball.explode();
        contador3 = Math.floor(Date.now()/1000);
      }
      else if ((Math.floor(Date.now()/1000)) - contador3 > 7) {
        contador3 = 0;
      }
      else {
        ball.draw(FRIEND_COLOR);
      }
    }
    else {

      ball.move();
      if (socket.id == hunter_ball.id) {
        ball.draw(HUNTER_COLOR);
      }
      else {
        ball.draw(FRIEND_COLOR);
      }
      ball.keepInside(terrain);
      stroke(92, 39, 81);
      line(mouse.x, mouse.y, ball.pos.x, ball.pos.y);
    }

    if (hunter_ball.id == socket.id) {music_speed(1.5);}
    else {music_speed(1);}

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
            exploded_ball.draw(FRIEND_COLOR);
          }
        }
        else {
          if (balls[i].id == hunter_ball.id) {
            ball_aux.draw(HUNTER_COLOR);
          }
          else {
            ball_aux.draw(FRIEND_COLOR);
          }
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

    //respawning_flag lets me run this only once. The flag is lowred after the setTimeout runs.
    if (respawning_flag == true) {

      if (respawning == 0) {
        respawning = Math.floor(Date.now()/1000);
      }
      else if ((Math.floor(Date.now()/1000)) - respawning > TIME_FOR_RESPAWN) {
        ball.alive = true;
        ball = new Ball(socket.id, ((MAX + MIN) / 2) * cos(random(0, 360)), ((MAX + MIN) / 2) * sin(random(0, 360)), 20);
        socket.emit('respawn', socket.id);
        respawning_flag = false;
        respawning = 0;
        document.getElementById("respawn_button").innerHTML = "RESPAWN";
      }
      else {
        document.getElementById("respawn_button").innerHTML = TIME_FOR_RESPAWN + 1 - (Math.floor(Date.now()/1000) - respawning);
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
  if (windowWidth < windowHeight){
    height = windowWidth;
    width = windowWidth;
  }
  else if (windowWidth >= windowHeight){
    height = windowHeight;
    width = windowHeight;
    document.getElementById("defaultCanvas0").style.top = "0vh";
    var margin = (windowWidth - width) / 2;
    margin = margin * 100 / windowWidth;
    document.getElementById("defaultCanvas0").style.left = floor(margin)+"vw";
    document.getElementById("mute_button").style.zIndex = "10";
    document.getElementById("respawn_button").style.zIndex = "11";
  }

  createCanvas(width, height);
  orb = new Orb(MAX*10, MAX*10, 20);
  COLOR_1 = color(157, 172, 255);
  COLOR_2 = color(210, 190, 235);
  COLOR_3 = color(255, 210, 215);
  FRIEND_COLOR = color(75, 192, 217);
  HUNTER_COLOR = color(216, 17, 89);
  current_color = COLOR_1;

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

      killFeed(hunter_ball.name, data.name);

      if (data.id == socket.id) {
        ball.alive = false;
        // setTimeout(()=>{
        //   socket.emit("disconnect");
        //   socket.disconnect();
        // }, 7000);
        respawn();
      }
    }
    );
}

function mute(){
  var music = document.getElementById("music");
  music.muted = !music.muted;
}

function music_speed(speed){
  var music = document.getElementById("music");
  music.playbackRate = speed;
}

function killFeed(killer, killed) {
  var feed = document.getElementById("kill_feed");
  feed.innerHTML = killer + " killed " + killed;
  feed.style.visibility = "visible";
  setTimeout(()=>{
    feed.style.visibility = "hidden"
  }, 3000);
}

function respawn() {
  respawning_flag = !respawning_flag;
  if (respawning_flag == false) {document.getElementById("respawn_button").innerHTML = "RESPAWN";}
}

// function mousePressed() {
//   allower=1;
// }