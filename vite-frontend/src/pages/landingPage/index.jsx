import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingProductCard from "./ProductCard"; // Import your product data
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../hooks/useProducts";
import { useQuery } from "@tanstack/react-query";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const { fetchProductsForLanding } = useProducts();

  const [products20, setProducts20] = useState([]);

  // Fixed useQuery configuration
  const productsQuery = useQuery({
    queryKey: ["landing-products"],
    queryFn: fetchProductsForLanding,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle the data when query succeeds
  useEffect(() => {
    if (productsQuery.data && !productsQuery.isLoading) {
      console.log("Landing products data:", productsQuery.data);
      
      // Handle different response structures
      const products = productsQuery.data?.data?.products || 
                      productsQuery.data?.products || 
                      productsQuery.data || 
                      [];
      
      setProducts20(products);
    }
  }, [productsQuery.data, productsQuery.isLoading]);

  // Log query state for debugging
  useEffect(() => {
    console.log("Products Query State:", {
      isLoading: productsQuery.isLoading,
      isError: productsQuery.isError,
      error: productsQuery.error,
      data: productsQuery.data,
      isFetching: productsQuery.isFetching,
    });
  }, [productsQuery]);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = !!token;

      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
      if (isLoggedIn) {
        navigate("/dashboard");
      }
    };

    checkAuth();
  }, [navigate, token]); // Added token dependency

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLoadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 8, products20.length));
  };

  const handleShowLess = () => {
    setVisibleProducts(8);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show loading state
  if (productsQuery.isLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (productsQuery.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Failed to load products</p>
          <button 
            onClick={() => productsQuery.refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Product Management System
                </h1>
                <p className="text-xs text-gray-500">
                  Discover Amazing Products
                </p>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
            >
              <svg
                className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-200 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-10 right-10 w-18 h-18 bg-indigo-200 rounded-full animate-pulse delay-300"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover
            </span>
            <br />
            <span className="text-gray-800">Amazing Products</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of premium products across multiple
            categories. From electronics to lifestyle essentials, find
            everything you need.
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {products20.length}+
              </div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">7+</div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">100%</div>
              <div className="text-sm text-gray-500">Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our handpicked selection of top-quality products
              from trusted brands
            </p>
          </div>

          {/* Products Grid */}
          {products20.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {products20.slice(0, visibleProducts).map((product) => (
                <LandingProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
              <p className="text-gray-500">We're working on adding products. Please check back later!</p>
            </div>
          )}

          {/* Load More / Show Less Button */}
          {products20.length > 0 && (
            <div className="text-center">
              {visibleProducts < products20.length ? (
                <button
                  onClick={handleLoadMore}
                  className="group inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-300 hover:bg-blue-50"
                >
                  <span className="mr-2">Load More Products</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-y-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              ) : (
                visibleProducts > 8 && (
                  <button
                    onClick={handleShowLess}
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-gray-200 hover:to-gray-300"
                  >
                    <svg
                      className="w-5 h-5 mr-2 transition-transform group-hover:-translate-y-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    <span>Show Less</span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>

          <button
            onClick={handleLoginClick}
            className="group inline-flex items-center px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 hover:bg-blue-50"
          >
            <svg
              className="w-6 h-6 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h4 className="text-xl font-bold">Product Management System</h4>
          </div>
          <p className="text-gray-400 mb-6">
            Your trusted partner for discovering and exploring amazing products
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">
              © 2025 Product Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
