import React, { useEffect, useState } from "react";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [EditSupplier, setEditSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    getSupplier();
  }, [newSupplier]);

  const getSupplier = async () => {
    const data = await window.electronAPI.getSupplier();
    setSuppliers(data);
  };
  console.log(suppliers);
  const addSupplier = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.createSupplier(newSupplier);
      setNewSupplier({
        name: "",
        address: "",
        phone: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid mt-2">
      <div>
        <h3>ADD NEW SUPPLIER</h3>
        <form
          onSubmit={addSupplier}
          className="form d-flex flex-column  flex-md-row  p-2"
        >
          <div className="form-group p-2 flex-fill">
            <label htmlFor="name">Name</label>
            <input
              className="form-control p-2 flex-fill"
              type="text"
              placeholder="NAME"
              value={newSupplier.name}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, name: e.target.value })
              }
            />
          </div>
          <div className="form-group p-2 flex-fill">
            <label htmlFor="address">Address</label>
            <input
              className="form-control"
              placeholder="ADDRESS"
              type="text"
              value={newSupplier.address}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, address: e.target.value })
              }
            />
          </div>
          <div className="form-group p-2 flex-fill">
            <label htmlFor="phone">Phone</label>
            <input
              placeholder="PHONE NUMBER"
              className="form-control"
              type="text"
              value={newSupplier.phone}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group p-2">
            <label htmlFor=""> </label>
            <button
              type="submit"
              className="btn btn-secondary mt-3 form-control"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
      <hr style={{ marginRight: "30px" }} />
      <div>
        <h2>Suppliers</h2>
        <div className="card p-3">
          <table className="table card-item">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {suppliers &&
                suppliers.map((s) => {
                  return (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.address}</td>
                      <td>{s.phone}</td>
                      <td>
                        <a
                          className="text-primary"
                          onClick={() => {
                            setEditSupplier(s);
                          }}
                        >
                          <i className="bi bi-pen"></i>
                        </a>
                      </td>
                      <td>
                        <a
                          className="text-danger"
                          onClick={() => {
                            // deleteProduct(product.id);
                          }}
                        >
                          <i className="bi bi-trash3"></i>
                        </a>
                      </td>
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

export default Suppliers;
