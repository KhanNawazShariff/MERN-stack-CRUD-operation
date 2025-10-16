import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import dropin from "braintree-web-drop-in";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const dropinRef = useRef(null);

  // New states for payment method and address
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [address, setAddress] = useState("");

  // Get client token for Braintree card payment
  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get("/api/product/braintree/token");
        setClientToken(data.clientToken);
      } catch (err) {
        console.log("Token fetch error:", err);
      }
    };
    getToken();
  }, []);

  // Initialize dropin UI for card payment
  useEffect(() => {
    if (clientToken && dropinRef.current) {
      if (dropinRef.current.children.length > 0) return;
      dropin.create(
        {
          authorization: clientToken,
          container: dropinRef.current,
        },
        (err, instance) => {
          if (err) {
            console.error("Drop-in Error:", err);
          } else {
            setInstance(instance);
          }
        }
      );
    }
  }, [clientToken]);

  // Handle card payment
  const handleCardPayment = async () => {
    if (!auth?.token) {
      toast.warn("Please login to proceed");
      navigate("/login", { state: "/cart" });
      return;
    }

    try {
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        "/api/product/braintree/payment",
        { nonce, cart },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (data.success) {
        // After payment success, create order on backend
        try {
          await axios.post(
            "/api/orders/create-order",
            {
              products: cart.map((p) => p._id),
              paymentMethod: "Card",
              paymentStatus: "Completed",
              address: "", // no address needed for card payment
            },
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
        } catch (err) {
          console.error("Order creation error:", err);
          toast.error("Payment succeeded but order creation failed");
          return;
        }

        toast.success("Payment successful");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/thank-you");
      } else {
        toast.error("Payment failed");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment request failed");
    }
  };

  // Handle COD order submission
  const handleCODOrder = async () => {
    if (!auth?.token) {
      toast.warn("Please login to proceed");
      navigate("/login", { state: "/cart" });
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/orders/create-order",
        {
          products: cart.map((p) => p._id),
          paymentMethod: "COD",
          paymentStatus: "Pending",
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Order placed successfully");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/thank-you");
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const removeItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Layout title="Cart - Ecommerce">
      <div className="container mt-3">
        <h3>Your Cart</h3>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div key={p._id} className="card mb-3">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      src={`/api/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5>{p.name}</h5>
                      <p>{p.description}</p>
                      <h6>₹ {p.price}</h6>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeItem(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h4>Cart Summary</h4>
            <hr />
            <h5>Total: ₹{cart.reduce((acc, item) => acc + item.price, 0)}</h5>

            {/* Payment method selection */}
            <div className="mb-3">
              <h5>Select Payment Method:</h5>
              <div>
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={() => setPaymentMethod("Card")}
                />
                <label htmlFor="card" className="ms-2">
                  Card Payment
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <label htmlFor="cod" className="ms-2">
                  Cash On Delivery (COD)
                </label>
              </div>
            </div>

            {/* Show drop-in UI only if Card payment selected */}
            {paymentMethod === "Card" && <div ref={dropinRef}></div>}

            {/* Show address input & place order button only if COD */}
            {paymentMethod === "COD" && (
              <div className="mb-3">
                <label>Enter your address:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shipping Address"
                />
                <button className="btn btn-primary mt-2" onClick={handleCODOrder}>
                  Place Order (COD)
                </button>
              </div>
            )}

            {/* Make Payment button (enabled only for card) */}
            <button
              className="btn btn-primary mt-3"
              onClick={handleCardPayment}
              disabled={!instance || paymentMethod !== "Card"}
            >
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
