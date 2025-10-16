import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/auth";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    /* global google */
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/google-login`, {
        token: response.credential,
      });

      if (res.data.success) {
        toast.success("Logged in with Google!");

        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: res.data.user,
            token: res.data.token,
          })
        );

        // Redirect based on user role
        if (res.data.user.role === "admin") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/user");
        }
      } else {
        toast.error(res.data.message || "Google login failed");
      }
    } catch (error) {
      toast.error("Google login error");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password"); // Using alert in case toast is not working
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.success) {
        alert(res.data.message); // Using alert
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: res.data.user,
            token: res.data.token,
          })
        );

        // Redirect based on user role
        if (res.data.user.role === "admin") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/user");
        }
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) alert("Invalid password");
      else if (status === 403) alert("Your account has been deactivated by admin");
      else if (status === 404) alert("Email is not registered");
      else alert("Something went wrong");
    }
  };

  return (
    <Layout title="Login - Ecommerce">
      <div className="register-page">
        <h1>Login</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Password"
            required
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password
          </button>
        </form>

        {/* Google Sign-In Button Container */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <div id="google-signin-button"></div>
        </div>
      </div>

      <style>{`
        .register-page {
          max-width: 400px;
          margin: 40px auto;
          padding: 20px;
          border-radius: 8px;
          background: #f8f8f8;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .register-form input {
          margin-bottom: 15px;
          height: 40px;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }

        .register-form .btn {
          width: 100%;
          height: 40px;
          background-color: #007bff;
          border: none;
          color: white;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .register-form .btn:hover {
          background-color: rgb(2, 12, 23);
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </Layout>
  );
}

export default Login;
