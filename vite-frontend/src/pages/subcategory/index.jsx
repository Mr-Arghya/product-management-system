import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSubcategories } from "../../hooks/useSubcategories";
import SkeletonLoader from "../../components/SkeletonLoader";
import DeleteModal from "../../components/DeleteModal";
import CreateSubcategoryModal from "./modules/CreateSubcategoryModal";
import Loader from "../../components/Loader";

const SubCategoryPage = () => {
  const [pageData, setPageData] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 0,
    showing: 4,
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    createSubcategory,
    deleteSubcategory,
    fetchSubcategories,
    updateSubcategory,
  } = useSubcategories({
    pagination: { page: pageData.currentPage, limit: pageData.showing },
  });

  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const subCategoriesQuery = useQuery({
    queryKey: ["sub-categories", searchTerm, pageData.showing],
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
    // onSuccess: () => subCategoriesQuery.refetch(),
  });
  const updateSubCategory = useMutation({
    mutationFn: ({ _id, categoryData }) =>
      updateSubcategory({ _id, subcategoryData: categoryData }),
  });
  const deleteSubCategory = useMutation({
    mutationFn: (_id) => deleteSubcategory(_id),
    // onSuccess: () => subCategoriesQuery.refetch(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleCreate = (data) => {
    createSubCategory.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = (data) => {
    updateSubCategory.mutate(
      { _id: currentProduct._id, categoryData: data },
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

  const openDeleteModal = (product) => {
    setModalMode("delete");
    setCurrentProduct(product);
  };

  const handleMode = (mode, product) => {
    setIsLoading(true);
    setCurrentProduct(product);
    setTimeout(() => {
      setModalMode(mode);
      setIsModalOpen(true);
      setIsLoading(false);
    }, 300);
  };

  const handleLoadMore = () => {
    setPageData((prev) => ({
      ...prev,
      showing: prev.showing + 4,
    }));
  };

  const handleShowLess = () => {
    setPageData((prev) => ({
      ...prev,
      showing: 4,
    }));
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sub-Categories</h1>
        <button
          onClick={() => handleMode("create", null)}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Sub-Category
        </button>
      </div>

      {subCategoriesQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-full mx-auto">
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
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-full mx-auto">
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
                    onClick={() => handleMode("view", subCategory)}
                    className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleMode("edit", subCategory)}
                    className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(subCategory)}
                    className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {subCategories?.length === 0 ? (
            <p className="mt-4 text-gray-600">No Sub-Categories found.</p>
          ) : (
            <>
              <div className="mt-4 text-sm text-gray-600">
                Showing {subCategories?.length} of {pageData.total}{" "}
                Sub-Categories
              </div>

              <button
                className="cursor-pointer mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-all 
            duration-200 border border-transparent hover:border-blue-400 shadow-md hover:shadow-lg font-medium"
                onClick={() => {
                  pageData.showing >= pageData.total
                    ? handleShowLess()
                    : handleLoadMore();
                }}
              >
                {pageData.showing >= pageData.total ? "Show Less" : "Load More"}
              </button>
            </>
          )}
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
        isOpen={modalMode === "delete"}
        itemName={currentProduct?.name}
        onConfirm={handleDelete}
        onCancel={() => setModalMode(null)}
      />
    </div>
  );
};

export default SubCategoryPage;
