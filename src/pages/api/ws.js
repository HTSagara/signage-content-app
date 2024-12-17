import { Server } from "ws";

let wsServer;

export default function handler(req, res) {
  if (!wsServer) {
    wsServer = new Server({ noServer: true });

    wsServer.on("connection", (socket) => {
      console.log("WebSocket connected.");

      socket.on("message", (message) => {
        console.log("Received:", message);
        socket.send(JSON.stringify({ message: "Acknowledged: " + message }));
      });

      socket.on("close", () => {
        console.log("WebSocket connection closed.");
      });
    });
  }

  res.status(200).end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
