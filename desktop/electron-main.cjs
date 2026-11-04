/**
 * OPENLAB 3D — ELECTRON DESKTOP RUNTIME & OFFLINE RUNNER
 * High-performance 60+ FPS WebGL 2.0 Desktop Container for Windows / macOS / Linux
 */

const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const url = require('url');

// GPU & WebGL acceleration flags for 60+ FPS rendering
app.commandLine.appendSwitch('enable-webgl2-compute-context');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('high-dpi-support', '1');

let mainWindow = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1600, width),
    height: Math.min(950, height),
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: '#0a0f1d',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableWebSQL: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    title: 'OpenLab 3D — Phòng Thí Nghiệm Khoa Học Tự Nhiên 3D',
    autoHideMenuBar: true,
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
