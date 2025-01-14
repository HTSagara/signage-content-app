const { app, BrowserWindow } = require("electron");
const path = require("path");
const WebSocket = require("ws");
const dns = require("dns").promises;

let mainWindow;

async function isInternetConnected() {
  try {
    // Check if DNS resolution works
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
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const deployedAppURL = "https://signage-content-web-app.vercel.app/";
  const localAppURL = "http://localhost:3000";

  // Check for internet connection
  const isOnline = await isInternetConnected();

  if (isOnline) {
    console.log("Internet connection detected. Loading deployed app...");
    mainWindow.loadURL(deployedAppURL).catch(() => {
      console.error(
        "Failed to load deployed app. Falling back to local app..."
      );
      mainWindow.loadURL(localAppURL);
    });
  } else {
    console.log("No internet connection detected. Loading local app...");
    mainWindow.loadURL(localAppURL);
  }

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
