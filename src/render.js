let settingBtn = document.getElementById('settingBtn');
let fileListBox = document.getElementById('fileListBox');
let tempPath1="C:\\UX\\for Scanning\\30-10-2020 1300\\cstview-asset-manager";
let tempPath2="E:\\Work\\electron-work\\polymer-command-tool\\src";
var fileList=[];
settingBtn.addEventListener('click', (e) => window.api.send("open-settings"))
window.api._setOriginalFolderPath(tempPath1);
fileList=window.api.getCompleteFileListForPath(tempPath1);
if(fileList.length>0){
	for(let item of fileList){
		let li = document.createElement('li');
		li.appendChild(document.createTextNode(item));
		li.setAttribute("class","list-group-item");
		fileListBox.appendChild(li)
	}
}

const version = document.getElementById('version');

window.api.setVersion()
version.innerText = window.api.variableList.appVersion;


// const notification = document.getElementById('notification');
// const message = document.getElementById('message');
// const restartButton = document.getElementById('restart-button');
// ipcRenderer.on('update_available', () => {
// 	ipcRenderer.removeAllListeners('update_available');
// 	message.innerText = 'A new update is available. Downloading now...';
// 	notification.classList.remove('hidden');
// });
// ipcRenderer.on('update_downloaded', () => {
// 	ipcRenderer.removeAllListeners('update_downloaded');
// 	message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
// 	restartButton.classList.remove('hidden');
// 	notification.classList.remove('hidden');
// });
// function closeNotification() {
// 	notification.classList.add('hidden');
// }
// function restartApp() {
// 	ipcRenderer.send('restart_app');
// }