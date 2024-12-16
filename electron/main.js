const WebSocket = require("ws");
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");

let mainWindow;

async function createWindow() {
  const isDev = (await import("electron-is-dev")).default;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Connect to WebSocket server
  const ws = new WebSocket("ws://localhost:3000");

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
    ws.send("Hello from Electron!");
  });

  ws.on("message", (data) => {
    console.log("Message from server:", data);
    mainWindow.webContents.send("canvas-update", JSON.parse(data));
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
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

ipcMain.on("save-canvas", (event, canvasData) => {
  console.log("Received canvas data:", canvasData);
  // Handle saving or processing the canvas data in Electron
});
