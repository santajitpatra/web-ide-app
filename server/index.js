var cors = require("cors");
const fs = require("fs/promises");
const express = require("express");
const http = require("node:http");
const os = require("os");
const path = require("path");
const pty = require("node-pty");
const { Server: SocketServer } = require("socket.io");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const ptyProcess = pty.spawn(shell, [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env,
});

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

app.use(cors());

io.attach(server);

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

app.get("/files", async (req, res) => {
  const fileTree = await generateFileTree(process.env.INIT_CWD + "/user");
  return res.json({ tree: fileTree });
});

server.listen(9000, () => {
  console.log("server running at http://localhost:9000");
});

async function generateFileTree(directory) {
  const tree = {};

  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }

  await buildTree(directory, tree);
  return tree;
}
