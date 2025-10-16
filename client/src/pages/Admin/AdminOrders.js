import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders/all-orders");
      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders", error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/orders/update-order-status/${orderId}`, {
        status: newStatus,
      });

      if (data?.success) {
        toast.success("Order status updated");
        // Update local state to reflect change without reload
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status", error);
      toast.error("Error updating status");
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h3>All Orders</h3>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Buyer</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Address</th>
                    <th>Created</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order?.buyer?.name}</td>
                      <td>
                        <ul>
                          {order.products.map((p, index) => (
                            <li key={index}>
                              {p.product?.name || "Product"} x {p.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>{order.status}</td>
                      <td>
                        {order.payment.method} - {order.payment.status}
                      </td>
                      <td>{order.address || "N/A"}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="form-select"
                        >
                          <option value="Not process">Not process</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
