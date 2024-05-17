const express = require("express");
const { http } = require("http");
const { Server: SocketServer } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

io.attach(server)

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(9000, () => {
  console.log("server running at http://localhost:9000");
});
