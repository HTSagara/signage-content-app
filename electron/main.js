import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import WebSocket from "ws";
import dns from "dns/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let ws;

const deployedAppURL = "https://signage-content-web-app.vercel.app/";
const localAppURL = "http://localhost:3000";

async function isInternetConnected() {
  try {
    await dns.lookup("example.com");
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
  mainWindow.webContents.openDevTools();
}

function setupWebSocket() {
  ws = new WebSocket("ws://localhost:3001");

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log("Electron received message:", message); // Debug log

      if (message.type === "canvas-update" && mainWindow) {
        console.log("Sending to renderer process:", message.data); // Debug log
        mainWindow.webContents.send("canvas-update", message.data);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      console.error("Raw message:", data.toString());
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    setTimeout(setupWebSocket, 5000);
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
