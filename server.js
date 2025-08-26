import express from "express";
import { WebSocketServer } from "ws";
import pty from "node-pty";

const app = express();
const server = app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("⚡ Client connected");

  // Spawn a Python process (you can change to bash, node, etc.)
  const shell = pty.spawn("python3", [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  // Send process output to terminal
  shell.on("data", (data) => ws.send(data));

  // Send user input from terminal → process stdin
  ws.on("message", (msg) => shell.write(msg));

  ws.on("close", () => shell.kill());
});

