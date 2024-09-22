import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    quantity: 0,
    price: 0,
    productId: "",
  });

  useEffect(() => {
    loadProducts();
    getSupplier();
  }, []);

  const getSupplier = async () => {
    const data = await window.electronAPI.getSupplier();
    setSuppliers(data);
  };
  const loadProducts = async () => {
    const data = await window.electronAPI.getProducts();
    setProducts(data);
  };
  console.log(products);
  const addProduct = (e) => {
    e.preventDefault();
    if (
      newProduct.name === "" ||
      newProduct.barcode === "" ||
      newProduct.quantity <= 0 ||
      newProduct.price <= 0
    ) {
      toast.warning("Please Provide Details");
    } else {
      window.electronAPI.addProduct(newProduct);
      setNewProduct({ name: "", barcode: 0, quantity: 0, price: 0 });
      loadProducts();
    }
  };

  const updateProduct = (e) => {
    e.preventDefault();
    window.electronAPI.updateProduct(editProduct);
    setEditProduct(null);
    toast.success("Product Updated!!");
    loadProducts();
  };

  const deleteProduct = (id) => {
    window.electronAPI.deleteProduct(id);
    loadProducts();
  };
  return (
    <div className="container-fluid">
      <h1>Product List</h1>
      <hr />
      <div>
        <h2>Add New Product</h2>
        <form
          onSubmit={addProduct}
          className="form d-flex flex-column  flex-md-row  p-2"
        >
          <div className="form-group p-2 flex-fill">
            <label htmlFor="name">NAME</label>
            <input
              className="form-control p-2 flex-fill"
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => {
                setNewProduct({ ...newProduct, name: e.target.value });
              }}
            />
          </div>
          <div className="form-group p-2 flex-fill">
            <label htmlFor="name">Supplier</label>
            <select
              className="form-select"
              onChange={(e) =>
                setNewProduct({ ...newProduct, supplierId: e.target.value })
              }
            >
              <option select>Suppliers</option>
              {suppliers &&
                suppliers.map((s) => {
                  return <option value={s.id}>{s.name}</option>;
                })}
            </select>
          </div>
          <div className="form-group p-2 flex-fill">
            <label htmlFor="barcode">BARCODE</label>
            <input
              className="form-control"
              type="text"
              placeholder="Barcode"
              value={newProduct.barcode}
              onChange={(e) => {
                setNewProduct({ ...newProduct, barcode: e.target.value });
              }}
            />
          </div>
          <div className="form-group p-2 flex-fill">
            <label htmlFor="name">QUANTITY</label>

            <input
              className="form-control"
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => {
                setNewProduct({ ...newProduct, quantity: e.target.value });
              }}
            />
          </div>
          <div className="form-group p-2 flex-fill">
            <label htmlFor="name">PRICE</label>

            <input
              className="form-control"
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => {
                setNewProduct({ ...newProduct, price: e.target.value });
              }}
            />
          </div>
          <div className="form-group p-2 ">
            <button
              type="submit"
              className="btn btn-secondary form-control mt-xl-3"
            >
              ADD PRODUCT
            </button>
          </div>
        </form>
      </div>
      <hr />
      {/* ************************************************************** */}
      {/* ******************************************************************** */}
      <h2>Products</h2>
      <div
        className="card p-3"
        style={{ height: "300px", paddingBottom: "50px", overflowY: "auto" }}
      >
        <table className="table table-hover text-center ">
          <thead>
            <tr className="fs-5">
              <td>Name</td>
              <td>Supplier</td>
              <td>Quantity</td>
              <td>Price</td>
              <td>Barcode</td>
              <td>Edit</td>
              <td>delete</td>
            </tr>
          </thead>
          {products &&
            products.map((product) => {
              return (
                <tbody>
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.supplierName || "N/A"}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                    <td>{product.barcode}</td>

                    <td>
                      <a
                        className="text-primary"
                        onClick={() => {
                          setEditProduct(product);
                        }}
                      >
                        <i className="bi bi-pen"></i>
                      </a>
                    </td>
                    <td>
                      <a
                        className="text-danger"
                        onClick={() => {
                          deleteProduct(product.id);
                        }}
                      >
                        <i className="bi bi-trash3"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
      <hr />
      {editProduct && (
        <div className="mt-5 mb-5">
          <h2>Edit Product</h2>
          <form
            onSubmit={editProduct}
            className="form d-flex justify-content-start"
          >
            <div className="form-group ms-5">
              <label htmlFor="name">Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Name"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
            </div>
            <div className="form-group ms-5">
              <label htmlFor="name">Quantity</label>
              <input
                className="form-control"
                type="number"
                placeholder="Quantity"
                value={editProduct.quantity}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, quantity: e.target.value })
                }
              />
            </div>
            <div className="form-group ms-5">
              <label htmlFor="name">Price</label>
              <input
                className="form-control"
                type="number"
                placeholder="Price"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
              />
            </div>
            <div className="form-group ms-5 ">
              <button type="submit" className="btn btn-secondary p-2 mt-3">
                Update Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Inventory;
