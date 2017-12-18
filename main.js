const {app, BrowserWindow, shell} = require('electron'),
    path = require('path'),
    url = require('url');

let win;

const appURL = process.env.ELECTRON_DEV_URL || url.format({
        pathname: path.join(__dirname, 'build/index.html'),
        protocol: 'file:',
        slashes: true
    }),
    handleRedirect = (e, url) => {
        if (url !== win.webContents.getURL()) {
            e.preventDefault()
            shell.openExternal(url)
        }
    },
    createWindow = () => {
        win = new BrowserWindow({
            fullscreen: true,
            icon: path.join(__dirname, 'public/icons/64x64.png')
        });

        win.on('closed', () => {
            win = null;
        });
        win
            .webContents
            .on('will-navigate', handleRedirect)
            .on('new-window', handleRedirect)

        if (process.env.ELECTRON_DEV_URL) {
            win
                .webContents
                .openDevTools();
        }

        win.loadURL(appURL);
    };

app
    .on('activate', () => {
        if (win === null) {
            createWindow();
        }
    })
    .on('ready', createWindow)
    .on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });