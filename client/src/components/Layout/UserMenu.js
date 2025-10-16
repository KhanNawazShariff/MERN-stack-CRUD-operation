import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div className="text-center">
      <h4>Dashboard</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <NavLink
            to="/dashboard/user/profile"
            className="text-decoration-none text-dark"
          >
            profile
          </NavLink>
        </li>
        <li className="list-group-item">
          <NavLink
            to="/dashboard/user/orders"
            className="text-decoration-none text-dark"
          >
            orders
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
