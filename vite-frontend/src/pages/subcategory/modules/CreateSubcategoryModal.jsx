import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCategories } from "../../../hooks/useCategories";
import { useQuery } from "@tanstack/react-query";

const CreateSubcategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  subCategory,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const overlayRef = useRef(null);
  const nameRef = useRef(null);

  const onSubmitForm = (data) => {
    onSubmit({ ...data, category_id: data.categoryId });
    reset();
    handleClose();
  };

  const { fetchCategories } = useCategories();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    keepPreviousData: true,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoriesQuery.data && !categoriesQuery.isLoading) {
      const response = categoriesQuery.data;
      setCategories(response.data.categories);
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading]);

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
            {mode === "edit" ? "Edit" : "Create"} Subcategory
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
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                type="text"
                className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                  errors.name ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Enter subcategory name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows="3"
                className="block w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter subcategory description"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register("categoryId", { required: "Category is required" })}
                className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                  errors.categoryId ? "border-red-400" : "border-gray-200"
                }`}
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:opacity-95 transition disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSubcategoryModal;
