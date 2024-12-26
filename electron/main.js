const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Final Project",
    autoHideMenuBar: true,
    width: 1800,
    height: 1100,
    icon: path.join(__dirname, "assets", "logo.jpg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Enable context isolation
      nodeIntegration: false, // Disable node integration
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL("http://localhost:5173/");
  mainWindow.setMenu(null);

  app.commandLine.appendSwitch("enable-gpu-rasterization");
  app.commandLine.appendSwitch("enable-zero-copy");
  app.commandLine.appendSwitch("ignore-gpu-blacklist");
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
