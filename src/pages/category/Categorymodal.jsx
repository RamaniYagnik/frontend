// src/components/CategoryModal.jsx
import React, { useEffect } from "react";

const CategoryModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  if (!isOpen) return null;

  // Handle image preview for both new file & existing DB image
  const previewImage =
    formData.image instanceof File
      ? URL.createObjectURL(formData.image) // new upload
      : formData.image
      ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${formData.image}` // existing image from DB
      : null;

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.image instanceof File) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [formData.image]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4">Add / Edit Category</h2>

        <label className="block mb-2">Category Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Enter category name"
        />

        <label className="block mb-2">Category Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="w-full border px-3 py-2 rounded mb-4"
        />

        {/* Show preview if file uploaded or DB image exists */}
        {previewImage && (
          <div className="mb-4">
            <img
              src={previewImage}
              alt="Selected Category"
              className="w-full h-40 object-contain rounded border"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
