import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpload } from "../../../hooks/useUpload";
import { X } from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";
import { useQuery } from "@tanstack/react-query";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode,
  product = null,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categories: "",
      sub_category_id: "",
      image: [],
    },
  });

  const { fetchCategories } = useCategories();
  const [categories, setCategories] = useState([]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (categoriesQuery.data && !categoriesQuery.isLoading) {
      const response = categoriesQuery.data;
      setCategories(response.data.categories);
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading]);

  useEffect(() => {
    if (product && categories.length > 0) {
      console.log("Product data changed:", product.sub_category_id);
      let categoryId = product.category || product.categories;
      let subcategoryId = product.sub_category_id;

      reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        categories: categoryId || "",
        sub_category_id: subcategoryId || "",
        image: product.image ? product.image : [],
      });
    } else if (product && categories.length === 0) {
      reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        categories: "",
        sub_category_id: "",
        image: product.image ? product.image : [],
      });
    }
  }, [product, categories, reset]);

  const { uploadFile } = useUpload();
  const [uploading, setUploading] = useState(false);

  const selectedCategoryId = watch("categories");
  const localImages = watch("image") || [];

  const selectedCategory = categories?.find(
    (cat) => String(cat._id) === String(selectedCategoryId)
  );

  const handleClose = () => {
    reset();
    onClose && onClose();
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls = [];

      for (const file of files) {
        const res = await uploadFile(file);
        const uploadedPath = res?.data?.files?.file?.path;
        if (uploadedPath) uploadedUrls.push(uploadedPath);
      }

      const newUrls = [...localImages, ...uploadedUrls];
      setValue("image", newUrls);
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url) => {
    const updated = localImages.filter((img) => img !== url);
    setValue("image", updated);
  };

  const onSubmitForm = (data) => {
    const productData = {
      ...data,
      categories: data.categories,
      sub_category_id: data.sub_category_id,
      price: parseFloat(data.price),
      image: data.image || [],
    };
    onSubmit && onSubmit(productData);
    reset();
    handleClose();
  };

  const getCategoryDisplayName = () => {
    if (mode === "view" && product) {
      if (product.Category?.name) return product.Category.name;
      if (selectedCategory?.name) return selectedCategory.name;
      return "Unknown Category";
    }
    return "";
  };

  const getSubcategoryDisplayName = () => {
    if (mode === "view" && product) {
      if (product.SubCategory?.name) return product.SubCategory.name;
      const subcategoryId = product.subcategory || product.sub_category_id;
      const subcategory = selectedCategory?.sub_categories?.find(
        (sub) => String(sub._id) === String(subcategoryId)
      );
      if (subcategory?.name) return subcategory.name;

      return "Unknown Subcategory";
    }
    return "";
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === "view" ? "View" : mode === "edit" ? "Edit" : "Create"}{" "}
            Product
          </h3>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                {...register("name", {
                  required: mode !== "view" ? "Name is required" : false,
                  minLength:
                    mode !== "view"
                      ? { value: 3, message: "At least 3 characters" }
                      : undefined,
                })}
                className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                  errors.name ? "border-red-400" : "border-gray-200"
                } ${mode === "view" ? "bg-gray-50" : ""}`}
                placeholder="Product name"
                disabled={mode === "view"}
                readOnly={mode === "view"}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: mode !== "view" ? "Description is required" : false,
                })}
                rows="3"
                className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                  errors.description ? "border-red-400" : "border-gray-200"
                } ${mode === "view" ? "bg-gray-50" : ""}`}
                placeholder="Short description"
                disabled={mode === "view"}
                readOnly={mode === "view"}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD)
                </label>
                <input
                  {...register("price", {
                    required: mode !== "view" ? "Price is required" : false,
                    min:
                      mode !== "view"
                        ? { value: 0, message: "Must be >= 0" }
                        : undefined,
                  })}
                  type="number"
                  step="0.01"
                  className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                    errors.price ? "border-red-400" : "border-gray-200"
                  } ${mode === "view" ? "bg-gray-50" : ""}`}
                  placeholder="0.00"
                  disabled={mode === "view"}
                  readOnly={mode === "view"}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {mode === "view" ? (
                  <div className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {getCategoryDisplayName()}
                  </div>
                ) : (
                  <select
                    {...register("categories", {
                      required: "Category required",
                    })}
                    className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                      errors.categories ? "border-red-400" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.categories && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.categories.message}
                  </p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category
                </label>
                {mode === "view" ? (
                  <div className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {getSubcategoryDisplayName()}
                  </div>
                ) : (
                  <select
                    {...register("sub_category_id", {
                      required: "Subcategory required",
                    })}
                    disabled={!selectedCategoryId}
                    className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                      errors.sub_category_id
                        ? "border-red-400"
                        : "border-gray-200"
                    } ${!selectedCategoryId ? "bg-gray-50" : ""}`}
                  >
                    <option value="" disabled>
                      {!selectedCategoryId
                        ? "Select category first"
                        : selectedCategory?.sub_categories?.length > 0
                        ? "Select sub-category"
                        : "No subcategories available"}
                    </option>
                    {selectedCategory?.sub_categories?.length > 0 &&
                      selectedCategory.sub_categories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                )}
                {errors.sub_category_id && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.sub_category_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              {mode !== "view" && (
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              )}
              {uploading && (
                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
              )}

              {/* Image Previews */}
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {localImages.length === 0 && !uploading && (
                  <p className="text-xs text-gray-400 col-span-full">
                    No images {mode === "view" ? "available" : "uploaded yet"}.
                  </p>
                )}
                {localImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`preview-${idx}`}
                      className="object-cover w-full h-24"
                    />
                    {mode !== "view" && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="cursor-pointer absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {mode !== "view" && (
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading || uploading}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:opacity-95 transition disabled:opacity-50"
                >
                  {isLoading || uploading
                    ? "Processing..."
                    : mode === "edit"
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-3 border-t text-xs text-gray-500">
          {mode === "view"
            ? "Product details are displayed in read-only mode."
            : "Tip: You can upload multiple product images."}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
