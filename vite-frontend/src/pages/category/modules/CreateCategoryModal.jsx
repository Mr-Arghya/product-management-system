import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpload } from "../../../hooks/useUpload";
import { X } from "lucide-react";

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode,
  category = null,
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
      images: [],
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
        images: category.image ? category.image : [],
      });
    }
  }, [category, reset]);

  const { uploadFile } = useUpload();
  const overlayRef = useRef(null);
  const nameRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const localImages = watch("images") || [];

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
        const uploadedPath = res?.data?.files?.file?.path;
        if (uploadedPath) uploadedUrls.push(uploadedPath);
      }

      const newUrls = [...localImages, ...uploadedUrls];
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
    const categoryData = {
      ...data,
      images: data.images || [],
    };
    onSubmit && onSubmit(categoryData);
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
            {mode === "view" ? "View " : mode === "edit" ? "Edit " : "Create "}{" "}
            Category
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
                placeholder="Category name"
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
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-3 border-t text-xs text-gray-500">
          Tip: You can upload multiple category images.
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
