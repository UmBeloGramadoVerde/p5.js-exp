let express = require('express');
let app = express();
let balls = [];

function Ball(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
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

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', balls);
  console.log(balls);
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
        ball_aux = new Ball(socket.id, data.x, data.y, data.r);
        balls.push(ball_aux);
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