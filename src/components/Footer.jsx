import React, { useState } from "react";

const Footer = () => {
  let time = new Date().toLocaleTimeString();
  let date = new Date().toLocaleDateString();
  const [ctime, setTime] = useState(time);
  const [cdate, setDate] = useState(date);

  const UpdateTime = () => {
    time = new Date().toLocaleTimeString();
    date = new Date().toLocaleDateString();
    setDate(date);
    setTime(time);
  };
  setInterval(UpdateTime);
  return (
    <>
      <footer className="bg-body-tertiary d-flex justify-content-between align-items-center px-3 py-2">
        <div>
          <h5 className="logo ms-3">YasPharma</h5>
          <h6>
            <i className="bi bi-telephone "></i> <span>0731434073</span>
          </h6>
          <h6>
            <i className="bi bi-geo-alt "></i> <span>Mazar e-sharif</span>
          </h6>
        </div>
        <div>
          <h3>{ctime}</h3>
          <h3>{cdate}</h3>
        </div>
      </footer>
    </>
  );
};

export default Footer;
