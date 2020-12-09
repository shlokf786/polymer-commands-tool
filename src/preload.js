const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs")
const path = require('path');

window.ELECTRON_DISABLE_SECURITY_WARNINGS=true;
window.originalFolderPath="";
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    send:(channel, data) => {
        console.log(channel,data)
        let validChannels=['open-settings'];
        if(validChannels.includes(channel)){
            ipcRenderer.send(channel,data);
        }
    },
    getCompleteFileListForPath: (dirPath) => {
        return getAllFiles(dirPath);
    },
    _setOriginalFolderPath: (folderPath) =>{
        window.originalFolderPath=folderPath;
    },
    setVersion:() => {
        ipcRenderer.send('app_version');
    },
    variableList:{},
});

ipcRenderer.on('app_version', (event, arg) => {
	ipcRenderer.removeAllListeners('app_version');
	window.api.variableList.appVersion = 'Version ' + arg.version;
});



function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
    
	arrayOfFiles = arrayOfFiles || []
    
	files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } 
        else {
            FullPath=path.join(dirPath, "/", file)
            arrayOfFiles.push(FullPath.replace(window.originalFolderPath,''))
		}
	})
	return arrayOfFiles;
}