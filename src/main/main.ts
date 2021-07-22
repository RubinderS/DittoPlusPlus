/**
 * Entry point of the Election app.
 */
import {BrowserWindow, app, globalShortcut} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as Datastore from 'nedb';

global.Datastore = Datastore;

let mainWindow: Electron.BrowserWindow | null;

const isDevelopment = process.env.NODE_ENV === 'development';
const isDevserver = process.env.NODE_ENV === 'devserver';
let isWindowShowing = true;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minWidth: 200,
    minHeight: 200,
    frame: isDevelopment || isDevserver,
    webPreferences: {
      webSecurity: false,
      devTools: process.env.NODE_ENV === 'production' ? false : true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  if (isDevserver) {
    mainWindow.loadURL('http://localhost:5555/');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  mainWindow.setAlwaysOnTop(true);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function registerKeyboardShortcuts() {
  const res = globalShortcut.register('CommandOrControl+Shift+V', () => {
    if (mainWindow) {
      isWindowShowing ? mainWindow.hide() : mainWindow.show();
      isWindowShowing = !isWindowShowing;
    }
  });

  if (!res) {
    //
  }
}

function unRegisterKeyboardShortcuts() {
  globalShortcut.unregisterAll();
}

function onReady() {
  createWindow();
  registerKeyboardShortcuts();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', onReady);
app.dock.hide();

/**
 * win.setSkipTaskbar (true);
 *
 * {
 * // ...
 * skipTaskbar: true,
 * // ...
 * }
 *
 * https://stackoverflow.com/questions/59668664/how-to-avoid-showing-a-dock-icon-while-my-electron-app-is-launching-on-macos
 */

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  unRegisterKeyboardShortcuts();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
    registerKeyboardShortcuts();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
