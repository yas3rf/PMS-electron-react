const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getProducts: () => ipcRenderer.invoke("get-products"),
  getProductByBarcode: (barcode) =>
    ipcRenderer.invoke("get-product-by-barcode", barcode),
  addProduct: (product) => ipcRenderer.send("add-product", product),
  updateProduct: (product) => ipcRenderer.send("update-product", product),
  deleteProduct: (productId) => ipcRenderer.send("delete-product", productId),
  createSale: (sale) => ipcRenderer.send("create-sale", sale),
  getSales: () => ipcRenderer.invoke("get-sales"),
  createSupplier: (supplier) => ipcRenderer.send("create-supplier", supplier),
  getSupplier: () => ipcRenderer.invoke("get-supplier"),
  getInventorySummary: () => ipcRenderer.invoke("getInventorySummary"),
  getSaleSummary: () => ipcRenderer.invoke("getSaleSummary"),
  createPurchase: (purchase) => ipcRenderer.send("create-purchase", purchase),
  getPurchases: () => ipcRenderer.invoke("get-purchases"),
  login: (user) => ipcRenderer.invoke("login", user),
  userRegister: (user) => ipcRenderer.send("register", user),
  getSaleHistory: () => ipcRenderer.invoke("get-sale-history"),
});
