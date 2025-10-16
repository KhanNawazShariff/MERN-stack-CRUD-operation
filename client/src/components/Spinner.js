import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => --prev);
    }, 1000);

    if (count === 0) {
      navigate(`${path}`);
    }

    return () => clearInterval(interval);
  }, [count, navigate, path]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div>
        <div className="spinner-border text-primary" role="status"></div>
        <h4 className="text-center mt-2">Redirecting to login in {count}...</h4>
      </div>
    </div>
  );
};

export default Spinner;
