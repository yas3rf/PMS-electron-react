import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState({
    totalSales: 0,
    bestSellingProducts: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResult = await window.electronAPI.getInventorySummary();
        setProducts(productResult);

        const saleResult = await window.electronAPI.getSaleSummary();
        setSales(saleResult); // Adjusted to set the entire saleResult object

        const supResult = await window.electronAPI.getSupplier();
        setSuppliers(supResult);
      } catch (error) {
        console.error("Error loading summaries", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container-fluid p-2">
      <div className="card-container d-flex flex-column flex-lg-row justify-content-even">
        <div
          className="card ms-4 shadow-lg p-3 mb-4 rounded"
          style={{ width: "18rem", backgroundColor: "#FFBA47" }}
        >
          <div className="card-body">
            <h4 className="card-title">Product Summary</h4>
            <h6 className="card-text">
              Total Products: <span>{products.totalProducts}</span>
            </h6>
            <div>
              <h6>Low Stock: </h6>
              {products.lowStockProducts ? (
                <div>
                  {products.lowStockProducts.map((p, index) => (
                    <div key={index}>
                      <p className="card-text">
                        Name: <span>{p.name}</span> - Available:{" "}
                        <span>{p.quantity}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <h6 className="card-text">N/A</h6>
              )}
            </div>
          </div>
        </div>

        <div
          className="card shadow-lg p-3 mb-4 ms-4  rounded"
          style={{ width: "18rem", backgroundColor: "#F5FF65" }}
        >
          <div className="card-body">
            <h4 className="card-title">Sales Summary</h4>
            <h6 className="card-text">
              Total Sales: <span>{sales.totalSales}</span>
            </h6>
            <div>
              <h6>Best Selling Products:</h6>
              {sales.bestSellingProducts &&
              sales.bestSellingProducts.length > 0 ? (
                sales.bestSellingProducts.map((product, index) => (
                  <div key={index}>
                    <p className="card-text">
                      Name: <span>{product.productName}</span> - Quantity Sold:{" "}
                      <span>{product.totalQuantity}</span>
                    </p>
                    <hr />
                  </div>
                ))
              ) : (
                <h6 className="card-text">N/A</h6>
              )}
            </div>
            <a href="/sales-history" className="text-success ">
              Show Sale History
            </a>
          </div>
        </div>
        <div
          className="card ms-4 shadow-lg p-3 mb-4 rounded"
          style={{ width: "18rem", backgroundColor: "#F5FF88" }}
        >
          <div className="card-body">
            <h4 className="card-title">Suppliers</h4>
            <ol className="card-item">
              {suppliers &&
                suppliers.map((s) => {
                  return (
                    <li>
                      <span className="card-text">{s.name}</span>
                    </li>
                  );
                })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
