import React, { useState } from "react";
import PrintInvoice from "./PrintInvoice";

const Sales = () => {
  const [cart, setCart] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [productQty, setProductQty] = useState(null);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleScanBarcode = async (e) => {
    e.preventDefault();
    if (!barcode) {
      setErrorMessage("Please enter a barcode.");
      return;
    }

    if (productQty <= 0) {
      setErrorMessage("Quantity must be greater than 0.");
      return;
    }

    try {
      const product = await window.electronAPI.getProductByBarcode(barcode);
      if (product) {
        addToCart(product);
        setErrorMessage(""); // Clear error message on successful scan
      } else {
        setErrorMessage("Product not found!");
      }
      setBarcode("");
      if (!errorMessage) {
        setShow(true);
      }
    } catch (error) {
      console.log("Error scanning product:", error);
      setErrorMessage("Error scanning product. Please try again.");
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      let updatedCart;
      const existingProduct = prevCart.find(
        (item) => item.productId === product.id
      );

      if (existingProduct) {
        const newQuantity =
          Number(existingProduct.quantity) + Number(productQty);
        if (newQuantity <= 0) {
          setErrorMessage("Quantity must be greater than 0.");
          return prevCart;
        }
        updatedCart = prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (productQty <= 0) {
          setErrorMessage("Quantity must be greater than 0.");
          return prevCart;
        }
        updatedCart = [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: productQty,
          },
        ];
      }

      setErrorMessage("");
      calculateTotal(updatedCart);
      return updatedCart;
    });
  };

  const calculateTotal = (updatedCart) => {
    const total = updatedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item.productId !== productId
      );
      if (updatedCart.length < 1) {
        setShow(false);
      }
      calculateTotal(updatedCart);
      return updatedCart;
    });
  };

  // Handle quantity change directly in the cart
  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      setErrorMessage("Quantity must be greater than 0.");
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Number(quantity) }
          : item
      );
      calculateTotal(updatedCart);
      setErrorMessage(""); // Clear error message on valid quantity change
      return updatedCart;
    });
  };

  const checkout = async () => {
    if (cart.length === 0) {
      setErrorMessage("Cart is empty. Add products before checkout.");
      return;
    }

    const sale = {
      items: cart,
      totalPrice,
    };

    try {
      const result = await window.electronAPI.createSale(sale);
      alert("Sale processed successfully");
      printInvoice();
      setCart([]);
      setTotalPrice(0);
      setErrorMessage(""); // Clear any error message after successful checkout
    } catch (error) {
      alert("Error processing Sale:", error);
    }
  };

  // Print the invoice
  const printInvoice = () => {
    const invoiceWindow = window.open("", "Invoice");
    invoiceWindow.document.write(`
      <html>
      <head><title>Invoice</title></head>
      <body>
        <h2>Invoice</h2>
        <table border="1" style="border-collapse:collapse; width:100%">

          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>

        ${cart
          .map(
            (item) => `
            <tr style="text-align:center;">
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price}</td>
              <td>${item.price * item.quantity}</td>
            </tr>

          `
          )
          .join("")}
          <tr style="text-align:center; font-weight:bold; color:red">
            <td colspan="3">Total Price</td>
            <td>${totalPrice}</td>
          </tr>
        </table>
        <div style="margin-left:300px; margin-top:300px">
        <button onClick="window.print()" style="background-color: #04AA6D;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px">Print Invoice</button>
  </div>
  </body>
      </html>
    `);
  };

  return (
    <div className="container-fluid">
      <div>
        <h1>Sales</h1>

        <form
          onSubmit={handleScanBarcode}
          className="form d-flex justify-content-start"
        >
          <div className="form-group ms-2">
            <label htmlFor="barcode">Barcode</label>
            <input
              className="form-control"
              type="text"
              value={barcode}
              autoFocus
              name=""
              id=""
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="ScanBarcode"
            />
          </div>
          <div className="form-group ms-2">
            <label htmlFor="qty">Quantity</label>

            <input
              className="form-control"
              type="number"
              value={productQty}
              min={1}
              onChange={(e) => setProductQty(e.target.value)}
              placeholder="qty"
            />
          </div>
          <button type="submit" className="btn btn-secondary ms-2">
            Add To Cart
          </button>
        </form>
        {errorMessage && <div style={{ color: "red" }}> {errorMessage}</div>}
      </div>
      <hr />
      {/* CART UI */}
      {show ? (
        <div className="card p-4 ">
          <h2>Cart</h2>
          <table className="table">
            <thead>
              <tr className="text-center">
                <th>NAME</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
              </tr>
            </thead>
            {cart.map((item) => (
              <tbody>
                <tr className="text-center" key={item.productId}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      width={"15px"}
                      value={item.quantity}
                      // min={1}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, e.target.value)
                      }
                    />
                  </td>
                  <td>$ {item.price}</td>

                  <button
                    className="btn"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <i className="bi bi-trash text-danger"></i>
                  </button>
                </tr>
              </tbody>
            ))}
          </table>
          <h3 className="text-primary">total Price: ${totalPrice}</h3>
          <button
            onClick={() => {
              setShow(false);
              checkout();
            }}
            className="btn btn-success"
          >
            Checkout
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Sales;
