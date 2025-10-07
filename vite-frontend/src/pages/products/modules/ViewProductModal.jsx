import React from 'react';
import ImageSlider from '../ImageSlider';

const ViewProductModal = ({ isOpen, onClose, product, categories, subcategories }) => {
  if (!isOpen || !product) return null;

  const categoryName = categories?.find(cat => cat.id === product.categoryId)?.name || 'Unknown';
  const subcategoryName = subcategories?.find(sub => sub.id === product.subcategoryId)?.name || 'Unknown';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <p className="text-gray-900 text-lg">{product.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <p className="text-gray-900">{product.description}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
              <p className="text-gray-900 text-xl font-bold text-green-600">${product.price}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <p className="text-gray-900">{categoryName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Subcategory</label>
              <p className="text-gray-900">{subcategoryName}</p>
            </div>
          </div>
          <div>
            {product.images && product.images.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                <ImageSlider images={product.images} />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
