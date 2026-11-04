/**
 * OPENLAB 3D — ELECTRON PRELOAD SCRIPT
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('openLabDesktop', {
  platform: process.platform,
  isElectron: true,
  version: '3.0.0',
});
