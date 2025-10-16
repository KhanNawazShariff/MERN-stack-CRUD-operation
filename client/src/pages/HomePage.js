import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import axios from "axios";
import { Button, Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart, setCart] = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/category/get-category");
      if (data?.success) setCategories(data.category);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/product/product-count");
      setTotal(data.total);
    } catch (error) {
      console.log("Error fetching product count", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/product/product-list/${page}`);
      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
    } catch (error) {
      console.log("Error fetching products", error);
    }
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data.products);
    } catch (error) {
      console.log("Error filtering products", error);
    }
  };

  const handleFilter = (value, checkedStatus) => {
    let all = [...checked];
    if (checkedStatus) {
      all.push(value);
    } else {
      all = all.filter((c) => c !== value);
    }
    setChecked(all);
  };

  const handleResetFilters = () => {
    setChecked([]);
    setRadio([]);
    getAllProducts();
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Added to cart");
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (checked.length > 0 || radio.length > 0) {
      filterProduct();
    } else {
      getAllProducts();
    }
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    if (checked.length === 0 && radio.length === 0) {
      getAllProducts();
    }
  }, [page]);

  return (
    <Layout title="All Products - Best Offers">
      {/* 🔹 Product + Filter Section */}
      <div className="row m-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter by Category</h4>
          <div className="d-flex flex-column ms-4">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(c._id, e.target.checked)}
                checked={checked.includes(c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column ms-4">
            <Radio.Group
              onChange={(e) => setRadio(e.target.value)}
              value={radio}
            >
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column ms-4 mt-3">
            <button className="btn btn-danger" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        <div className="col-md-10">
          <h2 className="text-center mb-3">All Products</h2>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`/api/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description?.substring(0, 30)}...
                  </p>
                  <p className="card-text">₹{p.price}</p>
                  <Button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </Button>
                  <Button
                    className="btn btn-secondary ms-1"
                    onClick={() => handleAddToCart(p)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {products.length < total &&
            checked.length === 0 &&
            radio.length === 0 && (
              <div className="text-center mt-4 mb-4">
                <button
                  className="btn btn-warning"
                  onClick={() => setPage(page + 1)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

          {products.length === 0 && (
            <h5 className="text-center w-100 mt-4">No products found.</h5>
          )}
        </div>
      </div>

      {/* 🔹 About Section */}
      <div className="container my-5">
        <h3 className="text-center mb-4">About Our Store</h3>
        <p className="text-center">
          We bring you the best products at the best prices. Quality guaranteed.
          Explore a wide range of categories, exclusive deals, and seamless
          delivery.
        </p>
      </div>

      {/* 🔹 Why Choose Us */}
      <div className="container my-5">
        <h3 className="text-center mb-4">Why Choose Us</h3>
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>🚚 Fast Delivery</h5>
              <p>Lightning-fast dispatch and tracking</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>✅ Trusted Quality</h5>
              <p>We only stock verified premium items</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>🔒 Secure Payments</h5>
              <p>Multiple payment options & secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Stylish Testimonials */}
      <div className="bg-white py-5">
        <div className="container">
          <h3 className="text-center mb-5">Loved by Shoppers</h3>
          <div className="row">
            {[
              {
                name: "Aarav Mehta",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "Amazing service and quick delivery. Totally satisfied!",
              },
              {
                name: "Isha Sharma",
                img: "https://randomuser.me/api/portraits/women/65.jpg",
                text: "Loved the variety and quality of products!",
              },
              {
                name: "Ravi Singh",
                img: "https://randomuser.me/api/portraits/men/44.jpg",
                text: "Support team helped me a lot. Great experience.",
              },
            ].map((t, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <div className="card p-4 shadow-sm h-100 text-center">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="rounded-circle mx-auto mb-3"
                    width="80"
                    height="80"
                  />
                  <h5>{t.name}</h5>
                  <p className="text-muted">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Brand Logos */}
      <div className="py-5 bg-light">
        <div className="container text-center">
          <h4 className="mb-4">Our Brand Partners</h4>
          <div className="d-flex justify-content-around align-items-center flex-wrap">
            {[
              "https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo-768x432.png",
              "https://1000logos.net/wp-content/uploads/2017/03/Adidas-Logo-1991-768x432.png",
              "https://1000logos.net/wp-content/uploads/2017/03/Puma-Logo-768x432.png",
              "https://1000logos.net/wp-content/uploads/2017/03/Zara-logo-768x432.png",
              "https://1000logos.net/wp-content/uploads/2017/06/HM-logo-768x432.png",
            ].map((logo, idx) => (
              <img
                src={logo}
                key={idx}
                alt="brand"
                className="m-3"
                style={{ width: "100px", objectFit: "contain", height: "auto" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Newsletter */}
      <div className="bg-dark text-white py-5">
        <div className="container text-center">
          <h4>Stay Updated!</h4>
          <p>Subscribe to our newsletter for latest deals and updates.</p>
          <div className="d-flex justify-content-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control w-50 me-2"
            />
            <button className="btn btn-warning">Subscribe</button>
          </div>
        </div>
      </div>

      {/* 🔹 Instagram-style Scroll Gallery */}
      <div className="py-5 bg-white">
        <div className="container text-center">
          <h4 className="mb-4">Follow Us On Instagram</h4>
          <div className="d-flex overflow-auto">
            {[1, 2, 3, 4, 5].map((n) => (
              <img
                key={n}
                src={`https://source.unsplash.com/200x200/?fashion,clothes,${n}`}
                alt="insta"
                className="me-2 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
