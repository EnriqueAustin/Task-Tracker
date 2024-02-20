const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveLog: (log) => ipcRenderer.send('save-log', log),
    quitApp: () => ipcRenderer.send('quit-app')
});