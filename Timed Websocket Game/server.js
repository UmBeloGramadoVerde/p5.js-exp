let express = require('express');
let app = express();
let host = 3010
let server = app.listen(host)


app.use(express.static('public'));

console.log("Socket server is running. localhost:" + host)

let socket = require('socket.io')
let io = socket(server);

io.sockets.on('connection', newConnection)

function newConnection(socket) {
  console.log('connection:', socket.id);
  socket.on('ball', updateBall);

  function updateBall(data) {
    socket.broadcast.emit('ball', data)
    console.log(data)
  }
}