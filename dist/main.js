const electron = require('electron')
const { 
  // Module to control application life.
  app, 
  // Module to create native browser window.
  BrowserWindow,
  // Module to control menu.
  Menu,
  // Module to control tray icon.
  Tray
} = electron

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // load tray icon
  if(process.platform === 'win32'){
    //设置托盘图标和菜单
    var trayMenuTemplate = [
      {
        label: '打开',
        click: () => {
          mainWindow.show();
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit();
          app.quit();//因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
        }
      }
    ];
    //系统托盘图标
    appTray = process.env.NODE_ENV === 'development' ?new Tray('ico/uketang.ico'):new Tray(`${__dirname}/ico/uketang.ico`);
    //图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    //设置此托盘图标的悬停提示内容
    appTray.setToolTip('优课堂');
    //设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);
    //单击右下角小图标显示应用左键
    appTray.on('click',function(){
      mainWindow.show();
    })
    //右键
    appTray.on('right-click', () => {
      appTray.popUpContextMenu(trayMenuTemplate);
    });
  };
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: 1122, 
    // height: 730,
    width: 0,
    height: 0,
    frame: false,
    // transparent: true,
    // resizable:true,
    // minHeight: 562,
    // minWidth: 1000,
    show: false,
    // icon: 'ico/uketang.ico',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    // pathname: path.join(__dirname, 'index2.html'),
    // pathname: path.join(__dirname, 'live.html'),
    pathname: path.join(__dirname, 'index.html'),
    // pathname: path.join(__dirname, '0129/index.html'),
    // pathname: path.join(__dirname, '0201/index2.html'),
    // pathname: path.join(__dirname, '0228/index2.html'),
    // pathname: path.join(__dirname, '0316/index2.html'),
    // pathname: path.join(__dirname, '0329/index2.html'),
    // pathname: path.join(__dirname, '0417/index2.html'),
    // pathname: path.join(__dirname, 'dynamic-data2.html'),
    // pathname: path.join(__dirname, 'bandwidth.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = electron.ipcMain
//登录窗口最小化
ipc.on('window-min',function(){
  mainWindow.minimize();
})
//登录窗口最大化
ipc.on('window-max',function(){
  console.log('window-max',mainWindow.isMaximized())
  if(mainWindow.isMaximized()){
      mainWindow.restore();  
  }else{
      mainWindow.maximize(); 
  }
})
ipc.on('window-close',function(){
  mainWindow.close();
})
ipc.on('window-login',function(){
  mainWindow.show();
  mainWindow.setSize(320,420);
  mainWindow.setMinimumSize(320,420);
  mainWindow.center()
})
ipc.on('window-home',function(){
  mainWindow.show();
  mainWindow.setSize(1122,730);
  mainWindow.setMinimumSize(1000,562);
  // mainWindow.setMaximumSize(500,500);
  mainWindow.center()
})

