// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path'); // Node.js module for working with file paths

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100, // Adjust width to fit your Pokedex layout comfortably
    height: 850, // Adjust height to fit your Pokedex layout comfortably
    webPreferences: {
      // Preload scripts are generally recommended for more complex interactions,
      // but might not be strictly necessary for just loading your existing JS.
      // preload: path.join(__dirname, 'preload.js'),

      // Security best practices:
      nodeIntegration: false, // Don't expose Node.js APIs directly to the renderer (your script.js)
      contextIsolation: true  // Keep Electron APIs and your web page scripts separate
    }
  });

  // Load the index.html of the app.
  // path.join ensures the correct path separators are used (/ or \)
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools (optional: useful for debugging, remove or comment out for final build)
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') { // 'darwin' is macOS
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require() them here.