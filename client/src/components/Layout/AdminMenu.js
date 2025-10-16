import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="text-center">
      <h4 className="my-3">Admin Panel</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <NavLink
            to="/dashboard/admin/create-category"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "text-primary fw-bold" : "text-dark"}`
            }
          >
            Create Category
          </NavLink>
        </li>

        <li className="list-group-item">
          <NavLink
            to="/dashboard/admin/create-product"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "text-primary fw-bold" : "text-dark"}`
            }
          >
            Create Product
          </NavLink>
        </li>

        <li className="list-group-item">
          <NavLink
            to="/dashboard/admin/products"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "text-primary fw-bold" : "text-dark"}`
            }
          >
            Products
          </NavLink>
        </li>

        <li className="list-group-item">
          <NavLink
            to="/dashboard/admin/users"
            className={({ isActive }) =>
              `text-decoration-none ${isActive ? "text-primary fw-bold" : "text-dark"}`
            }
          >
            Users
          </NavLink>
        </li>
        <li className="list-group-item">
  <NavLink
    to="/dashboard/admin/orders"
    className={({ isActive }) =>
      `text-decoration-none ${isActive ? "text-primary fw-bold" : "text-dark"}`
    }
  >
    Orders
  </NavLink>
</li>

      </ul>
    </div>
  );
};

export default AdminMenu;
