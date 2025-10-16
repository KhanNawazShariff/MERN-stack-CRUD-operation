import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/forgot-password", {
        email,
        newPassword,
        answer,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Forgot Password -Ecommerce App"}>
      <div className="register-page">
        <h1>RESET PASSWORD</h1>
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
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control"
            placeholder="Enter your answer"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
            placeholder="New Password"
            required
          />
          <button type="submit" className="btn btn-primary">
            Reset
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
};

export default ForgotPassword;
