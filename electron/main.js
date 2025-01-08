const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

let mainWindow;
let loadingWindow;

function createWindow() {
  // Create the loading window
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  loadingWindow.loadFile(path.join(__dirname, "loading.html"));

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
  // mainWindow.loadFile(path.join(__dirname, "../electron/dist/index.html"));

  mainWindow.setMenu(null);

  mainWindow.webContents.on("did-finish-load", () => {
    // Close the loading window and show the main window
    if (loadingWindow) loadingWindow.close();
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  });

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
