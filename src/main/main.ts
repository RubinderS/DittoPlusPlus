/**
 * Entry point of the Election app.
 */
import {BrowserWindow, Menu, Tray, app, globalShortcut} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as Datastore from 'nedb';
import '@resources/icon.png';
import '@resources/clipboard-svgrepo-com.png';

global.Datastore = Datastore;

let mainWindow: Electron.BrowserWindow | null;
let tray = null;
let isWindowShowing = true;
let isQuiting = false;

const isDevelopment = process.env.NODE_ENV === 'development';
const isDevserver = process.env.NODE_ENV === 'devserver';

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minWidth: 200,
    minHeight: 200,
    frame: isDevelopment || isDevserver,
    skipTaskbar: true, // hide from taskbar for Windows
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

  mainWindow.on('minimize', (event: any) => {
    event.preventDefault();
    hideWindow();
  });

  mainWindow.on('close', (event: any) => {
    if (!isQuiting) {
      event.preventDefault();
      hideWindow();
    }

    return false;
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function showWindow() {
  if (mainWindow) {
    mainWindow.show();
    isWindowShowing = true;
  }
}

function hideWindow() {
  if (mainWindow) {
    mainWindow.hide();
    isWindowShowing = false;
  }
}

function toggleWindowVisibility() {
  isWindowShowing ? hideWindow() : showWindow();
}

function registerKeyboardShortcuts() {
  const res = globalShortcut.register('CommandOrControl+Shift+V', () => {
    toggleWindowVisibility();
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
  app.whenReady().then(() => {
    tray = new Tray(`src/resources/clipboard-svgrepo-com.png`);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open',
        type: 'normal',
        click: () => {
          showWindow();
        },
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          isQuiting = true;
          app.quit();
        },
      },
    ]);

    tray.on('click', () => {
      toggleWindowVisibility();
    });
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', onReady);

if (process.platform === 'darwin') {
  app.dock.hide();
}

/**
 * https://stackoverflow.com/questions/59668664/how-to-avoid-showing-a-dock-icon-while-my-electron-app-is-launching-on-macos
 */

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  unRegisterKeyboardShortcuts();
  if (process.platform !== 'darwin') {
    isQuiting = true;
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
