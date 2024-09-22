import React from "react";

const PrintInvoice = ({ cart, totalPrice }) => {
  const printInvoice = () => {
    const invoiceWindow = window.open("", "Invoice");
    invoiceWindow.document.write(`
      <html>
      <head><title>Invoice</title></head>
      <body>
        <h2>Invoice</h2>
        <table border="1">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
          ${cart
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price}</td>
              <td>${item.price * item.quantity}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <td colspan="3">Total Price</td>
            <td>${totalPrice}</td>
          </tr>
        </table>
        <button onClick="window.print()">Print Invoice</button>
      </body>
      </html>
    `);
  };

  return (
    <div>
      <button onClick={printInvoice}>Print Invoice</button>
    </div>
  );
};

export default PrintInvoice;
