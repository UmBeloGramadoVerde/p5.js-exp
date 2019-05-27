var express = require('express');
const randomFloat = require('random-float');
var angles = require('angle-functions');
var app = express();
var balls = [];
var orb;
var MAX = 400;
var MIN = 30;
var terrain;
var running=false;
var contador2 = 0;

function Ball(id, x, y, r, name) {
  this.id = id;
  this.name="placeholder";
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
  var i;
  var xaux, yaux;
  var radius;

  //***Generating terrain path***

  //inner
  for (i = 0; i < this.points_inner; i++) {
    radius = randomFloat(min = this.radius_min, max = this.radius_min + this.midpoint);
    xaux = angles.cos((360 / this.points_inner) * i) * radius;
    yaux = angles.sin((360 / this.points_inner) * i) * radius;
    this.vertices_inner.push({ x: xaux, y: yaux });
  }
  this.vertices_inner[this.points_inner-1] = this.vertices_inner[0];
  this.vertices_inner[this.points_inner] = this.vertices_inner[1];

  //outer
  for (i = 0; i < this.points_outer; i++) {
    radius = randomFloat(min = this.radius_max - this.midpoint, max = this.radius_max);
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
var server = app.listen(process.env.PORT || 3010, listen);

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

var last_frame_mil=0;
var color_counter=0;

function heartbeat() {
  //tells the balls if they should change the state of the playing field
  var state=false;

  //process.hrtime returns array with tim in seconds and high resolution time in nanoseconds, we take second index and transform to mili
  var diff = (process.hrtime()[0] - last_frame_mil);
  if (diff >= 1) {
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
      orb = new Orb(((MAX + MIN) / 2) * angles.cos(randomFloat(0, 360)), ((MAX + MIN) / 2) * angles.sin(randomFloat(0, 360)), 20);
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
      	var ball_aux;
        if (balls.length == 0) {
          terrain = new Terrain(MIN, MAX);
          terrain.setup();
          orb = new Orb(((MAX + MIN) / 2) * angles.cos(randomFloat(0, 360)), ((MAX + MIN) / 2) * angles.sin(randomFloat(0, 360)), 20);
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

    socket.on('orb_killed',
      function(data) {
        var ball=0;
        var pos_orb = {x: orb.x, y: orb.y};
        for (var i = 0; i < balls.length; i++) {
          if (socket.id == balls[i].id) {
            ball = balls[i];
          }
        }
        if (ball != 0) {
          var delta = (ball.x - pos_orb.x)*(ball.x - pos_orb.x) + (ball.y - pos_orb.y)*(ball.y - pos_orb.y);
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
      }
      );

    socket.on('ball_killed',
      function(data) {
        var ball=0;
        var ball_aux = {x: data.x, y: data.y};
        var ball_killed;
        var index;
        for (var i = 0; i < balls.length; i++) {
          if (socket.id == balls[i].id) {
            ball = balls[i];
          }
        }
        //at the orb_killed function the above assumption that ball socket.id would be equal to some id in balls was giving errors
        //with that in mind I fixed it here as well, we just set the initial value to 0 and check if it's still the same
        if (ball!=0) {
          var delta = (ball.x - ball_aux.x)*(ball.x - ball_aux.x) + (ball.y - ball_aux.y)*(ball.y - ball_aux.y);
          if (delta <= 1700) {
            for (var j = 0; j < balls.length; j++) {
              if (data.id == balls[j].id) {
                ball_killed = balls[j];
                index = j;
              }
            }
            if (ball_killed.alive == true) {
              kill = {
                id: ball_killed.id,
                name: ball_killed.name
              };
              io.local.emit('kill', kill);
              balls[index].alive = false;
            }
          } 
        }   
      }
      );

    socket.on('respawn',
      function(id) {
        console.log("####ANTES#####");
        for (var i = 0; i < balls.length; i++) {
          console.log("i: "+i+" balls[i].alive: "+balls[i].alive+" balls[i].id: "+balls[i].id);
        }   
        console.log("#########");
        console.log("");
        console.log("####DEPOIS#####");
        for (var i = 0; i < balls.length; i++) {
          if (id == balls[i].id) {
            console.log("id: "+id+" balls[i].id: "+balls[i].id);
            balls[i].alive = true;
          }
          console.log("i: "+i+" balls[i].alive: "+balls[i].alive+" balls[i].id: "+balls[i].id);
        }   
        console.log("#########");
        console.log("");   
      }
      );

    socket.on('disconnect', function() {
      for (var i = 0; i < balls.length; i++) {
        if (socket.id == balls[i].id) {
          console.log("Client "+socket.id+" has disconnected");
          balls.pop(balls[i]);
        }
      }
    });

    socket.on('ball_name', function(data) {
      for (var i = 0; i < balls.length; i++) {
        if (socket.id == balls[i].id) {
          balls[i].name = data;
        }
      }
    });
  }
  );