const WebSocket = require("ws");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3001;

app.use(express.json());

// Webhook endpoint to receive updates from Vercel
app.post("/webhook", (req, res) => {
  const update = req.body;
  console.log("Received update: ", update);

  // Broadcast the update to connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "page-update",
          data: update,
        })
      );
    }
  });

  res.status(200).send("OK");
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to WebSocket server",
    })
  );

  ws.on("message", (data) => {
    console.log(`Received from client: ${data}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
