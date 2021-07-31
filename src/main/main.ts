/**
 * Entry point of the Election app.
 */
import {
  BrowserWindow,
  Menu,
  Tray,
  app,
  globalShortcut,
  ipcMain,
  nativeImage,
  screen,
} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as Datastore from 'nedb';
import '@resources/clipboard-svgrepo-com.png';
import {GlobalEvents} from '@type/globalEvents';

global.Datastore = Datastore;

let mainWindow: Electron.BrowserWindow | null;
let tray = null;
let isWindowShowing = true;
let isQuitting = false;

const isDevelopment = process.env.NODE_ENV === 'development';
const isDevServer = process.env.NODE_ENV === 'devserver';

const iconPath = path.resolve(
  path.join(__dirname, 'src', 'resources', 'clipboard-svgrepo-com.png'),
);

function showWindow() {
  if (mainWindow) {
    const {x, y} = screen.getCursorScreenPoint();
    mainWindow.setPosition(x, y);

    // workaround to show the application on current desktop when using multiple desktops
    mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true}); // put the window on all screens
    mainWindow.focus(); // focus the window up front on the active screen
    mainWindow.setVisibleOnAllWorkspaces(false, {visibleOnFullScreen: true}); // disable all screen behavior

    mainWindow.show();
    isWindowShowing = true;
    mainWindow.webContents.send(GlobalEvents.ShowWindow);
  }
}

function hideWindow() {
  if (mainWindow) {
    mainWindow.hide();

    if (process.platform == 'darwin') {
      app.hide();
    }

    isWindowShowing = false;
    mainWindow.webContents.send(GlobalEvents.HideWindow);
  }
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minWidth: 200,
    minHeight: 200,
    frame: isDevelopment || isDevServer,
    icon: iconPath, // icon for visible on taskbar
    webPreferences: {
      webSecurity: false,
      devTools: process.env.NODE_ENV === 'production' ? false : true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.setSkipTaskbar(true);

  // and load the index.html of the app.
  if (isDevServer) {
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
    if (!isQuitting) {
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

  mainWindow.on('blur', () => {
    if (process.env.NODE_ENV === 'production') {
      hideWindow();
    }
  });
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
    tray = new Tray(
      nativeImage.createFromPath(iconPath).resize({width: 16, height: 16}),
    );

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show/Hide',
        type: 'normal',
        click: () => {
          toggleWindowVisibility();
        },
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);

    tray.on('click', () => {
      if (process.platform !== 'darwin') {
        toggleWindowVisibility();
      }
    });
    tray.setToolTip('Ditto++');
    tray.setContextMenu(contextMenu);

    ipcMain.on(GlobalEvents.ShowWindow, () => {
      showWindow();
    });

    ipcMain.on(GlobalEvents.HideWindow, () => {
      hideWindow();
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', onReady);

if (process.platform === 'darwin') {
  app.dock.hide();
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  unRegisterKeyboardShortcuts();
  if (process.platform !== 'darwin') {
    isQuitting = true;
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
