import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation(); // Hook to get current route

  // Navbar items data
  const navItems = [
    { name: "HOME", href: "/home" },
    { name: "CHECK", href: "/check-armstrong" },
    { name: "LIST", href: "/armrange" },
    { name: "USERS", href: "/user-details" },
    { name: "LOGOUT", href: "/" },
  ];

  return (
    <div className="flex justify-end space-x-10 p-5 pr-10 pb-7 bg-custom-blue text-3xl opacity-95">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={`text-lg font-semibold text-white pb-1 hover:border-b-2 hover:border-white ${
            location.pathname === item.href ? "border-b-2 border-white" : ""
          }`}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default NavBar;
