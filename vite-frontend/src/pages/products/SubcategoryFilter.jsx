import React from 'react';

const SubcategoryFilter = ({ subcategories, selectedSubcategory, onSubcategoryChange, disabled }) => {
  return (
    <div>
      <select
        value={selectedSubcategory}
        onChange={(e) => onSubcategoryChange(e.target.value)}
        disabled={disabled}
        className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="">All Subcategories</option>
        {subcategories?.map((subcategory) => (
          <option key={subcategory._id} value={subcategory._id}>
            {subcategory.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubcategoryFilter;
