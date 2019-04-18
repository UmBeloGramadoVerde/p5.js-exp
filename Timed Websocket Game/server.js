let express = require('express');
let random = require('random');
let angles = require('angle-functions');
let app = express();
let balls = [];
let MAX = 400;
let MIN = 30;
let terrain;

function Ball(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
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

Terrain.prototype.draw = function(color1, color2) {
  let i;

  noStroke();
  fill(color1);
  beginShape();
  for (i = 0; i < this.vertices_outer.length; i++) {
    vertex(this.vertices_outer[i].x, this.vertices_outer[i].y);
  }
  endShape();

  noStroke();
  fill(color2);
  beginShape();
  for (i = 0; i < this.vertices_inner.length; i++) {
    vertex(this.vertices_inner[i].x, this.vertices_inner[i].y);
  }
  endShape();
};

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

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', balls);
}



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("We have a new client: " + socket.id);


    socket.on('start',
      function(data) {
      	var ball_aux;
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        if (balls.length == 0) {
          terrain = new Terrain(MIN, MAX);
          terrain.setup();
        }
        ball_aux = new Ball(socket.id, data.x, data.y, data.r);
        balls.push(ball_aux);
        socket.emit('terrain', terrain);
      }
    );

    socket.on('update',
      function(data) {
        //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var ball=0;
        for (var i = 0; i < balls.length; i++) {
          if (socket.id == balls[i].id) {
            ball = balls[i];
          }
        }
        ball.x = data.x;
        ball.y = data.y;
      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);