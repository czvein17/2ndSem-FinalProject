const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

let mainWindow;
let loadingWindow;

function createWindow() {
  loadingWindow = new BrowserWindow({
    width: 1000,
    height: 8000,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  loadingWindow.loadFile(path.join(__dirname, "loading.html"));

  // REMOVE `const` to update the global variable
  mainWindow = new BrowserWindow({
    title: "Final Project",
    autoHideMenuBar: true,
    width: 1800,
    height: 1100,
    icon: path.join(__dirname, "assets", "logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL("http://localhost:5173/");
  mainWindow.setMenu(null);

  mainWindow.webContents.on("did-finish-load", () => {
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
    // mainWindow.webContents.openDevTools();
  });

  mainWindow.on("closed", () => {
    mainWindow = null; // Prevent further access to a destroyed object
  });

  app.commandLine.appendSwitch("enable-gpu-rasterization");
  app.commandLine.appendSwitch("enable-zero-copy");
  app.commandLine.appendSwitch("ignore-gpu-blacklist");
}

if (mainWindow && !mainWindow.isDestroyed()) {
  mainWindow.webContents.openDevTools();
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
