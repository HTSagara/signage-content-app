const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

console.log("WebSocket server is running on ws://localhost:3001");

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send a proper JSON message
  ws.send(JSON.stringify({ message: "Hello, client!" }));

  ws.on("message", (data) => {
    console.log(`Received from client: ${data}`);
    // Echo the message back
    ws.send(JSON.stringify({ echo: data }));
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
