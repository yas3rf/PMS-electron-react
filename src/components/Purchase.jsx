import React, { useEffect, useState } from "react";

const Purchase = () => {
  const [product, setProduct] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    productId: "",
    supplierId: "",
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await window.electronAPI.getProducts();
        setProduct(products);
        const data = await window.electronAPI.getPurchases();
        setPurchases(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const createPurchase = async () => {
    try {
      await window.electronAPI.createPurchase(newPurchase);

      alert("Product Purchase was successful");
    } catch (error) {
      alert("Couldn't purchase product");
      console.log(error);
    }
  };

  console.log(purchases);
  return (
    <div className="container-fluid">
      <h1>Purchase</h1>
      <form
        onSubmit={createPurchase}
        className="form d-flex flex-column flex-md-row justify-content-between"
      >
        <div className="form-group p-2 flex-fill">
          <label htmlFor="">Product</label>
          <select
            className="form-select"
            value={newPurchase.productId}
            onChange={(e) => {
              const selectedProduct = product.find(
                (p) => p.id === parseInt(e.target.value)
              );
              setNewPurchase({
                ...newPurchase,
                productId: e.target.value,
                supplierId: selectedProduct ? selectedProduct.supplierId : "",
              });
            }}
          >
            <option value="">PRODUCTS</option>
            {product &&
              product.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group p-2 flex-fill">
          <label htmlFor="">Supplier</label>
          <select
            value={newPurchase.supplierId}
            className="form-select"
            onChange={(e) =>
              setNewPurchase({
                ...newPurchase,
                supplierId: e.target.value,
              })
            }
          >
            porductId
            <option value="">SUPPLIERS</option>
            {product &&
              product
                .filter((p) => p.id === parseInt(newPurchase.productId))
                .map((p) => (
                  <option key={p.supplierId} value={p.supplierId}>
                    {p.supplierName}
                  </option>
                ))}
          </select>
        </div>
        <div className="form-group p-2 flex-fill">
          <label htmlFor="">Quantity</label>
          <input
            type="number"
            value={newPurchase.quantity}
            className="form-control"
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, quantity: e.target.value })
            }
          />
        </div>
        <div className="form-group p-2 flex-fill">
          <label htmlFor="">Price</label>
          <input
            type="number"
            value={newPurchase.price}
            className="form-control"
            onChange={(e) => {
              setNewPurchase({ ...newPurchase, price: e.target.value });
            }}
          />
        </div>
        <div className="form-group p-2 flex-fill mt-4">
          <button type="submit" className="btn btn-secondary form-control">
            Buy
          </button>
        </div>
      </form>
      <hr style={{ marginRight: "30px" }} />
      <div>
        <h2>Purchases</h2>
        <div className="card p-3">
          <table className="table card-item">
            <thead>
              <tr>
                <th>Num</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases &&
                purchases.map((p, index) => {
                  return (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>{p.productName}</td>
                      <td>{p.supplierName}</td>
                      <td>{p.quantity}</td>
                      <td>{p.price}</td>
                      <td>{p.date.slice(0, 10).split(",")}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
