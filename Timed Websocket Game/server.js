let express = require('express');
let random = require('random');
let angles = require('angle-functions');
let app = express();
let balls = [];
let orb;
let MAX = 400;
let MIN = 30;
let terrain;
let running=false;
let contador2 = 0;

function Ball(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.alive = true;
}

function Terrain(r_min, r_max) {
  this.points_inner = 20;
  this.points_outer = 40;
  this.radius_min = r_min;
  this.radius_max = r_max;
  this.vertices_inner = [];
  this.vertices_outer = [];
  this.midpoint = (this.radius_max - this.radius_min) / 3;
  this.body_inner;
  this.body_outer;
}

Terrain.prototype.setup = function() {
  let i;
  let xaux, yaux;
  let radius;

  //***Generating terrain path***

  //inner
  for (i = 0; i < this.points_inner; i++) {
    radius = random.float(min = this.radius_min, max = this.radius_min + this.midpoint);
    xaux = angles.cos((360 / this.points_inner) * i) * radius;
    yaux = angles.sin((360 / this.points_inner) * i) * radius;
    this.vertices_inner.push({ x: xaux, y: yaux });
  }
  this.vertices_inner[this.points_inner-1] = this.vertices_inner[0];
  this.vertices_inner[this.points_inner] = this.vertices_inner[1];

  //outer
  for (i = 0; i < this.points_outer; i++) {
    radius = random.float(min = this.radius_max - this.midpoint, max = this.radius_max);
    xaux = angles.cos((360 / this.points_outer) * i) * radius;
    yaux = angles.sin((360 / this.points_outer) * i) * radius;
    this.vertices_outer[i] = { x: xaux, y: yaux };
  }
  this.vertices_outer[this.points_outer-1] = this.vertices_outer[0];
  this.vertices_outer[this.points_outer] = this.vertices_outer[1];

};

function Orb(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.particles = [];
  this.alive = true;
}

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// setInterval(heartbeat, 20);

let last_frame_mil=0;
let color_counter=0;

function heartbeat() {
  //tells the balls if they should change the state of the playing field
  let state=false;

  //process.hrtime returns array with tim in seconds and high resolution time in nanoseconds, we take second index and transform to mili
  let diff = (process.hrtime()[0] - last_frame_mil);
  if (diff >= 2) {
    color_counter = (color_counter) % 3 + 1;
    state = true;
    last_frame_mil = last_frame_mil + diff;
  }

  beat = {
    state_change: state,
    color: color_counter,
    balls: balls,
    orb: orb
  };
  io.sockets.emit('heartbeat', beat);

  if (!orb.alive) {
    if (contador2 == 0) {
      contador2 = Math.floor(Date.now()/1000);
    }
    if ((Math.floor(Date.now()/1000)) - contador2 > 7) {
      orb = new Orb(((MAX + MIN) / 2) * angles.cos(random.float(0, 360)), ((MAX + MIN) / 2) * angles.sin(random.float(0, 360)), 20);
      contador2 = 0;
    }
  }


}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("We have a new client: " + socket.id);


    socket.on('start',
      function(data) {
      	let ball_aux;
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        if (balls.length == 0) {
          terrain = new Terrain(MIN, MAX);
          terrain.setup();
          orb = new Orb(((MAX + MIN) / 2) * angles.cos(random.float(0, 360)), ((MAX + MIN) / 2) * angles.sin(random.float(0, 360)), 20);
        }
        ball_aux = new Ball(socket.id, data.x, data.y, data.r);
        balls.push(ball_aux);
        socket.emit('terrain', terrain);
        socket.emit('orb', orb);
        if (!running) {setInterval(heartbeat, 20);running=true;} 
      }
      );

    socket.on('update',
      function(data) {
        //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        let ball=0;
        for (let i = 0; i < balls.length; i++) {
          if (socket.id == balls[i].id) {
            ball = balls[i];
          }
        }
        ball.x = data.x;
        ball.y = data.y;       
      }
      );

    socket.on('orb_killed',
      function(data) {
        //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        let ball;
        let pos_orb = {x: orb.x, y: orb.y};
        for (let i = 0; i < balls.length; i++) {
          if (socket.id == balls[i].id) {
            ball = balls[i];
          }
        }
        let delta = (ball.x - pos_orb.x)*(ball.x - pos_orb.x) + (ball.y - pos_orb.y)*(ball.y - pos_orb.y);
        if (delta <= 1700) {
          if (orb.alive == true) {
            taken = {
              dangerous_boi: ball,
              orb: orb
            };
            io.sockets.emit('orb_taken', taken);
            orb.alive = false;
          }
        }    
      }
      );

    socket.on('ball_killed',
      function(data) {
        let ball;
        let ball_aux = {x: data.x, y: data.y};
        let ball_killed;
        for (let i = 0; i < balls.length; i++) {
          if (socket.id == balls[i].id) {
            ball = balls[i];
          }
        }
        let delta = (ball.x - ball_aux.x)*(ball.x - ball_aux.x) + (ball.y - ball_aux.y)*(ball.y - ball_aux.y);
        if (delta <= 1700) {
          for (let j = 0; j < balls.length; j++) {
            if (data.id == balls[j].id) {
              ball_killed = balls[j];
            }
          }
          if (ball_killed.alive == true) {
            kill = {
              id: ball_killed.id
            };
            io.local.emit('kill', kill);
            ball_killed.alive = false;
          }
        }    
      }
      );

    socket.on('disconnect', function() {
      for (let i = 0; i < balls.length; i++) {
        if (socket.id == balls[i].id) {
          console.log("Client "+socket.id+" has disconnected");
          balls.pop(balls[i]);
        }
      }
    });
  }
  );