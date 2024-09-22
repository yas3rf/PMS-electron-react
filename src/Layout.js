import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

function Layout() {
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div
          className="d-flex flex-column justify-content-between"
          style={{ width: "100vw" }}
        >
          <Header />
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
}
export default Layout;
