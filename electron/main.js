const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const WebSocket = require("ws");
const dns = require("dns").promises;

let mainWindow;
let ws;

const deployedAppURL = "https://signage-content-web-app.vercel.app/";
const localAppURL = "http://localhost:3000";

async function isInternetConnected() {
  try {
    await dns.lookup(deployedAppURL);
    return true;
  } catch {
    return false;
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const isOnline = await isInternetConnected();

  try {
    if (isOnline) {
      console.log("Internet connection detected. Loading deployed app...");
      await mainWindow.loadURL(deployedAppURL);
    } else {
      console.log("No internet connection detected. Loading local app...");
      await mainWindow.loadURL(localAppURL);
    }
  } catch (error) {
    console.error("Failed to load app:", error);
    try {
      await mainWindow.loadURL(localAppURL);
    } catch (err) {
      console.error("Failed to load local app:", err);
    }
  }

  setupWebSocket();

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
}

function setupWebSocket() {
  ws = new WebSocket("ws://localhost:3001");

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
    ws.send("Hello from Electron!");
  });

  ws.on("message", (data) => {
    console.log("Message from server:", data);
    if (mainWindow) {
      mainWindow.webContents.send("canvas-update", JSON.parse(data));
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
