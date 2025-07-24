import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 border-b-2 border-blue-500 rounded-md font-medium"
      : "flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600";

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCartOutlined /> E-commerce Dashboard
          </h1>

          <nav className="hidden md:flex space-x-4">
            <NavLink to="/products" className={getLinkClass}>
              <ShoppingOutlined />
              Products
            </NavLink>
            <NavLink to="/users" className={getLinkClass}>
              <UserOutlined />
              Users
            </NavLink>
            <NavLink to="/orders" className={getLinkClass}>
              <ShoppingCartOutlined />
              Orders
            </NavLink>
          </nav>

          <button
            className="md:hidden text-gray-700 text-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-2 mt-2 pb-4 border-t border-gray-100">
            <NavLink
              to="/products"
              className={getLinkClass}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingOutlined />
              Products
            </NavLink>
            <NavLink
              to="/users"
              className={getLinkClass}
              onClick={() => setIsOpen(false)}
            >
              <UserOutlined />
              Users
            </NavLink>
            <NavLink
              to="/orders"
              className={getLinkClass}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCartOutlined />
              Orders
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
