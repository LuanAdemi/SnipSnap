const {app, BrowserWindow, ipcMain, Tray} = require('electron');
const path = require('path');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('file-system')
const signale = require('signale')
var adapter = undefined
var db = undefined

let tray = undefined
let window = undefined

// Don't show the app in the doc
//





app.on('ready', () => {
  createTray()
  createWindow()
  fs.stat('db.json', function(err, stat) {
    if(err == null) {
      signale.complete('File already existing')
    } else if(err.code == 'ENOENT') {
        // file does not exist
        adapter = new FileSync('db.json')
        db = low(adapter)
        db.defaults({ snippets: [], count: {} }).write()
        db.get('snippets').push({ id: 1, title: 'Arduino SD',tags: 'arduino,sd',used: 0,code:'import SD',colors:'black,black'}).write()
        db.set('count.count', 1).write()
        signale.success('Created new DB!')
    } else {
        console.log('Some other error: ', err.code);
    }
  });
})

const createTray = () => {
  tray = new Tray(path.join('assets/tray.png'))
  tray.on('click', function (event) {
    toggleWindow()
  });
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x: x, y: y};
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 320,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      backgroundThrottling: false
    }
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  //window.toggleDevTools();
  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
      window.webContents.send('windowisnotfocused');
    }
  })
}


const createEditor = () => {
  editorwindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: true,
    fullscreenable: false,
    resizable: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      backgroundThrottling: false
    }
  })
  editorwindow.loadURL(`file://${path.join(__dirname, 'editor.html')}`)
  //window.toggleDevTools();
  // Hide the window when it loses focus
  editorwindow.on('blur', () => {
  editorwindow.close();
  })

}

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.webContents.send('windowisfocused');
}

ipcMain.on('show-window', () => {
  showWindow()
})
ipcMain.on('quit', () => {
  app.quit();
})

ipcMain.on('open-editor-window', () => {
  createEditor()
})
