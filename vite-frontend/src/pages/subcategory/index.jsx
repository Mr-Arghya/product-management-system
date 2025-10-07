import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSubcategories } from "../../hooks/useSubcategories";
import SkeletonLoader from "../../components/SkeletonLoader";
import DeleteModal from "../../components/DeleteModal";
import CreateSubcategoryModal from "./modules/CreateSubcategoryModal";

const SubCategoryPage = () => {
  const {
    createSubcategory,
    deleteSubcategory,
    fetchSubcategories,
    updateSubcategory,
  } = useSubcategories();

  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageData, setPageData] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 0,
    showing: 0,
  });

  const subCategoriesQuery = useQuery({
    queryKey: ["sub-categories", searchTerm, pageData.currentPage],
    queryFn: fetchSubcategories,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (subCategoriesQuery.data && !subCategoriesQuery.isLoading) {
      const response = subCategoriesQuery.data;
      setSubCategories(response.data.sub_categories);
      setPageData((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.total,
        currentPage: response.data.pagination.currentPage,
        showing: response.data.pagination.showing,
      }));
    }
  }, [subCategoriesQuery.data, subCategoriesQuery.isLoading]);

  const createSubCategory = useMutation({
    mutationFn: (vals) => createSubcategory(vals),
    onSuccess: () => subCategoriesQuery.refetch(),
  });
  const updateSubCategory = useMutation({
    mutationFn: ({ _id, categoryData }) =>
      updateSubcategory({ _id, ...categoryData }),
    onSuccess: () => subCategoriesQuery.refetch(),
  });
  const deleteSubCategory = useMutation({
    mutationFn: (_id) => deleteSubcategory(_id),
    onSuccess: () => subCategoriesQuery.refetch(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleCreate = (data) => {
    console.log(data, "<----DATA");
    createSubCategory.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = (data) => {
    updateSubCategory.mutate(
      { _id: editingCategory._id, categoryData: data },
      {
        onSuccess: () => setCurrentProduct(null),
      }
    );
  };

  const handleDelete = () => {
    deleteSubCategory.mutate(currentProduct._id, {
      onSuccess: () => setCurrentProduct(null),
    });
  };

  const handleMode = (mode, product) => {
    setModalMode(mode);
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sub-Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Sub-Category
        </button>
      </div>

      {subCategoriesQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <SkeletonLoader className="h-6 w-3/4 mb-2" />
              <SkeletonLoader className="h-4 w-full mb-4" />
              <div className="flex space-x-2">
                <SkeletonLoader className="h-8 w-16" />
                <SkeletonLoader className="h-8 w-16" />
                <SkeletonLoader className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subCategories?.map((subCategory) => (
            <div
              key={subCategory._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {subCategory.name}
              </h3>
              <p className="text-gray-600 mb-2">{subCategory.description}</p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleMode("view", category)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleMode("edit", category)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleMode("delete", category)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateSubcategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
        isLoading={createSubCategory.isPending}
        mode={modalMode}
        subCategory={currentProduct}
      />

      <DeleteModal
        isOpen={!!modalMode === "delete"}
        itemName={currentProduct?.name}
        onConfirm={handleDelete}
        onCancel={() => setCurrentProduct(null)}
      />
    </div>
  );
};

export default SubCategoryPage;
