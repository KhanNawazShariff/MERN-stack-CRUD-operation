import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <h1 className="text-center">All rights resreved</h1>
      <h1 className="text-center"></h1>
      <p className="text-center mt-3">
        <Link to="/about">about</Link>
        <Link to="/contact">contact</Link>
        <Link to="/policy">policy</Link>
      </p>
    </div>
  );
};

export default Footer;
