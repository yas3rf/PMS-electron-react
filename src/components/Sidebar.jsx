import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column  col-auto flex-shrink-0 p-3 bg-body-tertiary position-sticky"
      style={{
        width: "240px",
        top: "0",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Link
        to={"/"}
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <i className="bi bi-capsule-pill"></i>

        <span className="fs-4 ">YasPharma</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column  mb-auto">
        <li className="nav-item m-3 fs-5">
          <Link
            to={"/"}
            className="nav-link link-body-emphasis"
            aria-current="page"
          >
            <i className="bi bi-speedometer"></i> <span>Dashboard</span>
          </Link>
        </li>
        <hr />

        <li className="nav-item m-3 fs-5">
          <Link
            to={"/inventory"}
            className="nav-link link-body-emphasis"
            aria-current="page"
          >
            <i className="bi bi-cart"></i> <span>Inventory</span>
          </Link>
        </li>
        <hr />
        <li className="nav-item m-3 fs-5">
          <Link
            to={"/sales"}
            className="nav-link link-body-emphasis "
            aria-current="page"
          >
            <i className="bi bi-receipt"></i> <span>Sales</span>
          </Link>
          <ul className="nav nav-pills flex-column  mb-auto">
            <li className="list-group-item">
              <Link
                className="nav-link link-body-emphasis"
                to={"/sales-history"}
              >
                <i className="bi bi-clock-history"></i> <span>History</span>
              </Link>
            </li>
          </ul>
        </li>
        <hr />

        <li className="nav-item m-3 fs-5">
          <Link to={"/suppliers"} className="nav-link link-body-emphasis">
            <i className="bi bi-bag"></i> <span>Suppliers</span>
          </Link>
        </li>
        <hr />

        <li className="nav-item m-3 fs-5">
          <Link to={"/purchases"} className="nav-link link-body-emphasis">
            <i className="bi bi-cart-dash"></i> <span>Purchase</span>
          </Link>
        </li>
      </ul>
      <hr />
    </div>
  );
};

export default Sidebar;
