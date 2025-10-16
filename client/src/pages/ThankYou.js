import React from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Thank You - Ecommerce">
      <div className="container text-center mt-5">
        <h1 className="mb-4">🎉 Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
          Go to Homepage
        </button>
      </div>
    </Layout>
  );
};

export default ThankYou;
