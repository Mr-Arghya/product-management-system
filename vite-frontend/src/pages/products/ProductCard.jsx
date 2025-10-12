import React from "react";
import { DescriptionToggle } from "../../components/DescriptionToggle";

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 w-full h-[520px] flex flex-col">
      <div className="relative w-full h-40 bg-gray-200 flex-shrink-0">
        {product?.image && product.image.length > 0 ? (
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400"
          style={{
            display:
              product?.image && product.image.length > 0 ? "none" : "flex",
          }}
        >
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      </div>

      {/* Content Section - Flex grow to fill remaining space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name - Fixed height with better line clamping */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          <div className="line-clamp-2 min-h-[3rem]">
            {product?.name || "Unnamed Product"}
          </div>
        </h3>

        {/* Description - Better height management */}
        <div className="text-gray-600 text-sm mb-3 flex-grow-0">
          <div className="line-clamp-4 leading-relaxed min-h-[5rem]">
            {product?.description ? <DescriptionToggle description={product.description} /> : "No description available"}
          </div>
        </div>

        {/* Price - Fixed height */}
        <div className="mb-3 flex-shrink-0">
          <p className="text-xl font-bold text-green-600">
            ${product?.price?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Category Information - Fixed height */}
        <div className="mb-4 space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Category:</span>
            <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[120px]">
              {product?.Category?.name || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Subcategory:</span>
            <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[120px]">
              {product?.SubCategory?.name || "-"}
            </span>
          </div>
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={onView}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-md active:scale-95"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
