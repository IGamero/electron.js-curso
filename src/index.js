const { app, BrowserWindow, Menu, ipcMain } = require("electron");

const url = require("url");
const path = require("path");

//comprueba el ntorno para activar o no el refresh
if (process.env.NODE_ENV !== "production") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
  });
}

let mainWindow;
let newProductwindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    title: "Products App",
    icon: __dirname + "/src/img/icono.ico",
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("close", () => {
    app.quit();
  });
});

function createNewProductWindow() {
  newProductwindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "New Product",
    icon: "/src/img/icono.ico",
  });
  //newProductwindow.setMenu(null);
  newProductwindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/new-product.html"),
      protocol: "file",
      slashes: true,
    })
  );

  newProductwindow.on("closed", () => {
    newProductwindow = null;
  });
}

ipcMain.on("product:new", (e, newProduct) => {
  mainWindow.webContents.send("product:new", newProduct);
  newProductwindow.close();
});

const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "New product",
        accelerator: process.platform == "darwin" ? "command+N" : "",
        accelerator: process.platform == "win32" ? "Ctrl+N" : "",
        click() {
          createNewProductWindow();
        },
      },
      {
        label: "Remove All Products",
        click() {},
      },
      {
        label: "Exit",
        accelerator: process.platform == "darwin" ? "command+Q" : "",
        accelerator: process.platform == "win32" ? "Ctrl+Q" : "",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  templateMenu.unshift({
    label: app.getName(),
  });
}

if (process.env.NODE_ENV !== "production") {
  templateMenu.push({
    label: "DevTools",
    submenu: [
      {
        label: "Show/Hide Dev Tools",
        accelerator: "f12",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
