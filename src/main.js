const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;
let settingWindow;
function createWindow () {
  	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false, // is default value after Electron v5
			contextIsolation: true, // protect against prototype pollution
			enableRemoteModule: false, // turn off remote
			preload: path.join(__dirname, "../src/preload.js") // use a preload script
		},
		frame : true,
  	});
	mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	mainWindow.setMenuBarVisibility(false);

	mainWindow.once('ready-to-show', () => {
		autoUpdater.checkForUpdatesAndNotify();
	});

  	settingWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences:{
			nodeIntegration: false, // is default value after Electron v5
			contextIsolation: true, // protect against prototype pollution
			enableRemoteModule: false, // turn off remote
			preload: path.join(__dirname, "../src/settings/preload.js") // use a preload script
		},
		show : false,
  	});

  	settingWindow.loadFile(path.join(__dirname, '../src/settings/index.html'))

	settingWindow.on("close",(e) =>{
		console.log("close settings");
		if(settingWindow.isVisible())
			settingWindow.hide();
		e.preventDefault();
	})
}

app.on('ready', () => {
  	createWindow();
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('app_version', (event) => {
  	event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('open-settings',(event, args) => {
	if(settingWindow.isVisible())
		settingWindow.hide();
	else
		settingWindow.show();
})


//for auto update purpose only
autoUpdater.on('update-available', () => {
	mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
	mainWindow.webContents.send('update_downloaded');
});
ipcMain.on('restart_app', () => {
	autoUpdater.quitAndInstall();
});