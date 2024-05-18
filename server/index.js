const express = require("express");
const http = require("node:http");
const os = require("os");
const { Server: SocketServer } = require("socket.io");
const pty = require("node-pty");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const ptyProcess = pty.spawn(shell, [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD,
  env: process.env,
});

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

io.attach(server);

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(9000, () => {
  console.log("server running at http://localhost:9000");
});
