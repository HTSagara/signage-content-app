import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    const validChannels = ["client-event"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ["canvas-update"];
    if (validChannels.includes(channel)) {
      // Remove any existing listeners
      ipcRenderer.removeAllListeners(channel);
      // Add the new listener
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
