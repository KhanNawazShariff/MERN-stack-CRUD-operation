import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Layout from "../../components/Layout/Layout";

const Orders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/product/orders", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      console.log("📦 Orders Response:", data); // ✅ Debug log
      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log("❌ Failed to load orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="Your Orders">
      <div className="container my-4">
        <h4 className="mb-3">🧾 Your Orders</h4>

        {orders.length === 0 ? (
          <div className="alert alert-info">No orders yet.</div>
        ) : (
          orders.map((order, i) => (
            <div className="card mb-4" key={order._id}>
              <div className="card-header">
                <strong>Order #{i + 1}</strong> — Placed on{" "}
                {new Date(order.createdAt).toLocaleString()}
              </div>
              <div className="card-body">
                <h6>Buyer: {order.buyer?.name || "Unknown"}</h6>
                <p className="mb-2">Total Products: {order.products?.length}</p>
                <p className="mb-2">
                  Payment Status:{" "}
                  {order.payment?.success ? (
                    <span className="text-success">Success ✅</span>
                  ) : (
                    <span className="text-danger">Failed ❌</span>
                  )}
                </p>
                <p className="mb-2">
                  Transaction ID: {order.payment?.transaction?.id || "N/A"}
                </p>
                <hr />
                {order.products?.map((p) => (
                  <div className="d-flex mb-2" key={p._id}>
                    <img
                      src={`/api/product/product-photo/${p._id}`}
                      alt={p.name}
                      width="100"
                      height="100"
                      className="me-3"
                      style={{ objectFit: "cover" }}
                      onError={(e) => (e.target.style.display = "none")} // optional
                    />
                    <div>
                      <h6>{p.name}</h6>
                      <p className="text-muted">₹{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Orders;
