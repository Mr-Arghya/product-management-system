import React, { useState, useMemo, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useSubcategories } from "../../hooks/useSubcategories";
import debounce from "../../utils/debounce";
import SkeletonLoader from "../../components/SkeletonLoader";
import DeleteModal from "../../components/DeleteModal";
import ProductModal from "./modules/ProductModal";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SubcategoryFilter from "./SubcategoryFilter";
import ProductList from "./ProductList";
import { useMutation, useQuery } from "@tanstack/react-query";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [products, setProducts] = useState([]);

  const [pageData, setPageData] = useState({
    currentPage: 1,
    totalPages: 0,
    showing: 4,
    total: 0,
  });

  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);

  const { createProducts, deleteProducts, fetchProducts, updateProducts } =
    useProducts({
      filters: {
        search_value: searchTerm,
        categories: selectedCategory,
        sub_category_id: selectedSubcategory,
      },
      pagination: { page: pageData.currentPage, limit: pageData.showing },
    });

  const productsQuery = useQuery({
    queryKey: [
      "products",
      searchTerm,
      selectedCategory,
      selectedSubcategory,
      pageData.showing,
    ],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (productsQuery.data && !productsQuery.isLoading) {
      const response = productsQuery.data;
      setProducts(response.data.products);
      setPageData((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: Math.ceil(response.data.pagination.total / prev.showing),
        currentPage: response.data.pagination.currentPage,
      }));
    }
  }, [productsQuery.data, productsQuery.isLoading]);

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

  const createProduct = useMutation({
    mutationFn: (vals) => createProducts(vals),
    onSuccess: () => productsQuery.refetch(),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, productData }) =>
      updateProducts({ id, productsData: productData }),
    onSuccess: () => productsQuery.refetch(),
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => deleteProducts(id),
    onSuccess: () => productsQuery.refetch(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentProduct, setCurrentProduct] = useState(null);

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 500),
    []
  );

  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const subcategories = categories?.find(
      (category) => category._id === categoryId
    )?.sub_categories;
    setSubCategories(subcategories);
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleMode = (mode, product) => {
    setModalMode(mode);
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const { fetchCategories } = useCategories();

  const handleCreate = (data) => {
    createProduct.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = (data) => {
    updateProduct.mutate(
      { id: currentProduct._id, productData: data },
      {
        onSuccess: () => setCurrentProduct(null),
      }
    );
  };

  const handleDelete = () => {
    deleteProduct.mutate(currentProduct._id, {
      onSuccess: () => setCurrentProduct(null),
    });
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      setCategories(categoriesQuery?.data?.data?.categories);
    }
  }, [categoriesQuery.isLoading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <SearchBar onSearch={handleSearch} />
        <div className="flex space-x-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <SubcategoryFilter
            subcategories={subCategories}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
            disabled={!selectedCategory}
          />
        </div>
      </div>

      {productsQuery.isLoading ? (
        <ProductList>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <SkeletonLoader className="h-48 w-full mb-4" />
              <SkeletonLoader className="h-6 w-3/4 mb-2" />
              <SkeletonLoader className="h-4 w-full mb-2" />
              <SkeletonLoader className="h-4 w-1/2 mb-4" />
              <div className="flex space-x-2">
                <SkeletonLoader className="h-8 w-16" />
                <SkeletonLoader className="h-8 w-16" />
                <SkeletonLoader className="h-8 w-16" />
              </div>
            </div>
          ))}
        </ProductList>
      ) : (
        <div className="flex flex-col items-center">
          <ProductList>
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onView={() => handleMode("view", product)}
                onEdit={() => handleMode("edit", product)}
                onDelete={() => setCurrentProduct(product)}
              />
            ))}
          </ProductList>
          {products?.length === 0 ? (
            <p className="mt-4 text-gray-600">No products found.</p>
          ) : (
            <>
              <div className="mt-4 text-sm text-gray-600">
                Showing {products?.length} of {pageData.total} products
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
        categories={categories}
        subcategories={subCategories}
        isLoading={createProduct.isPending}
        mode={modalMode}
        product={currentProduct}
      />

      <DeleteModal
        isOpen={!!currentProduct && modalMode === "delete"} // Fixed this condition
        itemName={currentProduct?.name}
        onConfirm={handleDelete}
        onCancel={() => setCurrentProduct(null)}
      />
    </div>
  );
};

export default ProductsPage;
