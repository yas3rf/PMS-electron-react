const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");

const db = new Database("pharmacy.db", { verbose: console.log });

// create table for inventory
db.prepare(
  `CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barcode TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    supplierId INTEGER,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
    
    )`
).run();

// create table for suppliers

db.prepare(
  ` CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT
      
      ) `
).run();
// create table for Sales
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      quantity INTEGER,
      totalPrice REAL,
      date TEXT,
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `
).run();

// Create PURCHASE TABLE
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER,
  supplierId INTEGER,
  quantity INTEGER,
  price REAL,
  date TEXT,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (supplierId) REFERENCES suppliers(id)
  )
  `
).run();

// CREATE USER TABLE
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
  )
  `
).run();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enalbleRemoteModule: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000"); // Point to React dev server

  //   win.loadFile("./build/index.html");
}

// Handling dataBase // ipcMain
//*********************************************** */
// FETCH ALL PRODUCTS
ipcMain.handle("get-products", () => {
  try {
    const stmt =
      db.prepare(`SELECT products.id, products.name, products.price, products.quantity, products.barcode,suppliers.id AS supplierId, suppliers.name AS supplierName
       FROM products
       LEFT JOIN suppliers ON products.supplierId = suppliers.id`);
    return stmt.all();
  } catch (error) {
    console.error("Error fetching products", error);
    throw new Error("Failed to fetch Products");
  }
});

//fetch product by barcode

ipcMain.handle("get-product-by-barcode", (event, barcode) => {
  try {
    const getProduct = db.prepare("SELECT * FROM products WHERE barcode = ?");
    return getProduct.get(barcode);
  } catch (error) {
    console.error("Error fetching products", error);
    throw new Error("Failed to fetch Products with barcode");
  }
});

// ADD NEW PRODUCT

ipcMain.on("add-product", (event, product) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO products (name, supplierId, barcode, quantity, price) VALUES(?,?,?,?,?)"
    );
    stmt.run(
      product.name,
      product.supplierId,
      product.barcode,
      product.quantity,
      product.price
    );
  } catch (error) {
    console.error("Error Adding Product", error);
    throw new Error("Failed to Add Product");
  }
});

// UPDATE PRODUCT
ipcMain.on("update-product", (event, product) => {
  try {
    const stmt = db.prepare(
      "UPDATE products SET name = ?, quantity = ?, price= ? WHERE id = ?"
    );
    stmt.run(product.name, product.quantity, product.price, product.id);
  } catch (error) {
    console.error("Error Updating Product", error);
    throw new Error("Failed to Update Product");
  }
});

//DELETE A PRODUCT

ipcMain.on("delete-product", (event, productId) => {
  try {
    const stmt = db.prepare("DELETE FROM products WHERE id = ?");
    stmt.run(productId);
  } catch (error) {
    console.error("Error Deleting Product", error);
    throw new Error("Failed to Delete Product");
  }
});

// Get Product Summary
ipcMain.handle("getInventorySummary", async () => {
  try {
    const totalProducts = await db
      .prepare("SELECT COUNT(*) AS count FROM products")
      .get();
    const lowStockProducts = db
      .prepare("SELECT * FROM products WHERE quantity < 10")
      .all(); // Adjust threshold as needed
    return { totalProducts: totalProducts.count, lowStockProducts };
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    return null;
  }
});

// CREATE A SALE

ipcMain.on("create-sale", (event, sale) => {
  try {
    const insertSale = db.prepare(
      "INSERT INTO Sales (productId, quantity, totalPrice, date) VALUES (?, ?, ?, ?)"
    );
    const updateProductQty = db.prepare(
      "UPDATE products SET quantity = quantity - ? WHERE id = ?"
    );

    sale.items.forEach((item) => {
      insertSale.run(
        item.productId,
        item.quantity,
        item.price * item.quantity,
        new Date().toISOString().split("T")[0]
      );
      updateProductQty.run(item.quantity, item.productId);
    });
  } catch (error) {
    console.error("Error Adding Sale", error);
    throw new Error("Failed to Add Sale");
  }
});

//GET SALES

ipcMain.handle("get-sale-history", () => {
  try {
    const stmt =
      db.prepare(`SELECT products.name AS productName, sales.quantity,sales.totalPrice,sales.date
        FROM sales 
        LEFT JOIN products ON sales.productId = products.id`);
    return stmt.all();
  } catch (error) {
    console.error("Error Getting Sale", error);
    throw new Error(error);
  }
});

// GET SALES SUMMARY

ipcMain.handle("getSaleSummary", async () => {
  try {
    const totalSales = await db
      .prepare(
        "SELECT SUM(totalPrice) AS total FROM sales WHERE date >= DATE('now', 'start of day')"
      )
      .get();
    const bestSellingProducts = await db
      .prepare(
        `
       SELECT products.name AS productName, SUM(sales.quantity) AS totalQuantity 
        FROM sales 
        LEFT JOIN products ON sales.productId = products.id
        GROUP BY productName 
        ORDER BY totalQuantity DESC 
        LIMIT 5
    `
      )
      .all();
    return {
      totalSales: totalSales.total,
      bestSellingProducts: bestSellingProducts,
    };
  } catch (error) {
    console.log("Error fetching sales summary:", error);
    return null;
  }
});

// ADD Supplier

ipcMain.on("create-supplier", (event, supplier) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO suppliers (name,address,phone) VALUES (?,?,?)"
    );
    stmt.run(supplier.name, supplier.address, supplier.phone);
  } catch (error) {
    console.error("Error Adding Supplier", error);
    throw new Error("Failed to Add Supplier");
  }
});

//GET SUPPLIERS
ipcMain.handle("get-supplier", () => {
  try {
    const stmt = db.prepare("SELECT * FROM suppliers");

    return stmt.all();
  } catch (error) {
    console.error("Error Getting Supplier", error);
    throw new Error("Failed to Get Supplier");
  }
});

//CREATE PURCHASE
ipcMain.on("create-purchase", (event, purchase) => {
  try {
    const stmt = db.prepare(
      `INSERT INTO purchases (productId, supplierId, quantity, price, date) VALUES(?, ?, ?, ?, ?)`
    );
    stmt.run(
      purchase.productId,
      purchase.supplierId,
      purchase.quantity,
      purchase.price,
      new Date().toLocaleString()
    );
    const updateProductQty = db.prepare(`
      UPDATE products SET quantity = quantity + ? WHERE id = ?
      `);
    updateProductQty.run(purchase.quantity, purchase.productId);
    const updateProductPrice = db.prepare(`
      UPDATE products SET price = ? WHERE id = ?
      `);
    updateProductPrice.run(purchase.price, purchase.productId);
  } catch (error) {
    console.error(error);
  }
});

//  GET PURCHASES

ipcMain.handle("get-purchases", async () => {
  try {
    const stmt =
      db.prepare(`SELECT purchases.id,purchases.price, purchases.date, purchases.quantity,products.id AS productId, products.name AS productName, suppliers.id AS supplierId, suppliers.name AS supplierName
       FROM purchases
       LEFT JOIN products ON purchases.productId = products.id LEFT JOIN suppliers ON purchases.supplierId = suppliers.id
       `);

    return stmt.all();
  } catch (error) {
    console.error("Error Getting Purchases", error);
    throw new Error("Failed to Get Purchases");
  }
});

// CREATE USER AND LOGIN
function createUser(username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(
    "INSERT INTO users (username,password) VALUES (?, ?)"
  );

  return stmt.run(username, hashedPassword);
}

ipcMain.on("register", (event, user) => {
  createUser(user.username, user.password);
});

ipcMain.handle("login", (event, user) => {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const loggedInUser = stmt.get(user.username);
    if (user && bcrypt.compareSync(user.password, loggedInUser.password)) {
      return { success: true, message: "Login Succcessful" };
    } else {
      return { success: false, message: "invalid userName or password" };
    }
  } catch (error) {
    console.error("error during login", error);
    return { success: false, message: "error during login" };
  }
});

//*********************************************** */

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
