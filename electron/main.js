const { app, BrowserWindow } = require("electron");
const WebSocket = require("ws");

let mainWindow;
let ws;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the deployed Next.js app
  const deployedAppURL = "https://signage-content-web-app.vercel.app/";
  mainWindow.loadURL(deployedAppURL);

  connectWebSocket();

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (ws) ws.close();
  });
}

function connectWebSocket() {
  ws = new WebSocket("ws://localhost:3001");

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
  });

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("Received message:", message);

    if (message.type === "page-update") {
      // Reload the window to reflect changes
      mainWindow.reload();
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    // Retry connection after 5 seconds
    setTimeout(connectWebSocket, 5000);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    // Retry connection after 5 seconds
    setTimeout(connectWebSocket, 5000);
  });

  return ws;
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
