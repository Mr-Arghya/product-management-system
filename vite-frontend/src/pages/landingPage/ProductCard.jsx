import React from 'react';

// Product card component without action buttons
const LandingProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden">
        {product?.image && product.image.length > 0 ? (
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {/* Placeholder when no image */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-400" 
          style={{ display: (product?.image && product.image.length > 0) ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <p className="text-sm text-gray-400">No Image</p>
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
          ${product?.price?.toLocaleString() || '0'}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-md">
          {product?.Category?.name || 'Uncategorized'}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors duration-300">
          {product?.name || 'Unnamed Product'}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem] mb-4">
          {product?.description || 'No description available'}
        </p>
        
        {/* Subcategory */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product?.SubCategory?.name || 'General'}
          </span>
          
          {/* Rating Stars (decorative) */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingProductCard;