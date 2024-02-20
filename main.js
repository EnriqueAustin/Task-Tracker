const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

let win = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
// var isDev

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        alwaysOnTop: true,
    });

    let startUrl;
    if (isDev) {
        startUrl = 'http://localhost:8080'; // Vue dev server URL
        console.log('Loading from Vue dev server:', startUrl);
    } else {
        // Correctly construct the file path for production
        const prodPath = path.join(__dirname, 'vueapp/dist/index.html');
        startUrl = `file://${prodPath}`;
        console.log('Loading production build:', startUrl);
    }

    win.loadURL(startUrl); // Use loadURL for both local files and http URLs

    win.on('closed', () => {
        win = null; // Dereference the window object
    });
}

function promptForWorkLog() {
    if (win === null) {
        createWindow(); // Only create a new window if one doesn't already exist
    } else {
      // If the window exists, bring it to the front
        win.focus();
    }
}

function minutesToMilliseconds(minutes) {
    return minutes * 60000; // 1 minute = 60000 milliseconds
}

setInterval(promptForWorkLog, minutesToMilliseconds(1));

app.whenReady().then(() => {
    createWindow();

    const menu = Menu.buildFromTemplate([
      {
        label: 'File',
        submenu: [
          {
            label: 'Exit',
            click: () => {
              const choice = dialog.showMessageBoxSync(win, {
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: 'Are you sure you want to quit?'
              });
              if (choice === 0) { // The 'Yes' option
                app.quit();
              }
            }
          }
        ]
      },
    {
        label: 'Settings',
        submenu: [
        {
            label: 'Might Come Soon I Guess'
        }
        ]
    }
]);
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('quit-app', () => {
    if (!win) return; // Check if the window exists

    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: 'Are you sure you want to quit?'
    });
    // console.log(choice); // Helpful for debugging
    if (choice === 0) { // If 'Yes' is chosen, then quit the app
      app.quit();
    }
    // If 'No' is chosen, do nothing, thus not calling app.quit()
});

ipcMain.on('save-log', (event, workLog) => {
    const now = new Date();
    const dateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const documentsPath = path.join(os.homedir(), 'Documents');
    const logFilePath = path.join(documentsPath, 'WorkLogs', `${dateString}.txt`);

    fs.mkdir(path.join(documentsPath, 'WorkLogs'), { recursive: true }, (err) => {
        if (err) throw err;

        fs.appendFile(logFilePath, `${new Date().toLocaleTimeString()}: ${workLog}\n`, (err) => {
            if (err) throw err;
            console.log('Log saved successfully.');
        });
    });
    if (win !== null) {
        win.close(); // Close the window after saving the log
    } else {
        alert('Failed to save the log. Please try again.');
      }
});

// ipcMain.on('quit-app', () => {
//     app.quit();
// });
