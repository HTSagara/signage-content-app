const { app, BrowserWindow } = require("electron");
const path = require("path");
const WebSocket = require("ws");

let mainWindow;

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

  // Connect to the WebSocket server
  const ws = new WebSocket("ws://localhost:3001");

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
    ws.send("Hello from Electron!");
  });

  ws.on("message", (data) => {
    console.log("Message from server:", data);
    mainWindow.webContents.send("canvas-update", JSON.parse(data));
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    ws.close();
  });
}

app.on("ready", createWindow);
