import React, { useEffect, useState } from "react";

const SaleHistory = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electronAPI.getSaleHistory();
      setSales(result);
    };
    fetchData();
  }, []);
  console.log(sales);

  return (
    <div className="container-fluid">
      <h5 className="m-4">Sale History</h5>
      <div className="card ms-4 shadow-sm p-3 mb-4 rounded">
        <table className="table table-hover text-center">
          <thead>
            <tr className="fs-5">
              <td>Product Name</td>
              <td>Quantity</td>
              <td>Amount</td>
              <td>Date</td>
            </tr>
          </thead>
          {sales &&
            sales.map((sale) => {
              return (
                <tbody>
                  <tr key={sale.id}>
                    <td>{sale.productName}</td>
                    <td>{sale.quantity}</td>
                    <td>{sale.totalPrice}</td>
                    <td>{sale.date}</td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </div>
  );
};

export default SaleHistory;
