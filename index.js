console.log("MindReply Node server is running");

import http from "http";
nmp run build
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("MindReply Node.js server is working");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
