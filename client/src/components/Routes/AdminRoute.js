import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const adminCheck = async () => {
      try {
        // Ensure auth token is attached to axios headers
        const res = await axios.get("/api/auth/admin-auth");

        if (res.data.ok) {
          if (auth?.user?.role === 1) {
            setOk(true);
          } else {
            // User logged in but not admin, redirect to user dashboard
            navigate("/dashboard/user", { replace: true });
          }
        } else {
          // Unauthorized or not ok, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        // Error from backend or network issue - redirect to login
        navigate("/login", { replace: true });
      }
    };

    if (auth?.token) {
      adminCheck();
    } else {
      // No token, redirect to login immediately
      navigate("/login", { replace: true });
    }
  }, [auth?.token, auth?.user?.role, navigate]);

  if (!ok) {
    // Loading spinner while checking access
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status" />
        <span className="ms-2">Checking access...</span>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
