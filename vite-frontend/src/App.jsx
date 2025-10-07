import React from "react";
import { Routes, Route, useLocation, Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RequireAuth from "./components/RequireAuth";
import CategoryPage from "./pages/category";
import SubcategoryPage from "./pages/subcategory";
import ProductsPage from "./pages/products";
import { LoginPage, VerifyOTPPage } from "./pages/auth";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { Flip, ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();

  const authPaths = ["/login", "/verify-otp"];
  const hideSidebar = authPaths.includes(location.pathname);

  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        transition={Flip}
      />
      <div className="flex min-h-screen bg-gray-100">
        {!hideSidebar && <Sidebar />}
        <main className={`flex-1 p-4 ${!hideSidebar ? "md:ml-64" : ""}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route
              path="/categories"
              element={
                <RequireAuth>
                  <CategoryPage />
                </RequireAuth>
              }
            />
            <Route
              path="/subcategories"
              element={
                <RequireAuth>
                  <SubcategoryPage />
                </RequireAuth>
              }
            />
            <Route
              path="/products"
              element={
                <RequireAuth>
                  <ProductsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <div className="text-center mt-10">
                    <h1 className="text-3xl font-bold">
                      Welcome to Product Management System
                    </h1>
                  </div>
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
