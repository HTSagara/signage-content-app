const { WebSocket, WebSocketServer } = require("ws");

const server = new WebSocketServer({ port: 3001 });
const connectedClients = new Set();
let currentCanvasState = null;

server.on("connection", (ws) => {
  // Assign a unique ID to each client
  ws.id = Math.random().toString(36).substr(2, 9);
  connectedClients.add(ws);
  console.log(
    `Client ${ws.id} connected, total clients:`,
    connectedClients.size
  );

  // Send current canvas state to new clients
  if (currentCanvasState) {
    console.log("Sending current state to new client");
    ws.send(
      JSON.stringify({
        type: "canvas-update",
        data: currentCanvasState,
        sourceClientId: ws.id, // Add source client ID
      })
    );
  }

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const messageId = Math.random().toString(36).substr(2, 9); // Generate unique message ID

      console.log(
        `Received message type: ${parsedMessage.type} from client ${ws.id}`
      );

      if (parsedMessage.type === "canvas-update") {
        currentCanvasState = parsedMessage.data;

        // Add message ID and source client ID to the message
        const broadcastMessage = JSON.stringify({
          type: "canvas-update",
          data: currentCanvasState,
          sourceClientId: ws.id,
          messageId: messageId,
        });

        console.log(
          `Broadcasting to ${connectedClients.size - 1} other clients`
        );

        // Broadcast to all other clients
        connectedClients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log(`Sending update to client ${client.id}`);
            client.send(broadcastMessage);
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      console.error("Raw message:", message.toString());
    }
  });

  ws.on("error", (error) => {
    console.error(`WebSocket client ${ws.id} error:`, error);
  });

  ws.on("close", () => {
    connectedClients.delete(ws);
    console.log(
      `Client ${ws.id} disconnected, total clients:`,
      connectedClients.size
    );
  });
});

server.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  server.close(() => {
    console.log("Server closed");
    process.exit();
  });
});

console.log("WebSocket server running on port 3001");
