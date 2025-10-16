import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import axios from "axios";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/category/get-category");
      setCategories(data?.category || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    localStorage.removeItem("cart");
    toast.success("Logout successfully");
  };

  // Helper: check if current user is admin
  const isAdmin = auth?.user?.role === 1;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" >
      <div
        className="container-fluid"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link to="/" className="navbar-brand">
            🛒 Ecommerce App
          </Link>

          <ul
            className="navbar-nav ms-auto mb-2 mb-lg-0"
            style={{ justifyContent: "center", width: "100%" }}
          >
            <SearchInput />

            {/* Show Home only if NOT admin */}
            {!isAdmin && (
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
            )}

            {/* Show Categories only if NOT admin */}
            {!isAdmin && (
              <li className="nav-item dropdown" style={{ position: "relative" }}>
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  data-bs-toggle="dropdown"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Categories
                </Link>
                <ul
                  className="dropdown-menu"
                  style={{
                    maxWidth: "300px",
                    wordWrap: "break-word",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {categories.length === 0 ? (
                    <li>
                      <span className="dropdown-item text-muted">
                        No categories
                      </span>
                    </li>
                  ) : (
                    categories.map((c) => (
                      <li key={c._id}>
                        <Link to={`/category/${c.slug}`} className="dropdown-item">
                          {c.name}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </li>
            )}

            {auth?.user ? (
              <li className="nav-item dropdown" style={{ position: "relative" }}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {auth.user.name}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      to={`/dashboard/${isAdmin ? "admin" : "user"}`}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {!isAdmin && (
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  Cart ({cart.length})
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
