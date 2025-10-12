import React from 'react';

const Loader = ({ size = 'w-8 h-8', className = '' }) => {
  return (
    <div className={`inline-block ${size} animate-spin rounded-full border-4 border-solid border-gray-300 border-t-blue-500 ${className}`}></div>
  );
};

export default Loader;
