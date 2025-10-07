import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-white mb-8 text-center tracking-wide">
            Product Dashboard
          </h2>
          <nav>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className={`block p-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive("/")
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-blue-700/20 hover:text-blue-200"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              {/* Categories */}
              <li>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-700/20 focus:outline-none transition-all duration-200"
                >
                  <span className="font-medium">Categories</span>
                  {categoriesOpen ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {/* Dropdown */}
                {categoriesOpen && (
                  <ul className="ml-4 mt-2 space-y-2 border-l border-gray-700 pl-3">
                    <li>
                      <Link
                        to="/categories"
                        className={`block p-2 rounded-md transition-colors duration-200 ${
                          isActive("/categories")
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-700/20"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        All Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/subcategories"
                        className={`block p-2 rounded-md transition-colors duration-200 ${
                          isActive("/subcategories")
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-700/20"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Subcategories
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Products */}
              <li>
                <Link
                  to="/products"
                  className={`block p-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive("/products")
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-blue-700/20 hover:text-blue-200"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700 text-center text-gray-400 text-sm space-y-2">
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center justify-center w-full gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
          <div>© {new Date().getFullYear()} Arghya Dev</div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
