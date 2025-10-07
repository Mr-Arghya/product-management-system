import React from 'react';

const ProductCard = ({ product, categories, subcategories, onView, onEdit, onDelete }) => {
  const categoryName = categories?.find(cat => cat.id === product.categoryId)?.name || 'Unknown';
  const subcategoryName = subcategories?.find(sub => sub.id === product.subcategoryId)?.name || 'Unknown';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-lg font-bold text-green-600 mb-2">${product.price}</p>
        <p className="text-sm text-gray-500 mb-2">Category: {categoryName}</p>
        <p className="text-sm text-gray-500 mb-4">Subcategory: {subcategoryName}</p>
        {product.image && product.image.length > 0 && (
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
