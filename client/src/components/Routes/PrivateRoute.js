import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/auth/user-auth");

        if (res.data.ok) {
          if (auth?.user?.role === 0) {
            setOk(true);
          } else {
            // User logged in but is admin, redirect to admin dashboard
            navigate("/dashboard/admin", { replace: true });
          }
        } else {
          // Backend says not authenticated; redirect to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        // Error or unauthorized; redirect to login
        navigate("/login", { replace: true });
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      // No token present, redirect to login
      navigate("/login", { replace: true });
    }
  }, [auth?.token, auth?.user?.role, navigate]);

  if (!ok) {
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

export default PrivateRoute;
