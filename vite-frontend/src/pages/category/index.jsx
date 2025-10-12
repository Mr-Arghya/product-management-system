import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCategories } from "../../hooks/useCategories";
import SkeletonLoader from "../../components/SkeletonLoader";
import DeleteModal from "../../components/DeleteModal";
import CreateCategoryModal from "./modules/CreateCategoryModal";

const CategoryPage = () => {
  const {
    createCategories,
    deleteCategories,
    fetchCategories,
    updateCategories,
  } = useCategories();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageData, setPageData] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 0,
    showing: 0,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories", searchTerm, pageData.currentPage],
    queryFn: fetchCategories,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (categoriesQuery.data && !categoriesQuery.isLoading) {
      const response = categoriesQuery.data;
      setCategories(response.data.categories);
      setPageData((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.total,
        currentPage: response.data.pagination.currentPage,
        showing: response.data.pagination.showing,
      }));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading]);

  const createCategory = useMutation({
    mutationFn: (vals) => createCategories(vals),
    onSuccess: () => categoriesQuery.refetch(),
  });
  const updateCategory = useMutation({
    mutationFn: ({ _id, categoryData }) =>
      updateCategories({ id: _id, categoriesData: categoryData }),
    onSuccess: () => categoriesQuery.refetch(),
  });
  const deleteCategory = useMutation({
    mutationFn: (_id) => deleteCategories(_id),
    onSuccess: () => categoriesQuery.refetch(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // modalKey forces CreateCategoryModal to remount so internal form is reset
  const [modalKey, setModalKey] = useState(0);

  const handleCreate = (data) => {
    createCategory.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = (data) => {
    if (!currentProduct?._id) return;

    updateCategory.mutate(
      { _id: currentProduct._id, categoryData: data },
      {
        onSuccess: () => {
          setCurrentProduct(null);
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!currentProduct?._id) return;

    deleteCategory.mutate(currentProduct._id, {
      onSuccess: () => {
        setCurrentProduct(null);
        setIsDeleteModalOpen(false);
      },
    });
  };

  const handleMode = (mode, product) => {
    // Open delete modal separately
    if (mode === "delete") {
      setCurrentProduct(product);
      setModalMode("delete");
      setIsDeleteModalOpen(true);
      return;
    }

    if (mode === "create") {
      // clear previous product and force modal remount so the form is empty
      setCurrentProduct(null);
      setModalMode("create");
      setModalKey((k) => k + 1);
      setIsModalOpen(true);
      return;
    }

    // view / edit
    setCurrentProduct(product);
    setModalMode(mode);
    // ensure modal remount when editing a different product
    setModalKey((k) => k + 1);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => handleMode("create", null)}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Category
        </button>
      </div>

      {categoriesQuery.isLoading ? (
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
          {categories?.map((category) => (
            <div
              key={category._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600 mb-2">{category.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                Sub-Category:{" "}
                {category?.sub_categories.length > 0
                  ? category?.sub_categories.map((sub) => sub.name).join(", ")
                  : "None"}{" "}
                (Total: {category?.sub_categories.length || 0})
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMode("view", category)}
                  className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleMode("edit", category)}
                  className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleMode("delete", category)}
                  className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateCategoryModal
        // key forces remount so modal's internal form resets when opening create after edit
        key={`${modalKey}`}
        isOpen={isModalOpen && modalMode !== "delete"}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProduct(null);
        }}
        onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
        isLoading={createCategory.isLoading || updateCategory.isLoading}
        mode={modalMode}
        category={modalMode === "create" ? null : currentProduct}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        itemName={currentProduct?.name}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setCurrentProduct(null);
        }}
      />
    </div>
  );
};

export default CategoryPage;
