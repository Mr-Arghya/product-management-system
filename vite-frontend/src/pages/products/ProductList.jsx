import React from "react";

const ProductList = ({ children }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-full mx-auto"
    >
      {children}
    </div>
  );
};

export default ProductList;
