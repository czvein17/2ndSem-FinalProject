const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },

  uploadFile: () => ipcRenderer.send("upload-file"),
  onUploadFileResponse: (callback) =>
    ipcRenderer.on("upload-file-response", (event, response) =>
      callback(response)
    ),
});
