
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'ObjectVerse-Dex — Christmas Calendar',
    icon: path.join(__dirname, 'assets', 'calendar-icon.ico'),
    backgroundColor: '#0b202c',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      devTools: true
    }
  });

  Menu.setApplicationMenu(null);

  const gamePath = path.join(__dirname, 'game', 'index.html');

  win.loadFile(gamePath).catch(error => {
    console.error('FAILED TO LOAD CALENDAR:', error);
  });

  win.webContents.on('did-fail-load', (event, code, description, url) => {
    console.error('LOAD ERROR:', code, description, url);
  });

  win.webContents.on('did-finish-load', () => {
    console.log('Calendar HTML loaded successfully.');
  });

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  win.on('page-title-updated', event => event.preventDefault());

  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;

    if (input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    }

    if (input.key === 'F5' ||
        (input.control && input.key.toLowerCase() === 'r')) {
      event.preventDefault();
    }
  });

  // Temporary debugging shortcut
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' &&
        input.control &&
        input.shift &&
        input.key.toLowerCase() === 'i') {
      win.webContents.openDevTools();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
