import React, { useEffect, useRef, useState } from "react";
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
      category_id: "",
      sub_category_id: "",
      images: [],
    },
  });

  const { fetchCategories } = useCategories();

  const [categories, setCategories] = useState([]);

  const [subcategories, setSubcategories] = useState([]);

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
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        sub_category_id: product.sub_category_id,
        images: product.image ? product.image : [],
      });
    }
  }, [product, reset]);

  const { uploadFile } = useUpload();
  const overlayRef = useRef(null);
  const nameRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const selectedCategoryId = watch("category_id");
  const localImages = watch("images") || [];

  const SelectedCategory = categories?.find(
    (sub) => String(sub._id) === String(selectedCategoryId)
  );

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }
    setTimeout(() => nameRef.current?.focus(), 50);

    const onKey = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleClose = () => {
    reset();
    onClose && onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls = [];

      for (const file of files) {
        const res = await uploadFile(file);
        console.log(res, "<----res from upload");
        const uploadedPath = res?.data?.files?.file?.path;
        if (uploadedPath) uploadedUrls.push(uploadedPath);
      }

      const newUrls = [...localImages, ...uploadedUrls];
      console.log(newUrls, "<----newUrls");
      setValue("images", newUrls);
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url) => {
    const updated = localImages.filter((img) => img !== url);
    setValue("images", updated);
  };

  const onSubmitForm = (data) => {
    const productData = {
      ...data,
      category_id: data.category_id,
      sub_category_id: data.sub_category_id,
      price: parseFloat(data.price),
      images: data.images || [],
    };
    onSubmit && onSubmit(productData);
    reset();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === "view" ? "View " : mode === "edit" ? "Edit" : "Create "}{" "}
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
                ref={nameRef}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                })}
                className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                  errors.name ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Product name"
                disabled={mode === "view"}
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
                  required: "Description is required",
                })}
                rows="3"
                className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                  errors.description ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Short description"
                disabled={mode === "view"}
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
                    required: "Price is required",
                    min: { value: 0, message: "Must be >= 0" },
                  })}
                  type="number"
                  step="0.01"
                  className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                    errors.price ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="0.00"
                  disabled={mode === "view"}
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
                <select
                  {...register("category_id", {
                    required: "Category required",
                  })}
                  className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                    errors.category_id ? "border-red-400" : "border-gray-200"
                  }`}
                  disabled={mode === "view"}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  {...register("sub_category_id", {
                    required: "Subcategory required",
                  })}
                  disabled={!selectedCategoryId || mode === "view"}
                  className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                    errors.sub_category_id
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">
                    {selectedCategoryId
                      ? "Select subcategory"
                      : "Select category first"}
                  </option>
                  {SelectedCategory?.sub_categories?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={uploading || mode === "view"}
                className="block w-full text-sm text-gray-600"
              />
              {uploading && (
                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
              )}

              {/* Image Previews */}
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {localImages.length === 0 && !uploading && (
                  <p className="text-xs text-gray-400 col-span-full">
                    No images uploaded yet.
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
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
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
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:opacity-95 transition disabled:opacity-50"
                >
                  {isLoading || uploading ? "Processing..." : "Create Product"}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-3 border-t text-xs text-gray-500">
          Tip: You can upload multiple product images.
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
