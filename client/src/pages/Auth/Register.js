import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      try {
        toast.error("Please enter a valid email like name@example.com");
      } catch {
        alert("Invalid email format. Use format like name@example.com");
      }
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });

      if (res.data.success) {
        try {
          toast.success(res.data.message);
        } catch {
          alert(res.data.message);
        }
        navigate("/login");
      } else {
        try {
          toast.error(res.data.message);
        } catch {
          alert(res.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      try {
        toast.error("Something went wrong");
      } catch {
        alert("Something went wrong");
      }
    }
  };

  return (
    <Layout title="Register - Ecommerce">
      <div className="register-page">
        <h1>Register</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="Name"
            required
          />
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
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control"
            placeholder="Phone Number"
            required
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-control"
            placeholder="Address"
            required
          />
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control"
            placeholder="Your first mobile phone"
            required
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
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
        }

        .register-form .btn:hover {
          background-color: #0056b3;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </Layout>
  );
};

export default Register;
