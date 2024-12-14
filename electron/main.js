const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Final Project",
    autoHideMenuBar: true,
    width: 1600,
    height: 900,
    icon: path.join(__dirname, "assets", "logo.jpg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173/");

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.setTitle("My App");
    mainWindow.logo = path.join(__dirname, "assets", "logo.png");
  });

  mainWindow.setMenu(null);
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

ipcMain.on("upload-file", async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  if (result.canceled) {
    event.reply("upload-file-response", { success: false });
  } else {
    const filePath = result.filePaths[0];
    const destination = path.join(
      __dirname,
      "uploads",
      path.basename(filePath)
    );
    fs.copyFile(filePath, destination, (err) => {
      if (err) {
        event.reply("upload-file-response", {
          success: false,
          error: err.message,
        });
      } else {
        event.reply("upload-file-response", {
          success: true,
          path: destination,
        });
      }
    });
  }
});
